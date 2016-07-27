export default function globlaErrorHandler(errorUrl, staticHost) {
  window.onerror = function(message, scriptUrl, line, column) {
    var regex = new RegExp("^https?://" + staticHost);
    if (regex.test(scriptUrl) && scriptUrl.indexOf('.js') > -1) {
      alert(line, column, message);
    }
  };
};