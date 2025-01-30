import React, { useCallback, useState, type FormEventHandler } from 'react';
import { DictateButton, DictateCheckbox, type DictateEventHandler, type ProgressEventHandler } from 'react-dictate-button';

import DictationTextBox from './DictationTextBox.tsx';

type Result = Readonly<{
  confidence?: number | undefined;
  transcript?: string | undefined;
}>;

const App = () => {
  const [continuous, setContinuous] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string | undefined>();
  const [interim, setInterim] = useState<readonly Result[] | undefined>();
  const [result, setResult] = useState<Result | undefined>();

  const handleContinuousChange = useCallback<FormEventHandler<HTMLInputElement>>(
    event => setContinuous(event.currentTarget.checked),
    [setContinuous]
  );

  const handleCustomChange = useCallback<(event: { value: string | undefined }) => void>(
    ({ value }) => setCustomValue(value),
    [setCustomValue]
  );

  const handleDictate = useCallback<DictateEventHandler>(
    event => {
      const { result } = event;
      const { confidence, transcript } = result || {};

      setInterim(undefined);
      setResult({ confidence, transcript });
    },
    [setInterim, setResult]
  );

  const handleError = useCallback(() => {
    // TODO: Should not throw abort.
    setInterim(undefined);
    setResult(undefined);
  }, [setInterim, setResult]);

  const handleProgress = useCallback<ProgressEventHandler>(
    event => {
      setInterim(event.results);
      setResult(undefined);
    },
    [setInterim, setResult]
  );

  const handleRawEvent = useCallback<(event: Event) => void>(
    event => console.log(`Raw event: ${event.type}`, event),
    []
  );

  return (
    <div>
      <h1>
        <code>react-dictate-button</code>
      </h1>
      <label>
        <input checked={continuous} onChange={handleContinuousChange} type="checkbox" />
        &nbsp;Continuous mode
      </label>
      <h2>&lt;DictateButton&gt;</h2>
      <div>
        <DictateButton
          className="my-dictate-button"
          continuous={continuous}
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
      <h2>&lt;DictateCheckbox&gt;</h2>
      <div>
        <DictateCheckbox
          className="my-dictate-button"
          continuous={continuous}
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
      <h2>Result</h2>
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
      <h2>Custom text box</h2>
      <DictationTextBox
        grammar="#JSGF V1.0; grammar districts; public <district> = Tuen Mun | Yuen Long;"
        lang="en-US"
        onChange={handleCustomChange}
        value={customValue}
      />
    </div>
  );
};

export default App;
