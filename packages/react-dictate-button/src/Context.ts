import { createContext } from 'react';

type DictateContextType = Readonly<{
  abortable: boolean;
  readyState: number;
  supported: boolean;
}>;

const Context = createContext<DictateContextType>(
  Object.freeze({
    abortable: false,
    readyState: 0,
    supported: true
  })
);

export default Context;
export { type DictateContextType };
