import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { StoresService } from '../stores/stores.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private rolesService: RolesService,
    private jwtService: JwtService,
    private storesService: StoresService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role?.name || 'client' };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role?.name || 'client'
      }
    };
  }

  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Assign role
    const requestedRole = userData.role || 'client';
    const role = await this.rolesService.findByName(requestedRole);
    
    if (!role) {
      throw new BadRequestException(`Role ${requestedRole} not found`);
    }

    const user = await this.usersService.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      passwordHash: hashedPassword,
      role: role
    });

    if (requestedRole === 'store') {
      await this.storesService.createOrUpdate(user.id, {
        legalName: `${user.firstName} ${user.lastName} Logistics`,
        taxId: 'PENDING',
        status: 'pending'
      });
    }

    return this.login(user);
  }
}
