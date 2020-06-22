import {Container} from "../di/container";
import {DiContainer} from "../di";
import {DiConstant} from "../utils/constants/di.constant";

const container: Container = DiContainer.getInstance();

export const Middleware = (): ClassDecorator => {
    return (target) => {
        const params: Array<any> = Reflect.getMetadata('design:paramtypes', target);
        injectMiddleware(params, target, DiConstant.MI);
    }
};

const injectMiddleware = (params: Array<any>, target: any, typeTarget: string) => {
    const instance: any = container.resolve(target.name, typeTarget);
    if (!!instance) {
        return instance;
    }

    if(params && params.length > 0) {
        const listDependencies = params.map((param: any) => {
            const listParams: Array<any> = Reflect.getMetadata('design:paramtypes', param);
            return injectMiddleware(listParams, param, DiConstant.DE);
        });
        bindToContainer(target.name, new target(...listDependencies), DiConstant.DE);
    } else {
        bindToContainer(target.name, new target(), typeTarget);
    }

    return container.resolve(target.name, typeTarget);
};

const bindToContainer = (className: string, target: any, type: string): void => {
    container.injectDependency(className, target, type);
};