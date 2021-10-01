import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import BaseComponent from '../../Components/Commons/Base.Component';
import InputStandard, { InputType } from '../../Components/Inputs/InputStandard/InputStandard';
import Message from '../../Components/Message/Message';
import Button from '../../Components/Buttons/Button';
import SmallText from '../../Components/SmallText/SmallText';

import { login, logout } from '../../actions/userActions';

import './LoginPage.css';

class LoginPage extends BaseComponent<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            values: {},
            customError: null,
        };
    }

    // Getters
    get loading() {
        return this.props.userLogin.loading;
    }
    get error() {
        return this.props.userLogin.error;
    }
    get userInfo() {
        return this.props.userLogin.userInfo;
    }

    get commonProps() {
        return {
            getValue: (value: object) => this.getValues(value),
            loading: this.loading,
            isValid: this.error || this.state.customError,
        };
    }

    // Helper Functions
    getValues(value: object) {
        this.setState({ values: _.defaults(value, this.state.values) });
    }

    closeError() {
        this.setState({ customError: null });
        this.props.close();
    }

    loginHandler = (e: any) => {
        e.preventDefault();
        const { email, password } = this.state.values;

        if (!email || !password) {
            this.setState({ customError: 'Please fill out both fields' });
        } else {
            this.props.login(email, password);
        }
    };

    // Render Methods
    _renderError() {
        if ((this.error || this.state.customError) && !this.loading) {
            return <Message close={() => this.closeError()}>{this.error || this.state.customError}</Message>;
        }
    }

    _renderContent() {
        return (
            <main className="login-container">
                {this._renderError()}
                <h1 className="login-title">Log In</h1>
                <form className="login-form" onSubmit={this.loginHandler}>
                    <InputStandard
                        type={InputType.text}
                        name="email"
                        icon="fas fa-envelope"
                        placeholder="What's your email"
                        {...this.commonProps}
                    />
                    <InputStandard
                        type={InputType.password}
                        name="password"
                        icon="fas fa-lock"
                        placeholder="Enter your password"
                        {...this.commonProps}
                    />
                    <Button type="submit" title="Log In" loading={this.loading} />
                </form>
                <SmallText message="Do not have an account?" link="/sign-up" linkText="Sign Up" />
            </main>
        );
    }

    render() {
        return <>{this.session ? <Redirect to="/" /> : this._renderContent()}</>;
    }
}

const mapStateToProps = (state: any) => ({
    userLogin: state.userLogin,
});

const mapDispatchToProps = (dispatch: any) => ({
    login: (email: string, password: string) => dispatch(login(email, password)),
    close: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
