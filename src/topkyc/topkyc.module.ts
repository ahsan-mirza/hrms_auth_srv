import { Module } from '@nestjs/common';
import { TopKYCService } from './topkyc.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [TopKYCService],
  exports: [TopKYCService],
})
export class TopKYCModule {}
