export type Player = {
    id: string;
    creationDate: number;
    name: string;
    playedAsWordMaster: boolean;
    role: 'word_detective' | 'word_master';
    score: number;
    status: 'connected' | 'disconnected';
};

export type Question = {
    player: string;
    question: string;
};

export type Clue = {
    answer: string;
    question: Question;
};

export type Category = {
    id: string;
    description: string;
    lang: string;
    name: string;
    words: Array<string>;
    isChecked?: boolean;
};

export type Room = {
    categories: Array<Category>;
    createdBy: string;
    is_private: boolean;
    name: string;
    number_of_players: number;
};

export type HeartbeatData = {
    rtt: number;
    writeTime: number;
    readTime: number;
};

export type Hunch = {
    text: string;
};

export type Message = {
    text: string;
    isMine: boolean;
};