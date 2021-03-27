import React from 'react';

import { Story } from '@storybook/react';

import { Props as MainContainerProps } from '../components/MainContainer';
import { MainContainer, Button, Logo } from '../components';

export default {
  title: 'WD/MainContainer',
  component: MainContainer
};

const Template: Story<MainContainerProps> = (args) => <MainContainer {...args} />

export const Empty = Template.bind({});

export const WithLogo = Template.bind({});
WithLogo.args = { children : [ 
  <Logo/>
] };

export const WithSidebar = Template.bind({});
WithSidebar.args = {
  sidebar: (
    <Button kind="primary" variant="contained" label="Botão" />
  ),
  children : [ 
    <Button kind="primary" variant="contained" label="Botão" />
  ]
};
