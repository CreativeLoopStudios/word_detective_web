import React from 'react';

import { Story } from '@storybook/react';

import { Props as ButtonProps } from '../components/Button';
import { Button } from '../components';

import '../fonts/gothic.css';

export default {
  title: 'WD/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
    hoverColor: { control: 'color' },
    variant: {
      control: { type: 'select', options: ['contained', 'outlined'] }
    }
  }, 
};

const Template:Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  kind: 'primary',
  label: 'Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  kind: 'secondary',
  label: 'Button',
};

export const Large = Template.bind({});
Large.args = {
  size: 'large',
  label: 'Button',
};

export const Small = Template.bind({});
Small.args = {
  size: 'small',
  label: 'Button',
};

export const Outlined = Template.bind({});
Outlined.args = {
  variant: 'outlined',
  label: 'Button',
};