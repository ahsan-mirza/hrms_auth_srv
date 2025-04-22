import { forwardRef, Module } from '@nestjs/common';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { UsersModule } from 'src/users/users.module';
import { TopKYCModule } from 'src/topkyc/topkyc.module';

@Module({
  imports: [UsersModule, TopKYCModule],
  controllers: [KycController],
  providers: [KycService],
  exports: [KycService],
})
export class KycModule {}
