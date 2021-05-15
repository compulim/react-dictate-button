# react-dictate-button

[![npm version](https://badge.fury.io/js/react-dictate-button.svg)](https://badge.fury.io/js/react-dictate-button) [![Build Status](https://travis-ci.org/compulim/react-dictate-button.svg?branch=master)](https://travis-ci.org/compulim/react-dictate-button)

A button to start dictation using [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API), with an easy to understand event lifecycle.

# Breaking changes

## [2.0.0] - 2021-05-15

- Requires [`react@>=16.8.0`](https://npmjs.com/package/react)
- Modifying props while recognition started will no longer abort recognition, props will be updated in next recognition
- `SpeechGrammarList` is only constructed when `grammar` props present

# Demo

Try out this component at [github.io/compulim/react-dictate-button](https://github.io/compulim/react-dictate-button/).

# Background

Reasons why we need to build our own component, instead of using [existing packages](https://www.npmjs.com/search?q=react%20speech) on NPM:

- Some browsers required speech recognition (or WebRTC) to be triggered by a user event (button click)
  - We want to enforce this rule to reduce compatibility issues
- Bring your own Web Speech API
  - Enable speech recognition on unsupported browsers by bridging it with WebRTC and cloud-based service
- Support grammar list thru [JSGF](https://www.w3.org/TR/jsgf/) (a.k.a. speech priming)
- Ability to interrupt dictation
- Ability to [morph into other elements](#customization-thru-morphing)

# How to use

First, install our production version by `npm install react-dictate-button`. Or our development version by `npm install react-dictate-button@master`.

```jsx
import DictateButton from 'react-dictate-button';

export default () => (
  <DictateButton
    className="my-dictate-button"
    grammar="#JSGF V1.0; grammar districts; public <district> = Tuen Mun | Yuen Long;"
    lang="en-US"
    onDictate={this.handleDictate}
    onProgress={this.handleProgress}
  >
    Start/stop
  </DictateButton>
);
```

## Props

| Name                | Type                     | Default                                         | Description                                                                                                                                                                                                                                                       |
| ------------------- | ------------------------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `className`         | `string`                 | `undefined`                                     | Class name to apply to the button                                                                                                                                                                                                                                 |
| `disabled`          | `boolean`                | `false`                                         | `true` to interrupt and disable dictation, otherwise, `false`                                                                                                                                                                                                     |
| `extra`             | `{ [key: string]: any }` | `{}`                                            | Additional properties to set to [`SpeechRecognition`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) before `start`, useful when bringing your own [`SpeechRecognition`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition) |
| `grammar`           | `string`                 | `undefined`                                     | Grammar list in [JSGF format](https://developer.mozilla.org/en-US/docs/Web/API/SpeechGrammarList/addFromString)                                                                                                                                                   |
| `lang`              | `string`                 | `undefined`                                     | Language to recognize, for example, `'en-US'` or [`navigator.language`](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language)                                                                                                              |
| `speechGrammarList` | `any`                    | `window.SpeechGrammarList` (or vendor-prefixed) | Bring your own [`SpeechGrammarList`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechGrammarList)                                                                                                                                                          |
| `speechRecognition` | `any`                    | `window.SpeechRecognition` (or vendor-prefixed) | Bring your own [`SpeechRecognition`](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)                                                                                                                                                          |

> Note: change of `grammar` and `lang` will not take effect until next dictation.

## Events

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Signature</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>onClick</code></th>
      <td><pre>(event: <a href="https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent">MouseEvent</a>) => void</pre></td>
      <td>Emit when the user click on the button, <code>preventDefault</code> will stop recognition from starting</td>
    </tr>
    <tr>
      <th><code>onDictate</code></th>
      <td>
        <pre>({
  result: {
    confidence: number,
    transcript: number
  },
  type: 'dictate'
}) => void</pre>
      </td>
      <td>Emit when dictation is completed</td>
    </tr>
    <tr>
      <th><code>onError</code></th>
      <td><pre>(event: <a href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionErrorEvent">SpeechRecognitionErrorEvent</a>) => void</pre></td>
      <td>Emit when error has occurred or dictation is interrupted, <a href="#event-lifecycle">see below</a></td>
    </tr>
    <tr>
      <th><code>onProgress</code></th>
      <td>
        <pre>({
  abortable: boolean,
  results: [{
    confidence: number,
    transcript: number
  }],
  type: 'progress'
}) => void</pre>
      </td>
      <td>Emit for interim results, the array contains every segments of recognized text</td>
    </tr>
    <tr>
      <th><code>onRawEvent</code></th>
      <td><pre>(event: <a href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionEvent">SpeechRecognitionEvent</a>) => void</pre></td>
      <td>
        Emit for handling raw events from
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionEvent"
          ><code>SpeechRecognition</code></a
        >
      </td>
    </tr>
  </tbody>
</table>

## Hooks

> Although previous versions exported a React Context, it is recommended to use the hooks interface.

| Name            | Signature   | Description                                                                             |
| --------------- | ----------- | --------------------------------------------------------------------------------------- |
| `useAbortable`  | `[boolean]` | If ongoing speech recognition can be aborted, `true`, otherwise, `false`                |
| `useReadyState` | `[number]`  | Returns the current state of recognition, refer to [this section](#function-as-a-child) |
| `useSupported`  | `[boolean]` | If speech recognition is supported, `true`, otherwise, `false`                          |

### Checks if speech recognition is supported

To determines whether speech recognition is supported in the browser:

- If `speechRecognition` prop is `undefined`
  - If both [`window.navigator.mediaDevices`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices) and [`window.navigator.mediaDevices.getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) are falsy, it is not supported
    - Probably the browser is not on a secure HTTP connection
  - If both `window.SpeechRecognition` and vendor-prefixed are falsy, it is not supported
  - If recognition failed once with `not-allowed` error code, it is not supported
- Otherwise, it is supported

> Even the browser is on an insecure HTTP connection, `window.SpeechRecognition` (or vendor-prefixed) will continue to be truthy. Instead, `mediaDevices.getUserMedia` is used for capability detection.

### Event lifecycle

One of the design aspect is to make sure events are easy to understand and deterministic. First rule of thumb is to make sure `onProgress` will lead to either `onDictate` or `onError`. Here are some samples of event firing sequence (tested on Chrome 67):

- Happy path: speech is recognized
  1.  `onProgress({})` (just started, therefore, no `results`)
  2.  `onProgress({ results: [] })`
  3.  `onDictate({ result: ... })`
- Heard some sound, but nothing can be recognized
  1.  `onProgress({})`
  2.  `onDictate({})` (nothing is recognized, therefore, no `result`)
- Nothing is heard (audio device available but muted)
  1.  `onProgress({})`
  2.  `onError({ error: 'no-speech' })`
- Recognition aborted
  1.  `onProgress({})`
  2.  `onProgress({ results: [] })`
  3.  While speech is getting recognized, set `props.disabled` to `false`, interrupting dictation
  4.  `onError({ error: 'aborted' })`
- Not authorized to use speech or no audio device is availablabortable: truee
  1.  `onError({ error: 'not-allowed' })`

## Function as a child

Instead of passing child elements, you can pass a function to render different content based on ready state. This is called [function as a child](https://reactjs.org/docs/render-props.html#using-props-other-than-render).

| Ready state | Description                                         |
| ----------- | --------------------------------------------------- |
| `0`         | Not started                                         |
| `1`         | Starting recognition engine, dictation is not ready |
| `2`         | Recognizing                                         |
| `3`         | Stopping                                            |

For example,

```jsx
<DictateButton>
  {({ readyState }) => (readyState === 0 ? 'Start dictation' : readyState === 1 ? 'Starting...' : 'Stop dictation')}
</DictateButton>
```

# Customization thru morphing

You can build your own component by copying our layout code, without messing around the [logic code behind the scene](packages/component/src/Composer.js). For details, please refer to [`DictateButton.js`](packages/component/src/DictateButton.js), [`DictateCheckbox.js`](packages/component/src/DictateCheckbox.js), and [`DictationTextbox.js`](packages/playground/src/DictationTextbox.js).

## Checkbox version

In addition to `<button>`, we also ship `<input type="checkbox">` out of the box. The checkbox version is better suited for toggle button scenario and web accessibility. You can use the following code for the checkbox version.

```jsx
import { DictateCheckbox } from 'react-dictate-button';

export default () => (
  <DictateCheckbox
    className="my-dictate-checkbox"
    grammar="#JSGF V1.0; grammar districts; public <district> = Redmond | Bellevue;"
    lang="en-US"
    onDictate={this.handleDictate}
    onProgress={this.handleProgress}
  >
    Start/stop
  </DictateCheckbox>
);
```

## Textbox with dictate button

We also provide a "textbox with dictate button" version. But instead of shipping a full-fledged control, we make it a minimally-styled control so you can start copying the code and customize it in your own project. The sample code can be found at [DictationTextbox.js](packages/playground/src/DictationTextbox.js).

# Design considerations

## Naming

We name it "dictate button" instead of "web speech button" or "speech recognition button" because:

- Hide the complexity of Web Speech events because we only want to focus on dictation experience
  - Complexity in lifecycle events: `onstart`, `onaudiostart`, `onsoundstart`, `onspeechstart`
  - `onresult` may not fire in some cases, `onnomatch` is not fired in Chrome
  - To reduce complexity, we want to make sure event firing are either:
    - Happy path: `onProgress`, then either `onDictate` or `onError`
    - Otherwise: `onError`
- "Web Speech" could means speech synthesis, which is out of scope for this package
- "Speech Recognition" could means we will expose Web Speech API as-is, which we want to hide details and make it straightforward for dictation scenario

# Roadmap

Please feel free to [file](https://github.com/compulim/react-dictate-button/issues) suggestions.

- While `readyState` is 1 or 3 (transitioning), the underlying speech engine cannot be started/stopped until the state transition is complete
  - Need rework on the state management
- Instead of putting all logic inside [`Composer.js`](packages/component/src/Composer.js), how about
  1.  Write an adapter to convert `SpeechRecognition` into another object with simpler event model and `readyState`
  2.  Rewrite `Composer.js` to bridge the new `SimpleSpeechRecognition` model and React Context
  3.  Expose `SimpleSpeechRecognition` so people not on React can still benefit from the simpler event model

# Contributions

Like us? [Star](https://github.com/compulim/react-dictate-button/stargazers) us.

Want to make it better? [File](https://github.com/compulim/react-dictate-button/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/react-dictate-button/pulls) a pull request.
