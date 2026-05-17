import { Controller, Post, Get, Delete, Body, Param } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // POST /api/customer/register — Register a new customer
  @Post('register')
  register(@Body() body: any) {
    return this.customerService.register(body);
  }

  // POST /api/customer/login — Customer login
  @Post('login')
  login(@Body() body: any) {
    return this.customerService.login(body);
  }

  // GET /api/customer/all — Get all customers (admin use)
  @Get('all')
  getAll() {
    return this.customerService.getAll();
  }

  // GET /api/customer/:id — Get single customer by ID (admin use)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.customerService.getOne(Number(id));
  }

  // DELETE /api/customer/:id — Delete a customer by ID (admin use)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.customerService.delete(Number(id));
  }
}