import {Client} from "./client"


const youtubeMusicClient = new Client("5432");
youtubeMusicClient.update(document)

setInterval(() => {
    youtubeMusicClient.update(document)
}, 10e3)
