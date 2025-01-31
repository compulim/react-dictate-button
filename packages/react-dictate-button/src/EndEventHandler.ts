import { type TypedEventHandler } from './TypedEventHandler.ts';

export type EndEventHandler = TypedEventHandler<{
  type: 'end';
}>;
