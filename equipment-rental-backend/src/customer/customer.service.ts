import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import * as bcrypt from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PusherLib = require('pusher');

@Injectable()
export class CustomerService {
  private pusher: any;

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {
    this.pusher = new PusherLib({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_APP_KEY,
      secret: process.env.PUSHER_APP_SECRET,
      cluster: process.env.PUSHER_APP_CLUSTER,
      useTLS: true,
    });
  }

  // Register a new customer and notify admin in real-time
  async register(customerData: any): Promise<Customer> {
    const hashedPassword = await bcrypt.hash(customerData.password, 10);

    const newCustomer = new Customer();
    newCustomer.name = customerData.name;
    newCustomer.email = customerData.email;
    newCustomer.password = hashedPassword;

    if (customerData.isActive !== undefined) {
      newCustomer.isActive = customerData.isActive;
    }

    const saved = await this.customerRepository.save(newCustomer);

    // Trigger real-time Pusher event
    try {
      await this.pusher.trigger('admin-notifications', 'new-customer', {
        message: '🆕 New Customer Registered!',
        customerName: saved.name,
        customerEmail: saved.email,
        timestamp: new Date().toISOString(),
      });
      console.log('✅ Pusher event triggered for:', saved.name);
    } catch (err) {
      console.warn('❌ Pusher Trigger Error:', err);
    }

    return saved as Customer;
  }

  // Login logic
  async login(loginData: any) {
    const customer = await this.customerRepository.findOne({
      where: { email: loginData.email },
    });

    if (
      !customer ||
      !(await bcrypt.compare(loginData.password, customer.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      message: 'Login successful',
      customerId: customer.id,
      customerName: customer.name,
    };
  }

  // Fetch all customers for admin dashboard
  async getAll(): Promise<Omit<Customer, 'password'>[]> {
    const customers = await this.customerRepository.find();
    return customers.map(({ password, ...rest }) => rest);
  }

  // Get single customer by ID
  async getOne(id: number): Promise<Omit<Customer, 'password'>> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    const { password, ...rest } = customer;
    return rest;
  }

  // Delete customer by ID
  async delete(id: number): Promise<{ message: string }> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    await this.customerRepository.remove(customer);
    return { message: `Customer ${id} deleted successfully` };
  }
}