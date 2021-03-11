import React from 'react';
import { MainContainer } from '../components/MainContainer.tsx';
import { Button } from '../components/Button';

export default {
  title: 'WD/MainContainer',
  component: MainContainer
};

const Template = (args) => <MainContainer {...args} />

export const Empty = Template.bind({});

export const WithButton = Template.bind({});
WithButton.args = { children : [ 
  <Button kind="primary" variant="contained" label="Botão" />,
] };
