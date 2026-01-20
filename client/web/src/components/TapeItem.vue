<script lang="ts" setup>
import type { Tape, Song } from '@/types';
import { usePlayerStore } from '@/stores';
import SongItem from './SongItem.vue';
import { ref, onMounted } from 'vue';

const props = defineProps<{
    item: Tape
}>()

const playerStore = usePlayerStore()

const showCover = ref(false);
const refCoverSrc = ref<string | null>(props.item.cover ?? null);
const refCoverWidth = ref(200);
const refCoverHeight = ref(300);

const handleSong = (item: Song) => {
    playerStore.setSelectedSong(item);
}

onMounted(() => {
  playerStore.setSelectedSong(props.item.tracks.sideA[0])
});
</script>
<template>
    <div class="tape" :style="{ 'background-color': item.color }">
      <div class="tape-book">
        <span class="tape-title">{{ item.title }}</span>
        <div class="tape-side">
          <h1>A</h1>
          <SongItem v-for="song in item.tracks.sideA"
            :item="song"
            @onSelected="handleSong"
          />
        </div>
        <div class="tape-side">
          <h1>B</h1>
          <SongItem v-for="song in item.tracks.sideB"
            :item="song"
            @onSelected="handleSong"
          />
        </div>
      </div>
      <div class="tape-cover"
          :class="{ show: showCover }"
          v-if="refCoverSrc !== null"
      >
          <img :src="refCoverSrc"
            :width="refCoverWidth"
            :height="refCoverHeight"
          />
      </div>
    </div>
</template>
<style lang="css" scoped>
.tape-title {
    font-weight: bold;
}
.tape-book {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-tapeBook);
  width: 100%;
  height: auto;
  border-radius: 10px;
  gap: 5px;
  max-width: 332px;
  max-height: 527px;
  padding: 10px;
  z-index: 9999;
}
.tape {
  width: 332px;
  height: 527px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.2);
  padding: 20px;
}
.tape-side {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: start;
  justify-content: center;
  padding: 10px;
}
.tape-cover {
    position: fixed;
    opacity: 0;
    z-index: 9998;
}
</style>
