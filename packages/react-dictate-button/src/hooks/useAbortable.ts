import useDictateContext from './internal/useDictateContext';

export default function useAbortable(): readonly [boolean] {
  const { abortable } = useDictateContext();

  return Object.freeze([abortable]);
}
