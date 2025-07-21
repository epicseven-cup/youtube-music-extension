import {Presence} from "discord-rpc";
import { DEFAULT } from "./constant";
import {io, Socket} from "socket.io-client";


function timestampToSeconds(timestamp: string): number {
    const spTime = timestamp.split(":")
    // HH::MM::SS
    let scale: number = 1
    let seconds = 0
    for (let i = 0; i < spTime.length; i++) {
        seconds = seconds + (Number(spTime[spTime.length - i - 1]) * scale)
        scale = scale * 60
    }
    return seconds
}



export class Client {
    cssPaths = {
        imageSrc: "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.thumbnail-image-wrapper.style-scope.ytmusic-player-bar > img",
        startEndTime: "#left-controls > span",
        title: "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > yt-formatted-string",
        artist: "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > span > span.subtitle.style-scope.ytmusic-player-bar > yt-formatted-string > a:nth-child(1)",
        album: "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > span > span.subtitle.style-scope.ytmusic-player-bar > yt-formatted-string > a:nth-child(3)"
    }
    private wsClient: Socket;

    constructor(port:string) {
        this.wsClient = io(`ws://localhost:${port}`, {transports: ['websocket']})
    }

    _prase(dom: Document): Presence {
        const presence: Presence = {}
        if (dom == null) {
            return DEFAULT
        }
        presence.largeImageKey = (dom.querySelector(this.cssPaths.imageSrc) as HTMLImageElement)?.src ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToCiwlnI6TZrNzwZbKcZ9XzgFZTcRNehA1BQ&s"; // fall back to youtube music icon
        presence.details = dom.querySelector(this.cssPaths.title)?.innerHTML ?? "--";
        presence.state = dom.querySelector(this.cssPaths.artist)?.innerHTML ?? "--";
        presence.largeImageText = dom.querySelector(this.cssPaths.album)?.innerHTML ?? "--";

        // parsing
        const time = (dom.querySelector(this.cssPaths.startEndTime)?.innerHTML ?? "").trim().split(/\s+\/\s+/);
        const currentMusicTime = time.length > 1 ? timestampToSeconds(time[0]) : 0;
        presence.startTimestamp = new Date(Date.now() - (currentMusicTime * 1000)).valueOf();

        return presence;
    }

    update(dom: Document) {
	this.wsClient.emit("update", this._prase(dom))
    }
}
