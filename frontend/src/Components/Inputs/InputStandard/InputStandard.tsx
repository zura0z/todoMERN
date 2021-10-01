import React from 'react';
import BaseComponent from '../../Commons/Base.Component';

import './InputStandard.css';

export enum InputType {
    text = 'text',
    number = 'number',
    password = 'password',
    date = 'date',
    time = 'time',
}

interface IProps {
    type: string;
    name: string;
    value?: string;
    defaultValue?: string;
    icon: string;
    label?: string;
    placeholder?: string;
    loading?: boolean;
    isValid?: boolean;
    required?: boolean;
    autoComplete?: string;
    readOnly?: boolean;
    getValue: (value: object) => void;
}

class InputStandard extends BaseComponent<IProps, any> {
    input: React.RefObject<any>;

    constructor(props: any) {
        super(props);

        this.input = React.createRef();

        this.state = {
            value: '',
        };
    }

    // Lifecycle Methods
    componentDidMount() {
        this.props.defaultValue && this._onChange(this.props.defaultValue);
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (this.props.value !== prevProps.value) {
            this.setState({ value: this.props.value || '' });
        }
    }

    // Getters
    get styles() {
        return {
            borderColor: this.props.isValid && !this.props.loading && '#ff0033',
            marginTop: this.props.label && '15px',
        };
    }

    // Helper Functions
    _onChange(value: any) {
        this.props.getValue({ [this.props.name]: value });
        this.setState({ value: value });
    }

    // Render Methods
    _renderLabel() {
        if (this.props.label) {
            return (
                <label htmlFor={this.props.name} style={{ color: this.props.isValid && '#ff0033' }} className="label">
                    {this.props.label}
                </label>
            );
        }
    }

    _renderInput() {
        return (
            <input
                ref={this.input}
                type={this.props.type}
                placeholder={this.props.placeholder}
                value={this.state.value}
                onChange={(e) => this._onChange(e.target.value)}
                required={this.props.required}
                autoComplete={this.props.autoComplete}
                readOnly={this.props.readOnly}
                className="input"
            />
        );
    }

    _renderTextarea() {
        return (
            <textarea
                ref={this.input}
                className="textarea"
                placeholder={this.props.placeholder}
                value={this.state.value}
                onChange={(e) => this._onChange(e.target.value)}
                required={this.props.required}
                autoComplete={this.props.autoComplete}
                readOnly={this.props.readOnly}
                rows={1}
            />
        );
    }

    render() {
        return (
            <div className="input-container" style={this.styles}>
                <i className={`${this.props.icon} icon`} />
                {this.props.name.includes('comment') ? this._renderTextarea() : this._renderInput()}
                {this._renderLabel()}
            </div>
        );
    }
}

export default InputStandard;
