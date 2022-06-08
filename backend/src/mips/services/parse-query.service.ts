import { Injectable } from "@nestjs/common";
import { Parser } from "jison";

@Injectable()
export class ParseQueryService {
  parser: any;

  constructor() {
    this.parser = new Parser({
      lex: {
        options: {
          "case-insensitive": true
        },
        rules: [
          // ["\\s", "/* skip whitespace */"],
          ["\\$\\s", "/* skip whitespace */"],
          ["\\$", "/* skip whitespace */"],
          [",\\s", "return ',';"],
          [",", "return ',';"],
          ["AND", "return 'AND';"],
          ["OR", "return 'OR';"],
          ["NOT", "return 'NOT';"],
          ["\\(", "return '(';"],
          ["\\)", "return ')';"],
          ["(#|@)+[a-zA-Z_\\-][a-zA-Z0-9_\\-\\s]*", "return 'LITERAL';"],
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

  async parse(query: string): Promise<any> {
    return this.parser.parse(query);
  }
}
