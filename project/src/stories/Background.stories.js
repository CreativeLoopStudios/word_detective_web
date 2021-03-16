import React from 'react';

import { Background } from '../components';

import '../fonts/gothic.css';

export default {
  title: 'WD/Background',
  component: Background
};

const Template = (args) => <Background {...args} />;

export const Basic = Template.bind({});