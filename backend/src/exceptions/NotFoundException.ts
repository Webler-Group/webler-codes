import HttpException from "./HttpException";
import { ErrorCode } from "./enums/ErrorCode";

export default class NotFoundException extends HttpException {

    constructor(message: string, errorCode: ErrorCode) {
        super(message, errorCode, 404, null);
    }
}