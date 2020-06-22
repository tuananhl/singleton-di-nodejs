import { Injectable } from './../../decorators/injectable.decorator';
import { createPool, Pool, PoolOptions, PoolConnection } from 'mysql2/promise';

@Injectable()
export class Connector {
	private connection: Pool;
	private poolConfig: PoolOptions = {
        host            : 'mysql',
        database		: 'shop160_db',
		user			: 'root',
		password		: 'root',
        port            :  3306,
		connectionLimit	: 10
	};

	constructor() {
		this.initPollConnection();
	}

	private initPollConnection(): void {
        console.log("Init database");
        this.connection = this.createConnection();
	}

	private createConnection(): Pool {
		return createPool(this.poolConfig);
	}

	public async getConnection(): Promise<PoolConnection> {
        return this.connection.getConnection();
    }
}