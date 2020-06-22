import {Injectable} from "../decorators/injectable.decorator";
import { RequestHandler } from '../models/request/request.model';

@Injectable()
export class FileHelper {
    public getFilesInRequest(request: RequestHandler): Array<{ [key: string]: Array<File> }> {
        let listFiles: any = {};
        const filesInRequest: any = request.files;
        if (filesInRequest) {
            Object.keys(filesInRequest).map((key: string) => {
                const files = filesInRequest[key].path ? [filesInRequest[key]] : filesInRequest[key];
                listFiles[key] = files;
            });
        }

        return listFiles;
    }
}