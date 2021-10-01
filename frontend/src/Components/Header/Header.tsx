import React from 'react';
import { Link, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import BaseComponent from '../Commons/Base.Component';

import { logout } from '../../actions/userActions';

import Logo from '../../utils/logo.png';
import './Header.css';

class Header extends BaseComponent<any, any> {
    userIconElement: React.RefObject<any>;

    constructor(props: any) {
        super(props);

        this.userIconElement = React.createRef();

        this.state = {
            showDropdown: 'init',
            userImage: this.userInfo?.image,
            searchKeyword: '',
        };

        this.searchHandler = this.searchHandler.bind(this);
    }

    // Lifecycle Methods
    componentDidUpdate(prevProps: any, prevState: any) {
        if (this.userInfo !== prevProps.userLogin.userInfo && this.userInfo) {
            this.setState({ showDropdown: 'init' });
        }

        if (this.state.showDropdown !== prevState.showDropdown) {
            if (this.state.showDropdown === true) {
                window.addEventListener('click', (e) => this.handleClickOutside.bind(this)(e));
            } else window.removeEventListener('click', (e) => this.handleClickOutside.bind(this)(e));
        }

        if (this.userInfoUpdate?.image !== prevProps.userUpdate.userInfo?.image && this.userInfoUpdate?.image) {
            this.setState({ userImage: this.userInfoUpdate.image });
        } else if (this.userInfo?.image !== prevProps.userLogin.userInfo?.image && this.userInfo?.image) {
            this.setState({ userImage: this.userInfo.image });
        }
    }

    // Getters
    get userInfo() {
        return this.props.userLogin.userInfo;
    }
    get userInfoUpdate() {
        return this.props.userUpdate.userInfo;
    }

    // Helper Functions
    handleDropdown() {
        if (this.state.showDropdown === 'init') {
            this.setState({ showDropdown: true });
            return;
        }
        this.setState({ showDropdown: !this.state.showDropdown });
    }

    handleClickOutside(e: any) {
        !this.userIconElement?.current?.contains(e.target) && this.setState({ showDropdown: false });
    }

    searchHandler(e: any, history: any) {
        e.preventDefault();

        if (this.state.searchKeyword) {
            const keyword = this.state.searchKeyword.trim();
            history.push(`/search/${keyword}`);
        } else history.push('/my-page');
    }

    // Render Methods
    _renderSearchForm(history: any) {
        return (
            <form className="header-search-form" onSubmit={(e) => this.searchHandler(e, history)}>
                <div className="header-search-container">
                    <i className="fas fa-search" />
                    <input
                        type="text"
                        placeholder="Let's find your todo"
                        className="header-search-input"
                        value={this.state.searchKeyword}
                        onChange={(e) => this.setState({ searchKeyword: e.target.value })}
                    />
                </div>
            </form>
        );
    }

    _renderGuestHeader() {
        return (
            <>
                <Link to="/login" className="header-button login-btn">
                    Log In
                </Link>
                <Link to="/sign-up" className="header-button signup-btn">
                    Sign Up
                </Link>
            </>
        );
    }

    _renderMemberHeader() {
        return (
            <>
                <Route render={({ history }) => this._renderSearchForm(history)} />
                <Link to="/add-todo" className="header-add-todo-link">
                    <button className="header-add-todo-container">
                        <i className="fas fa-plus" />
                    </button>
                </Link>
                <div className="header-user-container">
                    <img
                        src={this.state.userImage}
                        alt="userIcon"
                        className="header-userIcon"
                        onClick={this.handleDropdown.bind(this)}
                        ref={this.userIconElement}
                    />
                    <div
                        className={`header-user-dropdown-menu-container ${
                            this.state.showDropdown !== 'init' && (!this.state.showDropdown ? 'removeDropdown' : 'showDropdown')
                        }`}
                        hidden={this.state.showDropdown === 'init'}
                    >
                        <ul>
                            <li>
                                <Link to="/my-page">
                                    <i className="fas fa-user-circle" />
                                    <span>My Page</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/account-settings">
                                    <i className="fas fa-cog" />
                                    <span>Account Settings</span>
                                </Link>
                            </li>
                            <li onClick={() => this.props.logout()}>
                                <i className="fas fa-sign-out-alt" />
                                <span>Log Out</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </>
        );
    }

    render() {
        return (
            <header className="header-bg">
                <nav className="header-nav">
                    <ul className="header-ul">
                        <li className="header-li">
                            <Link to="/" className="header-link">
                                <img src={Logo} className="header-logo" alt="logo" />
                            </Link>
                        </li>
                        <li className="header-li">{this.session ? this._renderMemberHeader() : this._renderGuestHeader()}</li>
                    </ul>
                </nav>
            </header>
        );
    }
}

const mapStateToProps = (state: any) => ({
    userLogin: state.userLogin,
    userUpdate: state.userUpdate,
});

const mapDispatchToProps = (dispatch: any) => ({
    logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
