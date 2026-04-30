import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { AdminEntity } from './admin.entity';
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

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // --- Auth Routes ---

  @Post('login')
  async login(@Body() loginDto: LoginAdminDto) {
    return await this.adminService.login(loginDto); // Handle login
  }

  // --- CRUD Routes ---

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() adminDto: CreateAdminDto): Promise<AdminEntity> {
    return await this.adminService.createAdmin(adminDto); // Register admin
  }

  @Get('all')
  async getAll(): Promise<AdminEntity[]> {
    return await this.adminService.getAll(); // Fetch all admins
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.adminService.deleteAdmin(id); // Secure delete
  }

  // --- Relationship Routes ---

  @Post(':id/profile')
  async createProfile(
    @Param('id') id: string,
    @Body() profileData: ProfileData,
  ) {
    return this.adminService.createProfile(id, profileData); // Add profile
  }

  @Post(':id/product')
  async addProduct(@Param('id') id: string, @Body() productData: ProductData) {
    return this.adminService.addProduct(id, productData); // Add product
  }

  @Get(':id/details')
  async getAdminDetails(@Param('id') id: string) {
    return this.adminService.getAdminWithDetails(id); // Fetch admin + profile + products
  }

  // --- General Routes ---

  @Get(':id')
  async getOne(@Param('id') id: string): Promise<AdminEntity> {
    return await this.adminService.getAdminById(id); // Fetch single admin
  }

  @Put('update/:id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() updateData: CreateAdminDto,
  ): Promise<AdminEntity> {
    return await this.adminService.updateAdmin(id, updateData); // Secure update
  }
}
