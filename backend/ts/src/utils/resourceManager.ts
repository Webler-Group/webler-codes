//Compiled on Sun Jul 28 2024 01:31:25 GMT-0400 (Eastern Daylight Time)

interface iStringResource {
    appname: string,
    email_subject_prefix: string,
    username_is_used: string,
    email_is_used: string,
    verify_your_account_msg: string,
    incorrect_password: string,
    user_is_verified: string,
    verification_code_not_found: string,
    verification_code_expired: string,
    refresh_token_not_set: string,
    refresh_token_invalid: string,
    _last_append: string,
}

interface iR {
    _strings: { [key: string]: iStringResource },
    locale: string,
    strings: iStringResource,
    localeStrings: iStringResource,
}

const R: iR = {
    _strings: {
        en: { 
    appname:  "Webler",
    email_subject_prefix:  "Webler Codes Team",
    username_is_used:  "Username is currently not available",
    email_is_used:  "Email has been linked to another account",
    verify_your_account_msg:  "Please check your email to confirm your account",
    incorrect_password:  "Incorrect password",
    user_is_verified:  "User is already verified",
    verification_code_not_found:  "Verification code not found",
    verification_code_expired:  "Verification code expired",
    refresh_token_not_set:  "Refresh token is not set",
    refresh_token_invalid:  "Invalid refresh token",
    _last_append:  "insert before this"
 },
    },
    locale: "en",
    
    get strings(): iStringResource {
        return R._strings["en"];
    },
    
    // TODO: implement auth user locale here
    get localeStrings(): iStringResource {
        return R._strings[R.locale] || { };
    },
};

export default R;
