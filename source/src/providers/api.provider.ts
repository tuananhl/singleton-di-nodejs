export default class ApiProvider {
    private provider_array: any = [];

    constructor() { }

    public get providers(): any {
        return this.provider_array;
    }
}