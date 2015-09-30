(function($){
	// Settings
	var repeat = localStorage.repeat || 0,
		shuffle = localStorage.shuffle || 'false',
		continous = true,
		autoplay = true,
		playlist = [
		{
title: 'Dont You Worry Child',
artist: '<b>1</b>',
album: 'Beth',
cover:'file:///D:/xampps/htdocs/Media/audio/Mp3/img/DontYouWorryChild.png',
mp3: 'https://dn-mvp.qbox.me/DontYouWorryChild(CharmingHorsesRemix)-Beth.mp3'
},
{
title: 'Robin Schulz-Sugar',
artist: '<b>2</b>',
album: 'Sugar Robin Schulz',
cover: 'file:///D:/xampps/htdocs/Media/audio/Mp3/img/SugarRobin%20Schulz.png',
mp3: 'file:///D:/xampps/htdocs/Media/audio/Mp3/Sugar-Robin%20Schulz.mp3'
},
{
title: 'Deep Sounds Vol',
artist: '<b>3</b>',
album: 'Deep',
cover: 'file:///D:/xampps/htdocs/Media/audio/Mp3/img/Deep%20Sounds%20Vol.%205.png',
mp3: 'file:///D:/xampps/htdocs/Media/audio/Mp3/Deep%20Sounds%20Vol.mp3'
},
{
title: 'SummerMusic',
artist: '<b>4</b>',
album: 'Mix2015',
cover: 'file:///D:/xampps/htdocs/Media/audio/Mp3/img/SummerMusicMix2015.png',
mp3: 'file:///D:/xampps/htdocs/Media/audio/Mp3/SummerMusicMix2015.mp3'
},
{
title: 'Lost Frequencies feat',
artist: '<b>5</b>',
album: 'Lost Frequencies feat',
cover: 'file:///D:/xampps/htdocs/Media/audio/Mp3/img/RealityLost%20Frequencies.png',
mp3: 'file:///D:/xampps/htdocs/Media/audio/Mp3/Lost%20Frequencies%20feat.mp3'
},
{
title: 'The Best of Kygo',
artist: '<b>6</b>',
album: ' Kygo Mix',
cover: 'audiojs/images/3.gif',
mp3: 'file:///D:/xampps/htdocs/Media/audio/Mp3/TheBestofKygoMix.mp3'
},
{
title: 'VIVA ISCO THE BEST ',
artist: '<b>7</b>',
album: 'MIX',
cover: 'audiojs/images/4.gif',
mp3: 'file:///D:/xampps/htdocs/Media/audio/Mp3/VIVA%20DISCO%20THE%20BEST%20MIX.mp3'
},
{
title: 'The Runaround',
artist: '<b>8</b>',
album: 'Sharon Corr',
cover: 'file:///D:/xampps/htdocs/Media/audio/Mp3/img/the%20runaround.jpg',
mp3: 'file:///D:/xampps/htdocs/Media/audio/Mp3/Sharon%20Corr%20-%20The%20Runaround.mp3'
},
{
title: 'Cheerleader',
artist: '<b>9</b>',
album: 'Various Artists',
cover: 'file:///D:/xampps/htdocs/Media/audio/Mp3/img/Cheerleader%20(Felix%20Jaehn%20Remix%20Radio%20Edit).png',
mp3: 'file:///D:/xampps/htdocs/Media/audio/Mp3/Cheerleader-Various%20Artists.mp3'
},];

	// Load playlist
	for (var i=0; i<playlist.length; i++){
		var item = playlist[i];
		$('#playlist').append('<li>'+item.artist+' <i class="fa fa-angle-right"></i> '+item.title+'</li>');
	}

	var time = new Date(),
		currentTrack = shuffle === 'true' ? time.getTime() % playlist.length : 0,
		trigger = false,
		audio, timeout, isPlaying, playCounts;

	var play = function(){
		audio.play();
		$('.playback').addClass('playing');
		timeout = setInterval(updateProgress, 500);
		isPlaying = true;
	}

	var pause = function(){
		audio.pause();
		$('.playback').removeClass('playing');
		clearInterval(updateProgress);
		isPlaying = false;
	}

	// Update progress
	var setProgress = function(value){
		var currentSec = parseInt(value%60) < 10 ? '0' + parseInt(value%60) : parseInt(value%60),
			ratio = value / audio.duration * 100;

		$('.timer').html(parseInt(value/60)+':'+currentSec);
		$('.progress .pace').css('width', ratio + '%');
		$('.progress .slider a').css('left', ratio + '%');
	}

	var updateProgress = function(){
		setProgress(audio.currentTime);
	}

	// Progress slider
	$('.progress .slider').slider({step: 0.1, slide: function(event, ui){
		$(this).addClass('enable');
		setProgress(audio.duration * ui.value / 100);
		clearInterval(timeout);
	}, stop: function(event, ui){
		audio.currentTime = audio.duration * ui.value / 100;
		$(this).removeClass('enable');
		timeout = setInterval(updateProgress, 500);
	}});

	// Volume slider
	var setVolume = function(value){
		audio.volume = localStorage.volume = value;
		$('.volume .pace').css('width', value * 100 + '%');
		$('.volume .slider a').css('left', value * 100 + '%');
	}

	var volume = localStorage.volume || 0.5;
	$('.volume .slider').slider({max: 1, min: 0, step: 0.01, value: volume, slide: function(event, ui){
		setVolume(ui.value);
		$(this).addClass('enable');
		$('.mute').removeClass('enable');
	}, stop: function(){
		$(this).removeClass('enable');
	}}).children('.pace').css('width', volume * 100 + '%');

	$('.mute').click(function(){
		if ($(this).hasClass('enable')){
			setVolume($(this).data('volume'));
			$(this).removeClass('enable');
		} else {
			$(this).data('volume', audio.volume).addClass('enable');
			setVolume(0);
		}
	});

	// Switch track
	var switchTrack = function(i){
		if (i < 0){
			track = currentTrack = playlist.length - 1;
		} else if (i >= playlist.length){
			track = currentTrack = 0;
		} else {
			track = i;
		}

		$('audio').remove();
		loadMusic(track);
		if (isPlaying == true) play();
	}

	// Shuffle
	var shufflePlay = function(){
		var time = new Date(),
			lastTrack = currentTrack;
		currentTrack = time.getTime() % playlist.length;
		if (lastTrack == currentTrack) ++currentTrack;
		switchTrack(currentTrack);
	}

	// Fire when track ended
	var ended = function(){
		pause();
		audio.currentTime = 0;
		playCounts++;
		if (continous == true) isPlaying = true;
		if (repeat == 1){
			play();
		} else {
			if (shuffle === 'true'){
				shufflePlay();
			} else {
				if (repeat == 2){
					switchTrack(++currentTrack);
				} else {
					if (currentTrack < playlist.length) switchTrack(++currentTrack);
				}
			}
		}
	}

	var beforeLoad = function(){
		var endVal = this.seekable && this.seekable.length ? this.seekable.end(0) : 0;
		$('.progress .loaded').css('width', (100 / (this.duration || 1) * endVal) +'%');
	}

	// Fire when track loaded completely
	var afterLoad = function(){
		if (autoplay == true) play();
	}

	// Load track
	var loadMusic = function(i){
		var item = playlist[i],
			newaudio = $('<audio>').html('<source src="'+item.mp3+'">').appendTo('#player');
		
		$('.cover').html('<img src="'+item.cover+'" alt="'+item.album+'">');
		$('.tag').html('<strong>'+item.title+'</strong>');
		$('#playlist li').removeClass('playing').eq(i).addClass('playing');
		audio = newaudio[0];
		audio.volume = $('.mute').hasClass('enable') ? 0 : volume;
		audio.addEventListener('progress', beforeLoad, false);
		audio.addEventListener('durationchange', beforeLoad, false);
		audio.addEventListener('canplay', afterLoad, false);
		audio.addEventListener('ended', ended, false);
	}

	loadMusic(currentTrack);
	$('.playback').on('click', function(){
		if ($(this).hasClass('playing')){
			pause();
		} else {
			play();
		}
	});
	$('.rewind').on('click', function(){
		if (shuffle === 'true'){
			shufflePlay();
		} else {
			switchTrack(--currentTrack);
		}
	});
	$('.fastforward').on('click', function(){
		if (shuffle === 'true'){
			shufflePlay();
		} else {
			switchTrack(++currentTrack);
		}
	});
	$('#playlist li').each(function(i){
		var _i = i;
		$(this).on('click', function(){
			switchTrack(_i);
		});
	});

	if (shuffle === 'true') $('.shuffle').addClass('enable');
	if (repeat == 1){
		$('.repeat').addClass('once');
	} else if (repeat == 2){
		$('.repeat').addClass('all');
	}

	$('.repeat').on('click', function(){
		if ($(this).hasClass('once')){
			repeat = localStorage.repeat = 2;
			$(this).removeClass('once').addClass('all');
		} else if ($(this).hasClass('all')){
			repeat = localStorage.repeat = 0;
			$(this).removeClass('all');
		} else {
			repeat = localStorage.repeat = 1;
			$(this).addClass('once');
		}
	});

	$('.shuffle').on('click', function(){
		if ($(this).hasClass('enable')){
			shuffle = localStorage.shuffle = 'false';
			$(this).removeClass('enable');
		} else {
			shuffle = localStorage.shuffle = 'true';
			$(this).addClass('enable');
		}
	});
})(jQuery);
