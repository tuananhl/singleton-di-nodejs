import { Injectable } from './../decorators/injectable.decorator';
import { Connector } from './../configs/db/connector.db';
import { PoolConnection } from 'mysql2/promise';
import { BaseRepository } from './base.repository';
import { RepositoryInterface } from '../interfaces/repository.interface';

@Injectable()
export class MediaRepository extends BaseRepository implements RepositoryInterface {
    fillable: Array<string> = ['path', 'file_name', 'driver'];

	constructor(private dbConnector: Connector) {
        super();
    }

	async createMediaRow(data: Array<any>, driver: number = 3, connection?: PoolConnection): Promise<any> {
        if (!connection) connection = await this.dbConnector.getConnection();
		try {
            await connection.beginTransaction();
            let sql: string = `INSERT INTO process_images (process_key, path, file_name, driver, version, signature, resource_type, folder_id) VALUES `;
            data.map((item: any, index: number) => {
                sql += `(?)`;
                if (index !== data.length - 1) {
                    sql += ','
                }
            });
			const result: any = await connection.query(
				sql,
				data
            );
            await connection.commit();
            return await this.mapAndReturnListMediaByIds(result[0].insertId, result[0].affectedRows, connection);
		} catch (e) {
            await connection.rollback();
            throw new Error(e);
		} finally {
			connection.release();
		}
    }

    private async mapAndReturnListMediaByIds(id: number, range: number, connection?: PoolConnection) {
        let listIds: number[] = [];
        for (let i = id; i < (id + range); i++) {
            listIds.push(i);
        }
        if (listIds && listIds.length > 0) {
            const result: any = await this.getListMediaByIds(listIds, connection);
            return result.map((item: any) => {
                return {
                    id: item.id_process_image,
                    process_key: item.process_key,
                    path: `${ process.env.CLOUD_IMAGE_PATH }/${ item.path }/v${ item.version }/${ item.file_name }`,
                    resource_type: item.resource_type
                }
            })
        }
        return [];
    }

    async getListMediaByIds(listIds: number[], connection?: PoolConnection): Promise<any> {
        if (!connection) connection = await this.dbConnector.getConnection();
        try {
            let query_string = ``;
            const params_sql: Array<number> = [];
            listIds.map((item: number, index: number) => {
                query_string += `?`;
                if (index !== listIds.length - 1) {
                    query_string += ` , `;
                }
                params_sql.push(item);
            });
			const sql = await connection.format(
				`SELECT * FROM process_images WHERE id_process_image IN (${query_string});`,
				params_sql
            );
            const result: any = await connection.query(sql);
            return result[0];
		} catch (e) {
            throw new Error(e);
		} finally {
			connection.release();
		}
    }

    public async getListMediaByParent(parentId: number, offset: number, limit: number, connection?: PoolConnection): Promise<any> {
        try {
            if (!connection) connection = await this.dbConnector.getConnection();
            let sql: string = `
                SELECT
                    id_process_image,
                    process_key, path,
                    file_name, driver,
                    folder_id,
                    resource_type,
                    version
                FROM process_images
                WHERE is_archive IS FALSE AND folder_id = ?  
                ORDER BY id_process_image DESC 
                LIMIT ?,?`;
            return connection.query(sql, [parentId, offset, limit]);
        } catch (error) {
            throw new Error(error.message);
        } finally {
            if (connection) connection.release();
        }
    }
}
