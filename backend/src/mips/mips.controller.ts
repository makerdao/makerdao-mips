import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { PaginationQueryDto } from '@app/common/dto/pagination-query.dto';
import { MIPsService } from './services/mips.service';

@Controller('mips')
export class MIPsController {
  constructor(private readonly mipsService: MIPsService) {}

  @Get()
  @ApiQuery({
    name: 'limit',
    description: 'Default value 10',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Default value 0',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'order',
    description: `'name -email', means: order property name ASC and email DESC`,
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'search',
    description: `search`,
    type: String,
    required: false,
  })
  async findAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('order') order?: string,
    @Query('search') search?: string,
  ) {
    const paginationQueryDto: PaginationQueryDto = {
      limit: +limit,
      offset: +offset,
    };

    const items = await this.mipsService.findAll(
      paginationQueryDto,
      order,
      search,
    );
    const total = await this.mipsService.count();

    return { items, total };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mipsService.findOne(id);
  }
}
