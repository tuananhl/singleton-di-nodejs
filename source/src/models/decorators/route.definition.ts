export type RequestMethod =     'get'
                            |   'post' 
                            |   'put'
                            |   'options'
                            |   'patch'
                            |   'delete';

export interface IRouteDefinition {
    path: string,
    requestMethod: RequestMethod,
    methodName: string | symbol,
    middleware: Array<any>
}
