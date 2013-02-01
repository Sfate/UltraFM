var RadioPlayer = {
  track: {
    artist : document.getElementsByClassName("artist")[0],
    song   : document.getElementsByClassName("title")[0],
    cover  : document.getElementsByClassName("cover")[0]
  },
  buttons: {
    play   : document.getElementsByClassName("play")[0],
    stop   : document.getElementsByClassName("stop")[0],
    vk     : document.getElementsByClassName("vk")[0],
    lastfm : document.getElementsByClassName("lastfm")[0],
    github : document.getElementsByClassName("github")[0]
  },
  refreshInfoId : null,
  background    : null,
  actions       : null,
  player        : null,
  streamUrl     : 'http://94.25.53.133/ultra-128.mp3',

  init: function(){
    this.background = chrome.extension.getBackgroundPage();
    this.actions    = chrome.browserAction;
    this.player     = this.background.document.getElementById('player');

    this.initStateInfo();
    this.initButtons();
    this.setClass();
  },
  initStateInfo: function() {
    document.querySelector('.state a').onclick = function() {
      var info = document.querySelector('.info');
      if (info.style.display == "block") {
        info.style.display = "none";
        document.body.style.height = "";
        document.body.focus();
      } else {
        info.style.display = "block";
        document.body.style.height = document.body.scrollHeight + "px";
      }
    };
  },
  initButtons: function () {
    this.buttons.play.onclick = function(e) {
    	e.preventDefault();
      RadioPlayer.changeState('play');
    };

    this.buttons.stop.onclick = function() {
      RadioPlayer.toggleButton(this);
      RadioPlayer.changeState('stop');
    };

    this.buttons.vk.onclick     = function () { RadioPlayer.toggleButton(this); return false; };
    this.buttons.lastfm.onclick = function () { RadioPlayer.toggleButton(this); return false; };
    this.buttons.github.onclick = function () { RadioPlayer.toggleButton(this); return false; };
  },
  toggleButton: function (self) {
    self.classList.add('pressed');
    setTimeout(function() { 
      self.classList.remove('pressed');
      if (self.parentNode.href) {
        window.open(self.parentNode.href,'_newtab');
      }
    }, 100);
  },
  play: function() {
    this.player.play();
    this.background.Player.start();
  },
  pause: function() {
    this.player.pause();
    this.background.Player.stop();
  },
  changeState: function(action) {
    if (this.player.paused && action == 'play') {
      this.play();
    } else {
      this.pause();
    }
    this.setClass();
  },
  setClass: function() {
    if(this.player.paused){
      this.buttons.play.classList.remove('pressed');
      clearInterval(this.refreshInfoId);
      this.refreshInfo();
    } else {
      this.refreshInfoId = setInterval(function(){RadioPlayer.refreshInfo()},1000);
      this.buttons.play.classList.add('pressed');
    }
  },
  refreshInfo: function () {
    if(this.player.paused){
      this.track.artist.innerText = "UltraFM";
      this.track.song.innerText   = "stopped";
      this.track.cover.style.backgroundImage = 'url(/images/icon_128.png)';
      this.buttons.vk.parentNode.removeAttribute('href');
      this.buttons.lastfm.parentNode.removeAttribute('href');
    } else {
      var currentTrack = this.background.Player.currentTrack;
      if (currentTrack) {
        this.track.artist.innerText = currentTrack.artist;
        this.track.song.innerText   = currentTrack.song;
        this.track.cover.style.backgroundImage = 'url('+this.background.Player.cover()+')';
        this.buttons.vk.parentNode.setAttribute('href', currentTrack.links.vk);
        this.buttons.lastfm.parentNode.setAttribute('href', currentTrack.links.lastfm);
      }
    }
  }
};
RadioPlayer.init();
