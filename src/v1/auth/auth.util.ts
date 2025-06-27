import { randomBytes } from 'crypto';

export function getRefreshTokenExpiry() {
  const now = new Date();
  const expireDays = 30;
  return new Date(now.getTime() + expireDays * 24 * 60 * 60 * 1000);
}

export function generateOpaqueToken() {
  return randomBytes(64).toString('hex');
}
