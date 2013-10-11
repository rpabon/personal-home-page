define(["backbone"], function(Backbone){
    
    var VideoFile = Backbone.Model.extend({
        
        idAttribute: "id",
        
        defaults: {
            type:"",
            ext :""
        },

        getType: function(){
            return this.get("type");
        },
        
        getExt: function(){
            return this.get("ext");
        }
    });
    return VideoFile;
});