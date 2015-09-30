(function() {
  $(".favorite").on("click", function() {
    return $(this).toggleClass("starred");
  });

  $(".playButton").on("click", function() {
    return $(this).toggleClass("playing");
  });

  $(".slider .slide").on("click", function(e) {
    var $this, pos;
    $this = $(this);
    pos = (e.offsetX / $this.width()) * 100;
    console.log(pos.toFixed(0) + "%");
    return $this.find(".pos").width(pos + "%");
  });

  $(".volume .slide").on("click", function(e) {
    var $this, pos, roundPos;
    $this = $(this);
    pos = (e.offsetX / $this.width()) * 100;
    roundPos = Math.round(pos / 25) * 25;
    console.log(pos.toFixed(0) + "%, " + roundPos + "%");
    $this.find(".pos").width(roundPos + "%");
    if (roundPos > 50) {
      return $(".volume .icon i").removeClass().addClass("fa fa-volume-up");
    } else if (roundPos > 0) {
      return $(".volume .icon i").removeClass().addClass("fa fa-volume-down");
    } else {
      return $(".volume .icon i").removeClass().addClass("fa fa-volume-off");
    }
  });

  $(function() {
    return $(".list").perfectScrollbar();
  });

}).call(this);