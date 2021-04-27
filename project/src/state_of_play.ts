const WAITING_PLAYERS: string = 'waiting_players';
const WORD_MASTER_CHOOSE_WORD: string = 'word_master_choose_word';
const WORD_DETECTIVES_ASK_QUESTIONS: string = 'word_detectives_ask_questions';
const WORD_MASTER_CHOOSE_QUESTION: string = 'word_master_choose_question';
const SHOW_QUESTION_CHOSE: string = 'show_question_chose';
const WM_DISCONNECTED: string = 'wm_disconnected';
const END_ROUND: string = 'end_round';
const END_GAME: string = 'end_game';

const stateOfPlay = {
    WAITING_PLAYERS,
    WORD_MASTER_CHOOSE_WORD,
    WORD_DETECTIVES_ASK_QUESTIONS,
    WORD_MASTER_CHOOSE_QUESTION,
    SHOW_QUESTION_CHOSE,
    WM_DISCONNECTED,
    END_ROUND,
    END_GAME
};

export default stateOfPlay;