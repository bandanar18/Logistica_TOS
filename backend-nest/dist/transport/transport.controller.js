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
exports.TransportController = void 0;
const common_1 = require("@nestjs/common");
const transport_service_1 = require("./transport.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TransportController = class TransportController {
    transportService;
    constructor(transportService) {
        this.transportService = transportService;
    }
    findAllTrips() {
        return this.transportService.findAllTrips();
    }
    createTrip(data, req) {
        return this.transportService.createTrip(data, req.user);
    }
    updateStatus(id, data, req) {
        return this.transportService.updateTripStatus(+id, data.status, req.user);
    }
    findAllVehicles() {
        return this.transportService.findAllVehicles();
    }
    findAllDrivers() {
        return this.transportService.findAllDrivers();
    }
};
exports.TransportController = TransportController;
__decorate([
    (0, common_1.Get)('trips'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TransportController.prototype, "findAllTrips", null);
__decorate([
    (0, common_1.Post)('trips'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TransportController.prototype, "createTrip", null);
__decorate([
    (0, common_1.Patch)('trips/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], TransportController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('vehicles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TransportController.prototype, "findAllVehicles", null);
__decorate([
    (0, common_1.Get)('drivers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TransportController.prototype, "findAllDrivers", null);
exports.TransportController = TransportController = __decorate([
    (0, common_1.Controller)('transport'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [transport_service_1.TransportService])
], TransportController);
//# sourceMappingURL=transport.controller.js.map