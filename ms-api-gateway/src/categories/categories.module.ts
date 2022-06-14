import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/proxy/proxy.module';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [ProxyModule],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
