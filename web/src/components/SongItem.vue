<script setup lang="ts">
import type { Song } from '@/types';
import { ref, watch } from 'vue'
import { usePlayerStore } from '@/stores';

const props = defineProps<{
    item: Song
}>()
const emits = defineEmits<{
    onSelected: [item: Song]
}>()

const playerStore = usePlayerStore()

const refSelected = ref(false);

const selSong = () => {
    emits("onSelected", props.item);
}

watch(playerStore, (newSong) => {
    if (newSong.getSelectedSong !== null && newSong.getSelectedSong.title === props.item.title) refSelected.value = true;
    else refSelected.value = false;
    playerStore.setSelectedSong(newSong.getSelectedSong);
});
</script>
<template>
    <div class="song" :class="{ selected: refSelected }" @click="selSong">
        <span class="song-title">{{ item.title }}</span>
    </div>
</template>
<style lang="css" scoped>
.song-title {
    font-family: 'Comic Relief', system-ui;
    font-size: 12pt
}
.song {
    border-radius: 5px;
    cursor: pointer;
    width: auto;
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 5px;
    transition: background-color 0.2s ease;
}
.song.selected {
    background-color: var(--color-songSelected);
}
.song:hover {
    background-color: var(--color-songSelected);
}
</style>
