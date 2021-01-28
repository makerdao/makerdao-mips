import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { Env } from "./env";
import { ValidationPipe } from "@nestjs/common";
import { MongoExceptionFilter } from "./exceptions/mongodb-exception.filter";
var fs = require('fs');

async function bootstrap() {

  const httpsOptions = {
    key: fs.readFileSync('./secrets/privkey.pem'),
    cert: fs.readFileSync('./secrets/cert.pem'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  // app.enableCors({
  //   origin: '*',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: 'Content-Type, Accept',
  //   credentials: true,
  // });

  const options = new DocumentBuilder()
    .setTitle("Parse mips project")
    .setDescription(
      "This project is a MIPs Tracker for MakerDAO Improvement Proposals. MIPs projects."
    )
    .setVersion("1.0")
    .build();
    
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("doc", app, document);

  const port = configService.get<number>(Env.Port) || 3000;

  app.useGlobalFilters(new MongoExceptionFilter());

  await app.listen(port);
  console.log(`Application running at ${port} port`);
}
bootstrap();
