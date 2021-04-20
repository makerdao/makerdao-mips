import { Injectable } from "@nestjs/common";
import {Parser} from "jison";

@Injectable()
export class ParseQueryService {  
  parser: any;

  constructor() {
    this.parser = new Parser({
      lex: {
        rules: [
          ["\\s", "/* skip whitespace */"],
          ["\\$", "/* skip whitespace */"],
          [",", "return ',';"],
          ["AND", "return 'AND';"],
          ["OR", "return 'OR';"],
          ["NOT", "return 'NOT';"],
          ["\\(", "return '(';"],
          ["\\)", "return ')';"],
          ["(#|@)+[a-zA-Z_][a-zA-Z0-9_]*", "return 'LITERAL';"],
        ],
      },
      operators: [
        ["left", "(", ")"],
        ["left", "OR", "AND", "NOT"],
      ],
      bnf: {
        program: [["e", "return $1"]],
        e: [
          ["OR ( e , e )", "$$ = { type: 'OPERATION', left: $3, op: $1, right: $5 }"],
          ["AND ( e , e )", "$$ = { type: 'OPERATION', left: $3, op: $1, right: $5 }"],
          ["NOT ( e )", "$$ = { type: 'OPERATION', left: $3, op: $1 }"],
          ["LITERAL", "$$ = { type: 'LITERAL', name: $1 };"],
        ],
      },
    });
  }

  async parse(query: string): Promise<any> {
    return this.parser.parse(query);    
  }
}
