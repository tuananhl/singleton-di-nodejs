import {Injectable} from "../decorators/injectable.decorator";
import {ClientOpts, createClient, RedisClient} from 'redis';

@Injectable()
export class RedisClientFacade {
    public redisClient: RedisClient;
    private clientOptions: ClientOpts = {
        host: 'redis',
        port: 6379
    };
	
    constructor() {
        this.createRedisClient();
    }

    public getKey(key: string): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            this.redisClient.get(key, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }

                return resolve(result);
            });
        });
    }

    public setKey(key: string, data: any): Promise<any> {
        return new Promise<any>((resolve: any, reject: any) => {
            this.redisClient.set(key, data, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            });
        });
    }

    private createRedisClient(): void {
        this.redisClient = createClient(this.clientOptions);
    }
}
