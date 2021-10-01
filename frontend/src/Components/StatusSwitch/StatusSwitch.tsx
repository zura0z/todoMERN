import React from 'react';

import './StatusSwitch.css';

class StatusSwitch extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            switchStyles: this.activeTodos,
        };
    }

    get activeTodos() {
        return {
            animationName: 'toLeft',
            background: 'linear-gradient(to right, #273297, #3242cd)',
        };
    }
    get doneTodos() {
        return { animationName: 'toRight', background: 'linear-gradient(to right, #279752, #32cd54)' };
    }

    changeStatus(status: string) {
        this.setState({ switchStyles: this[status] });
        this.props.setStatus(status);
    }

    render() {
        return (
            <div className="statusSwitch-container">
                <div className="statusSwitch-switch" style={this.state.switchStyles} />
                <div className="statusSwitch-btn" onClick={() => this.changeStatus('activeTodos')}>
                    Active
                </div>
                <div className="statusSwitch-btn" onClick={() => this.changeStatus('doneTodos')}>
                    Done
                </div>
            </div>
        );
    }
}

export default StatusSwitch;
