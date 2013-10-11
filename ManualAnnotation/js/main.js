require.config({

    paths: {
        //libraries
        "underscore": "lib/underscore",
        "backbone"  : "lib/backbone",
        "text"      : "lib/text",
        "bootstrap" : "lib/bootstrap",
        "functions" : "lib/functions",
        
        //jquery plugins
        "jcrop"              : "lib/plugins/jquery.Jcrop.min",
        "jquery-ui"          : "lib/plugins/jquery-ui-1.8.20.custom.min",
        "block-ui"           : "lib/plugins/jquery.blockUI",
        "tooltip-popover"    : "lib/plugins/bootstrap-tooltip-popover",
        "qtip"               : "lib/plugins/jquery.qtip",
        
        //HTML templates
        "templates" : "../templates",
        
        //app
        "AppRouter" : "app/router",
        "BaseView"  : "app/base_view", //introduces .dispose() method
        
        //app.video_list
        "VideoInfo" : "app/video_list/video_info",  //model
        "VideoInfos": "app/video_list/video_infos", //collection
        "VideoFile" : "app/video_list/video_file",  //model
        "VideoFiles": "app/video_list/video_files", //collection
        "VideoList" : "app/video_list/video_list",  //view
        
        //app.scene_list
        "Shot"      : "app/scene_list/shot",        //model
        "Shots"     : "app/scene_list/shots",       //collection
        "SceneList" : "app/scene_list/scene_list",  //view
        
        //app.boxes
        "Box"       : "app/boxes/box",           //model
        "Boxes"     : "app/boxes/boxes",         //collection
        "BoxView"   : "app/boxes/box_view",      //view
        
        //app.sequences
        "BoxSequence"         : "app/sequences/box_sequence",           //model
        "BoxSequences"        : "app/sequences/box_sequences",          //collection
        "BoxSequenceView"     : "app/sequences/box_sequence_view",      //view
        "SequenceCluster"     : "app/sequences/sequence_cluster",       //model
        "SequenceClusters"    : "app/sequences/sequence_clusters",      //collection
        "SequenceClusterView" : "app/sequences/sequence_cluster_view",  //view

        
        //app.thumbnail
        "Thumbnail"         : "app/thumbnails/thumbnail",           //model
        "ThumbnailView"     : "app/thumbnails/thumbnail_view",      //view
        "BigThumbnail"      : "app/thumbnails/big_thumbnail",       //view
        "GenerateThumbnails": "app/thumbnails/generate_thumbnails"  //view
    }

});


require(["AppRouter", "text!templates/navbar.html", "block-ui"], function(AppRouter, navbar){
    
    $.blockUI({ message: '<h1><img src="./img/loading.gif" /> Loading video list...</h1>' });
    
    $("body").append(navbar);
    
    $(".logo, .back-button").click(function(){
        window.location = "./"; //reload the page to avoid memory leaks
    });

    var app = new AppRouter();
    app.start();
    
});
