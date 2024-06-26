export enum ErrorCode {
    USER_ALREADY_EXISTS = 1001,
    USER_NOT_FOUND = 1002,
    INCORRECT_PASSWORD = 1003,
    USER_ALREADY_VERIFIED = 1004,

    VERIFICATION_CODE_NOT_FOUND = 1011,
    VERIFICATION_CODE_EXPIRED = 1012,

    UNAUTHORIZED = 2001,
    FORBIDDEN = 2002,

    UNPROCESSABLE_ENTITY = 3001,
    
    INTERNAL_EXCEPTION = 7001,
}