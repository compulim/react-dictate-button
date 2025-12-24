declare global {
  const IS_DEVELOPMENT: boolean;
}

export default function assert(truthy: boolean) {
  if (typeof IS_DEVELOPMENT !== 'undefined' && IS_DEVELOPMENT && !truthy) {
    throw new Error('Assertion failed.');
  }
}
