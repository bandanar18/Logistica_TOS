"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const warehouse_entity_1 = require("./entities/warehouse.entity");
const storage_location_entity_1 = require("./entities/storage-location.entity");
const inventory_item_entity_1 = require("./entities/inventory-item.entity");
const audit_service_1 = require("../audit/audit.service");
let StorageService = class StorageService {
    warehouseRepo;
    locationRepo;
    itemRepo;
    auditService;
    constructor(warehouseRepo, locationRepo, itemRepo, auditService) {
        this.warehouseRepo = warehouseRepo;
        this.locationRepo = locationRepo;
        this.itemRepo = itemRepo;
        this.auditService = auditService;
    }
    async findAllItems() {
        return this.itemRepo.find({ relations: ['warehouse', 'location', 'order'] });
    }
    async receiveItem(data, user) {
        const item = this.itemRepo.create(data);
        const saved = await this.itemRepo.save(item);
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
    async moveItem(id, toLocationId, user) {
        const item = await this.itemRepo.findOne({ where: { id }, relations: ['location'] });
        if (!item)
            throw new common_1.NotFoundException('Inventory item not found');
        const toLocation = await this.locationRepo.findOne({ where: { id: toLocationId }, relations: ['warehouse'] });
        if (!toLocation)
            throw new common_1.NotFoundException('Destination location not found');
        const previousLocation = item.location;
        item.location = toLocation;
        item.warehouse = toLocation.warehouse;
        const updated = await this.itemRepo.save(item);
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
    async findAllWarehouses() {
        return this.warehouseRepo.find();
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(warehouse_entity_1.Warehouse)),
    __param(1, (0, typeorm_1.InjectRepository)(storage_location_entity_1.StorageLocation)),
    __param(2, (0, typeorm_1.InjectRepository)(inventory_item_entity_1.InventoryItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService])
], StorageService);
//# sourceMappingURL=storage.service.js.map