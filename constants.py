from os import getcwd

API_URL=None
KEY = "7110eda4d09e062aa5e4a390b0a572ac0d2c0220"
if "kuga" in getcwd():
    API_URL = "http://localhost:3000/api"
else:
    API_URL = "https://api-vgenovpy.eu.pythonanywhere.com/api/7110eda4d09e062aa5e4a390b0a572ac0d2c0220"
    API_URL = "http://localhost:3000/api"

USER="omni"
USER_PWD="fc6b1ebb2b78456b725e99209223e0f"
DEVICES_ALLOWED = 5
SECRET_KEY = "209d5fae8b2ba427d30650dd0250942af944a0c9"
DB_FILE = "xray.db"
DEVICES_REGEX = {
    "iphone" : "iPhone OS \d{2}",
    "windows" : "Windows NT",
    "chrome" : "CrOS",
    "macintosh" : "Macintosh",
    "linux" : "Linux x86_64",
    "android" : "Android \d{2}|Android \d{1}\.\d",
    "windows_phone" : "Windows Phone \d{2}"
}
UPLOAD_FOLDER = "./static/images"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
