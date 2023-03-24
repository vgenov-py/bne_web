from flask import Flask
import os
from views.web.routes import web
from views.admin.routes import admin
from views.errors.routes import errors
import datetime as dt
from constants import SECRET_KEY, UPLOAD_FOLDER


def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = SECRET_KEY
    app.config["TIMEZONE"] = "Europe/Madrid"
    app.config['JSON_SORT_KEYS'] = False
    app.config['PERMANENT_SESSION_LIFETIME'] =  dt.timedelta(minutes=10)
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

    app.register_blueprint(web)
    app.register_blueprint(admin, url_prefix="/admin")
    app.register_blueprint(errors)
    return app


app = create_app()
if "kuga" in app.root_path:
    if __name__ == "__main__":
        app.run(debug=True)
else:
    app = create_app()
