import useDictateContext from './internal/useDictateContext';

export default function useAbortable() {
  const { abortable } = useDictateContext();

  return [abortable];
}
