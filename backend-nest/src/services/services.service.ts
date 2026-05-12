import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { StoresService } from '../stores/stores.service';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    private storesService: StoresService
  ) {}

  async create(ownerId: number, serviceData: Partial<Service>): Promise<Service> {
    const store = await this.storesService.findByOwner(ownerId);
    const service = this.servicesRepository.create({ ...serviceData, store });
    return this.servicesRepository.save(service);
  }

  async findByStoreOwner(ownerId: number): Promise<Service[]> {
    const store = await this.storesService.findByOwner(ownerId);
    return this.servicesRepository.find({ where: { store: { id: store.id } }, relations: ['category'] });
  }

  async searchPublicServices(query: any): Promise<Service[]> {
    const qb = this.servicesRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.store', 'store')
      .leftJoinAndSelect('service.category', 'category')
      .where("service.status = :status", { status: 'published' });

    if (query.q) {
      qb.andWhere("(service.name LIKE :q OR service.description LIKE :q OR store.legalName LIKE :q)", { q: `%${query.q}%` });
    }

    if (query.category) {
      qb.andWhere("category.code = :category OR category.id = :category", { category: query.category });
    }

    if (query.port) {
      qb.andWhere("store.basePort = :port", { port: query.port });
    }

    if (query.storeId) {
      qb.andWhere("store.id = :storeId", { storeId: query.storeId });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.servicesRepository.findOne({ where: { id }, relations: ['category', 'store'] });
    if (!service) throw new NotFoundException('Servicio no encontrado');
    return service;
  }

  async update(id: number, ownerId: number, data: Partial<Service>): Promise<Service> {
    const service = await this.findOne(id);
    const store = await this.storesService.findByOwner(ownerId);
    
    if (service.store.id !== store.id) {
      throw new NotFoundException('No tienes permiso para editar este servicio');
    }

    Object.assign(service, data);
    return this.servicesRepository.save(service);
  }

  async remove(id: number, ownerId: number): Promise<void> {
    const service = await this.findOne(id);
    const store = await this.storesService.findByOwner(ownerId);

    if (service.store.id !== store.id) {
      throw new NotFoundException('No tienes permiso para eliminar este servicio');
    }

    await this.servicesRepository.remove(service);
  }
}
