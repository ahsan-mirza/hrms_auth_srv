// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'user-service-consumer',
        },
        subscribe: {
          fromBeginning: true,
        },
        run: {
          autoCommit: false,
        },
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  //  await app.listen(process.env.PORT ?? 3000,()=>{
  //   console.log(`Server is running on port ${process.env.PORT}`);
  // });
  await app.listen();
  console.log(
    ` Microservice is listening on ${process.env.KAFKA_BROKER || 'localhost:9092'}`,
  );
}

bootstrap();
