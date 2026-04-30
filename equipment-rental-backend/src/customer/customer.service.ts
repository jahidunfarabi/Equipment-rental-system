import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // Create a new customer account
  async register(customerData: any): Promise<Customer> {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(customerData.password, 10);
    
    // Using explicit object creation to avoid Type mismatch
    const newCustomer = new Customer();
    newCustomer.name = customerData.name;
    newCustomer.email = customerData.email;
    newCustomer.password = hashedPassword;
    if (customerData.isActive !== undefined) {
      newCustomer.isActive = customerData.isActive;
    }

    // Explicitly returning the saved object cast as Customer
    return (await this.customerRepository.save(newCustomer)) as Customer;
  }

  // Verify customer credentials
  async login(loginData: any) {
    const customer = await this.customerRepository.findOne({ 
      where: { email: loginData.email } 
    });

    if (!customer) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, customer.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return { 
      message: 'Login successful', 
      customerId: customer.id,
      customerName: customer.name 
    };
  }
}