import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalInterceptor } from 'global.interceptor';
import { ResponseInterceptor } from './response.interceptor';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes( new ValidationPipe({whitelist:true, transform:true}))
  app.useGlobalInterceptors( new GlobalInterceptor())
  app.useGlobalInterceptors( new ResponseInterceptor())
  app.useGlobalFilters( new AllExceptionsFilter())
  app.enableCors()

   await app.listen(process.env.PORT ?? 3000,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}
bootstrap();
