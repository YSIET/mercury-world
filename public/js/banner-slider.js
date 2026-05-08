jQuery(function($){
  var $list = $('#banner > li');
  if(!$list.length) return;
  var idx = 0, len = $list.length, timer;
  // 모두 숨기고 첫 장만 명시적 inline-block
  $list.css('display','none');
  $list.eq(0).css({'display':'inline-block','opacity':1});
  function go(n){
    n = (n + len) % len;
    if(n === idx) return;
    var $cur = $list.eq(idx);
    var $nxt = $list.eq(n);
    $cur.fadeOut(400, function(){ $(this).css('display','none'); });
    $nxt.css({'display':'inline-block','opacity':0}).animate({opacity:1}, 400);
    idx = n;
  }
  function start(){ timer = setInterval(function(){ go(idx + 1); }, 4000); }
  function reset(){ clearInterval(timer); start(); }
  start();
  $(document).on('click', '.nav_left',  function(){ go(idx - 1); reset(); });
  $(document).on('click', '.nav_right', function(){ go(idx + 1); reset(); });
});