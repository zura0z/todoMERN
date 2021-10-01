import React from 'react';
import axios from 'axios';

import BaseComponent from '../../Commons/Base.Component';

import '../InputStandard/InputStandard.css';

export interface IProps {
    name: string;
    value?: string;
    icon: string;
    label?: string;
    setUploading: (isUploading: boolean) => void;
    getValue: (value: object) => void;
}

class InputFile extends BaseComponent<IProps, any> {
    input: React.RefObject<any>;

    constructor(props: any) {
        super(props);

        this.input = React.createRef();

        this.state = {
            value: '',
        };
    }


    // Lifecycle Methods
    componentDidUpdate(prevProps: any, prevState: any) {
        if (this.props.value !== prevProps.value && this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    // Helper Functions
    _onChange(value: any) {
        this.props.getValue({ [this.props.name]: value, imageName: value.split('/uploads')[1].substring(1) });
        this.setState({ value: value.split('/uploads')[1].substring(1) });
    }

    uploadFileHandler = async (e: any) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        if (file) {
            this.props.setUploading(true);
            try {
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                };

                const { data } = await axios.post('/api/upload', formData, config);
                this._onChange(data);

                this.props.setUploading(false);
            } catch (err) {
                console.error(err);
                this.props.setUploading(false);
            }
        }
    };

    // Render Methods
    _renderLabel() {
        if (this.props.label) {
            return (
                <label htmlFor={this.props.name} className="label">
                    {this.props.label}
                </label>
            );
        }
    }

    render() {
        return (
            <div className="input-container fileInput" onClick={() => this.input.current.click()} style={{ marginTop: '12px' }}>
                <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/png, image/jpeg"
                    onChange={this.uploadFileHandler}
                    ref={this.input}
                    hidden
                />
                <i className={`${this.props.icon} icon`} />
                <input type="text" value={this.state.value} onChange={(e) => this._onChange(e)} readOnly={true} className="input fileInput" />
                {this._renderLabel()}
            </div>
        );
    }
}

export default InputFile;
