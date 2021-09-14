import { Command } from "nestjs-command";
import { Injectable } from "@nestjs/common";
import { ParseMIPsService } from "./services/parse-mips.service";
import { MIPsService } from "./services/mips.service";

@Injectable()
export class ParseMIPsCommand {
  constructor(
    private readonly parseMIPsService: ParseMIPsService,
    private readonly mipsService: MIPsService
  ) {}

  @Command({
    command: "drop:db",
    describe: "Clear mips database collections",
    autoExit: true,
  })
  async drop() {
    try {
      const result = await this.mipsService.dropDatabase();

      console.log("Database Droped: ",result);
    } catch (error) {
      console.log("An Error happend on Droping the Database");
      console.log(error);
    }
  }

  @Command({
    command: "parse:mips",
    describe: "Parse mips of makerDao repository",
    autoExit: true, 
  })
  async parse() {
    await this.parseMIPsService.parse();
  }
}
