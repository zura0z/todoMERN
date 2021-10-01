import React from 'react';

import './ProgressBar.css';

interface IProps {
    start: any;
    value: any;
    deadline: any;
    status: number;
    tooltipText: string;
}

class ProgressBar extends React.Component<IProps, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            showTooltips: false,
        };
    }

    // Getters
    get isCompleated() {
        return this.props.value >= this.props.deadline || this.props.status;
    }

    get valuesForBar() {
        const q = Math.abs(this.props.value - this.props.start);
        const d = Math.abs(this.props.deadline - this.props.start);

        return [q, d];
    }

    get width() {
        return this.isCompleated ? '100%' : `${Math.floor((this.valuesForBar[0] / this.valuesForBar[1]) * 100)}%`;
    }

    get compleatedStyles() {
        return {
            background: this.props.status ? 'linear-gradient(to right, #279752, #32cd54)' : 'linear-gradient(to right, #972727, #cd3232)',
            borderRadius: '4px',
            border: 'none',
        };
    }

    get blueBarStyles() {
        if (this.isCompleated) return { width: this.width, ...this.compleatedStyles };
        return {
            width: this.width,
        };
    }

    get redBarStyles() {
        if (this.isCompleated) return { border: 'none' };
        return {
            width: `${100 - Math.floor((this.valuesForBar[0] / this.valuesForBar[1]) * 100)}%`,
        };
    }

    // Helper Functions
    msToTime(ms: any) {
        const h = Math.floor(ms / 1000 / 60 / 60);
        const m = Math.floor((ms / 1000 / 60 / 60 - h) * 60);
        const s = Math.floor(((ms / 1000 / 60 / 60 - h) * 60 - m) * 60);

        const seconds: string = s < 10 ? `0${s}` : `${s}`;
        const minutes: string = m < 10 ? `0${m}` : `${m}`;
        const hours: string = h < 10 ? `0${h}` : `${h}`;

        if (h) return `${hours}h ${minutes}m ${seconds}s`;
        return `${minutes}m ${seconds}s`;
    }

    // Render Methods
    _renderTooltips() {
        if (this.state.showTooltips) {
            const timeRemaining = this.msToTime(this.props.deadline - this.props.value);
            const bottomText = this.isCompleated ? (this.props.status ? 'Done!' : "Time's Up!") : `${timeRemaining} Remaining`;
            return (
                <div className="tooltips-container">
                    <div className="tooltipText">
                        <span>{this.props.tooltipText}</span>
                    </div>
                    <div className="timeRemaining">
                        <span>{bottomText}</span>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div
                className="progressBar-container"
                onMouseOver={() => !this.state.showTooltips && this.setState({ showTooltips: true })}
                onMouseOut={() => this.setState({ showTooltips: false })}
            >
                <div className="progressBarRed" style={this.blueBarStyles} />
                <div className="progressBarBlue" style={this.redBarStyles} />
                <span className="progressBar-value">{this.width}</span>
                {this._renderTooltips()}
            </div>
        );
    }
}

export default ProgressBar;
