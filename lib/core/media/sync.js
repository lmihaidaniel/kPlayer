let events = "play pause timeupdate seeking".split(/\s+/g);
export default Sync {
  constructor(...medias) {
    let loadCount = 0;
    let total = medias.length;
    // iterate both media sources
    medias.forEach(function(media) {

      // when each is ready... 
      media.on("canplaythrough", function() {
        // trigger a custom "sync" event
        this.emit("sync");
      });

      media.on("sync", function() {

        // Once both items are loaded, sync events
        if (++loadCount == total) {

          // Iterate all events and trigger them on the video B
          // whenever they occur on the video A
          events.forEach(function(event) {

            veddd.a.on(event, function() {

              // Avoid overkill events, trigger timeupdate manually
              if (event === "timeupdate") {

                if (!this.media.paused) {
                  return;
                }
                medias[1].emit("timeupdate");

                return;
              }

              if (event === "seeking") {
                medias[1].currentTime(this.currentTime());
              }

              if (event === "play" || event === "pause") {
                medias[1][event]();
              }
            });
          });
        }
      });
    });

    // With requestAnimationFrame, we can ensure that as 
    // frequently as the browser would allow, 
    // the video is resync'ed.
    function sync() {
      if (medias[1].media.readyState === 4) {
        medias[1].currentTime(
          medias[0].currentTime()
        );
      }
      requestAnimationFrame(sync);
    }

    sync();

  }
}