define(["BaseView", "SequenceCluster", "SequenceClusters", "BoxSequences", "Box", "text!templates/new_cluster.html", "block-ui", "tooltip-popover", "qtip"],
        function(BaseView, SequenceCluster, SequenceClusters, BoxSequences, Box, new_cluster_template){
   
    var SequenceClustersView = BaseView.extend({
        
        el: "#box_clusters",
        
        initialize: function(){
            var video_info = this.options.video_info;
            var video_id = video_info.id;
            
            this.collection = new SequenceClusters([], {video_id: video_id});
            
            this.collection.fetch({
                error: function(){alert("Error fetching sequence cluster collection!");}
            });
            
            this.bindTo(this.collection, "reset", this.render);
            this.collection.on("add", this.render, this);
                        
            this.box_sequences = new BoxSequences([], {video_id: video_id});
            this.box_sequences.on("reset", this.boxSequenceLoad, this);
         },
        
        render: function() {
            var collection = this.collection;
            var div = $(this.el);
            var video_info = this.options.video_info;
            var video_id = video_info.id;
            var boxes = this.options.boxes;
  
            div.empty();
            
            $("#create_cluster")
                .click(function(){
                    div.parent().block({
                        message: new_cluster_template,
                        css: { 
                            display:        "none",
                            width:          '80%',
                            height:         'auto',
                            color:          '#000', 
                            border:         '3px solid #aaa', 
                            backgroundColor:'#fff', 
                            cursor:         'auto' 
                        },
                        centerX: true,
                        centerY: true 
                    });
                    
                    $("#new-cluster-name").get(0).focus(); //make the cursor appear in the textbox
                    
                    $("#new_cluster_send").click(function(){
                        var name = $("#new-cluster-name").val();
                        
                        var new_cluster = new SequenceCluster({
                            videoId : video_id,
                            name    : name
                        });
                        collection.add(new_cluster);
                        new_cluster.save();
                        
                        div.parent().unblock();
                    });
                    
                    $("#new_cluster_cancel").click(function(){
                         div.parent().unblock();
                    });

                });

            this.collection.each(function(sequence_cluster){
             
            $("<p>")
                    .addClass("div-title-small sequence-title")
                    .html("<span>" + sequence_cluster.getName() + "</span><img src='./img/question-mark.png'/>")
                    .appendTo(div)
                    .qtip({
                        content: {
                                text: "<p>All the images inside this cluster can be dragged and dropped\n\
                                       to another cluster or to the selected Persons/Object area</p>", 
                                title: "<p>Persons/Objects Cluster</p>"
                        },
                        position: {
                                my: "center right", // Use the corner...
                                at: "center left" // ...and opposite corner
                        },
                        style: {
                            classes: "ui-tooltip-rounded ui-tooltip-shadow"
                        }
                    });
            
            var cluster = $("<div>", {id: "sequence_cluster_" + sequence_cluster.id})
                    .addClass("sequence-cluster")
                    .appendTo(div);

            require(["jquery-ui"], function(){
                    cluster.droppable({
                        accept: function(e){
                            if (e.parent().attr("id") === cluster.attr("id") ){ // if dropping inside the same div as origin do not accept
                                return false;
                            } else {
                                return true;
                            }
                        },
                        drop: function(events, ui){
                            ui.draggable.data("box-sequence-model").save({clusterId: sequence_cluster.id})
                            ui.draggable.addClass("box-thumbnail").appendTo(this);
                            console.log("new clusterId - boxes: (from #boxes) " ,ui.draggable.data("box-sequence-model").attributes);
                        }
                    });
                    
                    $("#boxes").droppable({
                        accept: "div.sequence-cluster > li", //accept dropping only from #boxes
                        drop: function(events, ui){
                            ui.draggable.data("box-sequence-model").save({clusterId: null});
                            ui.draggable.appendTo(this);
                            console.log("new clusterId - boxes: (from sequence-cluster) " ,ui.draggable.data("box-sequence-model").attributes);
                        }
                    });
                    
                    $("#recycle_bin").droppable({
                        accept: "li",
                        tolerance: "touch",
                        over: function(){
                            $(this).css({backgroundPosition: "-48px 0px"});
                        },
                        out: function(){
                            $(this).css({backgroundPosition: "0px 0px"});
                        },
                        drop: function(events, ui){
                            var box_sequence = ui.draggable.data("box-sequence-model");
                            var trackingId = box_sequence.id;
                            
                            var modelsByTrackingId = boxes.filter(function(box){
                                return box.getTrackingId() === trackingId;
                            });
                                
                            modelsByTrackingId.forEach(function(box){
                                box.destroy();
                            });
                            
                            box_sequence.destroy();
                            ui.draggable.remove();
                            
//                            $.ajax({ //erase image from the server
//                                url        : "../LocalRepCDB/rest/video/" + video_id + "/boxsequence/" + box_sequence.id + "/thumbnail",
//                                type       : "delete"
//                            });
                            
                            $(this).css({backgroundPosition: "0px 0px"});
                        }
                    })
                    .qtip({
                        content: {
                                text: "<p>All the images in the Selected Persons/Objects Area\n\
                                       and in the Persons/Objects Cluster can be erased here</p>", 
                                title: "<p>Wastebasket</p>"
                        },
                        position: {
                                my: "top center", // Use the corner...
                                at: "bottom center" // ...and opposite corner
                        },
                        style: {
                            classes: "ui-tooltip-rounded ui-tooltip-shadow"
                        }
                    });
                    
                });

            });
            
            this.box_sequences.fetch({
                error: function(){alert("Error fetching shot collection!");}
            });

            return this;
        },
        
        boxSequenceLoad: function(){
            var video_info = this.options.video_info;
            var fps = video_info.getFps();
            var box_sequences = this.box_sequences;
            $("#boxes").children("li").remove(); //remove all the existing box pictures in #boxes to avoid repainting when creating new sequence clusters
            
            
            box_sequences.each(function(box_sequence){
//                var filtered_sequences = box_sequences.filter(function(box_sequence){ //filter shot collection by cluster id
//                    return box_sequence.getClusterId() === clusterId;
//                });
                //console.log("thumb url: ", box_sequence.getThumbnailUrl());
                var li = $("<li>")
                    .addClass("box-thumbnail")
                    .data("box-sequence-model", box_sequence);  //attach the box sequence to the list element containing the image
                    
                if(box_sequence.getClusterId() === "" || null){
                    li.appendTo("#boxes");
                } else {
                    li.appendTo("#sequence_cluster_" + box_sequence.getClusterId());
                }
                
                var img = $("<img>")
                    .attr("src", box_sequence.getThumbnailUrl())
                    .appendTo(li)
                    .load(function(){
                         //$(this).fadeIn(500).appendTo(li);
                         
                        if(this.height > this.width) {
                            $(this).css({width: "auto", height: "100%", "text-align": "center"}); //hack to make image appear on the center
                        } else {
                            var parent_height = parseInt($(this).parent().css("height"));
                            var css_height = (parent_height / this.width) * this.height;
                            var margin = (parent_height - css_height) / 2;
                            $(this).css({width: "100%", height: "auto", top: margin}); //hack to make image appear on the center
                        }

                    });
                    
                    li.popover({
                        placement: "left",
                        title: "From " + frameToHMS(box_sequence.getStart(), fps),
                        content: img.clone()
                    });


                require(["jquery-ui"], function(){
                    li.draggable({
                        revert: "invalid",
                        opacity: 0.6,
                        helper: function(){
                            var helper = $(this)
                                .clone()
                                .css("list-style", "none")
                                .addClass("box-thumbnail")
                                .appendTo("#main");
                            $(this).fadeOut(100);
                            return helper;
                        },
                        stop: function(){
                            $(this).fadeIn(100);
                            //console.log("bsm: ", $(this).data("box-sequence-model").attributes);
                        }
                    });
                });

            });
        }

    });
    
    return SequenceClustersView;
});