import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  question: {
    fontWeight: 'bold',
    paddingRight: '1ex'
  }
}));

function Clue (props) {
    const classes = useStyles();

    return (
      <ul>
        {
            (props.clues || []).map((clue, idx) => (
                <li key={idx}>
                    <span className={classes.question}>{clue.question.question}</span>
                    <span>{clue.answer}</span>
                </li>
            ))
        }
      </ul>
    )
}

export default Clue;