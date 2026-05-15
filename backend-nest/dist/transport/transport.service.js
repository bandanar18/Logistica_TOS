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
exports.TransportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const trip_entity_1 = require("./entities/trip.entity");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const driver_entity_1 = require("./entities/driver.entity");
const audit_service_1 = require("../audit/audit.service");
let TransportService = class TransportService {
    tripRepo;
    vehicleRepo;
    driverRepo;
    auditService;
    constructor(tripRepo, vehicleRepo, driverRepo, auditService) {
        this.tripRepo = tripRepo;
        this.vehicleRepo = vehicleRepo;
        this.driverRepo = driverRepo;
        this.auditService = auditService;
    }
    async findAllTrips() {
        return this.tripRepo.find({ relations: ['vehicle', 'driver', 'order', 'carrier'] });
    }
    async generateTripCode() {
        const count = await this.tripRepo.count();
        const year = new Date().getFullYear();
        return `TRP-${year}-${(count + 1).toString().padStart(4, '0')}`;
    }
    async createTrip(data, user) {
        const tripCode = await this.generateTripCode();
        const trip = this.tripRepo.create({ ...data, tripCode });
        const saved = await this.tripRepo.save(trip);
        await this.auditService.log({
            user,
            module: 'transport',
            action: 'trip.created',
            entityType: 'trip',
            entityId: saved.id.toString(),
            metadata: { code: saved.tripCode, origin: saved.originName, destination: saved.destinationName }
        });
        return saved;
    }
    async updateTripStatus(id, status, user) {
        try {
            const trip = await this.tripRepo.findOne({
                where: { id },
                relations: ['vehicle', 'driver', 'order', 'carrier']
            });
            if (!trip)
                throw new common_1.NotFoundException(`Trip with ID ${id} not found`);
            const oldStatus = trip.status;
            trip.status = status;
            if (status === 'IN_TRANSIT')
                trip.actualPickupAt = new Date();
            if (status === 'DELIVERED')
                trip.actualDeliveryAt = new Date();
            const updated = await this.tripRepo.save(trip);
            await this.auditService.log({
                user: { id: user.id },
                module: 'transport',
                action: 'trip.status_changed',
                entityType: 'trip',
                entityId: id.toString(),
                metadata: { oldStatus, newStatus: status }
            }).catch(err => console.error('Audit log failed:', err));
            return updated;
        }
        catch (error) {
            console.error('Error updating trip status:', error);
            throw error;
        }
    }
    async findAllVehicles() {
        return this.vehicleRepo.find({ relations: ['store'] });
    }
    async findAllDrivers() {
        return this.driverRepo.find({ relations: ['store'] });
    }
};
exports.TransportService = TransportService;
exports.TransportService = TransportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trip_entity_1.Trip)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(2, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        audit_service_1.AuditService])
], TransportService);
//# sourceMappingURL=transport.service.js.map