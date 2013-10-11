define(["BoxSequence"], function(BoxSequence){

    var BoxSequences = Backbone.Collection.extend({
        
        initialize: function(data, options){
            this.video_id = options.video_id; //pass the video id as an option
        },
        
//        url: function() {
//            return "../LocalRepCDB/rest/video/" + this.video_id + "/boxsequence";
//        },

        url: function(){ 
            return "./js/lib/box_sequencesDB.php?video_id=" + this.video_id;
        },
        
        model: BoxSequence,
        
        byClusterId: function(clusterId) {
            var filtered = this.filter(function(box_sequence) {
                return box_sequence.getClusterId() === clusterId;
            });
            return new BoxSequences(filtered);
        
        }

    });

    return BoxSequences;
});