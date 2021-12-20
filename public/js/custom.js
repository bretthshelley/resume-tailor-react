// --------------------------------------------------------
//	Slider Caption
// -------------------------------------------------------- 
$(document).ready(function() {
	$(".carousel-caption .rotate").textrotator({
		animation: "fade", // Text Rotator Fade Effect
		speed: 2000 // Text Rotator Fade Speed
	});
	
	$('.carousel').carousel({
		interval: 4000, // Carousel Slide Transition Time
		pause: 'hover' // Carousel slider pause on mouse hover
	})
	
    $("a[data-gal^='prettyPhoto']").prettyPhoto(); // Pretty Photo for Lightbox Image
});

// --------------------------------------------------------
//	Scroll Up
// -------------------------------------------------------- 	
$(window).scroll(function() {
	if ($(this).scrollTop() > 100) {
		$('.scroll-up').fadeIn();
	} else {
		$('.scroll-up').fadeOut();
	}
});

$('.scroll-up').click(function() {
	$("html, body").animate({
		scrollTop: 0
	}, 600);
	return false;
});
$('.text-logo').click(function() {
    $("html, body").animate({
        scrollTop: 0
    }, 600);
    return false;
});

// --------------------------------------------------------
//	Navigation Bar
// -------------------------------------------------------- 	
$(window).scroll(function(){	
	"use strict";	
	var scroll = $(window).scrollTop();
	if( scroll > 60 ){		
		$(".navbar").addClass("scroll-fixed-navbar");				
	} else {
		$(".navbar").removeClass("scroll-fixed-navbar");
	}
});

// --------------------------------------------------------
//	Smooth Scrolling
// -------------------------------------------------------- 	
$(".navbar-nav li a[href^='#']").on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({
        scrollTop: $(this.hash).offset().top
    }, 1000);
});

// --------------------------------------------------------
//	Control Spy to Track Menu Change
// -------------------------------------------------------- 	
$(document).ready(function(){
    $(".navigation-menu").scrollspy();
		
		var quotes = [ "Leadership is a potent combination of strategy and character. But if you must be without one, be without the strategy. ~ Norman Schwarzkopf",
									 "You miss 100 percent of the shots you don’t take ~ Wayne Gretzky",
									 "You are not your resume, you are your work. ~ Seth Godin",
									 "Far and away the best prize that life offers is the chance to work hard at work worth doing. ~ Theodore Roosevelt",
									 "Even if you are on the right track, You’ll get run over if you just sit there. ~ Will Rogers",
									 "You must either modify your dreams or magnify your skills. ~ Jim Rohn",
									 "Every accomplishment starts with a decision to try. ~ Unknown",
									 "A calm sea does not make a skilled sailor. ~ Unknown",
									 "It is not the strongest of the species that survive, nor the most intelligent, but the one most responsive to change. ~ Charles Darwin",
									 "Do or do not. There is no try. ~ Yoda",
									 "The only place success comes before work is in the dictionary. ~ Vidal Sassoon",
									 "There are only two ways to live your life. One is as though nothing is a miracle. The other is as though everything is a miracle. ~ Albert Einstein",
									 "I feel that luck is preparation meeting opportunity. ~ Oprah Winfrey",
									 "Option A is not available. So let’s kick the sh** out of option B. ~ Sheryl Sandberg",
									 "If we can learn to deal with our discomfort and just relax into it we'll have a better life. ~ Mellody Hobson",
									 "Aerodynamically the bumblebee shouldn’t be able to fly, but the bumblebee doesn’t know that so it goes on flying anyway. ~ Mary Kay Ash",
									 "We need to accept that we won’t always make the right decisions, that we’ll screw up royally sometimes -- understanding that failure is not the opposite of success, it’s part of success. ~ Ariana Huffington",
									 "Never doubt that a small group of thoughtful committed citizens can change the world. Indeed, it is the only thing that ever has. ~ Margaret Mead"
									];
									
			var index = Math.floor((quotes.length + 1) * Math.random());						
			$('#inspireQuote').text(quotes[index]);
		
});

// --------------------------------------------------------
//	Stats Counter+ Waypoints to know when to activate
// -------------------------------------------------------- 	
$('#stats').waypoint(function() {
 $('.list-title').each(function() {
        counter = $(this).attr('data-count'),
        $(this).find('span').delay(6000).countTo({
            from: 50,
            to: counter,
            speed: 3000,// Stats Counter Speed
            refreshInterval: 50,
        });
    });
 }, { offset: '50%', triggerOnce: true });
 
// --------------------------------------------------------
//	Skills Knob + Waypoints to know when to activate
// -------------------------------------------------------- 	
$('#skills').waypoint(function() {
	$('.knob').each(function () {
          var element = $(this);
          var perc = element.attr("value");  
          element.knob({ 
               'value': 0, 
                'min':0,
                'max':100,
                "skin":"tron",
                "readOnly":true,
				'fgColor': '#00a8d6', // Color of Skill Knobs
                "thickness":.1,// Thickness of Skill Knobs
				'dynamicDraw': true,
				'draw' : function () { $(this.i).val(this.cv + '%'); }
          });

		$({value: 0}).animate({ value: perc }, {
			duration: 3000,
			easing: 'swing',
			progress: function () {
			element.val(Math.ceil(this.value)).trigger('change')}
		});
	});
 }, { offset: '50%', triggerOnce: true });