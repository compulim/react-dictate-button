import useDictateContext from './internal/useDictateContext.ts';

export default function useReadyState(): readonly [number] {
  const { readyState } = useDictateContext();

  return Object.freeze([readyState]);
}
