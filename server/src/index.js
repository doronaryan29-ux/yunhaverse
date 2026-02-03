import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { query } from './db.js'
import bcrypt from 'bcryptjs'
import { generateOtp, hashOtp, isExpired } from './otp.js'
import { sendOtpEmail } from './mailer.js'

const app = express()

const otpTtlMinutes = Number(process.env.OTP_TTL_MINUTES || 10)
const otpCooldownSeconds = Number(process.env.OTP_COOLDOWN_SECONDS || 60)
const otpMaxAttempts = Number(process.env.OTP_MAX_ATTEMPTS || 5)

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  }),
)
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

app.post('/auth/send-otp', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const mode = String(req.body?.mode || 'login')
  const password = String(req.body?.password || '')
  const firstName = String(req.body?.firstName || '').trim()
  const lastName = String(req.body?.lastName || '').trim()
  const birthdate = req.body?.birthdate ? String(req.body.birthdate) : null
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' })
  }

  try {
    const [rows] = await query(
      'SELECT id, otp_expires_at, otp_attempts, email_verified_at, status FROM users WHERE email = ? LIMIT 1',
      [email],
    )

    const existing = rows[0]
    if (existing?.status === 'suspended') {
      return res.status(403).json({ message: 'Account not active.' })
    }

    if (mode === 'login' && !existing) {
      return res.status(404).json({ message: 'Account not found. Please sign up.' })
    }

    if (mode === 'signup') {
      if (existing?.email_verified_at) {
        return res.status(409).json({ message: 'Account already exists.' })
      }
      if (!existing) {
        if (password.length < 8 || !/[A-Z]/.test(password)) {
          return res.status(400).json({
            message:
              'Password must be at least 8 characters and include 1 uppercase letter.',
          })
        }
      } else if (password) {
        if (password.length < 8 || !/[A-Z]/.test(password)) {
          return res.status(400).json({
            message:
              'Password must be at least 8 characters and include 1 uppercase letter.',
          })
        }
      }
    }
    if (existing?.otp_expires_at && !isExpired(existing.otp_expires_at)) {
      const remainingMs = new Date(existing.otp_expires_at).getTime() - Date.now()
      const cooldownMs = otpCooldownSeconds * 1000
      if (remainingMs > cooldownMs) {
        return res
          .status(429)
          .json({ message: 'OTP already sent. Please wait.' })
      }
    }

    const otp = generateOtp()
    const otpHash = hashOtp(otp)
    const expiresAt = new Date(Date.now() + otpTtlMinutes * 60 * 1000)
    const passwordHash =
      mode === 'signup' && password ? await bcrypt.hash(password, 10) : null

    if (existing) {
      const nextStatus =
        mode === 'signup' && !existing.email_verified_at ? 'pending' : existing.status
      await query(
        'UPDATE users SET otp_code = ?, otp_expires_at = ?, otp_attempts = 0, first_name = COALESCE(?, first_name), last_name = COALESCE(?, last_name), birthdate = COALESCE(?, birthdate), password_hash = COALESCE(?, password_hash), status = ? WHERE id = ?',
        [
          otpHash,
          expiresAt,
          firstName || null,
          lastName || null,
          birthdate,
          passwordHash,
          nextStatus,
          existing.id,
        ],
      )
    } else {
      await query(
        'INSERT INTO users (email, first_name, last_name, birthdate, password_hash, otp_code, otp_expires_at, otp_attempts, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, 0, "member", "pending")',
        [email, firstName || null, lastName || null, birthdate, passwordHash, otpHash, expiresAt],
      )
    }

    await sendOtpEmail({ to: email, otp, minutes: otpTtlMinutes })

    return res.json({ message: 'OTP sent.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to send OTP.' })
  }
})

app.post('/auth/verify-otp', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const otp = String(req.body?.otp || '').trim()

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' })
  }

  try {
    const [rows] = await query(
      'SELECT id, otp_code, otp_expires_at, otp_attempts, role, status FROM users WHERE email = ? LIMIT 1',
      [email],
    )

    const user = rows[0]
    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account not active.' })
    }

    if (user.otp_attempts >= otpMaxAttempts) {
      return res.status(429).json({ message: 'Too many attempts. Try later.' })
    }

    if (isExpired(user.otp_expires_at)) {
      return res.status(400).json({ message: 'OTP expired. Request a new one.' })
    }

    const otpHash = hashOtp(otp)
    if (otpHash !== user.otp_code) {
      await query('UPDATE users SET otp_attempts = otp_attempts + 1 WHERE id = ?', [user.id])
      return res.status(401).json({ message: 'Invalid OTP.' })
    }

    await query(
      'UPDATE users SET otp_code = NULL, otp_expires_at = NULL, otp_attempts = 0, email_verified_at = COALESCE(email_verified_at, NOW()), last_login_at = NOW(), status = "active" WHERE id = ?',
      [user.id],
    )

    return res.json({
      message: 'Verified.',
      user: {
        id: user.id,
        email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to verify OTP.' })
  }
})

app.post('/auth/cancel-signup', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' })
  }

  try {
    await query(
      'DELETE FROM users WHERE email = ? AND email_verified_at IS NULL',
      [email],
    )
    return res.json({ message: 'Signup cancelled.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to cancel signup.' })
  }
})

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`OTP server running on http://localhost:${port}`)
})
