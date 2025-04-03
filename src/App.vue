<script setup lang="ts">
import GameCard from './components/GameCard.vue';
import { onMounted, ref } from 'vue';
import axios from "axios"
import { IconCardboards, IconCheck, IconExternalLink, IconPlus, IconSparkles, IconYoga } from "@tabler/icons-vue"

const listing = ref()
const originData = ref()

const nativeGames = ref(0)
const nexusGames = ref(0)

const loadData = async () => {
  const nativeType = (await axios.get("/data/native.json")).data
  const nexusType = (await axios.get("/data/nexus.json")).data
  const avatarGesturesType = (await axios.get("/data/avatar-gestures.json")).data
  originData.value = nativeType.concat(nexusType).concat(avatarGesturesType).sort((a: any, b: any) => b.visits - a.visits)
  listing.value = originData.value

  nativeGames.value = originData.value.filter((e: any) => e.vrType == "native").length
  nexusGames.value = originData.value.filter((e: any) => e.vrType == "nexus").length
}

// https://assetdelivery.roblox.com/v1/asset/?id=15330287933
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="container">
    <div class="w-100 p-4 banner">
      <div class="text-center">
        <h1>Roblox VR Games Listing</h1>
        <p class="mb-0">List of Roblox VR games I found. Feel free to contribute! ^_^</p>
        <p v-if="originData" class="m-0">{{ nativeGames }} native games, and {{ nexusGames }} games with NexusVR.</p>
        <div class="column mt-3">
          <a class="btn btn-light me-2"
            href="https://github.com/maji-git/roblox-vr-listing/wiki/Contributing-to-the-list"><IconPlus :size="18"/> Contribute to the list</a>
          <a class="btn btn-outline-light"
            href="https://github.com/maji-git/roblox-vr-listing/wiki/Adding-VR-Support-to-your-game"><IconExternalLink :size="18"/> Adding VR to your game</a>
        </div>
      </div>
    </div>

    <!--
    <div class="text-center mb-2 mt-2">
      <h3>Supported Types</h3>
      <div class="row">
        <div class="col-md-4">
          <h4>Native</h4>
          <p>Games with Roblox VR supported out of the box, including VR originals, god-like, and custom VR implementation.</p>
        </div>
        <div class="col-md-4">
          <h4>Nexus VR</h4>
          <p>Game with VR support through Nexus VR, an open-source VR system developed by TheNexusAvenger. Which allow you to animate your body in VR.</p>
        </div>
        <div class="col-md-4">
          <h4>Avatar Gestures</h4>
          <p>Game that uses Roblox's AvatarGestures API. Which allow you to animate your body in VR.</p>
        </div>
      </div>
    </div>
    -->

    <!--
    <div class="row mb-2 justify-content-center">
      <div class="col-md-10">
        <input type="text" class="form-control" name="" id="" aria-describedby="helpId" placeholder="Search..." />
      </div>
      <div class="col-md-2">
        <div class="dropdown">
          <select class="btn btn-secondary form-control" type="button"
            aria-expanded="false">
            <option value="all">All</option>
            <option value="native">Native</option>
            <option value="nexus">Nexus VR</option>
            <option value="avatar-gestures">Avatar Gestures</option>
          </select>
        </div>
      </div>
    </div>
    -->

    <div class="d-flex flex-wrap justify-content-center">
      <GameCard v-for="g in listing" :game="g"></GameCard>
    </div>

    <div class="text-center mt-4 p-5">
      <p class="m-0">Made by maji!</p>
      <a href="https://himaji.xyz">himaji.xyz</a>
    </div>
  </div>
</template>