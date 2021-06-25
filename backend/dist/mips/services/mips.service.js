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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MIPsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mips_entity_1 = require("../entities/mips.entity");
const parse_query_service_1 = require("./parse-query.service");
let MIPsService = class MIPsService {
    constructor(mipsDoc, parseQueryService) {
        this.mipsDoc = mipsDoc;
        this.parseQueryService = parseQueryService;
    }
    async groupProposal() {
        return await this.mipsDoc.aggregate([
            { $match: { proposal: { $ne: "" } } },
            { $group: { _id: "$proposal" } },
        ]);
    }
    async findAll(paginationQuery, order, search, filter, select) {
        const buildFilter = await this.buildFilter(search, filter);
        const { limit, page } = paginationQuery;
        const total = await this.mipsDoc.countDocuments(buildFilter).exec();
        if (select) {
            const items = await this.mipsDoc
                .find(buildFilter)
                .select(select)
                .sort(order)
                .skip(page * limit)
                .limit(limit)
                .exec();
            return { items, total };
        }
        const items = await this.mipsDoc
            .find(buildFilter)
            .select(["-file", "-__v", "-sections", "-sectionsRaw"])
            .sort(order)
            .skip(page * limit)
            .limit(limit)
            .exec();
        return { items, total };
    }
    async buildFilter(search, filter) {
        let source = {};
        if (filter === null || filter === void 0 ? void 0 : filter.contains) {
            const field = filter.contains["field"];
            const value = filter.contains["value"];
            if (Array.isArray(field) && Array.isArray(value)) {
                for (let i = 0; i < field.length; i++) {
                    const newValue = this.validField(field[i].toString(), value[i]);
                    source[`${field[i].toString()}`] = {
                        $regex: new RegExp(`${newValue}`),
                        $options: "i",
                    };
                }
            }
            else {
                const newValue = this.validField(field.toString(), value);
                source[`${field.toString()}`] = {
                    $regex: new RegExp(`${newValue}`),
                    $options: "i",
                };
            }
        }
        if (filter === null || filter === void 0 ? void 0 : filter.equals) {
            const field = filter.equals["field"];
            const value = filter.equals["value"];
            if (Array.isArray(field) && Array.isArray(value)) {
                for (let i = 0; i < field.length; i++) {
                    const newValue = this.validField(field[i].toString(), value[i]);
                    source[`${field[i].toString()}`] = newValue;
                }
            }
            else {
                const newValue = this.validField(field.toString(), value);
                source[`${field.toString()}`] = newValue;
            }
        }
        if (filter === null || filter === void 0 ? void 0 : filter.inarray) {
            const field = filter.inarray["field"];
            const value = filter.inarray["value"];
            if (Array.isArray(field) && Array.isArray(value)) {
                for (let i = 0; i < field.length; i++) {
                    const newValue = this.validField(field[i].toString(), value[i]);
                    source[`${field[i].toString()}`] = { $in: newValue };
                }
            }
            else {
                const newValue = this.validField(field.toString(), value);
                source[`${field.toString()}`] = { $in: newValue };
            }
        }
        if (filter === null || filter === void 0 ? void 0 : filter.notcontains) {
            const field = filter.notcontains["field"];
            const value = filter.notcontains["value"];
            if (Array.isArray(field) && Array.isArray(value)) {
                for (let i = 0; i < field.length; i++) {
                    const newValue = this.validField(field[i].toString(), value[i]);
                    source[`${field[i].toString()}`] = {
                        $not: { $regex: new RegExp(`${newValue}`), $options: "i" },
                    };
                }
            }
            else {
                const newValue = this.validField(field.toString(), value);
                source[`${field.toString()}`] = {
                    $not: { $regex: new RegExp(`${newValue}`), $options: "i" },
                };
            }
        }
        if (filter === null || filter === void 0 ? void 0 : filter.notequals) {
            const field = filter.notequals["field"];
            const value = filter.notequals["value"];
            if (Array.isArray(field) && Array.isArray(value)) {
                for (let i = 0; i < field.length; i++) {
                    const newValue = this.validField(field[i].toString(), value[i]);
                    source[`${field[i].toString()}`] = { $ne: newValue };
                }
            }
            else {
                const newValue = this.validField(field.toString(), value);
                source[`${field.toString()}`] = { $ne: newValue };
            }
        }
        if (search) {
            if (search.startsWith("$")) {
                const or = new RegExp("or", "gi");
                const and = new RegExp("and", "gi");
                const not = new RegExp("not", "gi");
                search = search
                    .replace(or, "OR")
                    .replace(not, "NOT")
                    .replace(and, "AND");
                const ast = await this.parseQueryService.parse(search);
                const query = this.buildSmartMongoDBQuery(ast);
                source = {
                    $and: [
                        Object.assign(Object.assign({}, source), query),
                    ],
                };
            }
            else {
                source["$text"] = { $search: JSON.parse(`"${search}"`) };
            }
        }
        return source;
    }
    buildSmartMongoDBQuery(ast) {
        if (ast.type === "LITERAL" && ast.name.includes("#")) {
            return { tags: { $in: [ast.name.replace("#", "")] } };
        }
        else if (ast.type === "LITERAL" && ast.name.includes("@")) {
            return {
                status: {
                    $regex: new RegExp(`${ast.name.replace("@", "")}`),
                    $options: "i",
                },
            };
        }
        else {
            if (ast.type === "OPERATION" && ast.op === "OR") {
                const request = [];
                for (const item of ast.left) {
                    request.push(this.buildSmartMongoDBQuery(item));
                }
                return {
                    $or: [...request],
                };
            }
            else if (ast.type === "OPERATION" && ast.op === "AND") {
                const request = [];
                for (const item of ast.left) {
                    request.push(this.buildSmartMongoDBQuery(item));
                }
                return {
                    $and: [...request],
                };
            }
            else if (ast.type === "OPERATION" && ast.op === "NOT") {
                if (ast.left.includes("#")) {
                    return { tags: { $nin: [ast.left.replace("#", "")] } };
                }
                else if (ast.left.includes("@")) {
                    return {
                        status: {
                            $not: {
                                $regex: new RegExp(`${ast.left.replace("@", "")}`),
                                $options: "i",
                            },
                        },
                    };
                }
                else {
                    throw new Error("Database query not support");
                }
            }
            else {
                return;
            }
        }
    }
    isValidObjectId(id) {
        if (mongoose_2.isValidObjectId(id)) {
            return true;
        }
        return false;
    }
    validField(field, value) {
        let flag = false;
        switch (field) {
            case "status":
                flag = true;
                break;
            case "mipName":
                flag = true;
                break;
            case "filename":
                flag = true;
                break;
            case "proposal":
                flag = true;
                break;
            case "mip":
                flag = true;
                break;
            case "tags":
                flag = true;
                break;
            case "contributors":
                flag = true;
                break;
            case "author":
                flag = true;
                break;
        }
        if (!flag) {
            throw new Error(`Invalid filter field (${field})`);
        }
        return value;
    }
    async findOneByMipName(mipName) {
        return await this.mipsDoc
            .findOne({ mipName })
            .select(["-__v", "-file"])
            .exec();
    }
    async smartSearch(field, value) {
        switch (field) {
            case "tags":
                return await this.mipsDoc.aggregate([
                    { $unwind: "$tags" },
                    {
                        $match: {
                            tags: {
                                $regex: new RegExp(`^${value}`),
                                $options: "i",
                            },
                        },
                    },
                    { $group: { _id: { tags: "$tags" }, tag: { $first: "$tags" } } },
                    { $project: { _id: 0, tag: "$tag" } },
                ]);
            case "status":
                return await this.mipsDoc.aggregate([
                    {
                        $match: {
                            status: {
                                $regex: new RegExp(`^${value}`),
                                $options: "i",
                            },
                        },
                    },
                    {
                        $group: {
                            _id: { status: "$status" },
                            status: { $first: "$status" },
                        },
                    },
                    { $project: { _id: 0, status: "$status" } },
                ]);
            default:
                throw new Error(`Field ${field} invalid`);
        }
    }
    async findOneByFileName(filename) {
        const filter = {
            filename: {
                $regex: new RegExp(filename),
                $options: "i",
            },
        };
        return await this.mipsDoc.findOne(filter).select(["-__v", "-file"]).exec();
    }
    async getSummaryByMipName(mipName) {
        return await this.mipsDoc
            .findOne({ mipName })
            .select(["sentenceSummary", "paragraphSummary", "title"])
            .exec();
    }
    async findOneByProposal(proposal) {
        return await this.mipsDoc
            .find({ proposal: proposal })
            .select("title mipName")
            .sort("mip subproposal")
            .exec();
    }
    create(mIPs) {
        return this.mipsDoc.create(mIPs);
    }
    insertMany(mips) {
        return this.mipsDoc.insertMany(mips);
    }
    async getAll() {
        var e_1, _a;
        const files = new Map();
        try {
            for (var _b = __asyncValues(this.mipsDoc
                .find([{ $sort: { filename: 1 } }])
                .select(["hash", "filename"])
                .cursor()), _c; _c = await _b.next(), !_c.done;) {
                const doc = _c.value;
                files.set(doc.filename, doc);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) await _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return files;
    }
    async deleteManyByIds(ids) {
        await this.mipsDoc.deleteMany({ _id: { $in: ids } });
    }
    async deleteMany() {
        await this.mipsDoc.deleteMany();
    }
    async update(id, mIPs) {
        const existingMIPs = await this.mipsDoc
            .findOneAndUpdate({ _id: id }, { $set: mIPs }, { new: true, useFindAndModify: false })
            .lean(true);
        return existingMIPs;
    }
    async setMipsFather(mips) {
        const existingMIPs = await this.mipsDoc
            .findOneAndUpdate({ mipName: { $in: mips } }, { $set: { mipFather: true } }, { new: true, useFindAndModify: false })
            .lean(true);
        return existingMIPs;
    }
    async remove(id) {
        return await this.mipsDoc.deleteOne({ _id: id }).lean(true);
    }
};
MIPsService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(mips_entity_1.MIP.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        parse_query_service_1.ParseQueryService])
], MIPsService);
exports.MIPsService = MIPsService;
//# sourceMappingURL=mips.service.js.map