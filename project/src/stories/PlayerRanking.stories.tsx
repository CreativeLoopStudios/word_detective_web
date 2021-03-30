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
        { isWordMaster: true, playerName: "Player 1", score: 10 },
        { isWordMaster: false, playerName: "Player 2", score: 5 },
        { isWordMaster: false, playerName: "Player 3", score: 12 },
        { isWordMaster: false, playerName: "Player 4", score: 20 },
        { isWordMaster: false, playerName: "Player 5", score: 1 }
      ]}
    />
  ],
};
