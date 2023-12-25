import React from 'react';
import {Slider} from 'antd';
class ObjectBox extends React.Component {
    constructor(props) {
        super(props);
        if (props.obj == undefined || props.obj == null) {
            var obj = {
                id: 'default',
                materials: {
                    ambient: 0.1,
                    diffuse: 0.1,
                    specular: 0.1,
                    shininess: 0.1,
                    strength: 0.1,
                }
            };
            this.state = {
                objectId: props.objectId,
                obj: obj,
            };
            console.log(obj)
        }
        else{
            this.state = {
                objectId: props.objectId,
                obj: props.obj,
            };
        }
        
    }
    componentWillReceiveProps(props) {
        if (props.obj == undefined || props.obj == null) {
            var obj = {
                id: 'default',
                materials: {
                    ambient: 0.1,
                    diffuse: 0.1,
                    specular: 0.1,
                    shininess: 0.1,
                    strength: 0.1,
                }
            };
            this.state = {
                objectId: props.objectId,
                obj: obj,
            };
            console.log(obj)
        }
        else{
            this.state = {
                objectId: props.objectId,
                obj: props.obj,
            };
        }
    }
    onAmbientChange = (value) => {
        this.setState({
            obj: {
                ...this.state.obj,
                materials: {
                    ...this.state.obj.materials,
                    ambient: [value,value,value]
                }
            }
        });
    }
    onDiffuseChange = (value) => {
        this.state.obj.materials.diffuse = [value,value,value];
    }
    onSpecularChange = (value) => {
        this.state.obj.materials.specular = [value,value,value];
    }
    onShininessChange = (value) => {
        this.state.obj.materials.shininess = value;
    }
    onStrengthChange = (value) => {
        this.state.obj.materials.strength = value;
    }

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%',width:'100%', padding:'0 auto'}}>
                <p>obj Id: {this.state.objectId}</p>
                <p>obj Name: {this.state.obj.id}</p>
                <p>obj Type: {this.state.obj.constructor.name}</p>
                <div className='material'>
                    <p>Material:</p>
                    <li>ambient: {this.state.obj.materials.ambient[0]}</li>
                    <Slider min={0} max={1} step={0.01} defaultValue={this.state.obj.materials.ambient[0]} onChange={this.props.onAmbientChange}/>
                    <li>diffuse: {this.state.obj.materials.diffuse[0]}</li>
                    <Slider min={0} max={1} step={0.01} defaultValue={this.state.obj.materials.diffuse[0]} onChange={this.props.onDiffuseChange}/>
                    <li>specular: {this.state.obj.materials.specular[0]}</li>
                    <Slider min={0} max={1} step={0.01} defaultValue={this.state.obj.materials.specular[0]} onChange={this.props.onSpecularChange}/>
                    <li>shininess: {this.state.obj.materials.shininess}</li>
                    <Slider min={0} max={1} step={0.01} defaultValue={this.state.obj.materials.shininess[0]} onChange={this.props.onShininessChange}/>
                    <li>strength: {this.state.obj.materials.strength}</li>
                    <Slider min={0} max={1} step={0.01} defaultValue={this.state.obj.materials.strength[0]} onChange={this.props.onStrengthChange}/>

                </div>
            </div>
        );
    }
    
};

export default ObjectBox;
