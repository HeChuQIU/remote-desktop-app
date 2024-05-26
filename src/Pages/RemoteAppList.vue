<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";
// import { ipcRenderer } from 'electron';


let connection = new HubConnectionBuilder().withUrl("http://localhost:5000/remoteAppHub").build();
let items = ref([]);
let loaded = ref(false);
let selectedAppName = ref("");

onMounted(async () => {

});

const onLoadButtonClick = async () => {
  if (connection.state !== HubConnectionState.Connected)
    await connection.start();
  connection.invoke("GetRemoteApps").then(function (apps: string[]) {
    console.log(apps);
    items.value = apps.map((app, i) => ({title: app, value: i}));
    loaded.value = true;
  }).catch(function (err) {
    console.error(err.toString());
    loaded.value = false;
  });
};

const rdpToApp = async () =>{
  try {
    const result = await window.electronAPI.executeCommand(`echo ${selectedAppName.value}`);
    console.log(result);
  } catch (error) {
    console.error(`错误: ${error}`);
  }
}
</script>

<template>
  <v-card
      class="mx-auto"
      max-width="300"
  >
    <v-btn @click="onLoadButtonClick">
      <div v-if="loaded">重新加载</div>
      <div v-else>点击加载</div>
    </v-btn>
    <v-list :items="items" @click:select="value => selectedAppName = items[value.id].title"></v-list>
  </v-card>
  <v-btn @click="rdpToApp" :disabled="selectedAppName.length == 0">
    连接 {{ selectedAppName }}
  </v-btn>
</template>

<style scoped>

</style>