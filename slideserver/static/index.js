$(document).ready(function(){
    var viewer = new OpenSeadragon.Viewer({
        id: 'slide-view',
        prefixUrl: 'static/openseadragon/images/'
    });
    viewer.open('slide.dzi');
})