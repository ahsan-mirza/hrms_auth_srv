// src/utils/password-validator.ts
export class PasswordValidator {
    static getRegex() {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    }
  
    static isValid(password: string): boolean {
      return this.getRegex().test(password);
    }
  
    static getValidationErrors(password: string): string[] {
      const errors : any[] = [];
      if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
      }
      if (!/[a-z]/.test(password)) {
        errors.push("Must include at least one lowercase letter.");
      }
      if (!/[A-Z]/.test(password)) {
        errors.push("Must include at least one uppercase letter.");
      }
      if (!/\d/.test(password)) {
        errors.push("Must include at least one number.");
      }
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push("Must include at least one special character.");
      }
      return errors;
    }
  }
  