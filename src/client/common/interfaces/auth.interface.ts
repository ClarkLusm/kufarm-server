export interface IAuth {
  [x: string]: any;
  accessToken: string;
  refreshToken?: string;
}
