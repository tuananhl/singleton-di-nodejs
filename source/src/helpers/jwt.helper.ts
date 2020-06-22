import { Injectable } from "../decorators/injectable.decorator";
import { sign, SignOptions } from 'jsonwebtoken';


var iG  = 'Shop 160';
var sMail  = 'tuananhit.oct@gmail.com';
var aDress  = 'http://tuananh.info';

var signOptions: SignOptions = {
    issuer:  iG,
    subject:  sMail,
    audience:  aDress,
    expiresIn:  '12h',
    algorithm:  'HS512'
};

@Injectable()
export class JWTMHelper {
    createToken(id: number): any {
        if (process.env.JWT_SECRET_KEY) {
            return sign(
                {
                    id: id,
                },
                process.env.JWT_SECRET_KEY,
                signOptions
            );
        }
        
        throw new Error("JWT Secret Key is not generate?");
    }
}