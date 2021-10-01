import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import { logout, register } from '../../actions/userActions';
import Button from '../../Components/Buttons/Button';
import BaseComponent from '../../Components/Commons/Base.Component';
import InputStandard, { InputType } from '../../Components/Inputs/InputStandard/InputStandard';
import Message from '../../Components/Message/Message';
import SmallText from '../../Components/SmallText/SmallText';

import './SignUpPage.css';

class SignUpPage extends BaseComponent<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            values: {},
            submitedValues: {},
            customError: null,
            isSubmited: false,
        };
    }

    // Getters
    get loading() {
        return this.props.userRegister.loading;
    }

    get error() {
        return this.props.userRegister.error;
    }

    get userInfo() {
        return this.props.userRegister.userInfo;
    }

    // Validations
    usernameValidation() {
        const reg = /^[a-zA-Z0-9_.]+$/;
        let validate = !reg.exec(this.state.submitedValues.username) && this.state.isSubmited;
        if (this.state.values.username !== this.state.submitedValues.username) validate = false;
        if (!this.state.values.username && this.state.isSubmited) validate = true;

        return validate;
    }

    emailValidation() {
        const reg = /\S+@\S+\.\S+/;
        let validate = (!reg.test(this.state.submitedValues.email) && this.state.isSubmited) || this.error === 'User already exists';
        if (this.state.values.email !== this.state.submitedValues.email) validate = false;
        return validate;
    }

    passwordValidation() {
        let validate = false;
        if (
            this.state.submitedValues.password !== this.state.submitedValues.confirmPassword ||
            (!this.state.submitedValues.password && this.state.isSubmited)
        ) {
            validate = true;
        }
        if (this.state.values.password !== this.state.submitedValues.password) validate = false;

        return validate;
    }

    // Helper Functions
    getValues(value: object) {
        this.setState({ values: _.defaults(value, this.state.values) });
    }

    signUpHandler = (e: any) => {
        e.preventDefault();

        this.setState({ submitedValues: this.state.values, isSubmited: true });

        if (
            this.state.values.password === this.state.values.confirmPassword &&
            this.state.values.password &&
            this.state.values.confirmPassword
        ) {
            this.props.register(this.state.values.username, this.state.values.email, this.state.values.password);
        } else if (!this.state.values.password || !this.state.values.confirmPassword) {
            this.setState({ customError: 'Please fill out every field' });
        } else {
            this.setState({ customError: "Passwords don't match" });
        }
    };

    closeError() {
        this.setState({ customError: null });
        this.props.close();
    }

    // Render Methods
    _renderError() {
        if ((this.error || this.state.customError) && !this.loading) {
            return <Message close={() => this.closeError()}>{this.error || this.state.customError}</Message>;
        }
    }

    _renderContent() {
        return (
            <main className="signUp-container">
                {this._renderError()}
                <h1 className="signUp-title">Sing Up</h1>
                <form className="signUp-form" noValidate onSubmit={this.signUpHandler}>
                    <InputStandard
                        type={InputType.text}
                        icon="fas fa-user"
                        name="username"
                        getValue={(value: any) => this.getValues(value)}
                        isValid={this.usernameValidation() && !this.loading}
                        label="Username"
                        required={true}
                        autoComplete="off"
                    />
                    <InputStandard
                        type={InputType.text}
                        icon="fas fa-envelope"
                        name="email"
                        getValue={(value: any) => this.getValues(value)}
                        isValid={this.emailValidation() && !this.loading}
                        label="What's your email"
                        required={true}
                        autoComplete="off"
                    />
                    <InputStandard
                        type={InputType.password}
                        icon="fas fa-lock"
                        name="password"
                        getValue={(value: any) => this.getValues(value)}
                        isValid={this.passwordValidation() && !this.loading}
                        label="Password"
                        required={true}
                        autoComplete="new-password"
                    />
                    <InputStandard
                        type={InputType.password}
                        icon="fas fa-lock"
                        name="confirmPassword"
                        getValue={(value: any) => this.getValues(value)}
                        isValid={this.passwordValidation() && !this.loading}
                        label="Confirm Password"
                        required={true}
                        autoComplete="new-password"
                    />
                    <Button type="submit" loading={this.loading} title="Sign Up" />
                </form>
                <SmallText message="Already have an account?" link="/login" linkText="Log In" />
            </main>
        );
    }

    render() {
        return <>{this.session ? <Redirect to="/" /> : this._renderContent()}</>;
    }
}

const mapStateToProps = (state: any) => ({
    userRegister: state.userRegister,
    userLogin: state.userLogin,
});

const mapDispatchToProps = (dispatch: any) => ({
    register: (username: string, email: string, password: string) => dispatch(register(username, email, password)),
    close: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUpPage);
