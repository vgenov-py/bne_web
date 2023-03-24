from flask import request
from constants import UPLOAD_FOLDER, ALLOWED_EXTENSIONS
from werkzeug.utils import secure_filename
import os
import uuid

def upload_file(table):
    file = request.files.get("file")
    file_extension = file.filename.rsplit(".")[-1].lower()
    if file and file_extension in ALLOWED_EXTENSIONS:
        filename = secure_filename(file.filename)
        if filename:
            r_id = uuid.uuid4().hex
            filename = f"{r_id}.{file_extension}"
            file.save(os.path.join(f"{UPLOAD_FOLDER}{'/invoices' if table == 'invoices' else ''}", filename))
            return (r_id, filename)

def delete_file(file_location):
    os.remove(file_location)
