"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const nestjs_command_1 = require("nestjs-command");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, {
        logger: ["error", "log"],
    });
    app.select(nestjs_command_1.CommandModule).get(nestjs_command_1.CommandService).exec();
}
bootstrap();
//# sourceMappingURL=cli.js.map