import { HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { throwError } from '../errors/errors.function';

// encrypt password
export async function encryptPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
  }
}

// compare password
export async function comparePassword(password: string, hashPassword: string) {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error) {
    throwError(HttpStatus.INTERNAL_SERVER_ERROR, [], error.message);
  }
}
