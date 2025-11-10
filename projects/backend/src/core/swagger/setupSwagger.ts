import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { extraSwaggerModels } from "./extra-models";

export function setupSwagger(app: INestApplication, configService: ConfigService): void{
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('swagger.title', 'API Documentation'))
    .setDescription(configService.get<string>('swagger.description', ''))
    .setVersion(configService.get<string>('swagger.version', 'v1'))
    .addServer('http://localhost:3001')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // optional
      },
      'bearer', // @ApiBearerAuth()
    )
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: extraSwaggerModels,
  });
  SwaggerModule.setup('v1/api', app, document);
}