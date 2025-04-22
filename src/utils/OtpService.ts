

export class OtpService {
  

  

  async sendOtp(email: string,otp:string): Promise<any> {
    

    // OTP Sending
    // Here you can use any email service to send the OTP

    return {
        status: true,
        message: 'OTP sent successfully',
    };
  }

}