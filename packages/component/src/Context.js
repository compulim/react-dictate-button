import React from 'react';

const Context = React.createContext({
  abortable: undefined,
  recognition: null
})

const withRecognition = Component => props =>
  <Context.Consumer>
    { ({ recognition }) =>
      <Component recognition={ recognition } { ...props }>
        { props.children }
      </Component>
    }
  </Context.Consumer>

export default Context

export {
  withRecognition
}
