import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntSerializerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map(data => this.serializeBigInt(data)));
    }

    private serializeBigInt(obj: any, seen = new WeakSet()): any {
        if (typeof obj === 'bigint') {
            return obj.toString();
        }
        if (Array.isArray(obj)) {
            return obj.map(item => this.serializeBigInt(item, seen));
        }
        if (typeof obj === 'object' && obj !== null) {
            if (seen.has(obj)) {
                return;
            }
            seen.add(obj);

            const result: any = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    result[key] = this.serializeBigInt(obj[key], seen);
                }
            }
            return Object.keys(result).length !== 0 ? result : obj;
        }
        return obj;
    }
}
