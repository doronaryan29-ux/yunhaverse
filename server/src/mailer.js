import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE) === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendOtpEmail = async ({ to, otp, minutes }) => {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  const subject = 'Your YUNHAverse verification code'
  const text = `Your verification code is ${otp}. It expires in ${minutes} minutes.`

  return transporter.sendMail({
    from,
    to,
    subject,
    text,
  })
}
