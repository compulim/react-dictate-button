import React from 'react';

import DictateButton, { DictateCheckbox } from 'component';
import DictationTextbox from './DictationTextbox';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleCustomChange = this.handleCustomChange.bind(this);
    this.handleDictate = this.handleDictate.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleRawEvent = this.handleRawEvent.bind(this);

    this.state = {
      customValue: null,
      interim: null,
      result: null
    };
  }

  handleCustomChange({ value: customValue }) {
    this.setState(() => ({ customValue }));
  }

  handleDictate({ confidence, transcript } = {}) {
    this.setState(() => ({
      interimResults: null,
      result: { confidence, transcript }
    }));
  }

  handleError(event) {
    console.error(event);
    // alert(event.error);

    this.setState(() => ({
      interimResults: null,
      result: null
    }));
  }

  handleProgress(interimResults) {
    this.setState(() => ({
      interimResults,
      result: null
    }));
  }

  handleRawEvent(event) {
    console.log(event.type);
  }

  render() {
    const { state } = this;

    return (
      <div>
        <h1>&lt;DictateButton&gt;</h1>
        <div>
          <DictateButton
            className="my-dictate-button"
            grammar="#JSGF V1.0; grammar districts; public <district> = Tuen Mun | Yuen Long;"
            lang="en-US"
            onDictate={ this.handleDictate }
            onError={ this.handleError }
            onProgress={ this.handleProgress }
            onRawEvent={ this.handleRawEvent }
          >
            { readyState =>
                readyState === 0 ? 'Start dictation' :
                readyState === 1 ? 'Starting...' :
                'Stop dictation'
            }
          </DictateButton>
        </div>
        <h1>&lt;DictateCheckbox&gt;</h1>
        <div>
          <DictateCheckbox
            className="my-dictate-button"
            grammar="#JSGF V1.0; grammar districts; public <district> = Tuen Mun | Yuen Long;"
            lang="en-US"
            onDictate={ this.handleDictate }
            onError={ this.handleError }
            onProgress={ this.handleProgress }
            onRawEvent={ this.handleRawEvent }
          >
            { readyState =>
                readyState === 0 ? 'Start dictation' :
                readyState === 1 ? 'Starting...' :
                'Stop dictation'
            }
          </DictateCheckbox>
        </div>
        <h1>Result</h1>
        {
          state.result ?
            <p>{ state.result.transcript }</p>
          : state.interimResults ?
            <p>
              {
                state.interimResults.map(({ confidence, transcript }, index) =>
                  <span
                    key={ index }
                    style={{ opacity: Math.ceil(confidence * 2) / 2 }}
                  >
                    { transcript }
                  </span>
                )
              }
            </p>
          : false
        }
        <h1>Custom textbox</h1>
        <DictationTextbox
          onChange={ this.handleCustomChange }
          value={ state.customValue }
        />
      </div>
    );
  }
}
