"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const api_response_interceptor_1 = require("./common/interceptors/api-response.interceptor");
const api_exception_filter_1 = require("./common/filters/api-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalInterceptors(new api_response_interceptor_1.ApiResponseInterceptor());
    app.useGlobalFilters(new api_exception_filter_1.ApiExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Marketplace Logístico TOS API')
        .setDescription('Especificación maestra de API para el Marketplace Logístico TOS')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map