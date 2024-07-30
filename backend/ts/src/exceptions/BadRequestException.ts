import HttpException from "./HttpException";
import { ErrorCode } from "./enums/ErrorCode";

export default class BadRequestException extends HttpException {

    constructor(message: string, errorCode: ErrorCode, errors: any = null) {
        super(message, errorCode, 400, errors);
    }
}