<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import type { Tape } from '@/types';
import { useLoader } from '@/composables/useLoader';
import JSZip from 'jszip';
import TapeItem from '@/components/TapeItem.vue';
import { usePlayerStore } from '@/stores';
import library from "@/assets/imgs/library.png";
import play from "@/assets/imgs/play.png";
import pause from "@/assets/imgs/pause.png";
// import next from "@/assets/imgs/next.png";
// import previous from "@/assets/imgs/previous.png";

const route = useRoute();
const { show, hide } = useLoader();

const playerStore = usePlayerStore()

const tapeUrl = ref<string | null>(null);
const tape = ref<Tape | null>(null)
const zip = ref<JSZip | null>(null)
const headerMessage = ref("There is no tape");
let dateCountdown = new Date();
const notAvailable = ref(false);
const refAudioPlayer = ref(null);

const currSong = computed<Song | null>(() => playerStore.getSelectedSong)

const initPlayer = () => {
  const file = route.query.tape;
  if (file) {
    if (file instanceof Array)
      tapeUrl.value = file[0] ?? "";
    else tapeUrl.value = file
  }
}
const loadTape = async () => {
  if (tapeUrl.value == null) throw new Error("URL not loaded");

  const route = `${import.meta.env.VITE_AWS_ENDPOINT}?tape=${tapeUrl.value}`;
  const req = {
    method: "GET"
  }
  const { presigned_url } = await fetch(route, req).then((res) => res.json());
  if (presigned_url) {
    const res = await fetch(presigned_url)
    const blob = await res.blob()
    if (blob == null) throw new Error("Can not load the blob file");

    zip.value = await JSZip.loadAsync(blob)
    const jsonContent = await zip.value.file("metadata.json")?.async("string")
    if (jsonContent === undefined) throw new Error("No file metadata.json");

    const auxTape: Tape = JSON.parse(jsonContent);

    tape.value = auxTape;

    // Optional property
    if (auxTape.cover === undefined) { tape.value = auxTape; return; }
    const coverFile = zip.value.file(auxTape.cover);
    if (!coverFile) throw new Error("Cover file not finded in tape dir");

    const coverBlob = await coverFile.async("blob");
    const coverUrl = URL.createObjectURL(blob);
    auxTape.cover = coverUrl;

    tape.value = auxTape;
  }
}
const getSongBlob = async (file: string): Promise<string> => {
  const songFile = zip.value.file(file)
  if (songFile === undefined) return "";
  const songBlob = await songFile.async("blob");
  const songUrl = URL.createObjectURL(songBlob);
  return songUrl;
}
const togglePlay = () => {
  if (refAudioPlayer.value?.paused) refAudioPlayer.value?.play();
  else refAudioPlayer.value?.pause();
}

watch(tapeUrl, async (newValue, oldValue) => {
  try {
    if (newValue == "") throw new Error("No tape");
    if (newValue === oldValue) return;

    show();
    tapeUrl.value = newValue;
    await loadTape()
    hide();
  } catch(err) {
    console.error(err)
  }
});
watch(currSong, async (newSong) => {
  URL.revokeObjectURL(currSong.value.file);
  const songFile = await getSongBlob(newSong.file);
  if (songFile != undefined) {
    refAudioPlayer.value.src = songFile;
    refAudioPlayer.value.play();
  } else console.error("No song file for reproduction")
})

onMounted(() => {
  initPlayer();
})
</script>
<template>
  <header>
    <div class="danger" v-if="tape == nul">
      <span class="message">{{ headerMessage }}</span>
    </div>
  </header>
  <main v-if="tape != null && !notAvailable">
    <div class="row-end">
        <button class="btn sample">
            <span>Save tape</span>
            <img :src="library" width="20px"/>
        </button>
    </div>
    <TapeItem :item="tape"/>
  </main>
  <footer v-if="tape != null">
    <audio ref="refAudioPlayer"></audio>
    <div class="player-controls" v-if="currSong != null">
      <div class="player-song">
        <input
          type="range"
          :max="refAudioPlayer.duration"
          :value="refAudioPlayer.currentTime"
          @input="(event) => refAudioPlayer.currentTime = event.target.value"
        >
        <div class="row-between">
          <span class="player-time-song">{{1}}</span>
          <span class="player-time-song">{{3}}</span>
        </div>
      </div>
      <div class="player-buttons">
        <button
          class="btn player"
          :style="{ 'background-color': refAudioPlayer?.paused ? 'rgba(0,0,0,70%)' : '#000000' }"
          @click="togglePlay"
        >
          <img :src="refAudioPlayer?.paused ? play : pause" width="20px"/>
        </button>
      </div>
    </div>
  </footer>
</template>
<style lang="css" scoped>
.player-time-song {
  font-weight: 200;
}
input {
  width: 100%;
  color: black;
  background-color: black;
}
.player-buttons {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.row-between {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn.player {
  border-radius: 5px;
  padding: 15px;
  background-color: rgba(0,0,0,70%);
  display: flex;
  justify-content: center;
  align-items: center;
}
.player-song {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.row-end {
  width: 332px;
}
.danger {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background-color: var(--color-dangerBg);
  padding: 10px;
  border: 1px solid var(--color-danger);
}
</style>
