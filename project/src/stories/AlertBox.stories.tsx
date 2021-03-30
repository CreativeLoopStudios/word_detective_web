import React from 'react';

import { Story } from '@storybook/react';

import { Props as MainContainerProps } from '../components/MainContainer';
import { Props as AlertBoxProps } from '../components/AlertBox';
import { AlertBox, MainContainer } from '../components';

export default {
  title: 'WD/AlertBox',
  component: AlertBox
};

const Template: Story<AlertBoxProps> = (args) => <AlertBox {...args} />

export const Default = Template.bind({});
Default.args = {
  label: 'Quando você escolher a palarva, o jogo começará automaticamente. Desejamos um boa diversão!'
};

const TemplateMainContainer: Story<MainContainerProps> = (args) => <MainContainer {...args} />

export const WithMainContainer = TemplateMainContainer.bind({});
WithMainContainer.args = {
  sidebar: (<></>),
  children: [
    <AlertBox label="Quando você escolher a palarva, o jogo começará automaticamente. Desejamos um boa diversão!" />
  ]
};