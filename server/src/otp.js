import crypto from 'crypto'

const OTP_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const OTP_LENGTH = 6

export const generateOtp = () =>
  Array.from({ length: OTP_LENGTH }, () =>
    OTP_CHARS[Math.floor(Math.random() * OTP_CHARS.length)],
  ).join('')

export const hashOtp = (otp) =>
  crypto.createHash('sha256').update(otp).digest('hex')

export const isExpired = (expiresAt) =>
  !expiresAt || new Date(expiresAt).getTime() < Date.now()
