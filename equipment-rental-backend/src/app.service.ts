import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  //This is the default root response.

  getHello(): string {
    return 'Hello World!';
  }
}
