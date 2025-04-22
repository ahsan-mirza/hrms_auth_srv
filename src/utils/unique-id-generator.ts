// utils/unique-id-generator.ts

import { v4 as uuidv4 } from 'uuid';
type GenerateParams<T> = {
  model: T;
  fieldName: string;
  prefix: string;
  length?: number;
  maxAttempts?: number;
};
export class UniqueIdGenerator {
  static async generate<T extends { findOne: Function }>({
    model,
    fieldName,
    prefix,
    length = 20,
    maxAttempts = 5,
  }: GenerateParams<T>): Promise<string> {
    let attempts = 0;
    while (attempts < maxAttempts) {

      const id = `${prefix}-${uuidv4()}`; // Using UUID v4 for unique ID generation
      const exists = await model.findOne({ where: { [fieldName]: id } });
      if (!exists) return id;
      attempts++;
    }
    throw new Error(
      `Failed to generate a unique identifier for ${prefix} after ${maxAttempts} attempts.`,
    );
  }
}