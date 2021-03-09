import React from 'react';

import { Input } from '../components/Input';
import '../fonts/gothic.css';

export default {
  title: 'WD/Input',
  component: Input
};

const Template = (args) => <Input {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  label: 'Basic',
  placeholder: 'Basic...',
  type: 'text'
};