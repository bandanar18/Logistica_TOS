import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    const rolesToCreate = ['admin', 'store', 'client', 'inspector'];
    for (const roleName of rolesToCreate) {
      const exists = await this.roleRepository.findOne({ where: { name: roleName } });
      if (!exists) {
        await this.roleRepository.save({ name: roleName, description: `Role ${roleName}` });
      }
    }
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { name } });
  }
}
