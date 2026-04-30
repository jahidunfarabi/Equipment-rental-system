import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailerModule } from '@nestjs-modules/mailer';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminEntity } from './admin.entity';
import { ProfileEntity } from './profile.entity';
import { ProductEntity } from './product.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // Register Entities for TypeORM
    TypeOrmModule.forFeature([AdminEntity, ProfileEntity, ProductEntity]),

    // Authentication Configuration
    PassportModule,
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),

    // Email Service Configuration
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'your-email@gmail.com', // Replace with your Gmail
          pass: 'your-app-password', // Use 16-character App Password
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
  exports: [AdminService],
})
export class AdminModule {}
