define(["BaseView", "Shots", "tooltip-popover", "functions", "qtip"], function(BaseView, Shots){
   
    var SceneList = BaseView.extend({
        
        el: "#scene_list",
        
        initialize: function(){
            var video_id = this.options.video_info.id;
            
            this.collection = new Shots([], {video_id: video_id});
            
            this.collection.fetch({
                error: function(){alert("Error fetching shot collection!");}
            });
            
            this.bindTo(this.collection, "reset", this.render);
         },
        
        render: function() {
            var list = $(this.el);
            var shots = this.collection;
            var video_info = this.options.video_info;

            $(".navbar-title").empty().html(video_info.getName().replace(/_/g, " "));

            var sorted = shots.groupBy(function(shot){ //make subgroups with clusterId as key
                return shot.getClusterId();
            });
            
            var clusters = _.keys(sorted); //array with the cluster IDs
            
            clusters.forEach(function(cluster){
                
                var filtered_shots = shots.filter(function(shot){ //filter shot collection by cluster id
                    return shot.getClusterId() === cluster;
                });
                
                var fps          = video_info.getFps();
                var first_shot   = _.first(filtered_shots);
                var last_shot    = _.last(filtered_shots);
                var first_frame  = first_shot.getStart();
                var last_frame   = last_shot.getEnd();
                
                var scene = $("<div>", {id: "scene_" + cluster})
                    .addClass("scene")
                    .appendTo(list);
                    
                $("<a>")
                    .html("<p class='scene-title'><span>" + frameToHMS(first_frame, fps) + " &rarr; " + frameToHMS(last_frame, fps) + "</span><img src='./img/question-mark.png'/></p>")
                    .attr({href: "#/video/" + video_info.id + "/shot/complete_scene_" + cluster + "/start_frame:" + first_frame + "/end_frame:"
                            + last_frame + "/fps:" + fps})
                    .appendTo(scene)
                    .qtip({
                        content: {
                                text: "<p>Click here to load the complete scene, from \n\
                                       <strong style='color:green;'>" + frameToHMS(first_frame, fps) + " to " + frameToHMS(last_frame, fps) + "</strong></p>", 
                                title: "<p>Full scene</p>"
                        },
                        position: {
                                my: "bottom left", // Use the corner...
                                at: "top right" // ...and opposite corner
                        },
                        style: {
                            classes: "ui-tooltip-rounded ui-tooltip-shadow"
                        }
                    });
                  
                filtered_shots.forEach(function(shot){

                    var li = $("<li>")
                        .addClass("shot-thumbnail")
                        .attr({id: "shot_" + shot.id})
                        .appendTo(scene);
//                        .tooltip({
//                            title: "<p class='tooltip-text'>" + frameToHMS(shot.getStart(), fps) + " &rarr; " + frameToHMS(shot.getEnd(), fps) + "</p>" 
//                        });

                                                
                    //this is only for the times that the page is loaded with a complete url (or refreshed)
                    var current_url = Backbone.history.fragment;
                    var current_url_fragments = current_url.split("/");
                    if(current_url_fragments[3] === shot.id){ //if fragment of the shotID exists, it means that the page was refreshed or loaded with a long URL
                        li.addClass("selected-thumbnail");
                    }

                    var link = $("<a>")
                        .attr({href: "#/video/" + video_info.id + "/shot/" + shot.id + "/start_frame:" + shot.getStart() + "/end_frame:"
                                + shot.getEnd() + "/fps:" + video_info.getFps()})
                        .appendTo(li);

                    var img = $("<img>")
                        //.addClass("shot-thumbnail")
                        .attr({src: shot.getThumbnailUrl()})
                        .load(function(){
                            $(this).fadeIn(500).appendTo(link);
                        });
                        
                    li.popover({
                        html: true,
                        placement: "right",
                        title: "<p> Scene shot</p> <p>(" + frameToHMS(shot.getStart(), fps) + " &rarr; " + frameToHMS(shot.getEnd(), fps) + ")</p>",
                        content: img.clone()
                    })
                    .mouseup(function(){
                        $(this).popover("hide");
                    });
                    
                    $("#marking_title").qtip({
                        content: {
                                text: "<div>\n\
                                     <p>To start marking persons/objects in this area:</p>\n\
                                     <ol>\n\
                                        <li>On the left of the screen, click on one of the scene shots or on the scene title</li>\n\
                                        <li>On the bottom of the screen, click on one of the generated thumbnails</li>\n\
                                     </ol>", 
                                title: "<p>Video Capture Marking Area</p>"
                        },
                        position: {
                                my: "top left", // Use the corner...
                                at: "bottom left" // ...and opposite corner
                        },
                        style: {
                            classes: "ui-tooltip-rounded ui-tooltip-shadow"
                        }
                    });
                    
                    $("#thumbnails_title").qtip({
                        content: {
                                text: "<div>\n\
                                     <p>To generate video thumbnails in this area:</p>\n\
                                     <ul>\n\
                                        <li>On the left of the screen, click on one of the scene shots or on the scene title</li>\n\
                                     </ul>", 
                                title: "<p>Generated Video Thumbnails</p>"
                        },
                        position: {
                                my: "top left", // Use the corner...
                                at: "bottom left" // ...and opposite corner
                        },
                        style: {
                            classes: "ui-tooltip-rounded ui-tooltip-shadow"
                        }
                    });
                    
                                        
                    $("#selected_title").qtip({
                        content: {
                                text: "<div>\n\
                                     <p>All the selections made on the Marking Area will appear here.</p>\n\
                                     <ul>\n\
                                        <li>Drag and drop the small images to one of the person/object boxes in the Clusters column</li>\n\
                                        <li>To erase an image, drag and drop it to the waste basket</li>\
                                     </ul>", 
                                title: "<p>Selected Persons/Objects Area</p>"
                        },
                        position: {
                                my: "top left", // Use the corner...
                                at: "bottom left" // ...and opposite corner
                        },
                        style: {
                            classes: "ui-tooltip-rounded ui-tooltip-shadow"
                        }
                    });

                });

            });
            
            return this;
        }

    });
    
    return SceneList;
});