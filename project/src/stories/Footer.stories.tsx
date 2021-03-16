import React from 'react';

import { Story } from '@storybook/react';

import { Props as FooterProps } from '../components/Footer';
import { Footer } from '../components';

export default {
  title: 'WD/Footer',
  component: Footer,
  argTypes: {
    onClickFacebook: { action: 'onClickFacebook' },
    onClickInstagram: { action: 'onClickInstagram' },
    onClickYoutube: { action: 'onClickYoutube' },
    onClickTwitter: { action: 'onClickTwitter' },
    onClickLogo: { action: 'onClickLogo' }
  }
};

const Template: Story<FooterProps> = (args) => <Footer {...args} />

export const Dark = Template.bind({});
Dark.parameters = {
  backgrounds: { default: 'dark' }
};