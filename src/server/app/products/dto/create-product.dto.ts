export class CreateProductDto {
  name: string;
  alias: string;
  price: number;
  salePrice?: number;
  duration: number;
  image?: string;
  hashPower: number;
  dailyIncome: BigInt;
  monthlyIncome: BigInt;
  status: number;
}
