import HttpException from "./HttpException";
import { ErrorCode } from "./enums/ErrorCode";

export default class UnauthorizedException extends HttpException {
    constructor(message: string, errorCode: ErrorCode) {
        super(message, errorCode, 401, null);
    }
}