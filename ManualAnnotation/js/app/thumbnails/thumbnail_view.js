define(["BaseView", "BigThumbnail", "BoxView"], function(BaseView, BigThumbnail, BoxView){
    
    var ThumbnailView = BaseView.extend({
        
        tagName  : "canvas",
        
        attributes: function(){
            return{
                id:     "frame_" + this.model.getFrame(),
                width:  this.model.getImage().get(0).width,
                height: this.model.getImage().get(0).height
            };
        },
				
        initialize: function(){
            $(this.el)
                .fadeIn(500)
                .css({
                    width : this.options.width,
                    height: this.options.width * this.el.height / this.el.width //adjust aspect ratio
                });
           
            this.model.getBoxes().on("add", this.render, this);
            this.model.getBoxes().on("remove", this.render, this);
        },
				
        events: {
            "mouseup"  : "bigThumb",
            "mouseover": "handCursor"
        },

        render: function(){
            var canvas = $(this.el);
            var image = this.model.getImage();
            var boxes = this.model.getBoxes();
            var frame = this.model.getFrame();

            var ctx = canvas.get(0).getContext("2d");
                ctx.clearRect(0, 0, image.get(0).width, image.get(0).height); //clear the canvas to avoid repainting the same boxes
                ctx.drawImage(image.get(0), 0, 0);
            
            //console.log("boxes thumb frame" + canvas.attr("id") + ": ", boxes);
            //paint the boxes on the thumb
            boxes.forEach(function(box){
                var box_view = new BoxView({el: canvas, model: box});
            });
            
            canvas.popover({
                placement: "right",
                title: "From " + frameToHMS(frame,25),
                content: function(){
                    var clone = $("<canvas>")
                        .attr({
                            width: canvas.get(0).width,
                            height: canvas.get(0).height
                         })
                         .css({
                                width: "100%",
                                height: "auto"
                            });

                    var clone_ctx = clone.get(0).getContext("2d");
                    clone_ctx.drawImage(canvas.get(0), 0, 0, canvas.get(0).width, canvas.get(0).height);

                    return clone;                                        
                }
            });

            return this;
        },
        
        handCursor: function(){
            $(this.el).parent().css({cursor: "pointer"}); //li element
        },
				
        bigThumb: function(){
            var canvas = $(this.el);
            
            //control of selected canvas
            $(".frame").removeClass("selected-frame");
            canvas.parent().addClass("selected-frame"); //canvas is a child of an li element
            
            $("#marking_title").html("Marking " + frameToHMS(this.model.getFrame(),25) + "<img src='./img/question-mark.png' />");
            
            var big_thumbnail = new BigThumbnail({
                model: this.model
            });
            big_thumbnail.render();
        },
        
        detach_mouseup: function() {
            this.undelegateEvents();
            this.events = _.clone(this.events);
            delete this.events.mouseup;
            this.delegateEvents();
        }
    });
    
    return ThumbnailView;    
});