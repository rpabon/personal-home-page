define(["BaseView", "BoxSequences"], function(BaseView, BoxSequences){
   
    var BoxSequenceView = BaseView.extend({
        
        tagName: "ul",
        
        initialize: function(){
            $(this.el)
                .addClass("thumbnails")
                .appendTo("#boxes");
            var video_id = this.options.video_id;
            
            this.collection = new BoxSequences([], {video_id: video_id});
            
            this.collection.fetch({
                error: function(){alert("Error fetching shot collection!");}
            });
            
            this.bindTo(this.collection, "reset", this.render);

         },
        
        render: function() {
            var list = $(this.el);
  
            this.collection.each(function(box_sequence){
                console.log("box-clusterID: ", box_sequence.getClusterId());
                var thumb = $("<li>")
                    .data("box-model", box_sequence)
                    .appendTo(list);
                
                $("<img>")
                    //.css({margin: "1px"})
                    .addClass("box-thumbnail")
                    .attr({src: "../" + box_sequence.getThumbnailUrl()})
                    .load(function(){
                        $(this).fadeIn(500).appendTo(thumb);
                    });
                    
                require(["jquery-ui"], function(){
                    thumb.draggable({
                        revert: "invalid",
                        opacity: 0.6,
                        helper: function(){
                            var helper = $(this)
                                .clone()
                                .css("list-style", "none")
                                .appendTo("#main");
                            $(this).fadeOut(100);
                            return helper;
                        },
                        stop: function(){
                            $(this).fadeIn(100);
                        }
                    });
                    
                    $("#boxes").droppable({
                        accept: "#box_clusters li",
                        drop: function(events, ui){
                            ui.draggable.data("box-model").set("clusterId", null);
                            ui.draggable.appendTo(this);
                            console.log("new clusterId: " ,ui.draggable.data("box-model").getClusterId());
                        }
                    });
                });
                
            });
            
            return this;
        }

    });
    
    return BoxSequenceView;
});