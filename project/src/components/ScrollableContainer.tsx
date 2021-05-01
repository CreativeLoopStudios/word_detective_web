import React from 'react';

import { Box, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    container: {
        maxHeight: '100%',
        overflowY: 'auto',
        position: 'relative'
    }
}));

export type Props = {
    children: React.ReactNode;
    flex?: number;
}

function ScrollableContainer({ children, flex }: Props) {
    const classes = useStyles();
    
    return (
        <Box flex={flex} position="relative">
            <Box height="100%" position="absolute" width="100%">
                <div className={classes.container}>
                    {children}
                </div>
            </Box>
        </Box>
    );
}

ScrollableContainer.propTypes = {};
ScrollableContainer.defaultProps = {};

export default ScrollableContainer;