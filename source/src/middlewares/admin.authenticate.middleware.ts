import { Middleware } from "../decorators/middleware.decorator";
import { HttpService } from "../services/http.service";
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { UserRepository } from "../repositories/user.repository";
import { AUTH_CONSTANT } from './../constants/auth.constant';

const iG  = 'Shop 160';
const aDress  = 'http://tuananh.info';
const optionsPassportStrategy: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY,
    passReqToCallback: true,
    issuer: iG,
    audience: aDress
};

@Middleware()
export class AdminAuthenticationMiddleware {
    passport: any;
    constructor(private userRepository: UserRepository) {
        this.passport = passport;
        this.initMiddleware();
    }

    public handle() {
        return this.passport.authenticate('jwt', { session: false });
    }

    private initMiddleware(): void {
        const callback = async (parentClosure: any, payload: any, next: Function) => {
            try {
                const result: Array<any> = await this.userRepository.findUserById(payload.id || 0);
                if (result && result[0] && result[0].role_id == AUTH_CONSTANT.ADMIN_ROLE) {
                    next(null, result[0]);
                } else {
                    next(null, null);
                }
            } catch {
                next(null, false);
            }
        };
    
        const jwtStrategy: JwtStrategy = new JwtStrategy(optionsPassportStrategy, callback);
        this.passport.use(jwtStrategy);
    }
}
