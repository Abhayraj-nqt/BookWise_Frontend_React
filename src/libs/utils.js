import { validationPatterns } from "./constants";

export const validateEmail = (email) => {
    const emailPattern = validationPatterns.email;
    return emailPattern.test(email);
}

export const validateMobile = (mobile) => {
    const mobilePattern = validationPatterns.mobile;
    return mobilePattern.test(mobile);
}

export const validateEmailOrMobile = (input) => {
    return validateEmail(input) || validateMobile(input);
};
  
export const validatePassword = (password) => {
    const AZ = validationPatterns.AZ;
    const az = validationPatterns.az;
    const number = validationPatterns.number;
    const anyChar = validationPatterns.anyChar;
    return password.length >= 8 && AZ.test(password) && az.test(password) && number.test(password) && anyChar.test(password);
};


export const validateNotEmpty = (text) => {
    if (typeof text === 'number') {
        return text > 0;
    }

    text = String(text);

    return text.length >= 1;
}

export const validateAlphabet = (text) => {
    return validationPatterns.alphabet.test(text);
}

export const validateMinLength = (text, minLength) => {
    return text.length >= minLength;
}

export const validateEmailDomain = (text='') => {
    const domains = ['.com', '.in', '.org', '.net'];
    const extractedDomain = text.substring(text.lastIndexOf('.'));
    return domains.includes(extractedDomain);
}