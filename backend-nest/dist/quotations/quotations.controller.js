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
exports.QuotationsController = void 0;
const common_1 = require("@nestjs/common");
const quotations_service_1 = require("./quotations.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const orders_service_1 = require("../orders/orders.service");
let QuotationsController = class QuotationsController {
    quotationsService;
    ordersService;
    constructor(quotationsService, ordersService) {
        this.quotationsService = quotationsService;
        this.ordersService = ordersService;
    }
    create(createDto, req) {
        return this.quotationsService.create(createDto, req.user);
    }
    findAll(req) {
        return this.quotationsService.findAllForUser(req.user);
    }
    findOne(id) {
        return this.quotationsService.findOne(+id);
    }
    respond(id, respondDto, req) {
        return this.quotationsService.respond(+id, respondDto, req.user);
    }
    updateStatus(id, status, req) {
        return this.quotationsService.updateStatus(+id, status, req.user);
    }
    async convertToOrder(id, req) {
        const q = await this.quotationsService.findOne(+id);
        if (q.client.id !== (req.user.sub || req.user.id)) {
            throw new common_1.ForbiddenException('Only the client can convert the quotation to an order');
        }
        if (!['approved', 'order_created'].includes(q.status)) {
            throw new common_1.ForbiddenException('Quotation must be approved to be converted to an order');
        }
        const order = await this.ordersService.createFromQuotation(q);
        if (q.status !== 'order_created') {
            await this.quotationsService.updateStatus(+id, 'order_created', req.user);
        }
        return order;
    }
};
exports.QuotationsController = QuotationsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], QuotationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], QuotationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuotationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/respond'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], QuotationsController.prototype, "respond", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], QuotationsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/convert-to-order'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuotationsController.prototype, "convertToOrder", null);
exports.QuotationsController = QuotationsController = __decorate([
    (0, common_1.Controller)('quotations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [quotations_service_1.QuotationsService,
        orders_service_1.OrdersService])
], QuotationsController);
//# sourceMappingURL=quotations.controller.js.map