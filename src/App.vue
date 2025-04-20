<script setup lang="ts">
import GameCard from './components/GameCard.vue';
import { onMounted, ref } from 'vue';
import axios from "axios"
import { IconBrandDiscord, IconBrandGithub, IconBrandReddit, IconExternalLink, IconPlus } from "@tabler/icons-vue"

const listing = ref()
const originData = ref()

const nativeGames = ref(0)
const nexusGames = ref(0)
const totalGames = ref(0)

const filterVRType = ref("all")
const filterSortBy = ref("playing")
const filterGenre = ref("all")
const genreList = ref()

const reloadList = () => {
  listing.value = originData.value.sort((a: any, b: any) => b[filterSortBy.value] - a[filterSortBy.value])

  if (filterVRType.value != "all") {
    listing.value = listing.value.filter((e: any) => e.vrType == filterVRType.value)
  }
  if (filterGenre.value != "all") {
    listing.value = listing.value.filter((e: any) => e.genre == filterGenre.value)
  }
}

const loadData = async () => {
  const nativeType = (await axios.get("/data/native.json")).data
  const nexusType = (await axios.get("/data/nexus.json")).data
  const avatarGesturesType = (await axios.get("/data/avatar-gestures.json")).data
  originData.value = nativeType.concat(nexusType).concat(avatarGesturesType)

  nativeGames.value = originData.value.filter((e: any) => e.vrType == "native").length
  nexusGames.value = originData.value.filter((e: any) => e.vrType == "nexus").length

  totalGames.value = originData.value.length
  genreList.value = []

  for (const game of originData.value) {
    if (game.genre == "") {
      continue
    }
    if (!genreList.value.includes(game.genre)) {
      genreList.value.push(game.genre)
    }
  }

  reloadList()
}

// https://assetdelivery.roblox.com/v1/asset/?id=15330287933
onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="container">
    <div class="w-100 banner">
      <div>
        <h1>Roblox VR Games Listing</h1>
        <p class="mb-0">List of Roblox VR games I found. Feel free to contribute! ^_^</p>
        <p v-if="originData" class="m-0">{{ nativeGames }} native games, and {{ nexusGames }} games with NexusVR.</p>
        <div class="column mt-3">
          <a class="btn btn-light me-2"
            href="https://github.com/maji-git/roblox-vr-listing/wiki/Contributing-to-the-list"><IconPlus :size="18"/> Contribute to the list</a>
          <a class="btn btn-outline-light me-2"
            href="https://github.com/maji-git/roblox-vr-listing/wiki/Adding-VR-Support-to-your-game"><IconExternalLink :size="18"/> Adding VR to your game</a>
          <a class="btn"
            href="https://discord.gg/8hKfDq2bRC" target="_blank"><IconBrandDiscord :size="18"/></a>
          <a class="btn"
            href="https://www.reddit.com/r/RobloxVR/" target="_blank"><IconBrandReddit :size="18"/></a>
        </div>

        <div class="stats">
          <div>
            <p class="sub">NATIVE</p>
            <h1 class="num">{{ nativeGames }}</h1>
          </div>
          <div>
            <p class="sub">NEXUS</p>
            <h1 class="num">{{ nexusGames }}</h1>
          </div>
          <div>
            <p class="sub">TOTAL</p>
            <h1 class="num">{{ totalGames }}</h1>
          </div>
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
    
    <div class="row mb-2 justify-content-center">
      <!--
      <div class="col-md-10">
        <input type="text" class="form-control" name="" id="" aria-describedby="helpId" placeholder="Search..." />
      </div>
      -->
      <div class="col-md-2">
        <p class="filter-label">VR type</p>
        <div class="dropdown">
          <select class="btn btn-secondary form-control" type="button"
            aria-expanded="false" @change="reloadList" v-model="filterVRType">
            <option value="all">All</option>
            <option value="native">Native</option>
            <option value="nexus">Nexus VR</option>
            <option value="avatar-gestures">Avatar Gestures</option>
          </select>
        </div>
      </div>

      <div class="col-md-2">
        <p class="filter-label">Genre</p>
        <div class="dropdown">
          <select class="btn btn-secondary form-control" type="button"
            aria-expanded="false" @change="reloadList" v-model="filterGenre">
            <option value="all">All</option>
            <option v-for="g in genreList" :value="g">{{ g }}</option>
          </select>
        </div>
      </div>
      
      <div class="col-md-2">
        <p class="filter-label">Sort by</p>
        <div class="dropdown">
          <select class="btn btn-secondary form-control" type="button"
            aria-expanded="false" @change="reloadList" v-model="filterSortBy">
            <option value="playing">Activity</option>
            <option value="visits">Visits</option>
            <option value="favorites">Favorites</option>
          </select>
        </div>
      </div>
    </div>

    <div class="d-flex flex-wrap justify-content-center">
      <GameCard v-for="g in listing" :key="g.gameId" :game="g"></GameCard>
    </div>

    <div class="text-center mt-4 p-5">
      <p class="m-0">Made by maji!</p>
      <a href="https://himaji.xyz">himaji.xyz</a>
      <p class="m-0 text-muted">Activity is recorded when the site updates, and may be inaccurate</p>
    </div>
  </div>
</template>