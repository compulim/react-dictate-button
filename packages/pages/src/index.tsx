import './index.css';
import React from 'react';
// This is needed for testing React 16 and 17.
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';

import App from './App.tsx';

const rootElement = document.getElementById('root');

// rootElement && createRoot(rootElement).render(<App />);

render(<App />, rootElement);
