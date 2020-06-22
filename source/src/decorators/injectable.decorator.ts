import { DiContainer } from '../di';
import { Container } from "../di/container";
import {DiConstant} from "../utils/constants/di.constant";

const container: Container = DiContainer.getInstance();

export const Injectable = (config?: { providerIn: 'root' }): ClassDecorator => {
    return (target) => {
        const params: Array<any> = Reflect.getMetadata('design:paramtypes', target);
        injectParams(params, target);
    }
};

const injectParams = (params: Array<any>, target: any): any => {
    const instance: any = container.resolve<typeof target>(target.name);
    if (!!instance) {
        return instance;
    }
    if(params && params.length > 0) {
        const listDependencies = params.map((param: any) => {
            const listParams: Array<any> = Reflect.getMetadata('design:paramtypes', param);
            return injectParams(listParams, param);
        });
        bindToContainer(target.name, new target(...listDependencies));
    } else {
        bindToContainer(target.name, new target());
    }

    return container.resolve(target.name);
};

const bindToContainer = (className: string, target: any): void => {
    container.injectDependency(className, target, DiConstant.DE);
};