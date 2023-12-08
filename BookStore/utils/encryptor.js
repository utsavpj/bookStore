import bcrypt from 'bcryptjs';

const numberOfEncryptionRound = 10;

// encrypt given password
export async function encryptPassword(password) {
    return bcrypt.hash(password, numberOfEncryptionRound)
}