import React from "react";

import { Story } from '@storybook/react';

import { Props as EditInputProps } from '../components/EditInput';
import { EditInput } from "../components";

import "../fonts/gothic.css";

export default {
    title: "WD/EditInput",
    parameters: {
        default: "dark",
        values: [{ name: "dark", value: "#333333" }],
    },
    component: EditInput,
};

const Template: Story<EditInputProps> = (args) => <EditInput {...args} />;

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
