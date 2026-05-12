import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  async createOrUpdate(ownerId: number, storeData: Partial<Store>): Promise<Store> {
    let store = await this.storesRepository.findOne({ where: { owner: { id: ownerId } }, relations: ['owner'] });
    
    if (store) {
      store = this.storesRepository.merge(store, storeData);
    } else {
      store = this.storesRepository.create({ ...storeData, owner: { id: ownerId } as any });
    }
    
    return this.storesRepository.save(store);
  }

  async findByOwner(ownerId: number): Promise<Store> {
    const store = await this.storesRepository.findOne({ where: { owner: { id: ownerId } } });
    if (!store) throw new NotFoundException('Tienda no encontrada para este usuario');
    return store;
  }

  async findAll(): Promise<Store[]> {
    return this.storesRepository.find({ relations: ['owner'] });
  }

  async findOnePublic(id: number): Promise<Store> {
    const store = await this.storesRepository.findOne({ where: { id, status: 'approved' } });
    if (!store) throw new NotFoundException('Tienda no encontrada o no aprobada');
    return store;
  }
}
