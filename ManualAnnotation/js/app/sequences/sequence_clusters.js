define(["SequenceCluster"], function(SequenceCluster){

    var SequenceClusters = Backbone.Collection.extend({
        
        initialize: function(data, options){
            if(options){
                this.video_id = options.video_id; //pass the video id as an option
            }
        },
        
//        url: function() {
//            return "../LocalRepCDB/rest/video/" + this.video_id + "/sequencecluster";
//        },

        url: function(){ 
            return "./js/lib/sequence_clustersDB.php?video_id=" + this.video_id;
        },
        
        model: SequenceCluster

    });

    return SequenceClusters;
});