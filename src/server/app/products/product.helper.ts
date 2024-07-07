import { plainToInstance, instanceToPlain } from 'class-transformer';

import { Product } from "./product.entity";

export class ProductHelper {
    static dtoToEntity<T>(data: T): Product {
        return plainToInstance(Product, {
          ...instanceToPlain(data),
          dailyIncome: BigInt(data['dailyIncome']),
          monthlyIncome: BigInt(data['monthlyIncome']),
        });
    }
}