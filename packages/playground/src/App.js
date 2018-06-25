import { css } from 'glamor';
import classNames from 'classnames';
import React from 'react';

import DictateButton from 'component';

const INCONFIDENT_CSS = css({
  opacity: .5
});

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleEnd = this.handleEnd.bind(this);
    this.handleProgress = this.handleProgress.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.handleStart = this.handleStart.bind(this);

    this.state = {};
  }

  handleEnd() {
    this.setState(() => ({ phase: null }));
  }

  handleError(event) {
    console.error(event);
  }

  handleProgress(segments) {
    this.setState(() => ({
      phase: 'listening',
      segments,
      text: null
    }));
  }

  handleResult({ confidence, text }) {
    this.setState(() => ({ segments: [], text }));
  }

  handleStart() {
    this.setState(() => ({ phase: 'starting' }));
  }

  render() {
    const { state } = this;

    return (
      <div>
        <DictateButton
          className="my-dictate-button"
          grammar="#JSGF V1.0; grammar districts; public <district> = Tuen Mun | Yuen Long;"
          lang="en-US"
          onEnd={ this.handleEnd }
          onError={ this.handleError }
          onProgress={ this.handleProgress }
          onResult={ this.handleResult }
          onStart={ this.handleStart }
        >
          {
            this.state.phase === 'starting' ?
              'Starting...'
            : this.state.phase === 'listening' ?
              'Stop dictation'
            :
              'Start dictation'
          }
        </DictateButton>
        {
          (state.text || state.segments) ?
            <p>
              {
                state.text
                || (
                  state.segments.length ?
                    state.segments.map(({ confidence, text }, index) =>
                      <span
                        className={ classNames({ [INCONFIDENT_CSS]: confidence < .5 }) }
                        key={ index }
                      >
                        { text }
                      </span>
                    )
                  :
                    'Listening...'
                )
              }
            </p>
          :
            <p>&lt;No dictation done yet&gt;</p>
        }
      </div>
    );
  }
}
