from flask import Flask

app = Flask(__name__)

# this looks ugly and a bit wrong, but from what I understand is a necessary evil
import slideserver.views