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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const services_service_1 = require("../services/services.service");
const catalogs_service_1 = require("../catalogs/catalogs.service");
const stores_service_1 = require("../stores/stores.service");
const swagger_1 = require("@nestjs/swagger");
let SearchController = class SearchController {
    servicesService;
    catalogsService;
    storesService;
    constructor(servicesService, catalogsService, storesService) {
        this.servicesService = servicesService;
        this.catalogsService = catalogsService;
        this.storesService = storesService;
    }
    searchServices(query) {
        return this.servicesService.searchPublicServices(query);
    }
    async searchCategories() {
        return this.catalogsService.findByCode('SERVICE_CATEGORIES');
    }
    searchStores(query) {
        return this.storesService.findAll();
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)('services'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar servicios publicados' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "searchServices", null);
__decorate([
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar categorías para búsqueda' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "searchCategories", null);
__decorate([
    (0, common_1.Get)('stores'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar tiendas aprobadas' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SearchController.prototype, "searchStores", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)('Search'),
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [services_service_1.ServicesService,
        catalogs_service_1.CatalogsService,
        stores_service_1.StoresService])
], SearchController);
//# sourceMappingURL=search.controller.js.map