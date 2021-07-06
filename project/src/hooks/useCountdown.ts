import { useCallback, useRef, useState } from 'react';

type Countdown = {
    interval: NodeJS.Timeout | null;
}

let externalCounter = 0;
export default function useCountdown(timeInterval = 1000) {
    const [countdown, setCountdown] = useState(0);
    const countdownRef = useRef<Countdown>({ interval: null });

    const stop = useCallback(() => {
        if (countdownRef.current.interval) {
            clearInterval(countdownRef.current.interval);
            setCountdown(0);
        }
    }, []);

    externalCounter = countdown;
    const start = useCallback((timer: number, callback: () => void) => {
        if (timer <= 0) return;
        stop();
        setCountdown(timer);

        countdownRef.current.interval = setInterval(() => {
            if (externalCounter <= 0) {
                stop();
                if (callback) {
                    callback();
                }
            } else {
                setCountdown(prevCountdown => prevCountdown - timeInterval / 1000);
            }
        }, timeInterval);
    }, [stop, timeInterval]);

    return { countdown, start, stop };
}