import { Injectable } from "../decorators/injectable.decorator";

@Injectable()
export class BaseRepository {
    protected fillable: Array<string> = [];
    constructor() { }

    composeDataWithFillable(data: { [key: string]: any }): { [key: string]: any } {
        let result: any = {};
        this.fillable.map((key: string) => {
            if (key in data) {
                result[key] = data[key];
            }
        });
        
        return result;
    }
}