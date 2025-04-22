type HandlerResponse<T> = {
    success: boolean;
    message: string;
    data?: T;
    error?: any;
  };
  
  export async function tryCatch<T>(
    fn: () => Promise<T>,
    successMessage = 'Operation successful',
    errorMessage = 'Something went wrong',
  ): Promise<HandlerResponse<T>> {
    try {
      const data = await fn();
      return {
        success: true,
        message: successMessage,
        data,
      };
    } catch (error) {
      console.error('❌ Error:', error?.message || error);
      return {
        success: false,
        message: errorMessage,
        error: error?.message || error,
      };
    }
  }
  