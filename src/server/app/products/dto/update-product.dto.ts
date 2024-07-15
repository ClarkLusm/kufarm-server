export class UpdateProductDto {
  name?: string;
  price?: number;
  salePrice?: number;
  maxOut?: number;
  image?: string;
  hashPower?: number;
  dailyIncome?: BigInt;
  monthlyIncome?: BigInt;
  published?: boolean;
}
