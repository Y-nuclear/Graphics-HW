import React from 'react';
import { List } from 'antd';

class ObjectList extends React.Component {

    render() {
        const { objects } = this.props;
        console.log(objects);
        return (
            <div>
                <h2>Object List</h2>
                <List
                    dataSource={objects}
                    renderItem={(object) => (
                        <List.Item>{object.name}</List.Item>
                    )}
                />
            </div>
        );
    }
}

export default ObjectList;
