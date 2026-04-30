import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { AdminEntity } from './admin.entity';
import { ProfileEntity } from './profile.entity';
import { ProductEntity } from './product.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

interface ProfileData {
  address: string;
  bio: string;
}
interface ProductData {
  name: string;
  price: number;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepo: Repository<AdminEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepo: Repository<ProfileEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async login(loginDto: LoginAdminDto) {
    const admin = await this.adminRepo.findOneBy({ email: loginDto.email });
    if (admin && (await bcrypt.compare(loginDto.password, admin.password))) {
      const payload = { email: admin.email, sub: admin.id };
      return { accessToken: this.jwtService.sign(payload) };
    }
    throw new UnauthorizedException('Invalid email or password');
  }

  async createAdmin(dto: CreateAdminDto) {
    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(dto.password, salt);
      const admin = this.adminRepo.create({
        ...dto,
        password: hash,
        phone: Number(dto.phone),
      });
      const saved = await this.adminRepo.save(admin);

      try {
        await this.mailerService.sendMail({
          to: saved.email,
          subject: 'Welcome',
          text: `Hi ${saved.fullName}, registration successful!`,
        });
      } catch {
        console.warn('Mail failed');
      }
      return saved;
    } catch (error: unknown) {
      const dbError = error as { code?: string };
      if (dbError.code === '23505') throw new ConflictException('Email exists');
      throw new InternalServerErrorException('Creation failed');
    }
  }

  async updateAdmin(id: string, dto: CreateAdminDto) {
    const admin = await this.getAdminById(id);
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(dto.password, salt);
    Object.assign(admin, { ...dto, password: hash, phone: Number(dto.phone) });
    return await this.adminRepo.save(admin);
  }

  async deleteAdmin(id: string) {
    const admin = await this.getAdminById(id);
    await this.adminRepo.remove(admin);
    return { message: 'Deleted' };
  }

  async createProfile(adminId: string, data: ProfileData) {
    const admin = await this.getAdminById(adminId);
    return await this.profileRepo.save(
      this.profileRepo.create({ ...data, admin }),
    );
  }

  async addProduct(adminId: string, data: ProductData) {
    const admin = await this.getAdminById(adminId);
    return await this.productRepo.save(
      this.productRepo.create({ ...data, admin }),
    );
  }

  async getAdminWithDetails(id: string) {
    const admin = await this.adminRepo.findOne({
      where: { id },
      relations: ['profile', 'products'],
    });
    if (!admin) throw new NotFoundException('Not found');
    return admin;
  }

  async getAll() {
    return await this.adminRepo.find();
  }
  async getAdminById(id: string) {
    const admin = await this.adminRepo.findOneBy({ id });
    if (!admin) throw new NotFoundException('Not found');
    return admin;
  }
}
