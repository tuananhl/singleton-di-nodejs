export const Controller = (prefix: string): ClassDecorator => {
    return (target) => {
        Reflect.defineMetadata('prefix', prefix, target);
        // if controller not have any Router,, we will define its router is an empty array
        if (!Reflect.hasMetadata('routes', target)) {
            Reflect.defineMetadata('routes', [], target);
        }
    }
};
