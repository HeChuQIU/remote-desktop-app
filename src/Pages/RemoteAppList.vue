<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";
// import { ipcRenderer } from 'electron';


let connection = new HubConnectionBuilder().withUrl("http://localhost:5000/clientHub").build();
let items = ref([]);
let itemsIcon = ref([]);
let loaded = ref(false);
let selectedAppName = ref("");
let address = ref("");

onMounted(async () => {

});

const onLoadButtonClick = async () => {
  console.log(`Connection state: ${connection.state}`)
  items.value = [];
  itemsIcon.value = [];
  if (connection.state == HubConnectionState.Disconnected)
    await connection.start();
  Promise.all([
    connection.invoke("GetRemoteApplicationNames"),
    connection.invoke("GetIconBase64OfRemoteApplications")
  ]).then(([appNames, appIcons]) => {
    console.log(appNames, appIcons);
    items.value = appNames;
    itemsIcon.value = appIcons;
    loaded.value = true;
  }).catch(err => {
    console.error(err.toString());
    loaded.value = false;
  });
};

const rdpToApp = async () => {
  try {
    const result = await window.electronAPI.executeCommand(`xfreerdp /v:"hostname" /app:"${selectedAppName.value} /d:" /u:"user" /p:"password"`);
    console.log(result);
  } catch (error) {
    console.error(`错误: ${error}`);
  }
}

</script>

<template>
  <!--  <v-card-->
  <!--      class="mx-auto"-->
  <!--      max-width="300"-->
  <!--  >-->
  <!--    <v-text-field v-model="address" label="地址"></v-text-field>-->
  <!--  </v-card>-->
  <v-card
      class="mx-auto"
      max-width="300"
  >
    <v-btn @click="onLoadButtonClick">
      <div v-if="loaded">重新加载</div>
      <div v-else>点击加载</div>
    </v-btn>
    <v-list @click:select="value => selectedAppName = value.id">
      <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          color="primary"
          rounded="shaped"
      >
        <template v-slot:prepend>
          <v-img :width="32" :src="`data:image/png;base64,${itemsIcon[i]}`"/>
        </template>

        <v-list-item-title v-text="item"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-card>
  <v-btn @click="rdpToApp">
    连接 {{ selectedAppName }}
  </v-btn>
</template>

<style scoped>

</style>