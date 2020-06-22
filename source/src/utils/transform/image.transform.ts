export const createImagePath = (data: { file_name: string, path:string , version: string }) => {
    return data && data.file_name ?  `${ process.env.CLOUD_IMAGE_PATH }/${ data.path }/v${ data.version }/${ data.file_name }` : null;
};
