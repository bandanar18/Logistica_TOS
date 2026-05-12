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
exports.TosController = void 0;
const common_1 = require("@nestjs/common");
const tos_service_1 = require("./tos.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TosController = class TosController {
    tosService;
    constructor(tosService) {
        this.tosService = tosService;
    }
    findAllContainers() {
        return this.tosService.findAllContainers();
    }
    createContainer(data, req) {
        return this.tosService.createContainer(data, req.user);
    }
    moveContainer(id, moveDto, req) {
        return this.tosService.moveContainer(+id, moveDto.toYardId, moveDto.toLocation, req.user);
    }
    findAllYards() {
        return this.tosService.findAllYards();
    }
};
exports.TosController = TosController;
__decorate([
    (0, common_1.Get)('containers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TosController.prototype, "findAllContainers", null);
__decorate([
    (0, common_1.Post)('containers'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TosController.prototype, "createContainer", null);
__decorate([
    (0, common_1.Patch)('containers/:id/move'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], TosController.prototype, "moveContainer", null);
__decorate([
    (0, common_1.Get)('yards'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TosController.prototype, "findAllYards", null);
exports.TosController = TosController = __decorate([
    (0, common_1.Controller)('tos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [tos_service_1.TosService])
], TosController);
//# sourceMappingURL=tos.controller.js.map