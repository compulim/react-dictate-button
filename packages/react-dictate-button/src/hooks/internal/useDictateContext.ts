import { useContext } from 'react';

import Context, { type DictateContextType } from '../../Context.ts';

export default function useDictateContext(): DictateContextType {
  return useContext(Context);
}
