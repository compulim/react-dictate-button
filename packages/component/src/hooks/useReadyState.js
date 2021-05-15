import useDictateContext from './internal/useDictateContext';

export default function useReadyState() {
  const { readyState } = useDictateContext();

  return [readyState];
}
