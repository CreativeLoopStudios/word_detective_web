import React from 'react';

import { Story } from '@storybook/react';

import { Props as MainContainerProps } from '../components/MainContainer';
import { Props as QuestionsBoxProps } from '../components/QuestionsBox';
import { QuestionsBox, MainContainer } from '../components';

export default {
  title: 'WD/QuestionsBox',
  component: QuestionsBox
};

const Template: Story<QuestionsBoxProps> = (args) => <QuestionsBox {...args} />

export const Default = Template.bind({});
Default.args = {
  questions: [
    { player: "", question: 'Tem forma animal?' }
  ]
};
Default.parameters = {
  backgrounds: { default: 'dark' }
}

const TemplateMainContainer: Story<MainContainerProps> = (args) => <MainContainer {...args} />

export const WithMainContainer = TemplateMainContainer.bind({});
WithMainContainer.args = {
  children: [
    <QuestionsBox questions={[
      { player: "", question: 'Tem forma animal?' },
      { player: "", question: 'Tem forma animal?' },
      { player: "", question: 'Tem forma animal?' },
      { player: "", question: 'Tem forma animal?' },
      { player: "", question: 'Tem forma animal?' },
      { player: "", question: 'Tem forma animal?' },
      { player: "", question: 'Tem forma animal?' }
    ]} />
  ]
};