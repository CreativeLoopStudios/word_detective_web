import React, { useState, useEffect, useMemo } from "react";

import {
    makeStyles,
    Grid
} from "@material-ui/core";

import { withFirebase } from "../firebase/context";
import { CATEGORIES_COLLECTION, ROOMS_COLLECTION } from "../firebase/collections";
import FirebaseEvents from "../firebase_events";
import Firebase from "../firebase";

import { Category, Room } from "../types";

import { Switch, Button, Select, Label, Checkbox } from "../components";

const useStyles = makeStyles(() => ({}));

type Props = {
    roomId: string;
    firebase: Firebase;
    onChangeRoomConfig: (isConfigured: boolean) => void;
}

function CreateRoom({ roomId, firebase, onChangeRoomConfig }: Props) {
    const classes = useStyles();

    const categoriesLimit = 3;
    const numberOfPlayersOptions = [
            { name: "2 jogadores", value: 2 },
            { name: "3 jogadores", value: 3 },
            { name: "4 jogadores", value: 4 },
            { name: "5 jogadores", value: 5 }
    ];

    const [numberOfPlayers, setNumberOfPlayers] = useState(2);
    const [isPrivate, setIsPrivate] = useState(true);

    const [currentCategories, setCurrentCategories] = useState<Array<Category>>([]);
    const [newCategories, setNewCategories] = useState<Array<Category>>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await firebase
                .getCollection(CATEGORIES_COLLECTION)
                .get();

            const roomRef = await firebase.getCollectionByDocId(ROOMS_COLLECTION, roomId).get();
            const roomInfo: Room = roomRef.data() as Room;
            const checkedCategoryIds = (roomInfo.categories || []).map(c => c.id);

            const categoriesMapped = categories.docs.map((c) => ({
                ...c.data() as Category,
                id: c.id,
                isChecked: checkedCategoryIds.includes(c.id),
            }));
            setCurrentCategories([...categoriesMapped]);
            setNewCategories([...categoriesMapped]);
        };

        fetchCategories();
    }, [firebase, roomId]);

    const countChecks = (arr: Array<Category>) => {
        return arr.reduce((total, c) => {
            if (c.isChecked) {
                return (total += 1);
            } else {
                return total;
            }
        }, 0);
    }

    const handleChange = (value: string, checked: boolean) => {
        const numberOfAlreadyChecked = countChecks(newCategories);
        if (numberOfAlreadyChecked === categoriesLimit && checked)
            return;

        const newArr = newCategories.map(c => {
            const c_copy = {...c};
            if (c.name === value) {
                c_copy.isChecked = checked;
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
        await firebase.updateRoom(
            roomId,
            {
                name: 'Sala Default',
                categories: categoriesChecked,
                number_of_players: numberOfPlayers,
                is_private: isPrivate
            }
        );
        setCurrentCategories(newCategories);
        firebase.logEvent(FirebaseEvents.EVENTS.ROOM_CREATED, {
            [FirebaseEvents.PROP.ROOM_ID]: roomId,
            [FirebaseEvents.PROP.NUMBER_OF_PLAYERS]: numberOfPlayers,
            [FirebaseEvents.PROP.CATEGORIES]: categoriesChecked,
            [FirebaseEvents.PROP.IS_PRIVATE]: isPrivate,
        });
    };

    const handleSelectPlayers = (option: any) => {
        setNumberOfPlayers(option.value)
    };

    useEffect(() => {
        onChangeRoomConfig(countChecks(currentCategories) > 0);
    }, [currentCategories, onChangeRoomConfig])

    const shouldDisableSaving = useMemo(() => {
        const checked_1 = currentCategories.map(c => c.isChecked); 
        const checked_2 = newCategories.map(c => c.isChecked);
        return [...Array(checked_1.length).keys()].map((idx => checked_1[idx] === checked_2[idx])).every(v => v);
    }, [currentCategories, newCategories]);

    return (
        <Grid container spacing={3} direction="row">
            <Grid item xs={12}>
                <Label bold>N° de jogadores:</Label>
                <Select
                    options={numberOfPlayersOptions}
                    value={numberOfPlayers}
                    onChange={handleSelectPlayers}
                />
            </Grid>

            <Grid item xs={12}>
                <Label bold>Escolha as categorias:</Label>

                {newCategories.map((c) => (
                    <Checkbox
                        key={c.id}
                        label={c.name}
                        checked={c.isChecked}
                        onChange={handleChange}
                        value={c.name}
                    />
                ))}
            </Grid>

            <Grid item xs={12}>
                <Label bold>Sala privada?</Label>

                <Switch
                    checked={isPrivate}
                    onChange={handleChangeIsPrivate}
                />
            </Grid>

            <Grid item xs={12}>
                <Button
                    variant="contained"
                    kind="primary"
                    onClick={handleSubmit}
                    disabled={shouldDisableSaving}
                    label="Salvar"
                />
            </Grid>
        </Grid>
    );
}

export default withFirebase(CreateRoom);
