jQuery(function($){
  var $list = $('#banner > li');
  if(!$list.length) return;
  var idx = 0, len = $list.length, timer;
  // ul#banner를 단일 슬롯으로 + li 5개를 같은 자리에 stack
  $('#banner').css({position:'relative',width:'100%',height:'112px',overflow:'hidden',padding:0,margin:0,listStyle:'none'});
  $list.css({position:'absolute',left:0,top:0,width:'100%',height:'100%',display:'block',opacity:0,margin:0,padding:0});
  $list.eq(0).css({opacity:1});
  function go(n){
    n = (n + len) % len;
    if(n === idx) return;
    $list.eq(idx).animate({opacity:0}, 400);
    $list.eq(n).css({opacity:0}).animate({opacity:1}, 400);
    idx = n;
  }
  function start(){ timer = setInterval(function(){ go(idx + 1); }, 4000); }
  function reset(){ clearInterval(timer); start(); }
  start();
  $(document).on('click', '.nav_left',  function(){ go(idx - 1); reset(); });
  $(document).on('click', '.nav_right', function(){ go(idx + 1); reset(); });
});