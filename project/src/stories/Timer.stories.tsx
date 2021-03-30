import React from 'react';

import { Story } from '@storybook/react';
import { Timer } from '../components';
import { Props } from '../components/Timer'
import { makeStyles } from '@material-ui/core';

export default {
  title: 'WD/Timer',
  component: Timer,
  argTypes: {
    color: { control: 'color' }
  }
};

const Template: Story<Props> = (args) => (
  <div style={{backgroundColor: 'gray'}}>
    <Timer {...args} />
  </div>
)

export const Default = Template.bind({});
Default.args = {
  value: 14,
  max: 15
}