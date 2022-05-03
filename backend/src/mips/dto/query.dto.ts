import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  limit = 10;

  @IsOptional()
  @IsPositive()
  page: number;
}

export class Filters {
  contains?: BinaryOperator[];
  notcontains?: BinaryOperator[];
  equals?: BinaryOperator[];
  notequals?: BinaryOperator[];
  inarray?: BinaryArrayOperator[];
}

export class BinaryOperator {
  field: string;
  value: string;
}

export class BinaryArrayOperator {
  field: string;
  value: string[];
}
