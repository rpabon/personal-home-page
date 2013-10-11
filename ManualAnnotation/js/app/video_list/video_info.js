define(["backbone"], function(Backbone){
    
    var VideoInfo = Backbone.Model.extend({
        
        idAttribute: "id",
        
        url: function(){
            return "./metadata/" + this.id + "/video_info.json";
        }, 
            
        defaults: {
            created     : "",
            description : "",
            duration    : "",
            fps         : "",
            frames      : "",
            name        : ""
        },
        
        getCreated: function(){
            return this.get("created");
        },
        
        getDescription: function(){
            return this.get("description");
        },
        
        getDuration: function(){
            return this.get("duration");
        },
        
        getFps: function(){
            return this.get("fps");
        },
        
        getFrames: function(){
            return this.get("frames");
        },
        
        getName: function(){
            return this.get("name");
        }
    });
    
    return VideoInfo;
    
});