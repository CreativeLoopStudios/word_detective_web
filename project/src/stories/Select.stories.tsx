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
    options: [
        { name: "2 jogadores", value: "2" },
        { name: "3 jogadores", value: "3" },
        { name: "4 jogadores", value: "4" },
        { name: "5 jogadores", value: "5" }
    ]
};
Basic.parameters = {
    backgrounds: { default: 'dark' }
}

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
    options: [
        { name: "2 jogadores", value: "2" },
        { name: "3 jogadores", value: "3" },
        { name: "4 jogadores", value: "4" },
        { name: "5 jogadores", value: "5" }
    ]
};
WithoutLabel.parameters = {
    backgrounds: { default: 'dark' }
}
