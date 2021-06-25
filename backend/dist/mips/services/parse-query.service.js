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
exports.ParseQueryService = void 0;
const common_1 = require("@nestjs/common");
const jison_1 = require("jison");
let ParseQueryService = class ParseQueryService {
    constructor() {
        this.parser = new jison_1.Parser({
            lex: {
                options: {
                    "case-insensitive": false
                },
                rules: [
                    ["\\s", "/* skip whitespace */"],
                    ["\\$", "/* skip whitespace */"],
                    [",", "return ',';"],
                    ["AND", "return 'AND';"],
                    ["OR", "return 'OR';"],
                    ["NOT", "return 'NOT';"],
                    ["\\(", "return '(';"],
                    ["\\)", "return ')';"],
                    ["(#|@)+[a-zA-Z_\\-][a-zA-Z0-9_\\-]*", "return 'LITERAL';"],
                ],
            },
            operators: [
                ["left", "(", ")"],
                ["left", "OR", "AND", "NOT"],
            ],
            bnf: {
                program: [["e", "return $1"]],
                LIST: [
                    ["e", "$$ = [$1]"],
                    ["e , LIST", "$$ = $3; $3.push($1)"],
                ],
                e: [
                    [
                        "OR ( LIST )",
                        "$$ = { type: 'OPERATION', op: $1, left: $3 }",
                    ],
                    [
                        "AND ( LIST )",
                        "$$ = { type: 'OPERATION', op: $1, left: $3 }",
                    ],
                    ["NOT ( LITERAL )", "$$ = { type: 'OPERATION', left: $3, op: $1 }"],
                    ["LITERAL", "$$ = { type: 'LITERAL', name: $1 };"],
                ]
            },
        });
    }
    async parse(query) {
        return this.parser.parse(query);
    }
};
ParseQueryService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], ParseQueryService);
exports.ParseQueryService = ParseQueryService;
//# sourceMappingURL=parse-query.service.js.map