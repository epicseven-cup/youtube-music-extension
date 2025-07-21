"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const socket_io_client_1 = require("socket.io-client");
const constant_1 = require("./constant");
function timestampToSeconds(timestamp) {
    const spTime = timestamp.split(":");
    // HH::MM::SS
    let scale = 1;
    let seconds = 0;
    for (let i = 0; i < spTime.length; i++) {
        seconds = seconds + (Number(spTime[spTime.length - i - 1]) * scale);
        scale = scale * 60;
    }
    return seconds;
}
class Client {
    constructor(port) {
        this.cssPaths = {
            imageSrc: "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.thumbnail-image-wrapper.style-scope.ytmusic-player-bar > img",
            startEndTime: "#left-controls > span",
            title: "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > yt-formatted-string",
            artist: "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > span > span.subtitle.style-scope.ytmusic-player-bar > yt-formatted-string > a:nth-child(1)",
            album: "#layout > ytmusic-player-bar > div.middle-controls.style-scope.ytmusic-player-bar > div.content-info-wrapper.style-scope.ytmusic-player-bar > span > span.subtitle.style-scope.ytmusic-player-bar > yt-formatted-string > a:nth-child(3)"
        };
        this.wsClient = (0, socket_io_client_1.io)(`ws://localhost:${port}`, { transports: ['websocket'] });
    }
    _prase(dom) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        const presence = {};
        if (dom == null) {
            return constant_1.DEFAULT;
        }
        presence.largeImageKey = (_b = (_a = dom.querySelector(this.cssPaths.imageSrc)) === null || _a === void 0 ? void 0 : _a.src) !== null && _b !== void 0 ? _b : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToCiwlnI6TZrNzwZbKcZ9XzgFZTcRNehA1BQ&s"; // fall back to youtube music icon
        presence.details = (_d = (_c = dom.querySelector(this.cssPaths.title)) === null || _c === void 0 ? void 0 : _c.innerHTML) !== null && _d !== void 0 ? _d : "--";
        presence.state = (_f = (_e = dom.querySelector(this.cssPaths.artist)) === null || _e === void 0 ? void 0 : _e.innerHTML) !== null && _f !== void 0 ? _f : "--";
        presence.largeImageText = (_h = (_g = dom.querySelector(this.cssPaths.album)) === null || _g === void 0 ? void 0 : _g.innerHTML) !== null && _h !== void 0 ? _h : "--";
        // parsing
        const time = ((_k = (_j = dom.querySelector(this.cssPaths.startEndTime)) === null || _j === void 0 ? void 0 : _j.innerHTML) !== null && _k !== void 0 ? _k : "").trim().split(/\s+\/\s+/);
        const currentMusicTime = time.length > 1 ? timestampToSeconds(time[0]) : 0;
        presence.startTimestamp = new Date(Date.now() - (currentMusicTime * 1000)).valueOf();
        return presence;
    }
    update(dom) {
        this.wsClient.emit("update", this._prase(dom));
    }
}
exports.Client = Client;
