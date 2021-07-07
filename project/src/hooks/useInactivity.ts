import { useCallback, useEffect, useRef, useState } from 'react';

type JSTimeout = {
  handler: NodeJS.Timeout | null;
}

type Props = {
  timeout: number;
}

export default function useInactivity({ timeout }: Props) {
  const timeoutHandlerRef = useRef<JSTimeout>({ handler: null });
  const [inactive, setInactive] = useState(false);

  const stop = useCallback(() => {
      if (timeoutHandlerRef.current.handler) {
          clearTimeout(timeoutHandlerRef.current.handler);
          setInactive(false);
      }
  }, [setInactive]);

  useEffect(() => {
    stop();
    timeoutHandlerRef.current.handler = setTimeout(() => {
      setInactive(true);
    }, timeout);
  }, [setInactive, timeout]);

  return { stop, inactive };
}