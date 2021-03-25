import React from "react";

import { Story } from '@storybook/react';

import { Props as CheckboxProps } from '../components/Checkbox';
import { Checkbox } from "../components";

import "../fonts/gothic.css";

export default {
    title: "WD/Checkbox",
    parameters: {
        default: "dark",
        values: [{ name: "dark", value: "#333333" }],
    },
    component: Checkbox,
};

const Template: Story<CheckboxProps> = (args) => <Checkbox {...args} />;

export const Basic = Template.bind({});
Basic.args = {
    label: "Monstros"
};
Basic.parameters = {
  backgrounds: { default: 'dark' }
}

