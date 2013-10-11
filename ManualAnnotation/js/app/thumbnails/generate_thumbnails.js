define(["BaseView", "Thumbnail", "ThumbnailView", "BigThumbnail", "tooltip-popover", "functions"], function(BaseView, Thumbnail, ThumbnailView, BigThumbnail){
   
    var GenerateThumbnails = BaseView.extend({

        tagName: "ul",
        
        initialize: function() {
            var start = this.options.start;
            var end = this.options.end;
            
            $("#thumbnails").off().empty();
            
            $(this.el)
                .addClass("thumbnails")
                .attr({id: "thumbnails_frame_" + start + "_to_" + end})
                .appendTo("#thumbnails");
        },
        
        render: function() {
            var div = $(this.el);
            
            var video_id = this.options.video_id;
            var shot_id  = this.options.shot_id;
            var video    = this.options.video_element;
            var boxes    = this.options.boxes; //global box collection
            var framegap = this.options.frame_gap;
            var fps      = this.options.fps;
            var start    = this.options.start;
            var end      = this.options.end;
            
            //control of which thumbnail was selected
            if( !$("#shot_" + shot_id).hasClass("selected-thumbnail")){
                $("#shot_" + shot_id).addClass("selected-thumbnail");
                $(".shot-thumbnail:not(#shot_" + shot_id + ")").removeClass("selected-thumbnail");
            }
             
            $("#thumbnails_title").html("Thumbnails from " + frameToHMS(start, fps) + " to " + frameToHMS(end, fps));
            
            //progress bar handling
            $("#progress_bar").fadeIn(500);
            $("#progress_bar").children(".progress").removeClass("progress-success").addClass("progress-warning progress-striped active");
            $("#progress_bar").children(".progress").children(".bar").css({width: "0%"});
            
            video.get(0).currentTime = start/fps;
            video.on("seeked", function(){
                setTimeout(
                    function(){
                        if( video.get(0).currentTime <= end/fps ){
                            var current_frame =  Math.round(video.get(0).currentTime * fps);
                            var selected_boxes = boxes.byFrame(current_frame.toString()); //to string because in the db frame is a string

                            console.log("start_frame: " + start + "  - end_frame: " + end + "  - current_frame: " + current_frame );

                            var capture = $("<canvas>")
                                .addClass("shot-thumbnail")
                                .attr({
                                    width: video.get(0).videoWidth,
                                    height: video.get(0).videoHeight
                                });
                                
                            var ctx = capture.get(0).getContext("2d");
                            ctx.drawImage(video.get(0), 0, 0, video.get(0).videoWidth, video.get(0).videoHeight);
                            


                            var thumbnail = new Thumbnail({
                                video_id: video_id,
                                frame   : Math.round(video.get(0).currentTime * fps),
                                boxes   : selected_boxes,
                                image   : capture,
                                global_box_collection: boxes    
                            });
								
                            var li = $("<li>")
                                .addClass("frame")
                                .appendTo(div);

                            var tv = new ThumbnailView({
                                model: thumbnail,
                                width: parseFloat($(".shot-thumbnail").css("width"))
                            });
                            
                            tv.render().$el.appendTo(li);
                            
                                                        
                            if(current_frame === start){ //executed only in the first thumbnail
                                $("#marking_title").html("Marking " + frameToHMS(current_frame,25) + "<img src='./img/question-mark.png' />");
                                li.addClass("selected-frame");
                                var bt = new BigThumbnail({model: thumbnail});
                                bt.render();
                                //tv.detach_mouseup();
                            }

                            $("#load_start").html(current_frame);
                            $("#load_total").html(end);
                            $("#progress_bar").children(".progress").children(".bar").css({width: Math.round(100*(current_frame-start)/(end-framegap-start)) + "%"});
                            
                            if(video.get(0).currentTime + framegap/fps > end/fps){
                                $("#progress_bar").children(".progress").removeClass("progress-warning progress-striped active").addClass("progress-success");
                                $("#progress_bar").fadeOut(3000);
                                
                                video.off("seeked");
                                console.log("seeked event off! \n\n\n");
                            }

                            video.get(0).currentTime += framegap/fps; 

                        }
                    }
                    , 500);
            });

            return this;
        }

    });
    return GenerateThumbnails;
});