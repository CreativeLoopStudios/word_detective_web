import React from 'react'
import { Switch as MuiSwitch } from '@material-ui/core/'
import PropTypes from 'prop-types'

export type Props = {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}

function Switch({ checked, onChange }: Props) {
    return (<MuiSwitch checked={checked || false} onChange={onChange} />)
}

Switch.propTypes = {
    checked: PropTypes.bool
}

export default Switch;