import React from "react";

import { Story } from '@storybook/react';

import { Props as SelectProps } from '../components/Select';
import { Select } from "../components";

import "../fonts/gothic.css";

export default {
    title: "WD/Select",
    parameters: {
        default: "dark",
        values: [{ name: "dark", value: "#333333" }],
    },
    component: Select,
};

const Template: Story<SelectProps> = (args) => <Select {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    label: "Escolha o número de jogadores:",
    options: ['2 jogadores', '3 jogadores', '4 jogadores']
};
Basic.parameters = {
    backgrounds: { default: 'dark' }
}

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
    options: ['2 jogadores', '3 jogadores', '4 jogadores']
};
WithoutLabel.parameters = {
    backgrounds: { default: 'dark' }
}
