<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import type { Tape } from '@/types';
import { useLoader } from '@/composables/useLoader';
import JSZip from 'jszip';
import TapeItem from '@/components/TapeItem.vue';
import { usePlayerStore } from '@/stores';
import { saveLocalTape, loadLocalTape } from "@/utils";

const route = useRoute();
const { show, hide } = useLoader();

const playerStore = usePlayerStore()

const tapeUrl = ref<string | null>(null);
const tape = ref<Tape | null>(null)
const zip = ref<JSZip | null>(null)
const headerMessage = ref("There is no tape");
var dateCountdown = new Date();
const notPosible = ref(false);

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
  const lastTape = loadLocalTape();
  if (lastTape !== null && lastTape.tape == tapeUrl.value) dateCountdown = lastTape.date;
  else saveLocalTape(tapeUrl.value);

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
    if (auxTape.cover === undefined) { tape.value = auxTape; return; }

    for (let i = 0; i < auxTape.tracks.sideA; i++) {
        const track = auxTape.tracks.sideA[i];
        const songFile = zip.value.file(track.file)
        if (songFile === undefined) continue;
        const songBlob = await songFile.async("blob");
        const songUrl = URL.createObjectURL(songBlob);
        console.log(songUrl);
        auxTape.tracks.sideA[i].file = songUrl;
    }
    for (let i = 0; i < auxTape.tracks.sideB; i++) {
        const track = auxTape.tracks.sideB[i];
        const songFile = zip.value.file(track.file)
        if (songFile === undefined) continue;
        const songBlob = await songFile.async("blob");
        const songUrl = URL.createObjectURL(songBlob);
        console.log(songUrl);
        auxTape.tracks.sideB[i].file = songUrl;
    }

    tape.value = auxTape;

    // Optional property
    const coverFile = zip.value.file(auxTape.cover);
    if (!coverFile) throw new Error("Cover file not finded in tape dir");

    const coverBlob = await coverFile.async("blob");
    const coverUrl = URL.createObjectURL(blob);
    auxTape.cover = coverUrl;
    tape.value = auxTape;

  }
}
const loadPlayer = () => {
  if (tape.value == null) throw new Error("Tape not loaded");

  const TIME_LIMIT_h = 1;
  dateCountdown.setHours(dateCountdown.getHours() + TIME_LIMIT_h)
  const hours = dateCountdown.getHours();
  const minutes = dateCountdown.getMinutes();
  if (dateCountdown == new Date()) {
    headerMessage.value = "Tape is not disponible";

  }
  else headerMessage.value = `The tape will no longer be available at ${hours.toString()}:${minutes.toString()}`;
}
const getSongFile = () => {
    try {
        if (currSong.value === null) throw new Error("No song selected");
        const songFile = currSong.value.file
        if (songFile === undefined) throw new Error(`No file ${currSong.value.file}`);
        return songFile;
    } catch (err) {
        console.error(err)
    }
}

watch(tapeUrl, async (newValue, oldValue) => {
  try {
    if (newValue == "") throw new Error("No tape");
    if (newValue === oldValue) return;

    show();
    tapeUrl.value = newValue;
    await loadTape()
    hide();
    loadPlayer()
  } catch(err) {
    console.error(err)
  }
});
watch(currSong, (newSong) => {
   console.log(newSong);
})

onMounted(() => {
  initPlayer();
})
</script>
<template>
  <header>
    <div class="danger">
      <span class="message">{{ headerMessage }}</span>
    </div>
  </header>
  <main v-if="tape != null && !notPosible">
    <div class="row-end">
        <button class="btn sample">
            <span>Save tape</span>
            <!--<img :src="library" width="20px"/>-->
        </button>
    </div>
    <TapeItem :item="tape"/>
  </main>
  <footer v-if="tape != null">
      <div class="player-song" v-if="currSong != null">
          <audio controls>
              <source :src="getSongFile()" type="audio/mpeg">
          </audio>
          {{ currSong.title }}
      </div>
      <div class="player-buttons"></div>
  </footer>
</template>
<style lang="css" scoped>
.player-song {
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
