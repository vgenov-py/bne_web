from flask import Blueprint, render_template, request, flash, redirect, session
import requests as req
from constants import API_URL, USER, USER_PWD
from views.admin.utils import upload_file, delete_file
admin = Blueprint("admin", __name__)
@admin.route("/table/<table>", methods=["GET", "POST"])
def t_table(table):

    verb = request.method
    e_id = request.args.get("filter_by")
    if e_id and verb == "GET":
        res = req.get(f"{API_URL}/{table}?filter_by={e_id}", auth=(USER, USER_PWD)).json()
        print(res)
        if res["success"]:
            return render_template("admin/table.html", data=res["data"])
        else:
            return render_template("admin/table.html")

    if verb == "POST":
        user_form = dict(request.form)
        query_params = ""
        for k,v in user_form.items():
            query_params+=f"{k}={v}&"
        query_params = query_params[0:-1]
        url = f"{API_URL}/{table}?{query_params}"

        if user_form.get("id"): # DELETE
            req.delete(url, auth=(USER, USER_PWD))
            flash(f"Eliminado correctamente!", "danger")

        else: # CREATE
            res = req.post(url, auth=(USER, USER_PWD)).json()
            if res["success"]:
                element = "Usuario creado" if table == "users" else "Escuela creada"
                flash(f"{element} correctamente!", "success")
            else:
                flash(f"{res['message']}", "danger")

    data = req.get(f"{API_URL}/{table}", auth=(USER, USER_PWD)).json()
    if not data["success"]:
        return render_template("admin/table.html", table=table)
    if table == "users":
        schools = req.get(f"{API_URL}/schools", auth=(USER, USER_PWD)).json()
        if schools["success"]:
            return render_template("admin/table.html", data=data["data"], schools=schools["data"])

    return render_template("admin/table.html", data=data["data"])


@admin.route("/table/<table>/<id>", methods=["GET", "POST"])
def t_element(table, id):
    if request.method == "POST":
        user_form = dict(request.form)
        query_params = ""
        for k,v in user_form.items():
            query_params+=f"{k}={v}&"
        query_params = query_params[0:-1]
        url = f"{API_URL}/{table}/{id}?{query_params}"
        res = req.delete(url, auth=(USER, USER_PWD)).json()
        if res["success"]:
            data = req.get(f"{API_URL}/{table}", auth=(USER, USER_PWD)).json()
            res = render_template("admin/table.html", data=data["data"])
            flash(f"Eliminado correctamente!", "danger")
        else:
            if table == "images" or table == "invoices":
                img_id, path = upload_file(table)
                query_params += f"&id={img_id}&path={path}"
                url = f"{API_URL}/{table}/{id}?{query_params}"
            res = req.post(url, auth=(USER, USER_PWD)).json()
            if res["success"]:
                flash(f"{table[0:-1]} created!", "success")
                data = req.get(f"{API_URL}/{table}", auth=(USER, USER_PWD)).json()
            else:
                delete_file(path)
    return redirect(f"/admin/table/{table}")


@admin.route("/vds", methods=["GET", "POST"])
def r_vd():
    try:
        res = req.get(f"{API_URL}/vd/1000", auth=(USER,USER_PWD)).json()
        return res
    except Exception as e:
        return f"{e}"

