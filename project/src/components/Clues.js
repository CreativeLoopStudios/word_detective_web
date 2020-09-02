import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  question: {
    fontWeight: 'bold',
    paddingRight: '1ex'
  }
}));

const Clue = (props) => {
    const classes = useStyles();

    return (
      <>
          <h3>Pistas:</h3>
          <ul>
          {
              (props.clues || []).map(clue => (
                  <li>
                      <span className={classes.question}>{clue.question.question}</span>
                      <span>{clue.answer}</span>
                  </li>
              ))
          }
          </ul>
      </>
    )
}

export default Clue;