import { React } from 'react';
import { Button } from 'antd';
import './addbar.css';

const AddBar = ()=> {
    return (
        <div className="add-bar">
            <div className="add-button">
                <Button type="primary">+</Button>
            </div>
        </div>
    )
}

export default AddBar;