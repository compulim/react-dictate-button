import useDictateContext from './internal/useDictateContext.ts';

export default function useAbortable(): readonly [boolean] {
  const { abortable } = useDictateContext();

  return Object.freeze([abortable]);
}
