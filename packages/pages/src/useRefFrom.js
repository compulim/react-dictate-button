import { useRef } from 'react';

export default function useRefFrom(value) {
  const ref = useRef();

  ref.current = value;

  return ref;
}
