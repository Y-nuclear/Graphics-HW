# 使用flask框架，将前端上传的文件保存到本地
# 上传文件的路径为：UI/app/public/upload

from flask import Flask, request, render_template, redirect, url_for, send_from_directory
from werkzeug.utils import secure_filename
# CORS
from flask_cors import CORS
import os



app = Flask(__name__)
#设置CORS
CORS(app, supports_credentials=True)

# 上传文件的路径为：UI/app/public/upload
UPLOAD_FOLDER = './'

# 允许上传的文件类型
ALLOWED_EXTENSIONS = set(['txt','png', 'jpg', 'jpeg'])

# 设置上传文件的最大尺寸为100MB
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# post请求，上传文件 /api/upload
@app.route('/api/upload', methods=['POST'])
def upload_file():
    # 判断是否有文件上传
    
    print(request.files)
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    # 判断文件名是否为空
    if file.filename == '':
        return 'No selected file'
    # 判断文件是否符合要求
    if file :
        # 获取文件名
        filename = secure_filename(file.filename)
        # 保存文件
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])
        if os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
            os.remove(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return 'success'
    else:
        return 'file type error'
    
if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)