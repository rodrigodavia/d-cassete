import { defineStore } from 'pinia'
import type { Tape, Song } from '@/types'

interface PlayerState {
    currTape: Tape | null;
    selectedSong: Song | null;
}

export const usePlayerStore = defineStore("player", {
    state: (): PlayerState => ({
        currTape: null,
        selectedSong: null
    }),
    getters: {
        getCurrTape: (state) => state.currTape,
        getSelectedSong: (state) => state.selectedSong
    },
    actions: {
        setCurrTape(value: Tape | null) { this.currTape = value },
        setSelectedSong(value: Song | null) { this.selectedSong = value }
    }
});
