<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { Tape } from '@/types';
import { useLoader } from '@/composables/useLoader';
import JSZip from 'jszip';
import TapeItem from '@/components/TapeItem.vue';
import { usePlayerStore } from '@/stores';

const route = useRoute();
const { show, hide } = useLoader();

const playerStore = usePlayerStore()

const tapeUrl = ref<string | null>(null);
const tape = ref<Tape | null>(null)
const zip = ref<JSZip | null>(null)
const headerMessage = ref("There is no tape");

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

    const tempTape: Tape = JSON.parse(jsonContent);
    if (tempTape.cover === undefined) { tape.value = tempTape; return; }

    const coverFile = zip.value.file(tempTape.cover);
    if (!coverFile) throw new Error("Cover file not finded in tape dir");

    const coverBlob = await coverFile.async("blob");
    const coverUrl = URL.createObjectURL(blob);
    tempTape.cover = coverUrl;

    tape.value = tempTape;
  }
}
const loadPlayer = () => {
  if (tape.value == null) throw new Error("Tape not loaded");

  const TIME_LIMIT_h = 1;
  const date = new Date();
  date.setHours(date.getHours() + TIME_LIMIT_h)
  const hours = date.getHours();
  const minutes = date.getMinutes();
  headerMessage.value = `The tape will no longer be available at ${hours.toString()}:${minutes.toString()}`;
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
  <main v-if="tape != null">
    <div class="row-end">
        <button class="btn sample">
            <span>Save tape</span>
            <!--<img :src="library" width="20px"/>-->
        </button>
    </div>
    <TapeItem :item="tape" />
  </main>
  <footer v-if="tape != null">
      <div class="player-song"></div>
      <div class="player-buttons"></div>
  </footer>
</template>
<style lang="css" scoped>
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
