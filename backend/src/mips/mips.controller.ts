import { Controller, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Query } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

import { Filters, PaginationQueryDto } from "@app/common/dto/query.dto";
import { MIPsService } from "./services/mips.service";
import { ParseMIPsService } from "./services/parse-mips.service";

@Controller("mips")
export class MIPsController {
  constructor(
    private readonly mipsService: MIPsService,
    private readonly parseMIPsService: ParseMIPsService
  ) { }

  @Get()
  @ApiQuery({
    name: "limit",
    description: "Default value 10",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "offset",
    description: "Default value 0",
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: "order",
    description: `'title -name', means: order property title ASC and name DESC`,
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
    required: false,
    type: "object",
    schema: {     
      type: "object",
      example: {"filter": {contains: [{"field": "title", "value": "Proposal"}]}},
    }
  })
  async findAll(
    @Query("limit") limit?: string,
    @Query("offset") offset?: string,
    @Query("order") order?: string,
    @Query("search") search?: string,
    @Query("filter") filter?: Filters,
  ) {

    try {
      const paginationQueryDto: PaginationQueryDto = {
        limit: +limit || 10,
        offset: +offset,
      };
  
      const items = await this.mipsService.findAll(
        paginationQueryDto,
        order,
        search,
        filter
      );
      const total = await this.mipsService.count(search, filter);  
      return { items, total };
      
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

  @Get(":id")
  async findOne(@Param("id") id: string) {
    if (!this.mipsService.isValidObjectId(id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Invalid decoding ID ${id}`,
        },
        HttpStatus.BAD_REQUEST
      );
    }
    const mips = await this.mipsService.findOne(id);    

    if (!mips) {
      throw new NotFoundException(`MIPs with ${id} not found`);
    }

    return mips;
  }

  @Post("callback")
  async callback(): Promise<boolean> {
    try {      
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
