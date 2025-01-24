import useDictateContext from './internal/useDictateContext';

export default function useSupported(): readonly [boolean] {
  const { supported } = useDictateContext();

  return Object.freeze([supported]);
}
