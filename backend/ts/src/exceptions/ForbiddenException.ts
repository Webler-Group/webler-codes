import HttpException from "./HttpException";
import { ErrorCode } from "./enums/ErrorCode";

export default class ForbiddenException extends HttpException {
    constructor(message: string, errorCode: ErrorCode) {
        super(message, errorCode, 403, null);
    }
}