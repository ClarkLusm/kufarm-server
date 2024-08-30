import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { readFileSync } from 'fs';

const json = JSON.parse(readFileSync('package.json', 'utf-8'));
export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Bitcoino2fi')
    .setDescription('Bitcoino2fi API Description')
    .setVersion(json.version)
    .addTag('Bitcoino2fi')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
}
