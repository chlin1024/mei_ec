import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtValidationPipe implements PipeTransform {
  constructor(private readonly jwtService: JwtService) {}

  transform(value: any) {
    try {
      const data = this.jwtService.verify(value);
      console.log(data);
      return value;
    } catch (error) {
      throw new BadRequestException({
        message: error.message,
        error: error.name,
      });
    }
  }
}
