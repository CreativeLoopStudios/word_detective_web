import React from 'react';

import { Story } from '@storybook/react';

import { LogoProps, Sizes } from '../components/Logo';
import { Logo } from '../components';

export default {
  title: 'WD/Logo',
  component: Logo,
  argTypes: {
    color: { control: 'color' },
    size: {
        control: { type: 'select', options: Object.keys(Sizes) }
    }
  }
};

const Template: Story<LogoProps> = (args) => <Logo {...args} />

export const Round = Template.bind({});
