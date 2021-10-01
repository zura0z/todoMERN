import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import { updateProfile, getProfile, logout } from '../../actions/userActions';
import { USER_UPDATE_RESET } from '../../constants/userConstants';

import BaseComponent from '../../Components/Commons/Base.Component';
import InputStandard, { InputType } from '../../Components/Inputs/InputStandard/InputStandard';
import InputFile from '../../Components/Inputs/InputFile/InputFile';
import Message from '../../Components/Message/Message';
import Button from '../../Components/Buttons/Button';

import './AccountSettingsPage.css';

class AccountSettingsPage extends BaseComponent<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            values: {},
            submitedValues: {},
            isSubmited: false,
            uploading: false,
            customError: null,
            customSuccess: null,
        };
    }

    // Lifecycle Methods
    componentDidMount() {
        this.props.getProfile();
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (this.success !== prevProps.userUpdate.success && this.success) {
            this.setState({
                customError: null,
                customSuccess: 'User Updated Successfully!',
            });
        }

        if (this.user !== prevProps.userGetProfile.user && this.user) {
            const { username, email, image } = this.user;
            this.setState({
                values: {
                    ...this.state.values,
                    username: username,
                    email: email,
                    imageName: image?.split('/')[2] || image?.split('/uploads')[1].substring(1),
                },
            });
        }

        if (this.error !== prevProps.userUpdate.error || this.getProfileError !== prevProps.userGetProfile.error) {
            if (this.getProfileError && this.getProfileError.endsWith('401')) {
                this.props.logout();
            } else if (this.error || this.getProfileError) {
                this.setState({ customError: this.error || this.getProfileError });
            } else {
                this.setState({ customError: null });
            }
        }

        if (this.success !== prevProps.userUpdate.success) {
            this.setState({ customError: null });
        }
    }

    // Getters
    get loading() {
        return this.props.userUpdate.loading;
    }
    get error() {
        return this.props.userUpdate.error;
    }
    get success() {
        return this.props.userUpdate.success;
    }
    get getProfileLoading() {
        return this.props.userGetProfile.loading;
    }
    get getProfileError() {
        return this.props.userGetProfile.error;
    }
    get user() {
        return this.props.userGetProfile.user;
    }

    // Helper Functions
    saveChangesHandler(e: any) {
        e.preventDefault();
        const { username, password, image } = this.state.values;

        this.setState({
            submitedValues: this.state.values,
            isSubmited: true,
        });

        if (!username || !password) {
            this.setState({ customError: 'Please fill out every field' });
            return 0;
        } else if (username && password && this.user) {
            this.props.updateProfile(this.user._id, username, password, image);
        }
    }

    getValues(value: object) {
        this.setState({ values: _.defaults(value, this.state.values) });
    }

    closeMessage() {
        this.setState({
            customError: null,
            customSuccess: null,
        });
        this.props.reset();
    }

    usernameValidation() {
        const reg = /^[a-zA-Z0-9_.]+$/;
        let validate = !reg.exec(this.state.submitedValues.username) && this.state.isSubmited;
        if (this.state.values.username !== this.state.submitedValues.username) validate = false;
        return validate;
    }

    passwordValidation() {
        let validate = false;
        if (!this.state.isSubmited) return 0;
        if (!this.state.submitedValues.password || (!this.state.submitedValues.password && this.state.isSubmited)) {
            validate = true;
        }
        if (this.state.values.password !== this.state.submitedValues.password) validate = false;

        return validate;
    }

    // Render Methods
    _renderError() {
        if (this.state.customError && !this.loading && !this.getProfileLoading) {
            return <Message close={() => this.closeMessage()}>{this.state.customError}</Message>;
        }
    }

    _renderSuccess() {
        if (this.state.customSuccess) {
            return (
                <Message type="success" close={() => this.closeMessage()}>
                    {this.state.customSuccess}
                </Message>
            );
        }
    }

    _renderContent() {
        return (
            <main className="account-settings-container">
                {this._renderSuccess()}
                {this._renderError()}
                <h1 className="account-settings-title">Edit Your Profile</h1>
                <form className="account-settings-form" noValidate onSubmit={this.saveChangesHandler.bind(this)}>
                    <InputStandard
                        type={InputType.text}
                        icon="fas fa-user"
                        name="username"
                        label="Username"
                        value={this.state.values.username}
                        getValue={(value: any) => this.getValues(value)}
                        isValid={this.usernameValidation() && (!this.loading || !this.getProfileLoading)}
                        required={true}
                        autoComplete="off"
                    />
                    <InputStandard
                        type={InputType.text}
                        icon="fas fa-envelope"
                        name="email"
                        label="Email"
                        value={this.state.values.email}
                        required={true}
                        autoComplete="off"
                        readOnly={true}
                    />
                    <InputStandard
                        type={InputType.password}
                        icon="fas fa-lock"
                        name="password"
                        label="New Password"
                        value={this.state.values.password}
                        getValue={(value: any) => this.getValues(value)}
                        isValid={this.passwordValidation() && (!this.loading || !this.getProfileLoading)}
                        required={true}
                        autoComplete="new-password"
                    />
                    <InputFile
                        icon="fas fa-camera"
                        label="Avatar"
                        value={this.state.values.imageName}
                        name="image"
                        getValue={(value: any) => this.getValues(value)}
                        setUploading={(isUploading: boolean) => this.setState({ uploading: isUploading })}
                    />

                    <Button type="submit" loading={this.loading || this.getProfileLoading || this.state.uploading} title="Save" />
                </form>
            </main>
        );
    }

    render() {
        return <>{!this.session ? <Redirect to="/" /> : this._renderContent()}</>;
    }
}

const mapStateToProps = (state: any) => ({
    userGetProfile: state.userGetProfile,
    userUpdate: state.userUpdate,
    userLogin: state.userLogin,
});

const mapDispatchToProps = (dispatch: any) => ({
    updateProfile: (id: string, username: string, password: string, image: string) => dispatch(updateProfile(id, username, password, image)),
    getProfile: () => dispatch(getProfile()),
    reset: () => dispatch({ type: USER_UPDATE_RESET }),
    logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettingsPage);
