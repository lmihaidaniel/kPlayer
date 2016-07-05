export function mimeAudio(media, type) {
    switch (type) {
        case 'audio/mp4':
            return !!(media.canPlayType && media.canPlayType('audio/mp4; codecs="mp4a.40.5"').replace(/no/, ''));
        case 'audio/mpeg':
            return !!(media.canPlayType && media.canPlayType('audio/mpeg;').replace(/no/, ''));
        case 'audio/ogg':
            return !!(media.canPlayType && media.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
        case 'audio/wav':
            return !!(media.canPlayType && media.canPlayType('audio/wav; codecs="1"').replace(/no/, ''));
    }
}

export function mimeVideo(media, type) {
    switch (type) {
        case 'video/webm':
            return !!(media.canPlayType && media.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, ''));
        case 'video/mp4':
            return !!(media.canPlayType && media.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, ''));
        case 'video/ogg':
            return !!(media.canPlayType && media.canPlayType('video/ogg; codecs="theora"').replace(/no/, ''));
    }
}

export default {}