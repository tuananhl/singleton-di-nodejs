import * as bodyParser from 'body-parser';
import { Application } from 'express';

export const initBodyParser = (app: Application): void  => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
};