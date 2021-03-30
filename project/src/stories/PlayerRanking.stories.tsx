import React from 'react';

import { Story } from '@storybook/react';

import { Props as MainContainerProps } from '../components/MainContainer';
import { Props as PlayerRankingProps } from '../components/PlayerRanking';
import { MainContainer, PlayerRanking, PlayerRankingItem } from '../components';

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
        { isWordMaster: true, playerName: "Player 1", score: 0 },
        { isWordMaster: false, playerName: "Player 2", score: 0 },
        { isWordMaster: false, playerName: "Player 3", score: 0 },
        { isWordMaster: false, playerName: "Player 4", score: 0 },
        { isWordMaster: false, playerName: "Player 5", score: 0 }
      ]}
    />
  ],
};
