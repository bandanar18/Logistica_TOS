"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let ApiExceptionFilter = class ApiExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse = exception instanceof common_1.HttpException
            ? exception.getResponse()
            : { message: 'Internal server error' };
        const requestId = request.headers['x-request-id'] || `REQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const errorResponse = {
            success: false,
            message: typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse.message || 'An error occurred'),
            error: {
                code: exceptionResponse.error || 'INTERNAL_SERVER_ERROR',
                details: exceptionResponse.message instanceof Array ? exceptionResponse.message : [],
            },
            meta: {
                requestId,
                timestamp: new Date().toISOString(),
                version: 'v1',
            },
        };
        response.status(status).json(errorResponse);
    }
};
exports.ApiExceptionFilter = ApiExceptionFilter;
exports.ApiExceptionFilter = ApiExceptionFilter = __decorate([
    (0, common_1.Catch)()
], ApiExceptionFilter);
//# sourceMappingURL=api-exception.filter.js.map