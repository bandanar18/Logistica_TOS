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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trip = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("../../orders/entities/order.entity");
const vehicle_entity_1 = require("./vehicle.entity");
const driver_entity_1 = require("./driver.entity");
const store_entity_1 = require("../../stores/entities/store.entity");
let Trip = class Trip {
    id;
    tripCode;
    order;
    carrier;
    vehicle;
    driver;
    tripType;
    originName;
    originAddress;
    destinationName;
    destinationAddress;
    scheduledPickupAt;
    scheduledDeliveryAt;
    actualPickupAt;
    actualDeliveryAt;
    status;
    notes;
    createdAt;
    updatedAt;
};
exports.Trip = Trip;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Trip.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Trip.prototype, "tripCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order),
    __metadata("design:type", order_entity_1.Order)
], Trip.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store),
    __metadata("design:type", store_entity_1.Store)
], Trip.prototype, "carrier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vehicle_entity_1.Vehicle, { nullable: true }),
    __metadata("design:type", vehicle_entity_1.Vehicle)
], Trip.prototype, "vehicle", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver, { nullable: true }),
    __metadata("design:type", driver_entity_1.Driver)
], Trip.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "tripType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "originName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "originAddress", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "destinationName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Trip.prototype, "destinationAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Trip.prototype, "scheduledPickupAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Trip.prototype, "scheduledDeliveryAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Trip.prototype, "actualPickupAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], Trip.prototype, "actualDeliveryAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'CREATED' }),
    __metadata("design:type", String)
], Trip.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Trip.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Trip.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Trip.prototype, "updatedAt", void 0);
exports.Trip = Trip = __decorate([
    (0, typeorm_1.Entity)('trips')
], Trip);
//# sourceMappingURL=trip.entity.js.map