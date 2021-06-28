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
exports.BinaryArrayOperator = exports.BinaryOperator = exports.Filters = exports.PaginationQueryDto = void 0;
const class_validator_1 = require("class-validator");
class PaginationQueryDto {
    constructor() {
        this.limit = 10;
    }
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsPositive(),
    __metadata("design:type", Object)
], PaginationQueryDto.prototype, "limit", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsPositive(),
    __metadata("design:type", Number)
], PaginationQueryDto.prototype, "page", void 0);
exports.PaginationQueryDto = PaginationQueryDto;
class Filters {
}
exports.Filters = Filters;
class BinaryOperator {
}
exports.BinaryOperator = BinaryOperator;
class BinaryArrayOperator {
}
exports.BinaryArrayOperator = BinaryArrayOperator;
//# sourceMappingURL=query.dto.js.map