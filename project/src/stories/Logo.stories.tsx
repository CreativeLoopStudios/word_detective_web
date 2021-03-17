import React from 'react';

import { Story } from '@storybook/react';

import { Props as LogoProps } from '../components/Logo';
import { Logo } from '../components';

export default {
  title: 'WD/Logo',
  component: Logo
};

const Template: Story<LogoProps> = (args) => <Logo {...args} />

export const Round = Template.bind({});
