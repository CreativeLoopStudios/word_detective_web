import React from 'react';

import { Story } from '@storybook/react';

import { Props as ChatBoxProps } from '../components/ChatBox';
import { ChatBox, ChatBoxFooter, Input } from '../components';

export default {
    title: 'WD/ChatBox',
    component: ChatBox
};

const Template: Story<ChatBoxProps> = (args) => <ChatBox {...args} />

export const Default = Template.bind({});
Default.args = {
    messages: [
        { text: 'Me faça as suas perguntas', isMine: false },
        { text: 'Tem chifre o luquinhas?', isMine: true },
        { text: 'Tem animal?', isMine: true },
        { text: 'Tem dente?', isMine: true }
    ],
    children: (
        <ChatBoxFooter>
            <Input
                placeholder="Escreva a sua pergunta para o Word Master"
                type="text"
            />
        </ChatBoxFooter>
    )
};
