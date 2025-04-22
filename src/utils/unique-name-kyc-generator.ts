// utils/username-generator.ts
import { nanoid } from 'nanoid';

type SimpleUsernameParams = {
  baseUsername: string;
  uuidLength?: number;
};

export class UsernameGenerator {
  static generate({
    baseUsername,
    uuidLength = 8,
  }: SimpleUsernameParams): string {
    const rawUuid = nanoid(uuidLength * 2);
    const numericUuid = rawUuid.replace(/\D/g, '').slice(0, uuidLength);
    return `${baseUsername}_*k*${numericUuid}`;
  }
}
