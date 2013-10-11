define(["VideoInfo"], function(VideoInfo){
   
    var VideoInfos = Backbone.Collection.extend({
        
        //url: "../service/resources/video",
        url: "./metadata/video_infos.json",
        
        model: VideoInfo,
        
        byId: function(id){            
            var found = this.find(function(model){
                return  model.id === id;
            });
            return found;
        }

    });
    
    return VideoInfos;
});
