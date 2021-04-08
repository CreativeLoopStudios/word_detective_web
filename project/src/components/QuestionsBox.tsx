import React, { MouseEvent } from 'react';

import { Grid } from "@material-ui/core";

import PropTypes from 'prop-types';

import Button from './Button';
import Label from './Label';

export type Props = {
    questions: Array<string>;
    onClickAfirmative: (question: string) => void;
    onClickNegative: (question: string) => void;
}

function QuestionsBox({ questions, onClickAfirmative, onClickNegative }: Props) {
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
                                <Button label="SIM" backgroundColor="#575475" size="small" onClick={(e: MouseEvent) => onClickAfirmative(question)} />
                            </Grid>
                            <Grid item>
                                <Button label="NÃO" backgroundColor="#FF0D0D" size="small" onClick={(e: MouseEvent) => onClickNegative(question)} />
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
    onClickAfirmative: PropTypes.func,
    onClickNegative: PropTypes.func,
};
QuestionsBox.defaultProps = {
    questions: [],
    onClickAfirmative: undefined,
    onClickNegative: undefined
};

export default QuestionsBox;