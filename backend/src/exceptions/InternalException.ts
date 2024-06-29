import HttpException from "./HttpException";
import { ErrorCode } from "./enums/ErrorCode";

export default class InternalException extends HttpException {
    
    constructor(message: string, errorCode: ErrorCode, errors: any) {
        super(message, errorCode, 500, errors);
    }
}