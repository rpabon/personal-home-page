$(window).load(function(){
	
    //position track variables
    var position_megaman    = -72;
    var position_floor      = 0;
    var position_hills      = 0;
    var position_mountains  = 0;
    var position_clouds     = 0;
	
    //scene track variables
    var landing;
    var running;
    var standing;
    
    //background images tracking
    var track_floor;
    var track_hills;
    var track_mountains;
    var track_clouds;
	
    //cached selectors
    //var underscore = $(".underscore");
    var megaman      = $("#megaman");
    var grab_him     = $("#grab_him");
    var floor        = $("#floor");
    var hills        = $("#hills");
    var mountains    = $("#mountains");
    var clouds       = $("#clouds");
    var project      = $("#project");
    var profile      = $("#profile");
	
    //tooltip objects
    var project_tooltip = {
        position: {
            my: "top center",
            at: "bottom center"
        },
        style: {
            classes: "ui-tooltip-cluetip ui-tooltip-rounded ui-tooltip-shadow"
        },
        content: "Academic project done for Technicolor in Hannover using BackboneJS, RequireJS, LessCSS and CouchDB."
    };
	
    var profile_tooltip = {
        position: {
            my: "top center",
            at: "bottom center"
        },
        style: {
            classes: "ui-tooltip-cluetip ui-tooltip-rounded ui-tooltip-shadow"
        },
        content: "Check out my profile in LinkedIn."
    };
	
    //Blinking underscore
    /* 	function blink(selector){
		$(selector).fadeOut(300, function(){
			$(this).fadeIn(300, function(){
				blink(this);
			});
		});
	}
	
	blink(underscore); */
    
    var grass = 33; //height of the grass floor
    var fall = $(window).height() - megaman.height() - floor.height() + grass;
	
				
    var onHover = function(){
        ////console.log("enter");
        megaman.trigger("scene_standing");
    };
	
    var outHover = function(){
        ////console.log("leave");
        megaman.trigger("scene_running");
    };
			
    $("#project, #profile").hoverIntent(onHover, outHover);
	
    project
        .qtip(project_tooltip)
        .mouseup(function(){
            window.location = "./ManualAnnotation";
			//window.location = "#";
        });
	
    profile
        .qtip(profile_tooltip)
        .mouseup(function(){
            window.location = "http://de.linkedin.com/in/rpabon257";
        });

    megaman
        .animate({top: fall + "px"}, 800, "easeInQuint", function(){

            $(window).resize(function(){
                megaman.css("top", $(window).height() - megaman.height() - floor.height() + grass);
                grab_him
                    .position({
                        my: "bottom",
                        at: "top",
                        of: megaman
                    });
            });
            
            grab_him
                .fadeIn(500)
                .position({
                    my: "bottom",
                    at: "top",
                    of: megaman
                });
            
            var scene_landing = function() {
                //console.log("loop: ", typeof landing);
                megaman.css("background-position", position_megaman + "px 0px");
                position_megaman -= 72;

                var landing = setTimeout(scene_landing, 150);
                if(position_megaman < -360) {
                    clearTimeout(landing);
                    megaman.trigger("scene_running");
                }
            };
            scene_landing();
        })
				
    .draggable({
        revert: true,
        revertDuration: 1100,
        cursor: "url('./img/cursor_grab_closed.png') 23 23, auto", //23px 23px to center the image relative to the cursor
        helper: function(){
            var helper = $("<div>")
                .width(75)
                .height(89)
                .css({
                    background: "transparent url('./img/sprites.png') 0 -215px", 
                    zIndex: "-20"
                })
                .appendTo("body");
            return helper;
        },
        start: function(){
            grab_him.fadeOut(500);
            megaman.hide().trigger("scene_standing");
            $("#project, #profile").off("mouseenter mouseleave");
        },
        drag: function(e, ui){
            grab_him.hide();
            ui.originalPosition.left = ui.position.left;
        },
        stop: function(e, ui){
            megaman
                .show()
                .css("left", ui.position.left)
                .trigger("scene_running");
                
            grab_him
                .fadeIn(500)
                .position({
                    my: "bottom",
                    at: "top",
                    of: megaman
                });
				
            $("#project, #profile").hoverIntent(onHover, outHover);
            project.qtip(project_tooltip);				
            profile.qtip(profile_tooltip);
        }
    })
		
    .mouseover(function(){
        megaman.css("cursor", "url('./img/cursor_grab_open.png') 23 23, auto");
    })
		
    .mousedown(function(){
        megaman.css("cursor", "url('./img/cursor_grab_closed.png') 23 23, auto");
    })
		
    .mouseenter(function(){
        grab_him.fadeOut(500);
    })
		
    .mouseleave(function(){
        grab_him.fadeIn(500);
    })
    
		
    .on("scene_running", function(){

        //stop all running scenes
        clearTimeout(running);
        clearTimeout(standing);
        
        position_megaman = 0;
        var scene_running = function() {
            megaman.css("background-position", position_megaman + "px -72px");
            position_megaman -= 72;
          
            running = setTimeout(scene_running, 125);
            if(position_megaman < -216) {
               position_megaman = 0;
            }
        };
        scene_running();
			
//        scene_floor = setInterval(function(){
//            floor.css("background-position", position_floor + "px 0px");
//            position_floor -= 1;
//        }, 10);
        
        var scene_floor = function() {
            floor.css("background-position", position_floor + "px 0px");
            position_floor -= 1;
          
            track_floor = setTimeout(scene_floor, 10);
        };
        scene_floor();
			
//        scene_hills = setInterval(function(){
//            hills.css("background-position", position_hills + "px 0px");
//            position_hills -= 1;
//        }, 20);
        
        var scene_hills = function() {
            hills.css("background-position", position_hills + "px 0px");
            position_hills -= 1;
          
            track_hills = setTimeout(scene_hills, 20);
        };
        scene_hills();

//        scene_mountains = setInterval(function(){
//            mountains.css("background-position", position_mountains + "px 0px");
//            position_mountains -= 0.5;
//        }, 30);

        var scene_mountains = function() {
            mountains.css("background-position", position_mountains + "px 0px");
            position_mountains -= 0.5;
          
            track_mountains = setTimeout(scene_mountains, 30);
        };
        scene_mountains();

//        scene_clouds = setInterval(function(){
//            clouds.css("background-position", position_clouds + "px 0px");
//            position_clouds -= 0.5;
//        }, 50);

        var scene_clouds = function() {
            clouds.css("background-position", position_clouds + "px 0px");
            position_clouds -= 0.5;
          
            track_clouds = setTimeout(scene_clouds, 50);
        };
        scene_clouds();
    })
		
    .on("scene_standing", function(){
		
        //stop all runnning scenes
        clearTimeout(running);
        clearTimeout(track_floor);
        clearTimeout(track_hills);
        clearTimeout(track_mountains);
        clearTimeout(track_clouds);
                        
        position_megaman = 0;                
        var scene_standing = function() {
            megaman.css("background-position", position_megaman + "px -144px");
            position_megaman -= 72;
          
            standing = setTimeout(scene_standing, 400);
            if(position_megaman === -360) {
               position_megaman = 0;
            }
        };
        scene_standing();
    });

});

 
