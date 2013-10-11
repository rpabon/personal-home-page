define(["backbone"], function(Backbone){
    
    var Thumbnail = Backbone.Model.extend({ //non persistent model for managing the thumbnails
        
        idAttribute: "id",
        
        defaults: {
            video_id: null,
            image   :  null,   //canvas with image painted on
            frame   :  null,
            boxes   :  null    //collection of boxes of this thumbnail
        },
        
        getVideoId: function() {
            return this.get("video_id");
        },
        
        getImage: function() {
            return this.get("image");
        },
        
        getFrame: function() {
            return this.get("frame");
        },
        
        getBoxes: function() {
            return this.get("boxes");
        }
        
    });

    return Thumbnail;
});