export type Player = {
    id: string;
    creationDate: number;
    name: string;
    playedAsWordMaster: boolean;
    role: 'word_detective' | 'word_master';
    score: number;
    status: 'connected' | 'disconnected';
};

export type HeartbeatData = {
    rtt: number;
    writeTime: number;
    readTime: number;
};