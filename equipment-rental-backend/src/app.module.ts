import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    // Load environment variables from .env file
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Database configuration using asynchronous factory to read from ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', '654321'),
        database: configService.get<string>('DB_NAME', 'equipment_rental_admin_db'),
        autoLoadEntities: true,
        synchronize: true, // Set to false in production for data safety
      }),
      inject: [ConfigService],
    }),

    // Mailer configuration for Mailtrap integration
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: '"Orbit-EU Support" <support@orbit-eu.com>',
        },
      }),
      inject: [ConfigService],
    }),

    // Application Feature Modules
    AdminModule,

    CustomerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}