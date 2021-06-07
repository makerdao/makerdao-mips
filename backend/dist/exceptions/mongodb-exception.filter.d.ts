import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
export declare class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}
