import React from "react";

import { Story } from '@storybook/react';
import { PlayerHeader } from "../components";

import "../fonts/gothic.css";
import { Props } from "../components/PlayerHeader";

export default {
    title: "WD/PlayerHeader",
    parameters: {
        default: "dark",
        values: [{ name: "dark", value: "#333333" }],
    },
    component: PlayerHeader,
};

const Template: Story<Props> = (args) => <PlayerHeader {...args} />;

export const Default = Template.bind({});
Default.parameters = {
    backgrounds: { default: 'dark' },
}
Default.args = {
    name: "Player",
    isWordMaster: true,
}