import React from 'react';

import { Button } from '../components/Button';

export default {
  title: 'WD/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
    hoverColor: { control: 'color' },
  }, 
};

const Template = (args) => <Button {...args} />;

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
