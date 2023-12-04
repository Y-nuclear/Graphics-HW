//导入antd组件
import { Upload, message } from 'antd';
import React from 'react';

export default class UploaderBox extends React.Component {
    //具有上传文件功能的组件
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            uploading: false,
        };
    }

    //上传文件
    handleUpload = () => {
        const { fileList } = this.state;
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('file', file);
        });
        this.setState({
            uploading: true,
        });
        // You can use any AJAX library you like
        fetch('/api/upload', {
            method: 'POST',
            body: formData,
        }).then(() => {
            this.setState({
                fileList: [],
                uploading: false,
            });
            message.success('上传成功！');
        }).catch(() => {
            this.setState({
                uploading: false,
            });
            message.error('上传失败！');
        });
    }

    //上传文件之前的检查
    beforeUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.error('只能上传JPG格式的图片！');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小不能超过2MB！');
        }
        return isJPG && isLt2M;
    }

    //上传文件之前的检查
    handleChange = (info) => {
        let fileList = info.fileList;
        fileList = fileList.slice(-1);
        this.setState({ fileList });
    }

    render() {
        const { uploading } = this.state;
        const props = {
            action: '/api/upload',
            onRemove: (file) => {
                this.setState((state) => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                    };
                });
            },
            beforeUpload: this.beforeUpload,
            onChange: this.handleChange,
            fileList: this.state.fileList,
        };
        return (
            <div>
                <Upload {...props}>
                    
                </Upload>
                <button
                    className="btn btn-primary"
                    onClick={this.handleUpload}
                    disabled={this.state.fileList.length === 0}
                    loading={uploading}
                    style={{ marginTop: 16 }}
                >
                    {uploading ? '上传中...' : '开始上传'}
                </button>
            </div>
        );
    }
}
