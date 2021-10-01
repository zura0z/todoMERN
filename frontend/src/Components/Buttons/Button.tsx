import BaseComponent from '../Commons/Base.Component';
import loadingBtn from '../../utils/btnLoading.gif';

import './Button.css';

export interface IProps {
    title: string;
    loading: boolean;
    type: 'submit' | 'button';
}

class Button extends BaseComponent<IProps, any> {
    render() {
        return (
            <button type={this.props.type} className="button" disabled={this.props.loading}>
                {this.props.loading ? <img src={loadingBtn} className="loadingGif" alt="loading" /> : this.props.title}
            </button>
        );
    }
}

export default Button;
