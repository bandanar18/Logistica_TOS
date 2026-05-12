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
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const service_entity_1 = require("./entities/service.entity");
const stores_service_1 = require("../stores/stores.service");
let ServicesService = class ServicesService {
    servicesRepository;
    storesService;
    constructor(servicesRepository, storesService) {
        this.servicesRepository = servicesRepository;
        this.storesService = storesService;
    }
    async create(ownerId, serviceData) {
        const store = await this.storesService.findByOwner(ownerId);
        const service = this.servicesRepository.create({ ...serviceData, store });
        return this.servicesRepository.save(service);
    }
    async findByStoreOwner(ownerId) {
        const store = await this.storesService.findByOwner(ownerId);
        return this.servicesRepository.find({ where: { store: { id: store.id } }, relations: ['category'] });
    }
    async findAll() {
        return this.servicesRepository.find({ relations: ['category', 'store'], order: { createdAt: 'DESC' } });
    }
    async searchPublicServices(query) {
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
            qb.andWhere("store.basePort = :port OR store.basePort LIKE :portName", { port: query.port, portName: `%${query.port}%` });
        }
        if (query.minRating) {
            qb.andWhere('store.averageRating >= :minRating', { minRating: Number(query.minRating) });
        }
        if (query.storeId) {
            qb.andWhere("store.id = :storeId", { storeId: query.storeId });
        }
        return qb.orderBy('store.averageRating', 'DESC').addOrderBy('service.createdAt', 'DESC').getMany();
    }
    async findOne(id) {
        const service = await this.servicesRepository.findOne({ where: { id }, relations: ['category', 'store'] });
        if (!service)
            throw new common_1.NotFoundException('Servicio no encontrado');
        return service;
    }
    async update(id, ownerId, data) {
        const service = await this.findOne(id);
        const store = await this.storesService.findByOwner(ownerId);
        if (service.store.id !== store.id) {
            throw new common_1.NotFoundException('No tienes permiso para editar este servicio');
        }
        Object.assign(service, data);
        return this.servicesRepository.save(service);
    }
    async remove(id, ownerId) {
        const service = await this.findOne(id);
        const store = await this.storesService.findByOwner(ownerId);
        if (service.store.id !== store.id) {
            throw new common_1.NotFoundException('No tienes permiso para eliminar este servicio');
        }
        await this.servicesRepository.remove(service);
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        stores_service_1.StoresService])
], ServicesService);
//# sourceMappingURL=services.service.js.map