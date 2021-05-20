import React, { MouseEvent } from 'react';

import { Grid } from "@material-ui/core";

import PropTypes from 'prop-types';

import Button from './Button';
import Label from './Label';

import { Question } from '../types';

export type Props = {
    questions: Array<Question>;
    buttonsDisabled?: boolean;
    onClickAffirmative?: (question: Question, index: number) => void;
    onClickNegative?: (question: Question, index: number) => void;
}

function QuestionsBox({ questions, buttonsDisabled, onClickAffirmative, onClickNegative }: Props) {
    return (
        <Grid container item alignItems="center" spacing={4}>
            {
                questions.map((q, index) => (
                    <Grid container item key={index} spacing={1}>
                        <Grid item>
                            <Label kind="secondary" size="h5">{q.question}</Label>
                        </Grid>

                        <Grid container item spacing={2}>
                            <Grid item>
                                <Button label="SIM" disabled={buttonsDisabled} backgroundColor="#575475" size="small" onClick={(e: MouseEvent) => onClickAffirmative && onClickAffirmative(q, index)} />
                            </Grid>
                            <Grid item>
                                <Button label="NÃO" disabled={buttonsDisabled} backgroundColor="#FF0D0D" size="small" onClick={(e: MouseEvent) => onClickNegative && onClickNegative(q, index)} />
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