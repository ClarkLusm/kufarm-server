import crypto from 'crypto';

export const encryptedWalletKey = (text: string) => {
  const algorithm = 'aes-192-cbc'; //algorithm to use
  const key = crypto.scryptSync(process.env.WALLET_KEY_HASH, 'salt', 24); //create key
  const iv = crypto.randomBytes(16); // generate different ciphertext everytime
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return [cipher.update(text, 'utf8', 'hex') + cipher.final('hex'), iv.toString('base64')];
};

export const decryptedWalletKey = (encrypted: string, ivRaw: string) => {
  const algorithm = 'aes-192-cbc'; //algorithm to use
  const key = crypto.scryptSync(process.env.WALLET_KEY_HASH, 'salt', 24); //create key
  const iv = Buffer.from(ivRaw, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8'); //deciphered text
};
