// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function vendorPrefix<T = any>(name: string): T | undefined {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return name in window && typeof (window as Record<string, any>)[name] !== 'undefined'
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as Record<string, any>)[name]
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as Record<string, any>)[`webkit${name}`];
  }

  return;
}
