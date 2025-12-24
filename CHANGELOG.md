# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

Breaking changes are indicated by 💥.

## [Unreleased]

### Changed

- Bumped dependencies, in PR [#93](https://github.com/compulim/react-dictate-button/pull/93)
  - Production dependencies
    - [`@babel/runtime-corejs3@7.28.4`](https://npmjs.com/package/@babel/runtime-corejs3/v/7.28.4)
  - Development dependencies
    - [`@babel/runtime-corejs3@7.28.4`](https://npmjs.com/package/@babel/runtime-corejs3/v/7.28.4)
    - [`@typescript-eslint/eslint-plugin@8.50.1`](https://npmjs.com/package/@typescript-eslint/eslint-plugin/v/8.50.1)
    - [`@typescript-eslint/parser@8.50.1`](https://npmjs.com/package/@typescript-eslint/parser/v/8.50.1)
    - [`core-js@3.47.0`](https://npmjs.com/package/core-js/v/3.47.0)
    - [`eslint@9.39.2`](https://npmjs.com/package/eslint/v/9.39.2)
    - [`eslint-import-resolver-typescript@4.4.4`](https://npmjs.com/package/eslint-import-resolver-typescript/v/4.4.4)
    - [`eslint-plugin-import@2.32.0`](https://npmjs.com/package/eslint-plugin-import/v/2.32.0)
    - [`eslint-plugin-prettier@5.5.4`](https://npmjs.com/package/eslint-plugin-prettier/v/5.5.4)
    - [`eslint-plugin-react@7.37.5`](https://npmjs.com/package/eslint-plugin-react/v/7.37.5)
    - [`event-target-properties@0.1.1`](https://npmjs.com/package/event-target-properties/v/0.1.1)
    - [`prettier@3.7.4`](https://npmjs.com/package/prettier/v/3.7.4)

## [4.0.0] - 2025-02-13

### Added

- Works with Web Speech API provider without `resultIndex` in `SpeechRecognitionResultEvent`, by [@compulim](https://github.com/compulim), in PR [#86](https://github.com/compulim/react-dictate-button/pull/86)

### Changed

- Reduced React version requirement from 16.9.0 to 16.8.6, by [@compulim](https://github.com/compulim), in PR [#83](https://github.com/compulim/react-dictate-button/pull/83)
- 💥 Stopping an unabortable recognition (`SpeechRecognition.abort()` is undefined) will warn instead of throw, by [@compulim](https://github.com/compulim), in PR [#88](https://github.com/compulim/react-dictate-button/pull/88)

### Fixed

- Fixed `dictate` event should dispatch before `end` event, by [@compulim](https://github.com/compulim), in PR [#87](https://github.com/compulim/react-dictate-button/pull/87)
- Fixed [#84](https://github.com/compulim/react-dictate-button/issues/84). Logics should relies on `SpeechRecognition.continuous` property than `continuous` props, by [@compulim](https://github.com/compulim), in PR [#87](https://github.com/compulim/react-dictate-button/pull/87)
- Fixed `end` event should only be dispatched after `SpeechRecognition.error` event, instead of always emit on stop/unmount, by [@compulim](https://github.com/compulim), in PR [#88](https://github.com/compulim/react-dictate-button/pull/88)

## [3.0.0] - 2025-01-31

### Added

- Added continuous mode support, by [@RushikeshGavali](https://github.com/RushikeshGavali) and [@compulim](https://github.com/compulim), in PR [#73](https://github.com/compulim/react-dictate-button/pull/73) and PR [#78](https://github.com/compulim/react-dictate-button/pull/78)
   - In continuous mode, `dictate` and `progress` events will only report the latest round of recognition
   - After `end`, the push button and checkbox will not be turned off automatically
   - When stopping the recognition, it will emit an `error` event of error `aborted`, this is the behavior same as in non-continuous mode
   - If the underlying Web Speech API implementation does not support continuous mode, it should work as if in interactive mode
- Added `start` and `end` events, by [@compulim](https://github.com/compulim), in PR [#78](https://github.com/compulim/react-dictate-button/pull/78)

### Changed

- Modernized project scaffold, by [@compulim](https://github.com/compulim), in PR [#74](https://github.com/compulim/react-dictate-button/pull/74)
   - Ported all code to TypeScript
   - Monorepo management changed to [npm workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces) from [lerna](https://lerna.js.org/)
   - Bundler changed to [esbuild](https://esbuild.github.io/)/[tsup](https://github.com/egoist/tsup) from [Babel](https://babeljs.io/)
   - Test environment changed to [Happy DOM](https://github.com/capricorn86/happy-dom) from [JSDOM](https://github.com/jsdom/jsdom)
   - Added ES Modules in additional to CommonJS
   - Removed [`husky`](https://www.npmjs.com/package/husky) and [`lint-staged`](https://www.npmjs.com/package/lint-staged)

### Removed

- 💥 Deprecated `Context`, use `useAbortable`, `useReadyState`, and `useSupported` hooks respectively, by [@compulim](https://github.com/compulim), in PR [#74](https://github.com/compulim/react-dictate-button/pull/74)
- 💥 Deprecated default exports, use `import { DictateButton } from 'react-dictate-button'` instead, by [@compulim](https://github.com/compulim), in PR [#74](https://github.com/compulim/react-dictate-button/pull/74)
- 💥 Removed `defaultProps` and `propTypes`, by [@compulim](https://github.com/compulim), in PR [#74](https://github.com/compulim/react-dictate-button/pull/74)

## [2.0.1] - 2021-06-01

### Fixed

- Fixed [#65](https://github.com/compulim/react-dictate-button/issues/65). Setting `started` to `false` after `onDictate` callback should succeed even on an unabortable recognition, by [@compulim](https://github.com/compulim), in PR [#66](https://github.com/compulim/react-dictate-button/pull/66)

## [2.0.0] - 2021-05-16

### Added

- Added `module` field for exporting in ES Modules, by [@compulim](https://github.com/compulim) in PR [#58](https://github.com/compulim/react-dictate-button/pull/58)
- Added [`eslint`](https://npmjs.com/package/eslint), [`husky`](https://npmjs.com/package/husky), and [`lint-staged`](https://npmjs.com/package/lint-staged) for code hygiene, by [@compulim](https://github.com/compulim) in PR [#58](https://github.com/compulim/react-dictate-button/pull/58)
- Added and exported hooks: `useAbortable`, `useReadyState`, and `useSupported`, by [@compulim](https://github.com/compulim) in PR [#58](https://github.com/compulim/react-dictate-button/pull/58)

### Changed

- 💥 Requires [`react@>=16.8.0`](https://npmjs.com/package/react) and [`core-js@3`](https://npmjs.com/package/core-js`)
- 💥 Modifying props while recognition has started will no longer abort recognition immediately, props will be updated in next recognition
- 💥 `SpeechGrammarList` is only constructed when `grammar` props is present
- 💥 If `speechRecognition` prop is not present, capability detection is now done through `window.mediaDevices.getUserMedia`
- Bumped all dependencies and removed unneeded dependencies, by [@compulim](https://github.com/compulim) in PR [#58](https://github.com/compulim/react-dictate-button/pull/58)
  - [`@babel/cli@7.13.16`](https://npmjs.com/package/@babel/cli)
  - [`@babel/core@7.14.2`](https://npmjs.com/package/@babel/core)
  - [`@babel/preset-env@7.14.2`](https://npmjs.com/package/@babel/preset-env)
  - [`@babel/preset-react@7.13.13`](https://npmjs.com/package/@babel/preset-react)
  - [`lerna@4.0.0`](https://npmjs.com/package/lerna)
  - [`react@16.8.0`](https://npmjs.com/package/react)

### Fixed

- Fixed [#39](https://github.com/compulim/react-dictate-button/issues/39), added `type="button"` attribute to `<DictateButton>`, by [@compulim](https://github.com/compulim) in PR [#58](https://github.com/compulim/react-dictate-button/pull/58)

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

### Added

- Added `onClick` prop, can use `preventDefault` to stop speech recognition from starting

### Fixed

- Fixed `Composer.speechRecognition`/`speechGrammarList` should not be required

## [1.1.1] - 2018-06-29

### Fixed

- Fixed `extra` prop not passed to `<Composer>`

## [1.1.0] - 2018-06-29

### Added

- Added `extra` prop to copy to `SpeechRecognition`

### Changed

- Bumped to [`memoize-one@4.0.0`](https://npmjs.com/package/memoize-one/v/4.0.0)

## [1.0.0] - 2018-06-26

### Added

- Initial release

[Unreleased]: https://github.com/compulim/react-dictate-button/compare/v4.0.0...HEAD
[4.0.0]: https://github.com/compulim/react-dictate-button/compare/v3.0.0...v4.0.0
[3.0.0]: https://github.com/compulim/react-dictate-button/compare/v2.0.1...v3.0.0
[2.0.1]: https://github.com/compulim/react-dictate-button/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/compulim/react-dictate-button/compare/v1.2.2...v2.0.0
[1.2.2]: https://github.com/compulim/react-dictate-button/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/compulim/react-dictate-button/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/compulim/react-dictate-button/compare/v1.1.3...v1.2.0
[1.1.3]: https://github.com/compulim/react-dictate-button/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/compulim/react-dictate-button/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/compulim/react-dictate-button/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/compulim/react-dictate-button/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/compulim/react-dictate-button/releases/tag/v1.0.0
