import { type TypedEventHandler } from './TypedEventHandler.ts';

export type StartEventHandler = TypedEventHandler<{
  type: 'start';
}>;
