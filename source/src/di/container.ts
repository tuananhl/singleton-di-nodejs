import {DiConstant} from "../utils/constants/di.constant";

export class Container {
    private dependencies: any = {};

    public resolve<T>(classInjection: string, type: string = DiConstant.DE): any {
        if (!this.dependencies[type]) {
            this.dependencies[type] = {};
        }
        return this.dependencies[type][classInjection] || undefined;
    }

    public injectDependency(className: string, instanceInjection: any, type: string): void {
        if (!this.dependencies[type]) {
            this.dependencies[type] = {};
        }
        this.dependencies[type][className] = instanceInjection;
    }

    public createContainer(): void {
        this.dependencies = [];
    }
}