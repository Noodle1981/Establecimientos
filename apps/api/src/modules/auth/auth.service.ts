import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;

    // Standard Node bcrypt is 100% compatible with Laravel's bcrypt hashes!
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(dto: any) {
    const { email, password } = dto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales de acceso inválidas.');
    }

    const payload = { email: user.email, sub: Number(user.id), role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: Number(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
