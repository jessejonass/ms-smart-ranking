import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from './proxy/proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 587,
        secure: false,
        tls: {
          ciphers: 'SSLv3',
        },
        auth: {
          user: 'AKIATO4MWY7Y55OE5JTZ',
          pass: 'BGxq4uRNuM/n0mdmYJz6fdbBWtHnLsHNv8AaRwkUQVv1',
        },
      },
    }),
    ProxyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
