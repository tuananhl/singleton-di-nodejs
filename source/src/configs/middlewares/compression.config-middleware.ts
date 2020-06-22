import { Application } from 'express';
import compression from 'compression';

export const initCompressionConfigMiddleware = (app: Application) => {
    app.use(compression());
};
