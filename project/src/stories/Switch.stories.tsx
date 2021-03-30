import React, { useState, useEffect } from 'react'
import { Story } from '@storybook/react'
import { Switch } from '../components'
import { Props } from '../components/Switch'

export default {
    title: "WD/Switch",
    parameters: {
    },
    component: Switch,
};

const Template: Story<Props> = (args) => <Switch {...args} />

export const Default = Template.bind({});