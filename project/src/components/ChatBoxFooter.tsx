import React from 'react';

import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({}));

export type Props = {
    children: React.ReactNode;
}

function ChatBoxFooter({ children }: Props) {
    const classes = useStyles();
    
    return (
        <Grid item xs={12}>
            {children}
        </Grid>
    );
}

ChatBoxFooter.propTypes = {};

ChatBoxFooter.defaultProps = {};

export default ChatBoxFooter;