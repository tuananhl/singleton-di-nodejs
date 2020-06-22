import { Request } from 'express';

export interface RequestHandler extends Request {
    files: { [key: string]: Array<File> }[],
    user: {
        id: number;
        name: string;
        email: string;
    },
    folderId?: number;
}