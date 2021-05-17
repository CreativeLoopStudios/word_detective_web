import React, { MouseEvent } from 'react';

import { Grid } from "@material-ui/core";

import PropTypes from 'prop-types';

import Button from './Button';
import Label from './Label';

export type Props = {
    questions: Array<string>;
    buttonsDisabled?: boolean;
    onClickAffirmative?: (question: string) => void;
    onClickNegative?: (question: string) => void;
}

function QuestionsBox({ questions, buttonsDisabled, onClickAffirmative, onClickNegative }: Props) {
    return (
        <Grid container item alignItems="center" spacing={4}>
            {
                questions.map((question, index) => (
                    <Grid container item key={index} spacing={1}>
                        <Grid item>
                            <Label kind="secondary" size="h5">{question}</Label>
                        </Grid>

                        <Grid container item spacing={2}>
                            <Grid item>
                                <Button label="SIM" disabled={buttonsDisabled} backgroundColor="#575475" size="small" onClick={(e: MouseEvent) => onClickAffirmative && onClickAffirmative(question)} />
                            </Grid>
                            <Grid item>
                                <Button label="NÃO" disabled={buttonsDisabled} backgroundColor="#FF0D0D" size="small" onClick={(e: MouseEvent) => onClickNegative && onClickNegative(question)} />
                            </Grid>
                        </Grid>
                    </Grid>
                ))
            }
        </Grid>
    );
}

QuestionsBox.propTypes = {
    questions: PropTypes.array,
    buttonsDisabled: PropTypes.bool,
    onClickAffirmative: PropTypes.func,
    onClickNegative: PropTypes.func,
};
QuestionsBox.defaultProps = {
    questions: [],
    buttonsDisabled: false,
    onClickAffirmative: undefined,
    onClickNegative: undefined
};

export default QuestionsBox;