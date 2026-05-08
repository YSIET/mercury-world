jQuery(function ($) {
  var $list = $("#banner > li");
  if (!$list.length) return;
  var idx = 0,
    len = $list.length,
    timer;
  $list.hide().eq(0).show();
  function go(n) {
    n = (n + len) % len;
    $list.eq(idx).fadeOut(400);
    $list.eq(n).fadeIn(400);
    idx = n;
  }
  function start() {
    timer = setInterval(function () {
      go(idx + 1);
    }, 4000);
  }
  function reset() {
    clearInterval(timer);
    start();
  }
  start();
  $(document).on("click", ".nav_left", function () {
    go(idx - 1);
    reset();
  });
  $(document).on("click", ".nav_right", function () {
    go(idx + 1);
    reset();
  });
});
