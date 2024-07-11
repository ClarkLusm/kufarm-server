export interface IAuth {
  [x: string]: any;
  token: string;
  refreshToken?: string;
}
