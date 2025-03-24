<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from "axios"

const listing = ref()
const originData = ref()

const nativeGames = ref(0)
const nexusGames = ref(0)

const loadData = async () => {
  const nativeType = (await axios.get("/data/native.json")).data
  const nexusType = (await axios.get("/data/nexus.json")).data
  originData.value = nativeType.concat(nexusType).sort((a: any, b: any) => b.visits - a.visits)
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
          <a class="btn btn-light me-2" href="https://github.com/maji-git/roblox-vr-listing/wiki/Contributing-to-the-list">Contribute to the list</a>
          <a class="btn btn-outline-light" href="https://github.com/maji-git/roblox-vr-listing/wiki/Adding-VR-Support-to-your-game">Adding VR to your game</a>
        </div>
      </div>
    </div>

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
          </select>
        </div>
      </div>
    </div>
    -->

    <div class="d-flex flex-wrap justify-content-center">
      <a v-for="game in listing" :href="`https://www.roblox.com/games/${game.gameId}`" class="card m-2"
        style="width: 24rem;">
        <div class="card-body">
          <div :style="{ 'background-image': `url(https://assetdelivery.roblox.com/v1/asset/?id=${game.thumbnail})` }"
            alt="" class="rounded img-fluid mb-2 game-thumbnail"></div>

          <div>
            <span class="badge text-bg-success" v-if="game.vrType == 'native'">Native</span>
            <span class="badge text-bg-primary" v-if="game.vrType == 'nexus'">Nexus VR</span>
            <span class="badge text-bg-secondary ms-2">{{ game.genre }}</span>
          </div>

          <h3 class="card-title mb-0 mt-1">{{ game.name }}</h3>
          <div>
            <p class="mb-0">By {{ game.creator.name }}</p>
          </div>
          <div v-if="game.price" class="mt-1">
            <img src="/robux.svg" alt="R$" height="20">
            {{ game.price }}
          </div>
        </div>
      </a>
    </div>

    <div class="text-center mt-4 p-5">
      <p class="m-0">Made by maji!</p>
      <a href="https://himaji.xyz">himaji.xyz</a>
    </div>
  </div>
</template>