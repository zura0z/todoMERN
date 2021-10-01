import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './Components/Header/Header';

import HomePage from './Pages/Home/HomePage';
import LoginPage from './Pages/Login/LoginPage';
import SignUpPage from './Pages/SignUp/SignUpPage';
import AccountSettingsPage from './Pages/AccountSettings/AccountSettingsPage';
import AddTodoPage from './Pages/AddTodoPage/AddTodoPage';
import MyPage from './Pages/MyPage/MyPage';

class App extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <Router>
                <Header />
                <Route path="/" exact component={HomePage} />
                <Route path="/login" exact component={LoginPage} />
                <Route path="/sign-up" exact component={SignUpPage} />
                <Route path="/account-settings" exact component={AccountSettingsPage} />
                <Route path={['/add-todo', '/edit-todo/:id']} exact component={AddTodoPage} />
                <Route path="/my-page" exact component={MyPage} />
                <Route path="/search/:keyword" exact component={MyPage} />
            </Router>
        );
    }
}

export default App;
