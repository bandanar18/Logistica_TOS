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
exports.CatalogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const master_catalog_entity_1 = require("./entities/master-catalog.entity");
const master_catalog_item_entity_1 = require("./entities/master-catalog-item.entity");
let CatalogsService = class CatalogsService {
    catalogsRepository;
    itemsRepository;
    constructor(catalogsRepository, itemsRepository) {
        this.catalogsRepository = catalogsRepository;
        this.itemsRepository = itemsRepository;
    }
    async onModuleInit() {
        const defaultCatalogs = [
            {
                code: 'SERVICE_CATEGORIES',
                name: 'Categorías de Servicio',
                items: [
                    { code: 'ADUANA', name: 'Aduana' },
                    { code: 'TRANSPORTE', name: 'Transporte Terrestre' },
                    { code: 'ALMACENAJE', name: 'Almacenamiento' },
                    { code: 'INSPECCION', name: 'Inspecciones' },
                ]
            },
            {
                code: 'PORTS',
                name: 'Puertos',
                items: [
                    { code: 'VEPC', name: 'Puerto Cabello' },
                    { code: 'VELAG', name: 'La Guaira' },
                    { code: 'VEMCB', name: 'Maracaibo' },
                ]
            }
        ];
        for (const cat of defaultCatalogs) {
            let catalog = await this.catalogsRepository.findOne({ where: { code: cat.code } });
            if (!catalog) {
                catalog = await this.catalogsRepository.save({ code: cat.code, name: cat.name });
                for (const item of cat.items) {
                    await this.itemsRepository.save({
                        code: item.code,
                        name: item.name,
                        catalog: catalog
                    });
                }
            }
        }
    }
    findAll() {
        return this.catalogsRepository.find({ relations: ['items'] });
    }
    findOne(code) {
        return this.catalogsRepository.findOne({ where: { code }, relations: ['items'] });
    }
};
exports.CatalogsService = CatalogsService;
exports.CatalogsService = CatalogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(master_catalog_entity_1.MasterCatalog)),
    __param(1, (0, typeorm_1.InjectRepository)(master_catalog_item_entity_1.MasterCatalogItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CatalogsService);
//# sourceMappingURL=catalogs.service.js.map