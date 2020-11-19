import React, { useState, useCallback, useRef } from 'react';

function withCountdown(BaseComponent) {
    return function WithCountdown({ ...props }) {
        const [countdown, setCountdown] = useState(0);
        const currentCountdownRef = useRef(null);

        const doCountdown = useCallback((counter, callback) => {
            clearInterval(currentCountdownRef.current);
            if (counter <= 0) {
                return;
            }
    
            // first, wait for fractional second
            const splitSecond = counter % 1;
    
            // transform to int
            counter = (counter - splitSecond) | 0;
    
            setTimeout(() => {
                const h = setInterval(() => {
                    setCountdown(counter);
                    if (counter === 0) {
                        clearInterval(h);
                        if (callback) {
                            callback();
                        }
                    } else {
                        counter -= 1;
                    }
                }, 1000);
                currentCountdownRef.current = h;
            }, splitSecond);
        }, []);

        return <BaseComponent doCountdown={doCountdown} countdown={countdown} {...props} />;
    }
};

export default withCountdown;