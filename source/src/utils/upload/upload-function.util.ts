import { v2, ConfigOptions, UploadApiOptions } from 'cloudinary';
import * as Q from 'q';

const configs: ConfigOptions = {
    cloud_name: process.env.CLOUD_NAME || null,
    api_key: process.env.CLOUD_API_KEY || null,
    api_secret: process.env.CLOUD_API_SECRET || null
};

v2.config(configs);
const uploader = v2.uploader;
// @ts-ignore
export const upload = async function (file: string, options: UploadApiOptions = {}) {
    return await uploader.upload(file, { ...options, async: false }).then((data: any) => {
        return data;
    });
};