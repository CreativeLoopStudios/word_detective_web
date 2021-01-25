import React, { useState, useEffect, useMemo } from "react";
import {
    makeStyles,
    Button,
    TextField,
    Grid,
    Checkbox,
    FormControlLabel,
    Switch,
} from "@material-ui/core";
import { withFirebase } from "../firebase/context";
import { CATEGORIES_COLLECTION, ROOMS_COLLECTION } from "../firebase/collections";
import FirebaseEvents from "../firebase_events";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flex: 1,
    },
}));

function CreateRoom(props) {
    const classes = useStyles();

    const categoriesLimit = 3;

    const { roomId } = props;
    const [name, setName] = useState("");
    const [numberOfPlayers, setNumberOfPlayers] = useState(4);
    const [isPrivate, setIsPrivate] = useState(true);

    const [currentCategories, setCurrentCategories] = useState([]);
    const [newCategories, setNewCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await props.firebase
                .getCollection(CATEGORIES_COLLECTION)
                .get();

            const roomInfo = (await props.firebase.getCollection(ROOMS_COLLECTION).doc(roomId).get()).data();
            const checkedCategoryIds = (roomInfo.categories || []).map(c => c.id);

            const categoriesMapped = categories.docs.map((c) => ({
                ...c.data(),
                id: c.id,
                isChecked: checkedCategoryIds.includes(c.id),
            }));
            setCurrentCategories([...categoriesMapped]);
            setNewCategories([...categoriesMapped]);
        };

        fetchCategories();
    }, [props.firebase, roomId]);

    const countChecks = (arr) => {
        return arr.reduce((total, c) => {
            if (c.isChecked) {
                return (total += 1);
            } else {
                return total;
            }
        }, 0);
    }

    const handleChange = (evt) => {
        const numberOfAlreadyChecked = countChecks(newCategories);
        if (numberOfAlreadyChecked === categoriesLimit && evt.target.checked)
            return;

        const newArr = newCategories.map(c => {
            const c_copy = {...c};
            if (c.name === evt.target.value) {
                c_copy.isChecked = evt.target.checked;
            }
            return c_copy;
        });
        setNewCategories(newArr);
    };

    const handleChangeIsPrivate = () => {
        setIsPrivate(!isPrivate);
    };

    const handleSubmit = async () => {
        const categoriesChecked = newCategories
            .filter((c) => c.isChecked)
            .map((c) => ({
                id: c.id,
                name: c.name,
                description: c.description,
            }));
        await props.firebase.updateRoom(
            roomId,
            {
                name,
                categories: categoriesChecked,
                number_of_players: numberOfPlayers,
                is_private: isPrivate
            }
        );
        setCurrentCategories(newCategories);
        props.firebase.logEvent(FirebaseEvents.EVENTS.ROOM_CREATED, {
            [FirebaseEvents.PROP.ROOM_ID]: roomId,
            [FirebaseEvents.PROP.NUMBER_OF_PLAYERS]: numberOfPlayers,
            [FirebaseEvents.PROP.CATEGORIES]: categoriesChecked,
            [FirebaseEvents.PROP.IS_PRIVATE]: isPrivate,
        });
    };

    useEffect(() => {
        props.onChangeRoomConfig(countChecks(currentCategories) > 0);
    }, [currentCategories, props])

    const shouldDisableSaving = useMemo(() => {
        const checked_1 = currentCategories.map(c => c.isChecked); 
        const checked_2 = newCategories.map(c => c.isChecked);
        return [...Array(checked_1.length).keys()].map((idx => checked_1[idx] === checked_2[idx])).every(v => v);
    }, [currentCategories, newCategories]);

    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row">
                <Grid item xs={12}>
                    <h1>Configuração da Sala</h1>
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

                    {newCategories.map((c) => (
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
                        disabled={shouldDisableSaving}
                    >
                        Salvar
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default withFirebase(CreateRoom);
