import crypto from 'crypto';

export const encryptedWalletKey = (text: string) => {
  const algorithm = 'sha256'; //algorithm to use
  const key = crypto.scryptSync(process.env.WALLET_KEY_HASH, 'salt', 24); //create key
  const iv = crypto.randomBytes(16); // generate different ciphertext everytime
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex'); // encrypted text
};

export const decryptedWalletKey = (encrypted: string) => {
  const algorithm = 'sha256'; //algorithm to use
  const key = crypto.scryptSync(process.env.WALLET_KEY_HASH, 'salt', 24); //create key
  const iv = crypto.randomBytes(16); // generate different ciphertext everytime
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8'); //deciphered text
};
