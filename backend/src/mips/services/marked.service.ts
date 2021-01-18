import { Injectable } from "@nestjs/common";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const marked = require("marked");

@Injectable()
export class MarkedService {
  markedLexer(data: string): any {
    return marked.lexer(data);
  }

  markedHtml(data: string): any {
    return marked(data);
  }
}
