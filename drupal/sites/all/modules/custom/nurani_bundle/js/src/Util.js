/**
 * Corebox util library.
 */
function Util() {
}

// Globally available CB.Util
var util = new Util();

/**
 * Helper method, set informational messages which disappear after a set amount
 * of time.
 */
Util.prototype.setMessage = function (prepend_to, message, type, hide_after) {
  type       = type || 'ok';
  hide_after = hide_after || 3000;

  classes = ['messages'];
  if (type) {
    classes.push(type);
  }

  var message = $('<div class="' + classes.join(' ') + '" style="display: none;">' + message + '</div>');
  prepend_to.prepend(message);
  message.slideDown();

  setTimeout(function () {
    message.slideUp(function () {
      $(this).remove();
    });
  }, hide_after);
}
