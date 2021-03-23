import React from 'react';

import { Story } from '@storybook/react';

import { Props as LabelProps } from '../components/Label';
import { Label } from '../components';

import '../fonts/gothic.css';

export default {
  title: 'WD/Label',
  component: Label,
  argTypes: {
    color: { control: 'color' },
    bold: { control: 'boolean' },
    kind: {
      control: { type: 'select', options: ['primary', 'secondary'] }
    },
    size: {
      control: { type: 'select', options: ['subtitle1', 'body1', 'body2', 'h1', 'h2', 'h3'] }
    }
  }, 
};

const Template:Story<LabelProps> = (args) => <Label {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  kind: 'primary',
  children: [
    'Primary text'
  ]
};

export const Secondary = Template.bind({});
Secondary.args = {
  kind: 'secondary',
  children: [
    'Secondary text'
  ]
};
Secondary.parameters = {
  backgrounds: { default: 'dark' }
};

export const Bold = Template.bind({});
Bold.args = {
  kind: 'primary',
  bold: true,
  children: [
    'Bold text'
  ]
};