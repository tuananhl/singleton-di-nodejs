import { Application } from 'express';
import lusca from 'lusca';
import session from 'express-session';

const luscaOptions: Partial<lusca.LuscaOptions> = {
    csrf: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
    xssProtection: true,
    nosniff: true,
    referrerPolicy: 'same-origin'
};

export const initLuscaConfigMiddleware  = (app: Application): void => {
    app.use(session({
        secret: '12321312321321321312',
        resave: true,
        saveUninitialized: true
    }));
    app.use(lusca(luscaOptions));
};
