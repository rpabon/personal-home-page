define(["BaseView", "Shots", "tooltip-popover"], function(BaseView, Shots){
   
    var VideoList = BaseView.extend({
        
        el: "#video_list",

        render: function() {
            var list = $(this.el);
            var video_infos = this.options.video_infos;
            
            video_infos.each(function(video_info){
                var popover_content = $("<div>").append("<strong>ID: </strong>"+ video_info.id + "<br>" +
                                        "<strong>Created on: </strong>"        + video_info.getCreated() + "<br>" + 
                                        "<strong>Duration: </strong>"          + video_info.getDuration() + "<br>" +
                                        "<strong>Total frames: </strong>"      + video_info.getFrames() + "<br>" +
                                        "<strong>Frames per second: </strong>" + video_info.getFps() + "<br>");
                
                var info = $("<div>", {id: "video_info_" + video_info.id})
                    .addClass("video-info-block")
                    .appendTo(list)
                    .popover({
                        placement: "bottom",
                        title: video_info.getName().replace(/_/g, " "),
                        content: popover_content
                    })
                    .mouseup(function(){
                        $(this).popover("hide");
                    });

                var name = $("<p>").addClass("video-name-title").html(video_info.getName().replace(/_/g, " ")); //replace _ with spaces

                var image_link = $("<a>")
                    .addClass("video-list-thumbnail")
                    .attr({id: "image_link_" + video_info.id, href: "#/video/" + video_info.id})
                    .appendTo(info);

                $("<a>")
                    .attr({id: "name_link_" + video_info.id, href: "#/video/" + video_info.id})
                    .html(name)
                    .appendTo(info);
            
                var video_thumbnail = $("<img>")
                    .load( function(){
                        $(this).fadeIn(500).appendTo(image_link);
                        //image_link.html(this);
                    });

                //fetch the thumbnails
                var shots = new Shots([], {video_id: video_info.id});
                shots.fetch({
                    success: function(){
                        var shot = shots.at(5); //thumbnail #5
                        video_thumbnail.attr({src: shot.getThumbnailUrl()});
                    }
                });
            });
            
            //make rows of --- videos
            var info_divs = $(".video-info-block");
            for(var i = 0; i < info_divs.length; i += 7) {
                info_divs.slice(i, i+7).wrapAll("<div class='video-list-row'></div>");
                
            }
            
            return this;
        }

    });
    
    return VideoList;
});