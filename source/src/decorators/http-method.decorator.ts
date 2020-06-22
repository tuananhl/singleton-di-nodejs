import { IRouteDefinition, RequestMethod } from "../models/decorators/route.definition";

export const Get = (path: string, middleware: Array<any> = []): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol) => {
        checkMetaData(target, path, middleware, 'get', propertyKey, []);
    }
};

export const Post = (path: string, middleware: Array<any> = []): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol) => {
        checkMetaData(target, path, middleware, 'post', propertyKey, []);
    }
};

export const Put = (path: string, middleware: Array<any> = []): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol) => {
        checkMetaData(target, path, middleware, 'put', propertyKey, []);
    }
};

export const Patch = (path: string, middleware: Array<any> = []): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol) => {
        checkMetaData(target, path, middleware, 'patch', propertyKey, []);
    }
};

export const Delete = (path: string, middleware: Array<any> = []): MethodDecorator => {
    return (target: Object, propertyKey: string | symbol) => {
        checkMetaData(target, path, middleware, 'delete', propertyKey, []);
    }
};

const checkMetaData = (
                        target: Object,
                        path: string,
                        middleware: Array<any>,
                        method: RequestMethod,
                        propertyKey: string | symbol,
                        defaultValue: IRouteDefinition[]
                    ): void => 
{
    if(!Reflect.hasMetadata('routes', target.constructor)) {
        Reflect.defineMetadata('routes', defaultValue, target.constructor);
    }
    const routes: IRouteDefinition[] = Reflect
                                        .getMetadata(
                                            'routes',
                                            target.constructor
                                        );
    routes.push({
        path,
        requestMethod: method,
        methodName: propertyKey,
        middleware: middleware
    });
    Reflect.defineMetadata('routes', routes, target.constructor);
};
