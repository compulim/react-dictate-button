import React, { useCallback, useState } from 'react';
import DictateButton, { DictateCheckbox } from 'react-dictate-button';

import DictationTextbox from './DictationTextbox';

const App = () => {
  const [customValue, setCustomValue] = useState();
  const [interim, setInterim] = useState();
  const [result, setResult] = useState();

  const handleCustomChange = useCallback(({ value }) => setCustomValue(value), [setCustomValue]);

  const handleDictate = useCallback(
    event => {
      const { result } = event;
      const { confidence, transcript } = result || {};

      setInterim(undefined);
      setResult({ confidence, transcript });
    },
    [setInterim, setResult]
  );

  const handleError = useCallback(
    () => {
      setInterim(undefined);
      setResult(undefined);
    },
    [setInterim, setResult]
  );

  const handleProgress = useCallback(
    event => {
      setInterim(event.results);
      setResult(undefined);
    },
    [setInterim, setResult]
  );

  const handleRawEvent = useCallback(event => console.log(`Raw event: ${event.type}`, event), []);

  return (
    <div>
      <h1>&lt;DictateButton&gt;</h1>
      <div>
        <DictateButton
          className="my-dictate-button"
          grammar="#JSGF V1.0; grammar districts; public <district> = Tuen Mun | Yuen Long;"
          lang="en-US"
          onDictate={handleDictate}
          onError={handleError}
          onProgress={handleProgress}
          onRawEvent={handleRawEvent}
        >
          {({ readyState }) =>
            readyState === 0 ? 'Start dictation' : readyState === 1 ? 'Starting...' : 'Stop dictation'
          }
        </DictateButton>
      </div>
      <h1>&lt;DictateCheckbox&gt;</h1>
      <div>
        <DictateCheckbox
          className="my-dictate-button"
          lang="en-US"
          onDictate={handleDictate}
          onError={handleError}
          onProgress={handleProgress}
          onRawEvent={handleRawEvent}
        >
          {({ readyState }) =>
            readyState === 0 ? 'Start dictation' : readyState === 1 ? 'Starting...' : 'Stop dictation'
          }
        </DictateCheckbox>
      </div>
      <h1>Result</h1>
      {result ? (
        <p>{result.transcript}</p>
      ) : interim ? (
        <p>
          {interim.map(({ confidence, transcript }, index) => (
            <span key={index} style={{ opacity: confidence ? Math.ceil(confidence * 2) / 2 : 0.5 }}>
              {transcript}
            </span>
          ))}
        </p>
      ) : (
        false
      )}
      <h1>Custom textbox</h1>
      <DictationTextbox
        grammar="#JSGF V1.0; grammar districts; public <district> = Tuen Mun | Yuen Long;"
        lang="en-US"
        onChange={handleCustomChange}
        value={customValue}
      />
    </div>
  );
};

export default App;
