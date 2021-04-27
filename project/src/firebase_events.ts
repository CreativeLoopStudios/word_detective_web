const ROOM_CREATED: string = 'room_created';
const CHOSEN_WORD: string = 'chosen_word';
const ASKED_QUESTION: string = 'asked_question';
const CHOSEN_QUESTION: string = 'chosen_question';
const TYPED_HUNCH: string = 'typed_hunch';
const FINAL_SCORE: string = 'final_score';
const STATUS_CHANGED: string = 'status_changed';

const ROOM_ID: string = 'room_id';
const PLAYER_ID: string = 'player_id';
const NUMBER_OF_PLAYERS: string = 'number_of_players';
const CATEGORIES: string = 'categories';
const IS_PRIVATE: string = 'is_private';
const ROUND: string = 'round';
const WORD: string = 'word';
const QUESTION: string = 'question';
const HUNCH: string = 'hunch';
const PLAYERS: string = 'players';
const STATUS: string = 'status';

const events = {
    EVENTS: {
        ROOM_CREATED,
        CHOSEN_WORD,
        ASKED_QUESTION,
        CHOSEN_QUESTION,
        TYPED_HUNCH,
        FINAL_SCORE,
        STATUS_CHANGED
    },
    PROP: {
        ROOM_ID,
        PLAYER_ID,
        NUMBER_OF_PLAYERS,
        CATEGORIES,
        IS_PRIVATE,
        ROUND,
        WORD,
        QUESTION,
        HUNCH,
        PLAYERS,
        STATUS
    }
};

export default events;