let syncEvents = ["play", "pause", "timeupdate", "seeking"];
let waitEvents = ["stalled", "waiting", "suspend"];
export default class Synchronization {
  constructor(...medias) {
    let loadCount = 0;
    let total = medias.length;
    if (total < 2) return;
    let masterMedia = medias[0];
    let doSync = function() {
      // Iterate all events and trigger them on the medias to sync
      // whenever they occur on masterMedia
      syncEvents.forEach(function(event) {

        masterMedia.addEventListener(event, function() {

          // Avoid overkill events, trigger timeupdate manually
          if (event === "timeupdate") {
            if (!this.paused) return;
            for (let i = 1; i < total; i += 1) {
              medias[i].currentTime = this.currentTime;
            }
            return;
          }

          if (event === "seeking") {
            for (let i = 1; i < total; i += 1) {
              medias[i].currentTime = this.currentTime;
            }
          }

          if (event === "play" || event === "pause") {
            for (let i = 1; i < total; i += 1) {
              medias[i][event]();
            }
          }
        });
      });
    }

    // iterate all media sources
    for (let i = 1; i < total; i += 1) {
      let media = medias[i];
      media.sync = false;

      media.addEventListener('loadedmetadata', () => {
        if (media !== masterMedia) {
          media.currentTime = masterMedia.currentTime;
        }
      });

      waitEvents.forEach((event) => {
        media.addEventListener(event, function(){
            masterMedia.pause();
            this.pause();
            this.sync = false;
        });
      });

      // when each is ready... 
      media.addEventListener("canplaythrough", () => {
        // Once all items are loaded, sync events
        if (++loadCount == total) {
          doSync();
        }

        if (media !== masterMedia) {
          if (!masterMedia.paused && media.paused) {
            media.currentTime = masterMedia.currentTime;
            media.play();
          }
        }

      });
    }


    // With requestAnimationFrame, we can ensure that as 
    // frequently as the browser would allow, 
    // the medias is resync'ed.
    // currently not working on newest browsers
    function sync() {
      let readyState = 0;
      for (let i = 1; i < total; i += 1) {
        if (medias[i].readyState === 4) {
          readyState += 1;
        }
      }
      if (readyState === (total - 1)) {
        for (let i = 1; i < total; i += 1) {
          medias[i].currentTime = masterMedia.currentTime;
        }
      }
      requestAnimationFrame(sync);
    }

    //sync();

  }
}