import type { TypedEventHandler } from './TypedEventHandler.ts';

export type ProgressEventHandler = TypedEventHandler<{
  abortable: boolean;
  results?: readonly { confidence: number; transcript: string }[] | undefined;
  type: 'progress';
}>;
