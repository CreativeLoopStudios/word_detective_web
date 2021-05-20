import React from "react";
import { Grid } from "@material-ui/core";
import { Button, Label } from "../components";

function Heading({ children }) {
    return <Label size='h4' kind='secondary' bold={true}>{children}</Label>
}

function HelperText({ children }) {
    return <Label size='body1' kind='primary'>{children}</Label>
}

function CustomButton({ label, key, onClick }) {
    return (
        <Button
            variant="contained"
            kind="primary"
            backgroundColor='#dd0000'
            hoverColor='#ff0000'
            key={key}
            onClick={onClick}
            label={label}
        />
    )
}

function WordMasterChooseWord({ isWordMaster, categories, words, onClickCategory, onClickWord }) {
    return (
        <>
            {isWordMaster && (
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <HelperText>Escolha abaixo uma das categorias e em seguida uma palavra de sua preferência</HelperText>
                        </Grid>
                        {
                            categories.length > 0 && (
                                <>
                                    <Grid item xs={12}>
                                        <Heading>Escolha a categoria</Heading>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container spacing={2}>
                                            {categories.map((category) => (
                                                <Grid item key={category.id}>
                                                    <CustomButton 
                                                        onClick={() => onClickCategory(category)}
                                                        label={category.name}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </>
                            )
                        }
                        {
                            categories.length > 0 && words.length > 0 && (
                                <>
                                    <Grid item xs={12}>
                                        <Heading>Escolha a palavra</Heading>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <HelperText>Selecione uma palavra ou espere o tempo acabar para uma escolha aleatória</HelperText>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Grid container spacing={2}>
                                            {words.map((word, idx) => (
                                                <Grid item key={idx}>
                                                    <CustomButton 
                                                        onClick={() => onClickWord(word)}
                                                        label={word}
                                                    />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                </>
                            )
                        }
                    </Grid>
                </Grid>
            )}

            {!isWordMaster && (
                <Grid item xs={12}>
                    <HelperText>Aguarde o Word Master escolher a palavra da rodada</HelperText>
                </Grid>
            )}
        </>
    );
}

export default WordMasterChooseWord;
