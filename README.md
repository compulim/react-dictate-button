# react-dictate-button

[![npm version](https://badge.fury.io/js/react-dictate-button.svg)](https://badge.fury.io/js/react-dictate-button) [![Build Status](https://travis-ci.org/compulim/react-dictate-button.svg?branch=master)](https://travis-ci.org/compulim/react-dictate-button)

A button to start dictation using [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API).

This project scaffolding is from [react-component-template](https://github.com/compulim/react-component-template).

# Demo

Try out this component at [github.io/compulim/react-dictate-button](https://github.io/compulim/react-dictate-button/).

# Background

Reasons why we need to build our own component, instead of using [existing packages](https://www.npmjs.com/search?q=react%20speech) on NPM:

* Some browsers required speech recognition to be triggered by a user event (button click)
* Bring your own Web Speech API
   * Enable speech recognition on unsupported browsers by bridging it with WebRTC and cloud-based service
* Support grammar list thru [JSGF](https://www.w3.org/TR/jsgf/) (a.k.a. speech priming)
* Ability to interrupt dictation
* Ability to morph into elements other than `<button>`

## Naming

We name it "dictate button" instead of "web speech button" or "speech recognition button" because:

* Hide the complexity of Web Speech events because we only want to focus on dictation experience
   * Complexity in lifecycle events: `onstart`, `onaudiostart`, `onsoundstart`, `onspeechstart`
* "Web Speech" could means speech synthesis, which is out of scope for this package
* "Speech Recognition" could means we will expose Web Speech API as-is, which we want to hide details and make it straightforward for dictation scenario

# How to use

```jsx
import DictateButton from 'react-dictate-button';

export default () =>
  <DictateButton
    className="my-dictate-button"
    grammar="#JSGF V1.0; grammar districts; public <district> = Tuen Mun | Yuen Long;"
    onDictate={ this.handleDictate }
    onProgress={ this.handleProgress }
  >
    Start/stop
  </DictateButton>
```

## Props

| Name | Type | Default | Description |
| - | - | - | - |
| `className` | `string` | | Class name to apply to the button |
| `disabled` | `boolean` | `false` | `true` to disable the dictation button and abort active recognition, otherwise, `false` |
| `grammar` | `string` | | Grammar list in [JSGF format](https://developer.mozilla.org/en-US/docs/Web/API/SpeechGrammarList/addFromString) |
| `lang` | `string` | | Language to recognize, for example, `'en-us'` |
| `onDictate` | `function` | | Event callback to fire when dictation is completed, as `({ confidence: number, transcript: number }) => {}` |
| `onError` | `function` | | Event callback to fire when error has occurred or recognition is aborted, as `(event: SpeechRecognitionEvent) => {}` |
| `onProgress` | `function` | | Event callback to fire for interim results, as `([{ confidence: number, transcript: number }]) => {}` |
| `onRawResult` | `function` | | Event callback to fire for handling raw events from `SpeechRecognition.onresult`, as `(event: SpeechRecognitionEvent) => {}` |
| `speechGrammarList` | `any` | Browser implementation | Bring your own `SpeechGrammarList` |
| `speechRecognition` | `any` | Browser implementation | Bring your own `SpeechRecognition` |

> Changing `grammar` and `lang` will not effect until the dictation is restarted. You can use `disabled` and `onError({ type === 'aborted' })` to restart a dictation.

## Function as a child

Instead of passing child elements, you can pass a `function (readyState)` to render different content based on ready state. This is called [function as a child](https://reactjs.org/docs/render-props.html#using-props-other-than-render).

| Ready state | Description |
| - | - |
| `0` | Not started |
| `1` | Starting recognition engine, dictation is not ready |
| `2` | Recognizing |

For example,

```jsx
<DictateButton>
  {
    readyState =>
      readyState === 0 ? 'Start dictation' :
      readyState === 1 ? 'Starting...' :
      'Stop dictation'
  }
</DictateButton>
```

# Road map

Currently, other than maintenance, there is no planned road map. Please feel free to [file](https://github.com/compulim/react-dictate-button/issues) suggestions.

# Contributions

Like us? [Star](https://github.com/compulim/react-dictate-button/stargazers) us.

Want to make it better? [File](https://github.com/compulim/react-dictate-button/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/react-dictate-button/pulls) a pull request.
