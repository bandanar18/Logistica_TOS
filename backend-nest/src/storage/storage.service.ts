import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { StorageLocation } from './entities/storage-location.entity';
import { InventoryItem } from './entities/inventory-item.entity';
import { AuditService } from '../audit/audit.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepo: Repository<Warehouse>,
    @InjectRepository(StorageLocation)
    private locationRepo: Repository<StorageLocation>,
    @InjectRepository(InventoryItem)
    private itemRepo: Repository<InventoryItem>,
    private auditService: AuditService,
  ) {}

  async findAllItems(): Promise<InventoryItem[]> {
    return this.itemRepo.find({ relations: ['warehouse', 'location', 'order'] });
  }

  async receiveItem(data: any, user: User): Promise<InventoryItem> {
    const item = this.itemRepo.create(data);
    const saved = await this.itemRepo.save(item) as any;
    
    await this.auditService.log({
      user,
      module: 'storage',
      action: 'storage.item.received',
      entityType: 'inventory_item',
      entityId: saved.id.toString(),
      details: { sku: saved.sku, quantity: saved.quantity }
    });
    
    return saved;
  }

  async moveItem(id: number, toLocationId: number, user: User): Promise<InventoryItem> {
    const item = await this.itemRepo.findOne({ where: { id }, relations: ['location'] });
    if (!item) throw new NotFoundException('Inventory item not found');

    const toLocation = await this.locationRepo.findOne({ where: { id: toLocationId }, relations: ['warehouse'] });
    if (!toLocation) throw new NotFoundException('Destination location not found');

    const previousLocation = item.location;
    item.location = toLocation;
    item.warehouse = toLocation.warehouse;
    
    const updated = await this.itemRepo.save(item) as any;

    await this.auditService.log({
      user,
      module: 'storage',
      action: 'storage.item.moved',
      entityType: 'inventory_item',
      entityId: id.toString(),
      details: { fromLocationId: previousLocation?.id, toLocationId }
    });

    return updated;
  }

  async findAllWarehouses(): Promise<Warehouse[]> {
    return this.warehouseRepo.find();
  }
}
