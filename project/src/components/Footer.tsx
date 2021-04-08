import React from 'react';

import { Grid, makeStyles } from "@material-ui/core";

import PropTypes from 'prop-types';

import discordIcon from '../assets/discord.png';
import facebookIcon from '../assets/facebook.png';
import instagramIcon from '../assets/instagram.png';
import youtubeIcon from '../assets/youtube.png';
import twitterIcon from '../assets/twitter.png';
import creativeLoopLogo from '../assets/creativeloop-logo.png';

const useStyles = makeStyles(() => ({
    logo: {
        height: '1rem'
    },
    icon: {
        height: '2rem'
    }
}));

export type Props = {
    onClickDiscord: () => void;
    onClickFacebook: () => void;
    onClickInstagram: () => void;
    onClickYoutube: () => void;
    onClickTwitter: () => void;
    onClickLogo: () => void;
}

function Footer({ onClickDiscord, onClickFacebook, onClickInstagram, onClickYoutube, onClickTwitter, onClickLogo }: Props) {
    const classes = useStyles();
    
    return (
        <div>
            <Grid container justify="center" spacing={1}>
                <Grid container item xs={12} justify="center" spacing={2}>
                    <Grid item>
                        <img src={discordIcon} className={classes.icon} alt="social discord" onClick={onClickDiscord} />
                    </Grid>
                    <Grid item>
                        <img src={facebookIcon} className={classes.icon} alt="rede social facebook" onClick={onClickFacebook} />
                    </Grid>
                    <Grid item>
                        <img src={instagramIcon} className={classes.icon} alt="rede social instagram" onClick={onClickInstagram} />
                    </Grid>
                    <Grid item>
                        <img src={youtubeIcon} className={classes.icon} alt="social youtube" onClick={onClickYoutube} />
                    </Grid>
                    <Grid item>
                        <img src={twitterIcon} className={classes.icon} alt="rede social twitter" onClick={onClickTwitter} />
                    </Grid>
                </Grid>

                <Grid container item xs={12} justify="center">
                    <img src={creativeLoopLogo} className={classes.logo} alt="creative loop logo" onClick={onClickLogo} />
                </Grid>
            </Grid>
        </div>
    );
}

Footer.propTypes = {
    onClickDiscord: PropTypes.func,
    onClickFacebook: PropTypes.func,
    onClickInstagram: PropTypes.func,
    onClickYoutube: PropTypes.func,
    onClickTwitter: PropTypes.func,
    onClickLogo: PropTypes.func
};
Footer.defaultProps = {
    onClickDiscord: undefined,
    onClickFacebook: undefined,
    onClickInstagram: undefined,
    onClickYoutube: undefined,
    onClickTwitter: undefined,
    onClickLogo: undefined
};

export default Footer;