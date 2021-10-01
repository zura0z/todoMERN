import BaseComponent from '../Commons/Base.Component';
import { Link } from 'react-router-dom';

import './SmallText.css';

export interface IProps {
    message: string;
    link: string;
    linkText: string;
}

class SmallText extends BaseComponent<IProps> {
    render() {
        return (
            <small className="small-text">
                {this.props.message} <Link to={this.props.link}>{this.props.linkText}</Link>
            </small>
        );
    }
}

export default SmallText;
