export default function prefix(name) {
  try {
    if (window) {
      if (typeof window[name] !== 'undefined') {
        return window[name];
      } else {
        const prefixed = `webkit${ name }`;

        return window[prefixed];
      }
    }
  } catch (err) {}
}
