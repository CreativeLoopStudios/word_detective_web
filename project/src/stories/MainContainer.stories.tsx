import React from 'react';

import { Story } from '@storybook/react';

import { Props as MainContainerProps } from '../components/MainContainer';
import { MainContainer, Button } from '../components';

export default {
  title: 'WD/MainContainer',
  component: MainContainer
};

const Template: Story<MainContainerProps> = (args) => <MainContainer {...args} />

export const Empty = Template.bind({});

export const WithButton = Template.bind({});
WithButton.args = { children : [ 
  <Button kind="primary" variant="contained" label="Botão" />
] };
