export class Utils {
    
    
    
    
    /**
     * Generates a MongoDB-like ObjectId
     * @returns {string} A 24-character hexadecimal string
     * 
     * 
     * Example Output:
     * 661a47e8a1b2c3d4e5f60789
        │   │     │     │     │
        │   │     │     │     └── Counter (3 bytes = 6 hex chars): "e5f607"
        │   │     │     └──────── Process ID (2 bytes = 4 hex chars): "d4e5"
        │   │     └────────────── Machine Identifier (3 bytes = 6 hex chars): "c3d4e5"
        │   └──────────────────── Timestamp (4 bytes = 8 hex chars): "661a47e8"
        └──────────────────────── Full 12-byte ObjectId (24 hex characters)
     * 
     * 
     */
    static generateObjectId(): string {
      const timestamp = Math.floor(Date.now() / 1000).toString(16); // 4 bytes = 8 chars
  
      const randomBytes = (length: number): string =>
        Array.from({ length }, () => Math.floor(Math.random() * 256))
          .map(byte => byte.toString(16).padStart(2, '0'))
          .join('');
  
      const machineIdentifier = randomBytes(3); // 3 bytes = 6 chars
      const processId = randomBytes(2);         // 2 bytes = 4 chars
      const counter = randomBytes(3);           // 3 bytes = 6 chars
  
      return timestamp + machineIdentifier + processId + counter; // 24 hex characters
    }




    static getPasswordRegex() {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    }
    


  }