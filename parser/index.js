import axios from "axios"
import axiosRetry from 'axios-retry'
import fs from "fs"
import dotenv from "dotenv"

dotenv.config()
axiosRetry(axios, { retries: 5, retryDelay: () => 50000 });

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
    const ids = []

    for (const l of txt.split("\n")) {
        if (l.startsWith("#") || l == "") {
            continue
        }

        ids.push(l)

        gameTagIDs[l] = title
    }

    fs.writeFileSync(`public/data/tag-${title}.json`, JSON.stringify(ids))
}

async function parseTXT(url, title) {
    const txt = (await axios.get(url)).data
    const result = []
    const idData = []
    const gameIDData = []

    for (const l of txt.split("\n")) {
        if (l.startsWith("#") || l == "") {
            continue
        }

        gameIDData.push(l)
    }

    const gameIDChunked = chunkArray(gameIDData, 50)

    for (const placeIds of gameIDChunked) {
        let placeIdParam = ""

        placeIdParam = arrayToUrlParams("placeIds", placeIds)

        const gameDatas = (await axios.get(`https://games.roblox.com/v1/games/multiget-place-details?${placeIdParam}`, {
            headers: {
                "Cookie": `.ROBLOSECURITY=${process.env.ROBLOX_KEY}`
            }
        })).data

        for (const d of gameDatas) {
            idData.push({
                gameId: placeIds,
                universeId: d.universeId
            })
        }
    }

    const chunked = chunkArray(idData, 50)

    for (const c of chunked) {
        let placeIdParam = ""
        let universeIds = []

        for (const idd of c) {
            const universeId = idd.universeId

            universeIds.push(universeId)
        }

        placeIdParam = arrayToUrlParams("universeIds", universeIds)

        const gameDatas = (await axios.get(`https://games.roblox.com/v1/games?${placeIdParam}`)).data.data
        const thumbnailDatas = (await axios.get(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds.join(",")}&countPerUniverse=2&defaults=false&size=768x432&format=Png&isCircular=false`)).data.data
        let i = 0

        for (const gameData of gameDatas) {
            const thumb = thumbnailDatas.find((e) => e.universeId == gameData.id)
            let thumbURL = ""

            if (thumb && thumb.thumbnails) {
                thumbURL = thumb.thumbnails[0].imageUrl
            }
            
            result.push({
                gameId: gameData.rootPlaceId,
                universeId: gameData.id,
                name: gameData.name,
                price: gameData.price,
                creator: gameData.creator,
                genre: gameData.genre_l1,
                thumbURL,
                created: gameData.created,
                visits: gameData.visits,
                playing: gameData.playing,
                favorites: gameData.favoritedCount,
                vrType: title,
                vrTag: gameTagIDs[gameData.rootPlaceId] ?? undefined
            })
            i++
        }
    }

    // Sort result based on visits
    const sortedResults = result.sort((a, b) => b.visits - a.visits)

    fs.writeFileSync(`public/data/${title}.json`, JSON.stringify(sortedResults))
    fs.writeFileSync(`public/data/${title}-ids.json`, JSON.stringify(gameIDData))
}

async function main() {
    parseTagTXT("https://raw.githubusercontent.com/maji-git/roblox-vr-listing/main/tags/exclusive.txt", "exclusive")
    parseTagTXT("https://raw.githubusercontent.com/maji-git/roblox-vr-listing/main/tags/god-like.txt", "god-like")

    parseTXT("https://raw.githubusercontent.com/maji-git/roblox-vr-listing/main/native.txt", "native")
    parseTXT("https://raw.githubusercontent.com/maji-git/roblox-vr-listing/main/nexus-vr.txt", "nexus")
    parseTXT("https://raw.githubusercontent.com/maji-git/roblox-vr-listing/main/avatar-gestures.txt", "avatar-gestures")
}

main()