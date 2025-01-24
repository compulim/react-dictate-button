export default function vendorPrefix<T = any>(name: string): T | undefined {
  if (typeof window !== 'undefined') {
    return name in window && typeof (window as Record<string, any>)[name] !== 'undefined'
      ? (window as Record<string, any>)[name]
      : (window as Record<string, any>)[`webkit${name}`];
  }

  return;
}
