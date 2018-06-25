# react-dictate-button

[![npm version](https://badge.fury.io/js/react-dictate-button.svg)](https://badge.fury.io/js/react-dictate-button) [![Build Status](https://travis-ci.org/compulim/react-dictate-button.svg?branch=master)](https://travis-ci.org/compulim/react-dictate-button)

A button to start dictation using [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API).

This project scaffolding is from [react-component-template](https://github.com/compulim/react-component-template).

# Demo

Try out this component at [github.io/compulim/react-dictate-button](https://github.io/compulim/react-dictate-button/).

# Background

Reasons why we need to build our own component, instead of using [existing packages](https://www.npmjs.com/search?q=react%20speech) on NPM:

* Some browsers required speech recognition to be kicked off by a user event (button click)
* Bring your own Web Speech API
   * Enable speech recognition on unsupported browsers by bridging it with WebRTC and cloud-based service
* Support grammar list (speech priming)

## Naming

We name it "dictate button" instead of "web speech button" or "speech recognition button" because:

* Hide the complexity of Web Speech events because we only want to focus on dictation experience
   * Differences between `onstart`, `onaudiostart`, `onsoundstart`, `onspeechstart`
* "Web Speech" could means speech synthesis, which is out of scope for this package
* "Speech Recognition" could means we will expose what Web Speech API has

# How to use

```jsx
<DictateButton
  className="my-dictate-button"
  grammars="#JSGF V1.0; grammar districts; public <district> = Tuen Mun | Yuen Long;"
  onChange={ this.handleChange }
  onProgress={ this.handleProgress }
  speechRecognition={ SpeechRecognition || webkitSpeechRecognition }
>
  Click here to start dictation
</DictateButton>
```

# Contributions

Like us? [Star](https://github.com/compulim/react-dictate-button/stargazers) us.

Want to make it better? [File](https://github.com/compulim/react-dictate-button/issues) us an issue.

Don't like something you see? [Submit](https://github.com/compulim/react-dictate-button/pulls) a pull request.
