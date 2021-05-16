import { createContext } from 'react';

const Context = createContext({
  abortable: false,
  readyState: 0,
  supported: true
});

export default Context;
