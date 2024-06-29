import { NextFunction, Request, Response } from "express"
import HttpException from "../exceptions/HttpException";
import InternalException from "../exceptions/InternalException";
import { ErrorCode } from "../exceptions/enums/ErrorCode";
import { ZodError } from "zod";
import BadRequestException from "../exceptions/BadRequestException";
import { logEvents } from "../services/logger";

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next);
        } catch(error: any) {
            let exception: HttpException;
            if(error instanceof HttpException) {
                exception = error;
            } else if(error instanceof ZodError) {
                exception = new BadRequestException('Unprocessable entity', ErrorCode.UNPROCESSABLE_ENTITY, error);
            } else {
                exception = new InternalException('Something went wrong', ErrorCode.INTERNAL_EXCEPTION, null);
                logEvents(error.stack, 'error.log');
            }
            next(exception);
        }
    }
}