<template>
    <a :href="`https://www.roblox.com/games/${game.gameId}`" class="card m-2"
        style="width: 24rem;">
        <div class="card-body">
            <div :style="{ 'background-image': `url(https://assetdelivery.roblox.com/v1/asset/?id=${game.thumbnail})` }"
                alt="" class="rounded img-fluid mb-2 game-thumbnail"></div>

            <div>
                <span class="badge text-bg-success" v-if="game.vrType == 'native'">
                    <IconCheck /> Native
                </span>
                <span class="badge text-bg-primary" v-if="game.vrType == 'nexus'">
                    <IconCardboards /> Nexus VR
                </span>
                <span class="badge text-bg-light" v-if="game.vrType == 'avatar-gestures'">
                    <IconYoga /> Avatar Gestures
                </span>

                <span class="badge text-bg-danger ms-2" v-if="game.vrTag == 'god-like'">God-like</span>
                <span class="badge text-bg-warning ms-2" v-if="game.vrTag == 'exclusive'">
                    <IconSparkles /> Exclusive
                </span>

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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IconCardboards, IconCheck, IconSparkles, IconYoga } from "@tabler/icons-vue"

const props = defineProps(['game']);
const game = ref(props.game);
</script>