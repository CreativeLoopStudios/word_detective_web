import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { Button, Label } from "../components";

function Heading({ children }) {
    return (
        <Label size="h4" kind="secondary" bold>
            {children}
        </Label>
    );
}

function HelperText({ children }) {
    return (
        <Label size="body1" kind="primary">
            {children}
        </Label>
    );
}

function CategoryLabel({ children }) {
    return (
        <Label size="body1" kind="primary" bold>
            {children}
        </Label>
    );
}

function CustomButton({ label, key, onClick }) {
    return (
        <Button
            variant="contained"
            kind="primary"
            backgroundColor="white"
            hoverBgColor="#34C1F8"
            color="#34C1F8"
            hoverColor="white"
            size="small"
            key={key}
            onClick={onClick}
            label={label}
            width="100%"
        />
    );
}

function WordMasterChooseWord({ isWordMaster, fetchWordChoices, onClickWord }) {
    const [wordChoices, setWordChoices] = useState({});

    useEffect(() => {
        (async () => {
            setWordChoices(await fetchWordChoices());
        })();
    }, [setWordChoices, fetchWordChoices]);

    return (
        <>
            {isWordMaster && (
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        {Object.values(wordChoices).length > 0 && (
                            <>
                                <Grid item xs={12}>
                                    <Heading>
                                        Escolha a palavra da rodada
                                    </Heading>
                                </Grid>

                                <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                        {wordChoices.map(
                                            ([category, words]) => (
                                                <Grid
                                                    item
                                                    key={category.id}
                                                    xs={12}
                                                >
                                                    <Grid
                                                        container
                                                        alignItems="center"
                                                        justify="center"
                                                        spacing={1}
                                                    >
                                                        <Grid item xs={3}>
                                                            <CategoryLabel>
                                                                {category.name.toUpperCase()}
                                                            </CategoryLabel>
                                                        </Grid>

                                                        {words.map((word) => (
                                                            <Grid item xs={3}>
                                                                <CustomButton
                                                                    key={word}
                                                                    onClick={() =>
                                                                        onClickWord(
                                                                            word,
                                                                            category
                                                                        )
                                                                    }
                                                                    label={word}
                                                                />
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </Grid>
                                            )
                                        )}
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Grid>
            )}

            {!isWordMaster && (
                <Grid item xs={12}>
                    <HelperText>
                        Aguarde o Word Master escolher a palavra da rodada
                    </HelperText>
                </Grid>
            )}
        </>
    );
}

export default WordMasterChooseWord;
