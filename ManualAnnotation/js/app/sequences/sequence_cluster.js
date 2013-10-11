define(["backbone"], function(Backbone){
 
    var SequenceCluster = Backbone.Model.extend({
        
        idAttribute: "id",
        
//        urlRoot: function() {
//            return "../LocalRepCDB/rest/video/" + this.getVideoId() + "/sequencecluster";
//        },
        url: "./js/lib/sequence_clustersDB.php",

        defaults: {
            videoId : 0,
            name    : 0,
            personId: 0,
            priority: 0
        },
        
        getVideoId: function() {
            return this.get("videoId");
        },

        getName: function() {
            return this.get("name");
        },
        
        getPersonId: function() {
            return this.get("personId");
        },
        
        getPriority: function() {
            return this.get("priority");
        }
    });

    return SequenceCluster;
});