"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const env_1 = require("./env");
const common_1 = require("@nestjs/common");
const mongodb_exception_filter_1 = require("./exceptions/mongodb-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    const options = new swagger_1.DocumentBuilder()
        .setTitle("Parse mips project")
        .setDescription("This project is a MIPs Tracker for MakerDAO Improvement Proposals. MIPs projects.")
        .setVersion("1.0")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup("doc", app, document);
    const port = configService.get(env_1.Env.Port) || 3000;
    app.useGlobalFilters(new mongodb_exception_filter_1.MongoExceptionFilter());
    await app.listen(port);
    console.log(`Application running at ${port} port`);
}
bootstrap();
//# sourceMappingURL=main.js.map