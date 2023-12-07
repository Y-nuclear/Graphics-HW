// 写一个canvas组件，可以添加各种Object

import React, { Component } from 'react';
import {Triangle} from '../GL/BasicProperty';

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
            objects: [new Triangle(gl)]
        });
        
    }
    componentDidUpdate(){
        // console.log(this.state.objects);
        var gl = this.state.gl;
        var objects = this.state.objects;
        gl.clear(gl.COLOR_BUFFER_BIT);
        for(var i = 0;i < objects.length;i++){
            objects[i].render();
        }
    }
    addObject(object){
        var objects = this.state.objects;
        objects.push(object);
        this.setState({
            objects: objects
        });
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