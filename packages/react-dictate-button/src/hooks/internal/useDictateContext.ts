import { useContext } from 'react';

import Context, { type DictateContextType } from '../../Context';

export default function useDictateContext(): DictateContextType {
  return useContext(Context);
}
