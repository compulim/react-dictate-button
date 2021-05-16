import useDictateContext from './internal/useDictateContext';

export default function useSupported() {
  const { supported } = useDictateContext();

  return [supported];
}
