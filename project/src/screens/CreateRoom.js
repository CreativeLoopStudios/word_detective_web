import React, { useState, useEffect } from "react";
import {
    makeStyles,
    Button,
    TextField,
    Grid,
    Checkbox,
    FormControlLabel,
    Switch,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { withFirebase } from "../firebase/context";
import {
    CATEGORIES_COLLECTION,
} from "../firebase/collections";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

function CreateRoom(props) {
    const classes = useStyles();
    const history = useHistory();
    const categoriesLimit = 3;

    const [name, setName] = useState("");
    const [numberOfPlayers, setNumberOfPlayers] = useState(4);
    const [isPrivate, setIsPrivate] = useState(true);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await props.firebase
                .getCollection(CATEGORIES_COLLECTION)
                .get();

            const categoriesMapped = categories.docs.map((c) => ({
                ...c.data(),
                id: c.id,
                isChecked: false,
            }));
            setCategories(categoriesMapped);
        };

        fetchCategories();
    }, [props.firebase]);

    const handleChange = (evt) => {
        const numberOfAlreadyChecked = categories.reduce((total, c) => {
            if (c.isChecked) {
                return (total += 1);
            } else {
                return total;
            }
        }, 0);
        if (numberOfAlreadyChecked === categoriesLimit && evt.target.checked)
            return;

        categories.forEach((c) => {
            if (c.name === evt.target.value) {
                c.isChecked = evt.target.checked;
            }
        });
        setCategories([...categories]);
    };

    const handleChangeIsPrivate = () => {
        setIsPrivate(!isPrivate);
    };

    const handleSubmit = async () => {
        const categoriesChecked = categories.filter(c => c.isChecked).map(c => ({ id: c.id, name: c.name, description: c.description }));
        const roomId = await props.firebase.createNewRoom(name, numberOfPlayers, categoriesChecked, isPrivate);
        history.push(`/${roomId}/lobby`);
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                <Grid item xs={12}>
                    <h1>Criação da Sala</h1>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        id="outlined-basic"
                        label="Nome da Sala"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        id="outlined-basic"
                        label="Número de Jogadores"
                        variant="outlined"
                        value={numberOfPlayers}
                        type="number"
                        onChange={(e) => setNumberOfPlayers(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12}>
                    <h2>Categorias</h2>

                    {categories.map((c) => (
                        <FormControlLabel
                            key={c.id}
                            control={
                                <Checkbox
                                    checked={c.isChecked}
                                    onChange={handleChange}
                                    inputProps={{
                                        "aria-label": "primary checkbox",
                                    }}
                                    name={c.name}
                                    value={c.name}
                                />
                            }
                            label={c.name}
                        />
                    ))}
                </Grid>

                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isPrivate}
                                onChange={handleChangeIsPrivate}
                                color="primary"
                            />
                        }
                        label="Sala privada?"
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Criar
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default withFirebase(CreateRoom);
