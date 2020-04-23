export enum InputValidationUsername{
    OK = 0,
    TAKEN = 1 
}

export enum InputValidationPassword{
    NO_CAPS,
    NO_DIGIT,
    NO_LETTER,
    OK
}

export enum InputValidationPasswordConfirm{
    NOT_MATCHING,
    OK
}

export enum InputValidationEmail{
    TAKEN,
    OK
}