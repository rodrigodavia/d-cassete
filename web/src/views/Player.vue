<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {  type Tape } from '@/types';
import { useLoader } from '@/composables/useLoader';
import JSZip from 'jszip';
import SongItem from '@/components/SongItem.vue';

const route = useRoute();
const { show, hide } = useLoader();

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
  if (tapeUrl.value == null) throw new Error("Ref not loaded");
  const route = `${import.meta.env.VITE_AWS_ENDPOINT}?tape=${tapeUrl.value}`;
  const req = {
    method: "GET"
  }
  const { presigned_url } = await fetch(route, req).then((res) => res.json())
  if (presigned_url) {
    const res = await fetch(presigned_url)
    const blob = await res.blob()
    if (blob == null) throw new Error("Ref not loaded");
    zip.value = await JSZip.loadAsync(blob)
    const jsonContent = await zip.value.file("metadata.json")?.async("string")
    if (jsonContent != undefined) tape.value = JSON.parse(jsonContent)
  }
}
const loadPlayer = () => {
  if (tape.value == null) throw new Error("Ref not loaded");

  const TIME_LIMIT_h = 1;
  const date = new Date(tape.value.created_at);
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
    <div class="tape" :style="{ 'background-color': tape.color }">
      <div class="tape-book">
        <span class="tape-title">{{ tape.title }}</span>
        <div class="tape-side">
          <SongItem v-for="song in tape.tracks.sideA"
            :item="song"
          />
        </div>
        <div class="tape-side">
          <SongItem v-for="song in tape.tracks.sideB"
            :item="song"
          />
        </div>
      </div>
      <div class="tape-cover"></div>
    </div>
  </main>
  <footer v-if="tape != null">
  </footer>
</template>
<style lang="css" scoped>
.tape-book {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-tapeBook);
  width: 100%;
  height: 100%;
  border-radius: 10px;
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
header {
  background-color: white;
  display: flex;
  justify-content: center;
  padding: 20px;
  align-items: center;
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