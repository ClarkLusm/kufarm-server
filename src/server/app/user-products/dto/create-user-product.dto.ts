export class CreateUserProductDto {
  userId: string;
  productId: string;
  duration: number;
  hasPower: number;
  dailyIncome: BigInt;
  monthlyIncome: BigInt;
  status: number;
  startAt: Date;
  endAt: Date;
}
