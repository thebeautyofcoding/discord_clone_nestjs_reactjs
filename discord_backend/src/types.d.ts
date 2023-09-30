declare namespace Express {
  export interface Request {
    profile?: {
      email: string;
    };
  }
}
