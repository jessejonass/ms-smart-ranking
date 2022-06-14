import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [CategoriesModule, PlayersModule, ProxyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
