import {Injectable} from "../decorators/injectable.decorator";
import * as cloudinary from 'cloudinary';
import { upload } from '../utils/upload/upload-function.util';

@Injectable({
    providerIn: 'root'
})
export class UploadCloudinaryService {
    private cloudinaryVersion: any = cloudinary.v2;

    uploadToCloudinary(resources: Array<File>): Promise<any> {
        try {
            let arrayFileUpload: Array<any> = [];
            for (let i = 0; i < resources.length; i++) {
                let file: any = resources[i];
                const filePath: string = file.path;
                arrayFileUpload.push(upload(filePath));
            }
    
            return Promise.all(arrayFileUpload);
        } catch (error) {
            throw error.message;
        }
    }
}