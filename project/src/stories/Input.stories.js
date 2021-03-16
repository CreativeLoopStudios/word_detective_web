import React from "react";

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

const Template = (args) => <Input {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    label: "Digite seu nome:",
    placeholder: "Basic...",
    type: "text",
};
Basic.parameters = {
  backgrounds: { default: 'dark' }
}

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
    placeholder: "Basic...",
    type: "text",
};
