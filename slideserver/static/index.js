$(document).ready(function(){
    var viewer = new OpenSeadragon.Viewer({
        id: 'slide-view',
        prefixUrl: 'static/openseadragon/images/'
    });
    var selection = viewer.selection({
        onSelection: function(rect){
            var request_data = {x: rect.x, y: rect.y, width: rect.width, height: rect.height, rotation: rect.rotation};
            $.ajax({method: 'POST', url: '/userselection/', data: request_data});
        }
    });

    viewer.open('slide.dzi');
})