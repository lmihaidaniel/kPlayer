let browser = (function() {
    var nVer = navigator.appVersion,
      nAgt = navigator.userAgent,
      browserName = navigator.appName,
      fullVersion = '' + parseFloat(navigator.appVersion),
      majorVersion = parseInt(navigator.appVersion, 10),
      nameOffset,
      verOffset,
      ix;

    // EDGE
    if (browserName == "Netscape" && navigator.appVersion.indexOf('Trident') > -1) {
      browserName = "IE";
      var edge = nAgt.indexOf('Edge/');
      fullVersion = nAgt.substring(edge + 5, nAgt.indexOf('.', edge));
    }
    // MSIE 11
    else if ((navigator.appVersion.indexOf("Windows NT") !== -1) && (navigator.appVersion.indexOf("rv:11") !== -1)) {
      browserName = "IE";
      fullVersion = "11;";
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf("MSIE")) !== -1) {
      browserName = "IE";
      fullVersion = nAgt.substring(verOffset + 5);
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf("Chrome")) !== -1) {
      browserName = "Chrome";
      fullVersion = nAgt.substring(verOffset + 7);
    }
    // Safari
    else if ((verOffset = nAgt.indexOf("Safari")) !== -1) {
      browserName = "Safari";
      fullVersion = nAgt.substring(verOffset + 7);
      if ((verOffset = nAgt.indexOf("Version")) !== -1) {
        fullVersion = nAgt.substring(verOffset + 8);
      }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf("Firefox")) !== -1) {
      browserName = "Firefox";
      fullVersion = nAgt.substring(verOffset + 8);
    }
    // In most other browsers, "name/version" is at the end of userAgent
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
      browserName = nAgt.substring(nameOffset, verOffset);
      fullVersion = nAgt.substring(verOffset + 1);
      if (browserName.toLowerCase() == browserName.toUpperCase()) {
        browserName = navigator.appName;
      }
    }
    // Trim the fullVersion string at semicolon/space if present
    if ((ix = fullVersion.indexOf(";")) !== -1) {
      fullVersion = fullVersion.substring(0, ix);
    }
    if ((ix = fullVersion.indexOf(" ")) !== -1) {
      fullVersion = fullVersion.substring(0, ix);
    }
    // Get major version
    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
      fullVersion = '' + parseFloat(navigator.appVersion);
      majorVersion = parseInt(navigator.appVersion, 10);
    }
    // Return data
    return [browserName, majorVersion];
  })();
export default {
  browser: browser,
  isIE: (function() {
    if (browser[0] === 'IE') {
      return browser[1];
    }
    return false;
  })(),
  isFirefox: (function(){
    if (browser[0] === 'Firefox') {
      return browser[1];
    }
    return false;
  })(),
  isChrome: (function(){
    if (browser[0] === 'Chrome') {
      return browser[1];
    }
    return false;
  })(),
  isSafari: (function(){
    if (browser[0] === 'Safari') {
      return browser[1];
    }
    return false;
  })(),
  isTouch: 'ontouchstart' in document.documentElement,
  isIos: /(iPad|iPhone|iPod)/g.test(navigator.platform)
}