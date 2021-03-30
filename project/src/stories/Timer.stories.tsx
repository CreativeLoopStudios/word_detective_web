import React from 'react';

import { Story } from '@storybook/react';
import { Timer } from '../components';
import { Props } from '../components/Timer'

export default {
  title: 'WD/Timer',
  component: Timer,
  parameters: {
    default: "dark",
    values: [{ name: "dark", value: "#333333" }],
  },
  argTypes: {
    color: { control: 'color' }
  }
};

const Template: Story<Props> = (args) => (
    <Timer {...args} />
)

export const Default = Template.bind({});
Default.args = {
  value: 14,
  max: 15
}
Default.parameters = {
    backgrounds: { default: 'dark' }
}