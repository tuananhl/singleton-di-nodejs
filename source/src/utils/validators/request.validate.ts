export class RequestValidate {
    constructor() {}

    public static handle(validation: any, data: any, partial: boolean = false): {[key: string]: Array<any> | boolean} {
        try {
            const result: Array<any> = [];
            Object.keys(validation).map((key:string) => {
                const vl: any = typeof data[key] == 'number' ? data[key] : (data[key] || null);
                let validateResults: any;
                if (partial) {
                    if (key in data) {
                        validateResults = this.validateWithKey(key, validation[key], vl, true).filter((item: string) => item);
                    }
                } else {
                    validateResults = this.validateWithKey(key, validation[key], vl).filter((item: string) => item);
                }
                if (validateResults && validateResults.length > 0) {
                    result.push(validateResults);
                }
            });
            return {
                errors: result,
                success: result.length == 0
            };
            
        } catch (err) {
            throw new Error(err.message);
        }
    }

    public static validateWithKey(name: string, validations: Array<string>, data: any, partial: boolean = false) {
        if (validations) {
            return validations.map((item: string) => {
                const keySplitted: Array<string | number> = item.split(":");
                const keyName: string = keySplitted.length > 1 ? keySplitted[0].toString() : item;
                const length: number = keySplitted.length > 1 ? parseInt(keySplitted[1].toString()) : 0;
                if (this.handleFunction[keyName]) {
                    return this.handleFunction[keyName](name, data, length, partial);
                } else {
                    throw new Error("Can not find validate with driver " + item)
                }
            });
        }
    }

    public static message: {[key: string] : Function} = {
        required: (name: string, partial: boolean = false) => `Property ${ name } is ${ partial ? 'not null' : 'required' }`,
        minLength: (name: string, length: number, partial: boolean = false) => `Property ${ name } has min length ${ length }`,
        maxLength: (name: string, length: number, partial: boolean = false) => `Property ${ name } has max length ${ length }`,
        email: (value: string, partial: boolean = false) => `Email ${ value } is invalid`,
        isNum: (value: string, length: number) => `Params must type number`
    };
    
    private static handleFunction: {[key: string]: Function} = {
        required: (key: string, value: any, length: number, partial: boolean = false) => {
            return (typeof value != 'number' && value) || (typeof value == "number" && value >= 0) ? null : RequestValidate.message.required(key, partial)
        },
        minLength: (key: string, value: any, minLength: number, partial: boolean = false) => value != '' && value.length >= minLength ? null : RequestValidate.message.minLength(key, minLength, partial),
        maxLength: (key: string, value:any, length: number, partial: boolean = false) => value != '' && value.length <= length ? null : RequestValidate.message.minLength(key, length, partial),
        email: (key: string, value: string, length: number, partial: boolean = false) => value != '' && RequestValidate.validateEmail(value) ? null : RequestValidate.message.email(value, partial),
        isNum: (key: string, value: string, length: number, partial: boolean = false) => !isNaN(+value) ? null : RequestValidate.message.isNum(value, length)
    };

    private static validateEmail(email: string): boolean {
        var reGex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reGex.test(email);
    }
}
