define(["backbone"], function(Backbone){
    
    var Shot = Backbone.Model.extend({
        
        idAttribute: "id",
            
        defaults: {
            duration    : "",
            start       : "",
            clusterId   : "",
            thumbnailUrl: "",
            priority    : "",
            description : ""
        },

        getDuration: function(){
            return this.get("duration");
        },
        
        getStart: function(){
            return this.get("start");
        },
        
        getEnd: function(){
            return this.get("start") + this.getDuration();
        },
        
        getClusterId: function(){
            return this.get("clusterId");
        },
        
        getThumbnailUrl: function(){
            return this.get("thumbnailUrl");
        },
        
        getPriority: function(){
            return this.get("priority");
        },
        
        getDescription: function(){
            return this.get("description");
        }
    });
    
    return Shot;
});