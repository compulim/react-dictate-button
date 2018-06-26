# react-dictate-button

[![npm version](https://badge.fury.io/js/react-dictate-button.svg)](https://badge.fury.io/js/react-dictate-button) [![Build Status](https://travis-ci.org/compulim/react-dictate-button.svg?branch=master)](https://travis-ci.org/compulim/react-dictate-button)

A button to start dictation using [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API), with an easy to understand event lifecycle.

This project scaffolding is from [react-component-template](https://github.com/compulim/react-component-template).

# Demo

Try out this component at [github.io/compulim/react-dictate-button](https://github.io/compulim/react-dictate-button/).

# Background

Reasons why we need to build our own component, instead of using [existing packages](https://www.npmjs.com/search?q=react%20speech) on NPM:

* Some browsers required speech recognition (or WebRTC) to be triggered by a user event (button click)
* Bring your own Web Speech API
   * Enable speech recognition on unsupported browsers by bridging it with WebRTC and cloud-based service
* Support grammar list thru [JSGF](https://www.w3.org/TR/jsgf/) (a.k.a. speech priming)
* Ability to interrupt dictation
* Ability to morph into elements other than `<button>`

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
| `speechGrammarList` | `any` | Browser implementation | Bring your own `SpeechGrammarList` |
| `speechRecognition` | `any` | Browser implementation | Bring your own `SpeechRecognition` |

> `grammar` and `lang` will not effect until next dictation.

## Events

| Name | Signature | Description |
| - | - | - |
| `onDictate` | `({ confidence: number, transcript: number }) => {}` | Event callback to fire when dictation has been completed |
| `onError` | `(event: SpeechRecognitionEvent) => {}` | Event callback to fire when error has occurred or recognition is aborted, [see below](#event-lifecycle) |
| `onProgress` | `([{ confidence: number, transcript: number }]) => {}` | Event callback to fire for interim results, the array contains every segments of speech |
| `onRawResult` | `(event: SpeechRecognitionEvent) => {}` | Event callback to fire for handling raw events from `SpeechRecognition.onresult` |

### Event lifecycle

One of the most important design is to make sure events are easy to understand and deterministic. Thumb of rule is to make sure `onProgress` will lead to either `onDictate` or `onError`. Here are some samples of event firing sequence (tested on Chrome 67):

* Happy path: speech is recognized
   * `onProgress([])`
   * `onProgress([...])`
   * `onDictate(...)`
* Heard some sound, but nothing can be recognized
   * `onProgress([])`
   * `onDictate()`
* Nothing is heard (audio is muted)
   * `onProgress([])`
   * `onError({ error: 'no-speech' })`
* Recognition aborted
   * `onProgress([])`
   * `onProgress([...])`
   * While speech is getting recognized, `props.disabled` is set to `false`
   * `onError({ error: 'aborted' })`
* Not authorized to use speech or no audio device is available
   * `onError({ error: 'not-allowed' })`

## Function as a child

Instead of passing child elements, you can pass a function to render different content based on ready state. This is called [function as a child](https://reactjs.org/docs/render-props.html#using-props-other-than-render).

| Ready state | Description |
| - | - |
| `0` | Not started |
| `1` | Starting recognition engine, dictation is not ready |
| `2` | Recognizing |
| `3` | Stopping |

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

# Customization thru morphing

Morphing can be done thru [React.Context](https://reactjs.org/docs/context.html). In short, you can build your own component, without worrying the [code behind the scene](packages/component/src/Composer.js). For details, please refer to [`DictateButton.js`](packages/component/src/DictateButton.js) and [`DictateCheckbox.js`](packages/component/src/DictateCheckbox.js).

In addition to `<button>`, we also ship `<input type="checkbox">` out of the box. You can use the following code for the checkbox version.

```jsx
import { DictateCheckbox } from 'react-dictate-button';

export default () =>
  <DictateCheckbox
    className="my-dictate-checkbox"
    grammar="#JSGF V1.0; grammar districts; public <district> = Redmond | Bellevue;"
    onDictate={ this.handleDictate }
    onProgress={ this.handleProgress }
  >
    Start/stop
  </DictateCheckbox>
```

# Design considersations

## Naming

We name it "dictate button" instead of "web speech button" or "speech recognition button" because:

* Hide the complexity of Web Speech events because we only want to focus on dictation experience
   * Complexity in lifecycle events: `onstart`, `onaudiostart`, `onsoundstart`, `onspeechstart`
   * `onresult` may not fire in some cases, `onnomatch` is not fired in Chrome
   * To reduce complexity, we want to make sure event firing are either:
      * Happy path: `onProgress`, then either `onDictate` or `onError`
      * Otherwise: `onError`
* "Web Speech" could means speech synthesis, which is out of scope for this package
* "Speech Recognition" could means we will expose Web Speech API as-is, which we want to hide details and make it straightforward for dictation scenario

# Road map

Please feel free to [file](https://github.com/compulim/react-dictate-button/issues) suggestions.

* While `readyState` is 1 or 3 (transitioning), the underlying speech engine cannot be started/stopped until the state transition is complete
   * Need rework on the state management

# Contributions

Like us? [Star](https://github.com/compulim/react-dictate-button/stargazers) us.

Want to make it better? [File](https://github.com/compulim/react-dictate-button/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/react-dictate-button/pulls) a pull request.
