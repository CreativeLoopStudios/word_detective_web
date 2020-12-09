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
    
            // transform to int
            const splitSecond = counter % 1;
            counter = (counter - splitSecond) | 0;
    
            const h = setInterval(async () => {
                setCountdown(counter);
                if (counter === 0) {
                    clearInterval(h);
                    if (callback) {
                        await callback();
                    }
                } else {
                    counter -= 1;
                }
            }, 1000);
            currentCountdownRef.current = h;
        }, []);

        return <BaseComponent doCountdown={doCountdown} countdown={countdown} {...props} />;
    }
};

export default withCountdown;