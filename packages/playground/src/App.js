import React from 'react';

import DictateButton from 'component';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleAbortClick = this.handleAbortClick.bind(this);
    this.handleDictate = this.handleDictate.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleRawEvent = this.handleRawEvent.bind(this);

    this.state = {
      aborted: false,
      interim: null,
      result: null
    };
  }

  handleAbortClick() {
    this.setState(() => ({
      aborted: true
    }));
  }

  handleDictate({ confidence, transcript }) {
    this.setState(() => ({
      interimResults: null,
      result: { confidence, transcript }
    }));
  }

  handleError(event) {
    this.setState(() => ({
      aborted: false,
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
        <DictateButton
          className="my-dictate-button"
          disabled={ state.aborted }
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
        <button onClick={ this.handleAbortClick }>Abort</button>
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
      </div>
    );
  }
}
