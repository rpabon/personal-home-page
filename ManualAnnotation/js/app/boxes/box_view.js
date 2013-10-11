define(["BaseView"], function(BaseView){

    var BoxView = BaseView.extend({
    
        initialize: function(){
            this.render();
        },
				
        render: function(){
            var canvas = $(this.el); //must be passed
            var box = this.model;
            var ctx = canvas.get(0).getContext("2d");
            
            var x = box.getX1() * canvas.get(0).width;
            var y = box.getY1() * canvas.get(0).height;
            var w = box.getW() * canvas.get(0).width;
            var h = box.getH() * canvas.get(0).height;
            
            //console.log("box coord: ", x, y, w, h);
            //console.log(box.getX(), box.getY());
										
            ctx.fillStyle = "black";
            ctx.globalAlpha = 0.1;
            ctx.shadowColor = "black";
            ctx.shadowBlur = 10;
            ctx.fillRect(x, y, w, h); //transparent box in the back
            ctx.globalAlpha = 1;
            ctx.strokeStyle = "white"; //color of the box
            ctx.lineWidth = 4; //line width of the box
            ctx.shadowColor = "black";
            ctx.shadowBlur = 10;
            ctx.strokeRect(x, y, w, h); //rectangle on top 
        }
    });

    return BoxView;
});

