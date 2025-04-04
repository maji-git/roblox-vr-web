import axios from "axios"
import axiosRetry from 'axios-retry'
import fs from "fs"

axiosRetry(axios, { retries: 3, retryDelay: () => 5000 });

try { fs.mkdirSync("public/data") } catch {}

const gameTagIDs = {}

function chunkArray(arr, chunkSize = 100) {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }
    return result;
}

function arrayToUrlParams(name, values) {
    return values.map(value => `${encodeURIComponent(name)}=${encodeURIComponent(value)}`).join('&');
}

async function parseTagTXT(url, title) {
    const txt = (await axios.get(url)).data

    for (const l of txt.split("\n")) {
        if (l.startsWith("#") || l == "") {
            continue
        }

        gameTagIDs[l] = title
    }
}

async function parseTXT(url, title) {
    const txt = (await axios.get(url)).data
    const result = []
    const idData = []

    for (const l of txt.split("\n")) {
        if (l.startsWith("#") || l == "") {
            continue
        }

        const universeId = (await axios.get(`https://apis.roblox.com/universes/v1/places/${l}/universe`)).data.universeId

        idData.push({
            gameId: l,
            universeId: universeId
        })
        
        console.log(l)
    }

    const chunked = chunkArray(idData, 90)

    for (const c of chunked) {
        let placeIdParam = ""
        let universeIds = []

        for (const idd of c) {
            const gameId = idd.gameId
            const universeId = idd.universeId

            universeIds.push(universeId)
        }

        placeIdParam = arrayToUrlParams("universeIds", universeIds)

        const gameDatas = (await axios.get(`https://games.roblox.com/v1/games?${placeIdParam}`)).data.data
        const thumbnailDatas = (await axios.get(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds.join(",")}&countPerUniverse=1&defaults=true&size=768x432&format=Png&isCircular=false`)).data.data
        let i = 0

        for (const gameData of gameDatas) {
            const thumb = thumbnailDatas.find((e) => e.universeId == gameData.id)
            result.push({
                gameId: gameData.rootPlaceId,
                universeId: gameData.id,
                name: gameData.name,
                price: gameData.price,
                creator: gameData.creator,
                maxPlayers: gameData.maxPlayers,
                genre: gameData.genre_l1,
                thumbnail: thumb?.thumbnails[0]?.targetId,
                thumbURL: thumb?.thumbnails[0]?.imageUrl,
                created: gameData.created,
                visits: gameData.visits,
                favorites: gameData.favoritedCount,
                vrType: title,
                vrTag: gameTagIDs[gameData.rootPlaceId] ?? undefined
            })
            i++
        }
    }



    fs.writeFileSync(`public/data/${title}.json`, JSON.stringify(result))
}

async function main() {
    parseTagTXT("https://raw.githubusercontent.com/maji-git/roblox-vr-listing/main/tags/exclusive.txt", "exclusive")
    parseTagTXT("https://raw.githubusercontent.com/maji-git/roblox-vr-listing/main/tags/god-like.txt", "god-like")

    parseTXT("https://raw.githubusercontent.com/maji-git/roblox-vr-listing/main/native.txt", "native")
    parseTXT("https://raw.githubusercontent.com/maji-git/roblox-vr-listing/main/nexus-vr.txt", "nexus")
    parseTXT("https://raw.githubusercontent.com/maji-git/roblox-vr-listing/main/avatar-gestures.txt", "avatar-gestures")
}

main()