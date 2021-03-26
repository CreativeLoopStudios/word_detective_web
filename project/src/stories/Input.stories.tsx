import React from "react";

import { Story } from '@storybook/react';

import { Props as InputProps } from '../components/Input';
import { Input } from "../components";

import "../fonts/gothic.css";

export default {
    title: "WD/Input",
    parameters: {
        default: "dark",
        values: [{ name: "dark", value: "#333333" }],
    },
    component: Input,
};

const Template: Story<InputProps> = (args) => <Input {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    label: "Digite seu nome:",
    placeholder: "Basic...",
    value: "",
    type: "text",
};
Basic.parameters = {
  backgrounds: { default: 'dark' }
}

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
    placeholder: "Basic...",
    type: "text",
    value: ""
};
