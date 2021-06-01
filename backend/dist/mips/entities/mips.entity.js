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
exports.MIPsSchema = exports.MIP = exports.Reference = exports.Section = void 0;
const mongoose_1 = require("@nestjs/mongoose");
class Section {
}
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Section.prototype, "heading", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Section.prototype, "depth", void 0);
exports.Section = Section;
class Reference {
}
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Reference.prototype, "name", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], Reference.prototype, "link", void 0);
exports.Reference = Reference;
let MIP = class MIP {
};
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MIP.prototype, "file", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MIP.prototype, "filename", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MIP.prototype, "hash", void 0);
__decorate([
    mongoose_1.Prop({
        default: -1,
        type: Number,
    }),
    __metadata("design:type", Number)
], MIP.prototype, "mip", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MIP.prototype, "mipName", void 0);
__decorate([
    mongoose_1.Prop({
        default: -1,
        type: Number,
    }),
    __metadata("design:type", Number)
], MIP.prototype, "subproposal", void 0);
__decorate([
    mongoose_1.Prop({
        index: { type: "text" },
    }),
    __metadata("design:type", String)
], MIP.prototype, "title", void 0);
__decorate([
    mongoose_1.Prop({
        default: "",
        type: String,
    }),
    __metadata("design:type", String)
], MIP.prototype, "proposal", void 0);
__decorate([
    mongoose_1.Prop({
        type: [String],
    }),
    __metadata("design:type", Array)
], MIP.prototype, "author", void 0);
__decorate([
    mongoose_1.Prop({
        type: [String],
    }),
    __metadata("design:type", Array)
], MIP.prototype, "contributors", void 0);
__decorate([
    mongoose_1.Prop({
        type: [String],
    }),
    __metadata("design:type", Array)
], MIP.prototype, "tags", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MIP.prototype, "status", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MIP.prototype, "types", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MIP.prototype, "dateProposed", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MIP.prototype, "dateRatified", void 0);
__decorate([
    mongoose_1.Prop({
        type: [String],
    }),
    __metadata("design:type", Array)
], MIP.prototype, "dependencies", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MIP.prototype, "replaces", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MIP.prototype, "sentenceSummary", void 0);
__decorate([
    mongoose_1.Prop(),
    __metadata("design:type", String)
], MIP.prototype, "paragraphSummary", void 0);
__decorate([
    mongoose_1.Prop({
        type: [Object]
    }),
    __metadata("design:type", Array)
], MIP.prototype, "sections", void 0);
__decorate([
    mongoose_1.Prop({
        type: [String]
    }),
    __metadata("design:type", Array)
], MIP.prototype, "sectionsRaw", void 0);
__decorate([
    mongoose_1.Prop({
        type: [Object]
    }),
    __metadata("design:type", Array)
], MIP.prototype, "references", void 0);
MIP = __decorate([
    mongoose_1.Schema()
], MIP);
exports.MIP = MIP;
exports.MIPsSchema = mongoose_1.SchemaFactory.createForClass(MIP);
//# sourceMappingURL=mips.entity.js.map