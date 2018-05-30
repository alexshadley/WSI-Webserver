import subprocess
import os
import json

IMAGE_PATH = '/home/alex/HCI/slide-webserver/slideserver/static/testslide.svs'
SCRIPT_PATH = '/home/alex/IdeaProjects/QuPathTestScript/Nuclei_Detection.groovy'

def detect_nuclei(params):
    os.chdir('/home/alex/QuPath/app')

    # processParams = {'x': 30000, 'y': 10000, 'width': 1000, 'height': 1000}
    with open('params.json', 'w') as outfile:
        json.dump(params, outfile)

    subprocess.call(['java', '-Djava.library.path=/home/alex/QuPath/app', '-cp', './QuPathApp.jar:jars/groovy-json.jar', 'qupath.QuPath', '-image', IMAGE_PATH, '-script', SCRIPT_PATH])

    with open('nuclei.json', 'r') as infile:
        return json.load(infile)