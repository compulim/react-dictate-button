# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.2] - 2020-02-27

### Fixed
- Fix [#12](https://github.com/compulim/react-dictate-button/issues/12): Workaround [Angular/zone.js bug](https://github.com/angular/angular/issues/31750) by not using Symbol.iterator for iterable objects, by [@compulim](https://github.com/compulim) in PR [#13](https://github.com/compulim/react-dictate-button/pull/13)

## [1.2.1] - 2019-12-04

### Fixed
- Fix: `Composer.onProgress` should set `abortable` on the first event (based on `SpeechRecognition.audioStart` event), by [@compulim](https://github.com/compulim) in PR [#5](https://github.com/compulim/react-dictate-button/pull/5)

## [1.2.0] - 2019-12-03

### Added
- Support unabortable speech recognition, by [@compulim](https://github.com/compulim) in PR [#4](https://github.com/compulim/react-dictate-button/pull/4).

### Changed
- Bump to [`event-as-promise@1.0.5`](https://npmjs.com/package/event-as-promise/v/1.0.5)
- Move `lerna bootstrap` from hoisted to local

## [1.1.3] - 2018-07-19

### Fixed
- Fix: move [`memoize-one`](https://npmjs.com/package/memoize-one) to production dependencies

## [1.1.2] - 2018-06-29

### Fixed
- Fix: `Composer.speechRecognition`/`speechGrammarList` should not be required

### Added
- Add: `onClick` prop, can use `preventDefault` to stop speech recognition from starting

## [1.1.1] - 2018-06-29

### Fixed
- fix: `extra` prop not passed to `<Composer>`

## [1.1.0] - 2018-06-29

### Added
- Added `extra` prop to copy to `SpeechRecognition`

### Changes
- Bump to [`memoize-one@4.0.0`](https://npmjs.com/package/memoize-one/v/4.0.0)

## [1.0.0] - 2018-06-26

### Added
- Initial release
