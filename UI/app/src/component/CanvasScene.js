// canvas组件，可以添加各种Object

import React, { Component } from 'react';
import {Triangle,Rectangle,Cube} from '../GL/BasicProperty';

class CanvasScene extends Component {
    constructor(props){
        super(props);
        this.state = {
            canvas: null,
            gl: null,
            objects: []
        }
        
    }
    componentDidMount(){
        var canvas = document.getElementById('canvas');
        var gl = canvas.getContext('webgl');
        this.setState({
            canvas: canvas,
            gl: gl,
            objects: [new Cube(gl)]
        });
        
    }
    componentDidUpdate(){
        // console.log(this.state.objects);
        var gl = this.state.gl;
        var objects = this.state.objects;
        gl.clear(gl.COLOR_BUFFER_BIT);
        for(var i = 0;i < objects.length;i++){
            objects[i].glRotate(0.5,0,0,1);
            objects[i].glTranslate(0.2,0,0);
            objects[i].update();
            console.log(objects[i].modelMatrix.elements);

            objects[i].render();
        }
    }
    // 添加物体
    addObject(object){
        var objects = this.state.objects;
        objects.push(object);
        this.setState({
            objects: objects
        });
    }
    // 删除物体
    removeObject(object){
        var objects = this.state.objects;
        var index = objects.indexOf(object);
        if(index !== -1){
            objects.splice(index,1);
        }
        this.setState({
            objects: objects
        });
    }
    // 添加canvas事件
    addEvent(type,func){
        var canvas = this.state.canvas;
        canvas.addEventListener(type,func);
    }
    // 删除canvas事件
    removeEvent(type,func){
        var canvas = this.state.canvas;
        canvas.removeEventListener(type,func);
    }
    render() {
        return (
            <div>
                <canvas id="canvas" width={500} height={500} style={
                    {
                        border: '1px solid #000',
                        margin: '10px auto',
                        display: 'block',
                        background: '#ffd0d0'
                    }
                }>canvas</canvas>
            </div>
        );
    }
}
export default CanvasScene;