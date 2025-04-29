import { v4 as uuidv4 } from 'uuid';

type SimpleUsernameParams = {
  baseUsername: string;
  uuidLength?: number;
};

export class UsernameGenerator {
  static generate({
    baseUsername,
    uuidLength = 8,
  }: SimpleUsernameParams): string {
    // const rawUuid = nanoid(uuidLength * 2);
    const rawUuid = uuidv4(); // Using UUID v4 for unique ID generation
    const numericUuid = rawUuid.replace(/\D/g, '').slice(0, uuidLength);
    return `${baseUsername}_*k*${numericUuid}`;
  }
}