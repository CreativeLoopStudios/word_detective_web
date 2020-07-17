import React, { useState, useCallback } from 'react';

function withCountdown(BaseComponent) {
    return function WithCountdown({ ...props }) {
        const [countdown, setCountdown] = useState(0);

        const doCountdown = useCallback((counter, callback) => {
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
            }, splitSecond);
        }, []);

        return <BaseComponent doCountdown={doCountdown} countdown={countdown} {...props} />;
    }
};

export default withCountdown;