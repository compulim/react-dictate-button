import { type TypedEventHandler } from './TypedEventHandler.ts';

export type DictateEventHandler = TypedEventHandler<{
  result?: { confidence: number; transcript: string } | undefined;
  type: 'dictate';
}>;
