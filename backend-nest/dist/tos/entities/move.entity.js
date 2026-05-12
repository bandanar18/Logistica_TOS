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
exports.Move = void 0;
const typeorm_1 = require("typeorm");
const container_entity_1 = require("./container.entity");
const yard_entity_1 = require("./yard.entity");
let Move = class Move {
    id;
    container;
    fromYard;
    toYard;
    fromLocation;
    toLocation;
    moveType;
    executedAt;
};
exports.Move = Move;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Move.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => container_entity_1.Container),
    (0, typeorm_1.JoinColumn)({ name: 'container_id' }),
    __metadata("design:type", container_entity_1.Container)
], Move.prototype, "container", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => yard_entity_1.Yard),
    (0, typeorm_1.JoinColumn)({ name: 'from_yard_id' }),
    __metadata("design:type", yard_entity_1.Yard)
], Move.prototype, "fromYard", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => yard_entity_1.Yard),
    (0, typeorm_1.JoinColumn)({ name: 'to_yard_id' }),
    __metadata("design:type", yard_entity_1.Yard)
], Move.prototype, "toYard", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Move.prototype, "fromLocation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Move.prototype, "toLocation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Move.prototype, "moveType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Move.prototype, "executedAt", void 0);
exports.Move = Move = __decorate([
    (0, typeorm_1.Entity)('tos_moves')
], Move);
//# sourceMappingURL=move.entity.js.map