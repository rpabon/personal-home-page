define(["backbone"], function(Backbone){
 
    var Box = Backbone.Model.extend({
        
        idAttribute: "id",
              
//        urlRoot: function() {
//            return "../LocalRepCDB/rest/video/" + this.getVideoId() + "/box";
//        },
        url: function(){
            return "./js/lib/boxDB.php?id=" + this.get('id');
        },


        defaults: {
            videoId: null,
            frame  : null,
            x1     : 0,
            y1     : 0,
            x2     : 0,
            y2     : 0,
            los    : null,
            trackingId: null
        },
        
        getVideoId: function() {
            return this.get("videoId");
        },
        
        getFrame: function() {
            return this.get("frame");
        },

        getX1: function() {
            return this.get("x1");
        },
        
        getY1: function() {
            return this.get("y1");
        },
        
        getX2: function() {
            return this.get("x2");
        },
        
        getY2: function() {
            return this.get("y2");
        },
        
        getW: function() {
            return this.get("x2") - this.get("x1");
        },
        
        getH: function() {
            return this.get("y2") - this.get("y1");
        },
        
        getLos: function() {
            return this.get("los");
        },
        
        getTrackingId: function() {
            return this.get("trackingId");
        }
    });

    return Box;
});

