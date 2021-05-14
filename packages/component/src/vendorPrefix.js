export default function vendorPrefix(name) {
  if (typeof window !== 'undefined') {
    return typeof window[name] !== 'undefined' ? window[name] : window[`webkit${name}`];
  }
}
