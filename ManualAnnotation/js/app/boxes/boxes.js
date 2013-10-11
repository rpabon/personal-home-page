define(["Box"], function(Box){

    var Boxes = Backbone.Collection.extend({
        
        initialize: function(data, options){
            if(options){
                this.video_id = options.video_id; //pass the video id as an option
            }
        },
        
//        url: function() {
//            return "../LocalRepCDB/rest/video/" + this.video_id + "/box";
//        },
        url: function(){ 
            return "./js/lib/boxDB.php?video_id=" + this.video_id;
        },
        
        model: Box,
        
        byFrame: function(frame) {
            var filtered = this.filter(function(box) {
                return box.getFrame() === frame;
            });
            return new Boxes(filtered);
        
        }
    });

    return Boxes;
});