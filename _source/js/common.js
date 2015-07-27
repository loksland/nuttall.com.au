

/* jshint ignore:start */



$(document).ready(function(){
	
	$('a.fullscreen').on('click', function(e){
		
		e.preventDefault();
		
		var pswpOptions = {};
		pswpOptions.index = 0;
		pswpOptions.showAnimationDuration = 0;		
		pswpOptions.hideAnimationDuration = 0;
		pswpOptions.bgOpacity = 1;
		pswpOptions.escKey = true;
		pswpOptions.history = false;
		
		var item = {};
		item.src = $(this).attr('href');
		// Dropped by picture_tag.rb
		item.w = Number($(this).find('picture').attr('data-src-w'));
		item.h = Number($(this).find('picture').attr('data-src-h'));
		//item.title = 'Here is the thing';
		item.msrc = $(this).find('source').last().attr('srcset');
		
		items = [item];
		var gallery = new PhotoSwipe(document.querySelectorAll('.pswp')[0], PhotoSwipeUI_Default, items, pswpOptions);
		gallery.init();
		
	});
	
});

/* jshint ignore:end */