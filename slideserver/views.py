from slideserver import app
from flask import render_template, make_response, request, jsonify
from openslide import OpenSlide, deepzoom
from io import BytesIO
from slideserver.qupath import detect_nuclei

@app.before_first_request
def setup():
    slide = OpenSlide('HCI/slide-webserver/slideserver/static/testslide.svs')
    app.deepzoom = deepzoom.DeepZoomGenerator(slide)


@app.route('/')
def hello_world():
    return render_template('index.html.j2')

@app.route('/slide.dzi')
def slide_dzi():
    response = make_response(app.deepzoom.get_dzi('jpeg'))
    response.mimetype = 'application/xml'
    return response

@app.route('/slide_files/<int:level>/<int:col>_<int:row>.<format>')
def tile(level, col, row, format):
    response_tile = app.deepzoom.get_tile(level, (col, row))

    # this is some black magic inspired by the OpenSlide examples found here:
    # https://github.com/openslide/openslide-python
    buf = BytesIO()
    response_tile.save(buf, format, quality=75)
    response = make_response(buf.getvalue())
    response.mimetype = 'image/%s' % format
    return response

@app.route('/userselection/', methods=['POST'])
def user_selection():
    print(request.form)
    qupathParams = {'x': int(request.form['x']), 'y': int(request.form['y']), 'height': int(request.form['height']), 'width': int(request.form['width'])}
    return jsonify(detect_nuclei(qupathParams))
