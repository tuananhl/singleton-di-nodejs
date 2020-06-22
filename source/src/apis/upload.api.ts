import {Controller} from '../decorators/controller.decorator';
import {Post} from '../decorators/http-method.decorator';
import {Response} from 'express';
import {FileHelper} from '../helpers/file.helper';
import {UploadCloudinaryService} from '../services/upload-cloudinary.service';
import {MediaRepository} from '../repositories/media.repository';
import {raiseException, responseServer} from '../utils/exceptions/raise.exception';
import {RequestHandler} from '../models/request/request.model';
import {AdminAuthenticationMiddleware} from '../middlewares/admin.authenticate.middleware';

@Controller('/media')
export class MediaController {
	constructor(
		private fileHelper: FileHelper,
		private uploadCloudService: UploadCloudinaryService,
		private mediaRepository: MediaRepository,
	) { }

	@Post('/upload/image', [AdminAuthenticationMiddleware])
	public async uploadImage(request: RequestHandler, response: Response) {
		try {
			const files: any = this.fileHelper.getFilesInRequest(request);
			const result: Array<string> = await this.uploadImageToCloudinary(files);
			const dataToSave: Array<any> = result.map((item: any) => {
				return [
					item.public_id,'image/upload',
					`${ item.public_id }.${ item.format }`,
					3,
					item.version,
					item.signature,
					item.resource_type,
					request.folderId
				];
			});
			const data = await this.mediaRepository.createMediaRow(dataToSave);
			return responseServer(request, response, 201, 'Upload successfully', data);
		} catch (e) {
			return raiseException(request, response, 500, e.message);
		}
	}

	private async uploadImageToCloudinary(files: { [key: string]: Array<File> }): Promise<Array<string>> {
        try {
			return await this.uploadCloudService.uploadToCloudinary(files.file);
        } catch (e) {
        	throw new Error("Error when upload to cloud " + e);
        }
	}
}
