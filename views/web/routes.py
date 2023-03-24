from flask import Blueprint, render_template, session, request, redirect, url_for, make_response, flash
from constants import API_URL, USER, USER_PWD
import requests as req


models = {"geographic" : "geo", "person": "per"}

web = Blueprint("web", __name__)
@web.route("/<model>", methods=["GET"])
def r_query(model):
    if request.args:
        def get_args(args):
            print(args)
            result = ""
            for k,v in args.items():
                if v:
                    result += f"{k}={v}&"
            return result[0:-1]
        args = get_args(request.args)
        print(model)
        res = req.get(f"{API_URL}/{models.get(model)}?{args}").json()
        print(res["data"])
        return render_template(f"{model}.html", data=res)
    return render_template(f"{model}.html")

@web.route("/")
def r_home():
    return render_template("query.html")