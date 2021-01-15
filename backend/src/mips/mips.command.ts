import { Command } from "nestjs-command";
import { Injectable } from "@nestjs/common";
import { ParseMIPsService } from "./services/parse-mips.service";
 
@Injectable()
export class ParseMIPsCommand {
  constructor(private readonly parseMIPsService: ParseMIPsService) {}
 
  @Command({
    command: "parse:mips",
    describe: "Parse mips of makerDao repository",
    autoExit: true // defaults to `true`, but you can use `false` if you need more control
  })
  async parse() {
    await this.parseMIPsService.parse();
  }
}