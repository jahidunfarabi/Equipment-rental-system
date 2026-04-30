import { Controller, Post, Body } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Endpoint for customer registration: POST /customer/register
  @Post('register')
  register(@Body() body: any) {
    return this.customerService.register(body);
  }

  // Endpoint for customer login: POST /customer/login
  @Post('login')
  login(@Body() body: any) {
    return this.customerService.login(body);
  }
}