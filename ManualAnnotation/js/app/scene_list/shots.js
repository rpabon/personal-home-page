define(["Shot"], function(Shot){
    
    var Shots = Backbone.Collection.extend({

        initialize: function(data, options){
            this.video_id = options.video_id; //pass the video id as an option
        },
          
        url: function() {
            //return "../service/resources/video/" + this.video_id + "/shot";
            return "./metadata/" + this.video_id + "/shot.json";
        },
        
        model: Shot
    });
    
    return Shots;
});
