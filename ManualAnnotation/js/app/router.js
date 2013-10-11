define([
        "backbone",                                                            //libraries
        "text!templates/video_list.html", "text!templates/marking_area.html",   //HTML templates
        "VideoList", "SceneList", "GenerateThumbnails", "BoxSequenceView", "SequenceClusterView",     //Views
        "Boxes", "VideoFiles", "VideoInfos",                                    //Collections
        "VideoInfo"
        ],                                                                      //Models
    
        function(
                 Backbone,                                                      //libraries         
                 video_list_layout, marking_area_layout,                        //HTML templates
                 VideoList, SceneList, GenerateThumbnails, BoxSequenceView, SequenceClusterView,    //Views
                 Boxes, VideoFiles, VideoInfos,                                  //Collections
                 VideoInfo                                                      //Models                                                 
                ){             
        
   
    var AppRouter = Backbone.Router.extend({
        
        routes: {
            ""                                               : "videoList",
            "video/:video_id"                                : "sceneList",
            "video/:video_id/shot/:shot_id/:start/:end/:fps" : "generateThumbnails"
        },

        
        videoList: function() {
            var self = this; //reference to router, allows to pass its variables to its functions
            
            if ($("#main").length > 0){
                $(".navbar-title").html("Manual Semantic Annotation Tool");
                $("#main").remove();
            }
            
            $("body").append(video_list_layout); //load video list layout
            
            self.video_infos = new VideoInfos;
            self.video_infos.fetch({
                error: function(){
                    alert("Error loading the video list information!");
                }
            });
            
            self.video_infos.on("reset", function(){
                $.unblockUI();
                self.video_list = new VideoList({video_infos: self.video_infos});
                self.video_list.render();
            });
            
        },
        
        sceneList: function(video_id) {
            var self = this;
            var video_info = "";
            
            $.blockUI({ message: '<h1><img src="./img/loading.gif" /> Loading...</h1>' });

            $("#main").remove(); //remove video list template
            $("body").append(marking_area_layout); //load marking area layout
            
                self.video_element = $("<video>", {id: video_id})
                //.attr("preload", "metadata")
                .css({display: "none"})
                .appendTo("#main");
            
            if(self.video_list){ self.video_list.dispose(); } //remove video list view
            
            self.boxes = new Boxes([], {video_id: video_id});
            self.boxes.fetch({
                error: function(){
                    alert("Error loading boxes");
                }
             });
            
            self.boxes.on("reset", function(){
                //console.log("Boxes resource loaded for video " + video_id + " - " + self.boxes);
                //console.log("BOXES: ", self.boxes);
                
                var video_files = new VideoFiles([], {video_id: video_id});
                video_files.fetch({
                    error: function(){
                        alert("Error loading video files");
                    }
                });
                
                video_files.on("reset", function(){
                  //  console.log("Video sources loaded for video " + video_id + " - " + video_files);
                  console.log("VIDEO FILES: ", video_files);
                    video_files.each(function(file){ //for the two sources
                        console.log("video file: ", file);
                        $("<source>")
                            .attr({src: "./metadata/" + video_id + "/" + video_id + "." + file.getExt(),
                                   type: file.getType()})
                            .appendTo(self.video_element);
                        });
                });
                
            });

            self.video_element.on("loadedmetadata", function(){
                if(typeof self.video_infos !== "undefined"){ //in case the video_infos collection had been already loaded

                    video_info = self.video_infos.byId(video_id);
                    self.boxCluster(video_info, self.boxes); //Load sequence_cluster_view
                    self.scene_list = new SceneList({video_info: video_info});
                    
                    $.unblockUI();

                } else { //in case the video_infos collection had not been yet loaded 

                    video_info = new VideoInfo({id: video_id});
                    video_info.fetch({
                        error: function(){
                            alert("Error loading video " + video_id + " information!");
                        }
                    });

                    video_info.on("change", function(){
                        self.boxCluster(video_info, self.boxes); //Load sequence_cluster_view
                        self.scene_list = new SceneList({video_info: video_info});
                        $.unblockUI();
                    });                
                }
            });
 
        },
        
        generateThumbnails: function(video_id, shot_id, start, end, fps) {
            var self = this;

            var clean_start = parseFloat(start.replace(/^start_frame:+/i, ''));  //remove 'start_frame:'
            var clean_end = parseFloat(end.replace(/^end_frame:+/i, ''));        //remove 'end_frame:'
            var clean_fps = parseFloat(fps.replace(/^fps:+/i, ''));              //remove 'fps:'
                        
            if(self.thumbnails){self.thumbnails.dispose();}
            
            if(typeof self.boxes !== "undefined"){
                
                console.log("BOXES FOR THUMB: ", self.boxes);
                self.video_element.off("seeked"); //unbind the seeked event, so the new thumbnails can be generated in a new event *prevents bug*
                console.log("seeked event off!, new thumbnails will be generated");
            
                self.thumbnails = new GenerateThumbnails({ //generate thumnails with this parameters
                    video_id     : video_id,
                    shot_id      : shot_id,
                    start        : clean_start,
                    end          : clean_end,
                    fps          : clean_fps,
                    frame_gap    : 50,
                    video_element: self.video_element,
                    boxes        : self.boxes
                }).render();
            
            } else {

                self.sceneList(video_id);
                
                self.video_element.off("seeked"); //unbind the seeked event, so the new thumbnails can be generated in a new event *prevents bug*
                console.log("seeked event off!, new thumbnails will be generated");
                
                self.video_element.on("loadedmetadata", function(){
                    self.thumbnails = new GenerateThumbnails({ //generate thumnails with this parameters
                        video_id     : video_id,
                        shot_id      : shot_id,
                        start        : clean_start,
                        end          : clean_end,
                        fps          : clean_fps,
                        frame_gap    : 50,
                        video_element: self.video_element,
                        boxes        : self.boxes
                    }).render();
                });
            }

        },
        
        boxCluster: function(video_info, boxes){
          //var self = this;
          
          //var box_sequence_view = new BoxSequenceView({video_id: video_id});
          var sequence_cluster_view = new SequenceClusterView({video_info: video_info, boxes: boxes});
          
        },
        
        start: function(){
            Backbone.history.start();
        }
        
    });

    return AppRouter;
});