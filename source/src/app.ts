import 'reflect-metadata';
require('dotenv').config();
import express from 'express';
import { Request, Response, Application } from 'express';
import {
    initLuscaConfigMiddleware,
    initBodyParser,
    initCompressionConfigMiddleware
} from './configs/middlewares';
import ApiProviders from './providers/api.provider';
import { IRouteDefinition } from './models/decorators/route.definition';
import { DiContainer } from './di'
import { Container } from "./di/container";
import { DiConstant } from "./utils/constants/di.constant";
import { IncomingForm } from 'formidable';
import { RequestHandler } from './models/request/request.model';
import cors from 'cors';

const mediaParser: Array<string> = [
    '/api/v1/media/upload/image/'
];

export default class App {
    private readonly port: number;
    private readonly app: Application;
    private container: Container;

    constructor(port: number) {
        this.port = port;
        this.app = express();
    }

    public bootstrapApplication(): void {
        try {
            this.initConfigures();
            this.initMiddlewares();
            this.startContainer();
            this.startProviders();
            this.startServer();
            
        } catch(error) {
            throw new Error(error);
        }
    }

    private startContainer(): void {
        this.container = DiContainer.getInstance();
    }

    private startServer(): void {
        this.app.listen(this.port, () => {
            console.log("App start at port " + this.port);
        });
    }

    private initConfigures(): void {

    }

    private startProviders(): void {
        const apiPrefix: string = process.env.API_PREFIX || '/api/v1';
        const apiProviders = new ApiProviders();
        [
            ...apiProviders.providers
        ].map((controller: any) => {
            type instanceType = ReturnType<typeof controller>;
            const paramsConstructors: Array<any> = Reflect.getMetadata('design:paramtypes', controller);
            let instanceDependencies: Array<any> = [];
            if (paramsConstructors) {
                instanceDependencies = paramsConstructors.map((param: any) => {
                    return this.container.resolve(param.name);
                });
            }
            const instance: InstanceType<instanceType> = new controller(...instanceDependencies);
            const prefix: any = Reflect.getMetadata('prefix', controller);
            const routes: IRouteDefinition[] = Reflect.getMetadata('routes', controller);
            routes.forEach((route: IRouteDefinition) => {
                let middlewares: Array<any> = [];
                if (route && route.middleware && route.middleware.length > 0) {
                    middlewares = route.middleware.map((middleware: any) => {
                        const instanceMiddleware: ReturnType<typeof middleware> = this.container.resolve(middleware.name);
                        return instanceMiddleware.handle();
                    });
                }
                console.log(`Method ${ route.requestMethod } - ${ apiPrefix + prefix + route.path }`);
                this.app[route.requestMethod](apiPrefix + prefix + route.path, [...middlewares], (request: Request, response: Response) => {
                    (instance as any)[route.methodName](request, response);
                })
            });
        });
    }

    private initMiddlewares(): void {
        const corsOptions = {
            origin: '*',
            "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
            "preflightContinue": false,
            "optionsSuccessStatus": 204
        };
        this.app.use(cors(corsOptions));
        process.setMaxListeners(0);
        initLuscaConfigMiddleware(this.app);
        initBodyParser(this.app);
        initCompressionConfigMiddleware(this.app);
        this.app.use(function (error: Error, request: Request, response: Response, next: Function) {
            return response.status(500).json({ message: error.message, code: 500, success: false });
        });
        this.app.use((request: RequestHandler, response: Response, next) => {
            if (mediaParser.includes(request.path)) {
                const form = new IncomingForm();
                form.multiples = true;
                response.setHeader('Content-Type', 'application/json');
                form.parse(request, function(err, fields: any, files) {
                    request.files = files as any;
                    request.folderId = fields.folderId;
                    next();
                });
            } else {
                next();
            }
        });
    }
}
