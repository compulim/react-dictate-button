# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Breaking changes

- Requires [`react@>=16.8.0`](https://npmjs.com/package/react)
- Modifying props while recognition started will no longer abort recognition, props will be updated in next recognition
- `SpeechGrammarList` is only constructed when `grammar` props present
- Capability detection is now done through `window.mediaDevices.getUserMedia`, if `speechRecognition` prop is not present

### Fixed

- Fixed [#39](https://github.com/compulim/react-dictate-button/issues/39), added `type="button"` attribute to `<DictateButton>`, by [@compulim](https://github.com/compulim) in PR [#58](https://github.com/compulim/react-dictate-button/pull/58)

### Changed

- Bumped all dependencies and reducing dependencies, by [@compulim](https://github.com/compulim) in PR [#58](https://github.com/compulim/react-dictate-button/pull/58)
  - [`@babel/cli@7.13.16`](https://npmjs.com/package/@babel/cli)
  - [`@babel/core@7.14.2`](https://npmjs.com/package/@babel/core)
  - [`@babel/preset-env@7.14.2`](https://npmjs.com/package/@babel/preset-env)
  - [`@babel/preset-react@7.13.13`](https://npmjs.com/package/@babel/preset-react)
  - [`lerna@4.0.0`](https://npmjs.com/package/lerna)
  - [`react@16.8.0`](https://npmjs.com/package/react)

## [1.2.2] - 2020-02-27

### Fixed

- Fixed [#12](https://github.com/compulim/react-dictate-button/issues/12), workaround [Angular/zone.js bug](https://github.com/angular/angular/issues/31750) by not using Symbol.iterator for iterable objects, by [@compulim](https://github.com/compulim) in PR [#13](https://github.com/compulim/react-dictate-button/pull/13)

## [1.2.1] - 2019-12-04

### Fixed

- `Composer.onProgress` should set `abortable` on the first event (based on `SpeechRecognition.audioStart` event), by [@compulim](https://github.com/compulim) in PR [#5](https://github.com/compulim/react-dictate-button/pull/5)

## [1.2.0] - 2019-12-03

### Added

- Support unabortable speech recognition, by [@compulim](https://github.com/compulim) in PR [#4](https://github.com/compulim/react-dictate-button/pull/4).

### Changed

- Bumped to [`event-as-promise@1.0.5`](https://npmjs.com/package/event-as-promise/v/1.0.5)
- Moved `lerna bootstrap` from hoisted to local

## [1.1.3] - 2018-07-19

### Fixed

- Moved [`memoize-one`](https://npmjs.com/package/memoize-one) to production dependencies

## [1.1.2] - 2018-06-29

### Fixed

- Fixed `Composer.speechRecognition`/`speechGrammarList` should not be required

### Added

- Added `onClick` prop, can use `preventDefault` to stop speech recognition from starting

## [1.1.1] - 2018-06-29

### Fixed

- Fixed `extra` prop not passed to `<Composer>`

## [1.1.0] - 2018-06-29

### Added

- Added `extra` prop to copy to `SpeechRecognition`

### Changes

- Bumped to [`memoize-one@4.0.0`](https://npmjs.com/package/memoize-one/v/4.0.0)

## [1.0.0] - 2018-06-26

### Added

- Initial release
