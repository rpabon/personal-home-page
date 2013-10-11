define(["backbone"], function(Backbone){
 
    var BoxSequence = Backbone.Model.extend({
        
        idAttribute: "id",
        
//        urlRoot: function() {
//            return "../LocalRepCDB/rest/video/" + this.getVideoId() + "/boxsequence";
//        },

        url: function() {
            return "./js/lib/box_sequencesDB.php?id=" + this.get("id");
        },
        
        defaults: {
            videoId     : null,
            start       : 0,
            duration    : 1,
            priority    : 0,
            clusterId   : null,
            thumbnailUrl: null,
            roles       : null
        },
        
        getVideoId: function() {
            return this.get("videoId");
        },

        getStart: function() {
            return this.get("start");
        },
        
        getDuration: function() {
            return this.get("duration");
        },
        
        getPriority: function() {
            return this.get("priority");
        },
        
        getClusterId: function() {
            return this.get("clusterId");
        },
        
        getThumbnailUrl: function() {
            return this.get("thumbnailUrl");
        },
        
        getRoles: function() {
            return this.get("roles");
        }

    });

    return BoxSequence;
});