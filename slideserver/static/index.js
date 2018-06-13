var ANNOTATION_RADIUS = 3.0;

var selectionCount = 0;
var annotations = [];

function drawNuclei(nuclei, canvas, drawAnnotations) {
    for (var i = 0; i < nuclei.length; i++) {
        var circ = new fabric.Circle({
            left: Math.round(nuclei[i].x - ANNOTATION_RADIUS/2),
            top: Math.round(nuclei[i].y - ANNOTATION_RADIUS/2),
            fill: 'red',
            radius: ANNOTATION_RADIUS
        });
        annotations.push(circ);

        // only add annotations to the screen if hide annotations is unchecked
        if(drawAnnotations) {
            canvas.add(circ);
        }
    }
}

$(document).ready(function(){
    var viewer = new OpenSeadragon.Viewer({
        id: 'slide-view',
        prefixUrl: 'static/openseadragon/images/'
    });

    // add a canvas over the image, but only after the image is loaded since we need to know image dimensions
    viewer.addHandler('open', function (event) {
        var world = event.eventSource.world;
        var overlayScale = world.getItemAt(0).getContentSize().x;
        viewer.overlay = viewer.fabricjsOverlay({scale: overlayScale, static: true});
    });

    var selection = viewer.selection({
        onSelection: function(rect){
            var request_data = {x: rect.x, y: rect.y, width: rect.width, height: rect.height, rotation: rect.rotation};
            $.ajax({method: 'POST', url: '/userselection/', data: request_data})
                .done( function(data){
                    selectionCount += 1;

                    var jsonstr = JSON.stringify(data);
                    var nucleiDetectionData = new Blob([jsonstr], {type:'application/json'});
                    var url = URL.createObjectURL(nucleiDetectionData);

                    var a = document.createElement('a');
                    a.href = url;
                    a.download = 'selection-' + selectionCount + '.json';

                    var button = document.createElement('button');
                    button.innerText = 'Selection ' + selectionCount;

                    a.appendChild(button);
                    $('#menu').append(a);

                    drawNuclei(data, viewer.overlay.fabricCanvas(), !$('#hide-annotations').prop('checked'));

                });
        }
    });

    $('#hide-annotations').change( function (){
        if(this.checked) {
            viewer.overlay.fabricCanvas().clear();
        }
        else {
            for(var i = 0; i < annotations.length; i++) {
                viewer.overlay.fabricCanvas().add(annotations[i]);
            }
        }
    });

    viewer.open('slide.dzi');
});