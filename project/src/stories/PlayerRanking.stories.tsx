import React from 'react';

import { Story } from '@storybook/react';

import { Props as MainContainerProps } from '../components/MainContainer';
import { MainContainer, PlayerRanking } from '../components';

export default {
  title: 'WD/PlayerRanking',
  component: PlayerRanking
};

const Template: Story<MainContainerProps> = (args) => <MainContainer {...args} />

export const Default = Template.bind({});
Default.args = {
  sidebar: [
    <PlayerRanking
      players={[
        { id: '', creationDate: 0, name: "Player 1", playedAsWordMaster: false, role: 'word_master', score: 10, status: 'connected' },
        { id: '', creationDate: 0, name: "Player 2", playedAsWordMaster: false, role: 'word_detective', score: 5, status: 'connected' },
        { id: '', creationDate: 0, name: "Player 3", playedAsWordMaster: false, role: 'word_detective', score: 12, status: 'disconnected' },
        { id: '', creationDate: 0, name: "Player 4", playedAsWordMaster: false, role: 'word_detective', score: 20, status: 'connected' },
        { id: '', creationDate: 0, name: "Player 5", playedAsWordMaster: false, role: 'word_detective', score: 1, status: 'disconnected' }
      ]}
    />
  ],
};
