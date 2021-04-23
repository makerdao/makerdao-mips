import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

import * as crypto from "crypto";

import { MIPsService } from "./services/mips.service";
import { ParseMIPsService } from "./services/parse-mips.service";
import { PullRequestService } from "./services/pull-requests.service";

import { Env } from "@app/env";
import { Filters, PaginationQueryDto } from "./dto/query.dto";

@Controller("mips")
export class MIPsController {
  constructor(
    private mipsService: MIPsService,
    private parseMIPsService: ParseMIPsService,
    private pullRequestService: PullRequestService,
    private configService: ConfigService
  ) {}

  @Get("findall")
  @ApiQuery({
    name: "limit",
    description: "Limit per page, default value 10",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "page",
    description: "Page, default value equal to zero",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "order",
    description: `'title -mip', means: order property title ASC and mip DESC`,
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "select",
    description: `Select files to get output`,
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "search",
    description:
      'The search field treats most punctuation in the string as delimiters, except a hyphen-minus (-) that negates term or an escaped double quotes (\\ ") that specifies a phrase',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: "filter",
    description:
      "Filter field with various filter patterns. (contains, notcontains, equals, notequals)",
    required: false,
    type: "object",
    schema: {
      type: "object",
      example: {
        filter: {
          contains: [{ field: "status", value: "RFC" }],
          notcontains: [{ field: "status", value: "Accepted" }],
          equals: [{ field: "mip", value: -1 }],
          notequals: [{ field: "mip", value: -1 }],
        },
      },
    },
  })
  async findAll(
    @Query("limit") limit?: string,
    @Query("page") page?: string,
    @Query("order") order?: string,
    @Query("select") select?: string,
    @Query("search") search?: string,
    @Query("filter") filter?: Filters
  ) {
    try {
      const paginationQueryDto: PaginationQueryDto = {
        limit: +limit || 10,
        page: +page,
      };

      return await this.mipsService.findAll(
        paginationQueryDto,
        order,
        search,
        filter,
        select
      );
      
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get("findone")
  @ApiQuery({
    type: String,
    name: "mipName",
    required: true
  })
  async findOneByMipName(
    @Query("mipName") mipName?: string
  ) {

    const mip = await this.mipsService.findOneByMipName(mipName);

    if (!mip) {
      throw new NotFoundException(`MIPs with name ${mipName} not found`);
    }

    let subproposals = [];

    if (!mip.proposal) {
      subproposals = await this.mipsService.findOneByProposal(mip.mipName);
    }

    try {
      const pullRequests = await this.pullRequestService.aggregate(
        mip.filename
      );
      return { mip, pullRequests, subproposals };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get("smart-search")
  @ApiQuery({
    type: String,
    name: "field",
    required: true
  })
  @ApiQuery({
    type: String,
    name: "value",
    required: true
  })
  async smartSearch(
    @Query("field") field: string,
    @Query("value") value: string,
  ) {
    try {
      return await this.mipsService.smartSearch(field, value);      
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );      
    }
    
  }

  @Get("findone-by")
  @ApiQuery({
    type: String,
    name: "field",
    required: true
  })
  @ApiQuery({
    type: String,
    name: "value",
    required: true
  })
  async findOneByFilename(
    @Query("field") field: string,
    @Query("value") value: string,
  ) {

    let mip;

    switch (field) {
      case 'filename':
        mip = await this.mipsService.findOneByFileName(value);
        if (!mip) {
          throw new NotFoundException(`MIPs with ${field} ${value} not found`);
        }
        return mip;

      case 'mipName':
        mip = await this.mipsService.getSummaryByMipName(value);

        if (!mip) {
          throw new NotFoundException(`MIPs with ${field} ${value} not found`);
        }
        return mip;
    
      default:
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: `Field ${field} not found`,
          },
          HttpStatus.BAD_REQUEST
        );    
    }    
  }

  @Post("callback")
  async callback(@Req() { headers, body }: any): Promise<boolean> {
    try {
      const secretToken = this.configService.get<string>(
        Env.WebhooksSecretToken
      );

      const hmac = crypto.createHmac("sha1", secretToken);
      const selfSignature = hmac.update(JSON.stringify(body)).digest("hex");
      const comparisonSignature = `sha1=${selfSignature}`; // shape in GitHub header

      const signature = headers["x-hub-signature"];

      if (!signature) {
        return false;
      }

      const source = Buffer.from(signature);
      const comparison = Buffer.from(comparisonSignature);

      if (!crypto.timingSafeEqual(source, comparison)) {
        return false;
      }

      this.parseMIPsService.loggerMessage("Webhooks works");

      return this.parseMIPsService.parse();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
