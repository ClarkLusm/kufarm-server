import * as nano from 'nanoid'

export function genReferralCode() {
  const nanoid = nano.customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10);
  const code = nanoid();
  return code.toString().toUpperCase();
}
