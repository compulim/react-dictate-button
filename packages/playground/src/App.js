import React from 'react';

import DictateButton from 'component';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleProgress = this.handleProgress.bind(this);

    this.state = {};
  }

  handleChange(text) {
    this.setState(() => ({ text }));
  }

  handleProgress() {
  }

  render() {
    return (
      <div>
        <DictateButton
          className="my-dictate-button"
          grammar="#JSGF V1.0; grammar districts; public <district> = Tuen Mun | Yuen Long;"
          onChange={ this.handleChange }
          onProgress={ this.handleProgress }
        >
          Click here to start dictation
        </DictateButton>
        {
          this.state.text ?
            <p>
              { this.state.text }
            </p>
          :
            <p>&lt;No dictation done yet&gt;</p>
        }
      </div>
    );
  }
}
