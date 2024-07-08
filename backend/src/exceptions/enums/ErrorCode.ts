export enum ErrorCode {
    USER_ALREADY_EXISTS = 1001,
    USER_NOT_FOUND = 1002,
    INCORRECT_PASSWORD = 1003,
    USER_ALREADY_VERIFIED = 1004,
    USERNAME_IS_USED = 1005,
    EMAIL_IS_USED = 1006,

    VERIFICATION_CODE_NOT_FOUND = 1011,
    VERIFICATION_CODE_EXPIRED = 1012,

    PROFILE_NOT_FOUND = 1021,

    ROUTE_NOT_FOUND = 1101,

    UNAUTHORIZED = 2001,
    FORBIDDEN = 2002,

    UNPROCESSABLE_ENTITY = 3001,

    BAD_REQUEST = 4001,
    
    INTERNAL_EXCEPTION = 7001,
}