define([], function(){
                
    frameToHMS = function(currentFrame, fps) {
        function pad2(number) {
            return (number < 10 ? '0' : '') + number;
        }

        var FF = currentFrame % fps;
        var seconds = (currentFrame - FF) / fps;
        var SS = seconds % 60;
        var minutes = (seconds - SS) / 60;
        var MM = minutes % 60;
        var HH = (minutes - MM) / 60;
        var result = null;
        
        if(HH === 0){
            result = pad2(MM) + ":" + pad2(SS) + ";" + pad2(FF);
        } else {
            result = pad2(HH) + ":" + pad2(MM) + ":" + pad2(SS) + ";" + pad2(FF);
        }

        return result;
    }

});