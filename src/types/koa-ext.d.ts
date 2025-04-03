import * as Koa from 'koa';

declare module 'koa' {
  interface DefaultState {}
  interface DefaultContext {}
  
  interface Request extends Koa.BaseRequest {
    body: {
      schema: any;
      [key: string]: any;
    };
  }
} 