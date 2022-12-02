import {
  useEffect,
  useRef,
} from 'react';
import { useMediaQuery } from 'react-responsive';

export const usePrevious = <T> (value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export const useSmallScreenQuery = (): boolean => useMediaQuery({ query: '(max-width: 768px)' });
export const usePortraitQuery = (): boolean => useMediaQuery({ query: '(orientation: portrait)' });

export const usePortal = (id: string) => {
  const rootElemRef = useRef(document.createElement('div'));

  useEffect(() => {
    // Look for existing target dom element to append to
    const parentElem = document.getElementById(id);

    // Add the detached element to the parent
    parentElem?.appendChild(rootElemRef.current);

    // This function is run on unmount
    return function removeElement() {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      rootElemRef.current.remove();
    };
  }, [id]);

  return rootElemRef.current;
};
