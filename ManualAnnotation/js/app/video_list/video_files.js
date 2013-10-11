define(["VideoFile"], function(VideoFile){
   
    var VideoFiles = Backbone.Collection.extend({
        
        initialize: function(model, options){
            this.video_id = options.video_id; //pass the video id as an option
        },
        
        url: function() {
            return "./metadata/" + this.video_id + "/video_files.json";
        },
        
        model: VideoFile

    });
    
    return VideoFiles;
});
