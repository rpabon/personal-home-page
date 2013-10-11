define(["BaseView", "Box", "BoxSequence"], function(BaseView, Box, BoxSequence){
    
    var BigThumbnail = BaseView.extend({
        
        el: "#big_thumbnail",
				
        initialize: function(){
            $(this.el).off().empty();
        },
				
        render: function(){
            var view = this;
            var big_thumb = $(this.el);
            var model = this.model;
            
            require(["ThumbnailView", "jcrop"], function(ThumbnailView){
                var tv = new ThumbnailView({
                    model: model, 
                    width: parseFloat($("#big_thumbnail").css("width")) //size of #marking
                });
                tv.detach_mouseup();
                
                var canvas = tv.render().$el;

                canvas
                    .attr("id", "big_" + canvas.attr("id"))
                    .appendTo(big_thumb)                    
                    .Jcrop({
                        //bgColor: "#5E2612", //sepia
                        allowMove: false,
                        allowResize: false,
                        onSelect: function(c){
                            view.cropImage(c);
                            this.release();
                        }
                    });
                
                var margin = ($("#big_thumbnail").height() - parseInt(canvas.css("height"))) / 2;
                canvas.parent().css({top: margin + "px"});  //css hack to make the canvas appear vertically centered
            });

            return this;
        },
				
        cropImage: function(c){
            var video_id = this.model.getVideoId();
            var image    = this.model.getImage();
            var frame    = this.model.getFrame();
            var boxes    = this.model.getBoxes();
            var global_box_collection = this.model.get("global_box_collection");
            
            var fix = image.get(0).width / parseFloat($("#big_thumbnail").css("width")); //fixes the problem with the css resize, fix = image.width/#big_thumbnail.width
            //console.log("fix:", image.get(0).width, parseFloat($("#big_thumbnail").css("width")))
            var flag = false; //initialize paint trigger
            var x1 = c.x  * fix;
            var y1 = c.y  * fix;
            var x2 = c.x2 * fix;
            var y2 = c.y2 * fix;
            var w  = c.w  * fix;
            var h  = c.h  * fix;

 
            if( (w > 15) || (h > 15) ){ //minimum box size
                                
                boxes.each(function(box){
                    //avoid painting a box inside an existing one and surrounding one or a group of boxes with a big one
                    if( (x1 / image.get(0).width > box.getX1()) && (y1 / image.get(0).height > box.getY1()) &&
                        (x2 / image.get(0).width < box.getW() + box.getX1()) && (y2 / image.get(0).height < box.getH() + box.getY1()) ||
                        (x1 / image.get(0).width < box.getX1()) && (y1 / image.get(0).height< box.getY1()) &&
                        (x2 / image.get(0).width > box.getW() + box.getX1()) && (y2 / image.get(0).height > box.getH() + box.getY1())
                      ){
                        flag = true; //box will NOT be painted
                    }
                });
                
                if(flag === false){ //box will be painted
                    
                    var new_box = new Box({ //create new box model
                        videoId   : video_id,
                        frame     : frame,
                        x1        : x1 / image.get(0).width, 
                        y1        : y1 / image.get(0).height,
                        x2        : x2 / image.get(0).width,
                        y2        : y2 / image.get(0).height,
                        trackingId: null
                    });
                    
                    boxes.add(new_box); //add new painted box to the existing collection (LOCAL FRAME BOX COLLECTION!!)
                    global_box_collection.add(new_box); //add new box to the global box collection
                    
                    var box_image = $(document.createElement("canvas")).attr({width: w, height: h});
                
                    var box_image_ctx = box_image.get(0).getContext("2d");
                        box_image_ctx.drawImage(image.get(0), x1,y1,w,h, 0,0,w,h);
                        
                    var li = $("<li>").addClass("box-thumbnail").appendTo("#boxes");
                    var url = box_image.get(0).toDataURL("image/jpeg");
                    var image_data = url.replace(/^data:image\/jpeg;base64,+/i, '');
                        
                    var img = $("<img>")
                        .attr("src", url)
                        .load(function(){
                             $(this).fadeIn(500).appendTo(li);

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
                        placement: "bottom",
                        title: "From " + frameToHMS(frame,25),
                        content: img.clone()
                    });
                    
                    var new_sequence = new BoxSequence({ //create new box sequence
                        videoId     : video_id,
                        start       : frame,
                        duration    : 1,
                        priority    : 0,
                        clusterId   : null
                    });

                    new_sequence.save({},{ //save box sequence
                        success: function(){ //callback fired when the server responds
                            //new_box.set("trackingId", new_sequence.id); //give the new box the tracking id corresponding to the id of the box sequence
                            
                            new_box.save({trackingId: new_sequence.id});
                            console.log("sequence: ", new_sequence.attributes, "box: ", new_box.attributes);
                            //here goes the code to save the new_box with its new attributes
                            
                            //set the thumbnailUrl
                            //new_sequence.save({thumbnailUrl: "LocalRepCDB/rest/video/" + video_id + "/boxsequence/" + new_sequence.id + "/thumbnail"});
                            new_sequence.save({thumbnailUrl: url});
                            
                            li.data("box-sequence-model", new_sequence); //attach the box sequence to the list element containing the image
                            
//                            $.ajax({ //upload the scr from image to the server
//                                url        : "./js/lib/image_upload.php",
//                                type       :"post",
//                                data       : {image_data: image_data, name: new_sequence.id, video_id: video_id},
//                                dataType   : "json",
//                                contentType: "image/jpeg"
//                            });
                        }
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
                            }
                        });

                    });
 
                }
            }
        }
    });

    return BigThumbnail;
});