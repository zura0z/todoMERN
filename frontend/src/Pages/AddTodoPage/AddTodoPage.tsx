import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import _ from 'lodash';

import { addTodo, getTodo, editTodo } from '../../actions/todoActions';
import { logout } from '../../actions/userActions';
import Button from '../../Components/Buttons/Button';
import BaseComponent from '../../Components/Commons/Base.Component';
import InputStandard, { InputType } from '../../Components/Inputs/InputStandard/InputStandard';

import Message from '../../Components/Message/Message';
import { TODO_ADD_RESET, TODO_EDIT_RESET, TODO_GET_RESET } from '../../constants/todoConstants';

import './AddTodoPage.css';

class AddTodoPage extends BaseComponent<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            values: {},
            submitedValues: {},
            isSubmited: false,
            customError: '',
        };
    }

    // Lifecycle Methods
    componentDidMount() {
        if (this.todoId) {
            this.props.getTodo(this.todoId);
        }
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (this.success !== (prevProps.todoAdd.success || prevProps.todoEdit.success) && this.success) {
            return this.setState({ isSubmited: false });
        }

        if (this.todo !== prevProps.todoGet.todo) {
            if (this.todo) {
                this.setState({
                    values: {
                        name: this.todo.name,
                        comment: this.todo.comment,
                        deadlineDate: this.deadlineDate,
                        deadlineTime: this.deadlineTime,
                    },
                });
            }
        }

        if (this.error !== (prevProps.todoAdd.error || prevProps.todoEdit.error || prevProps.todoGet.error)) {
            if (this.error && this.error.endsWith('401')) {
                this.props.logout();
            }
        }

        if (this.todoId !== prevProps.match.params.id && !this.todoId) {
            this.setState({ values: { name: '', comment: '', deadlineDate: this.getToday(), deadlineTime: '' } });
            this.props.reset();
        }
    }

    componentWillUnmount() {
        this.props.reset();
    }

    // Getters
    get userInfo() {
        return this.props.userLogin.userInfo;
    }
    get loading() {
        return this.props.todoAdd.loading || this.props.todoGet.loading || this.props.todoEdit.loading;
    }
    get success() {
        return this.props.todoAdd.success || this.props.todoEdit.success;
    }
    get error() {
        return this.props.todoAdd.error || this.props.todoGet.error || this.props.todoEdit.error;
    }
    get todoId() {
        return this.props.match.params.id;
    }
    get todo() {
        return this.props.todoGet.todo;
    }
    get deadlineTime() {
        return this.todo.deadline.split('T')[1].slice(0, 5);
    }
    get deadlineDate() {
        return this.todo.deadline.split('T')[0];
    }

    // Helper Functions
    handleAddTodo(e: any) {
        e.preventDefault();
        this.setState({
            submitedValues: this.state.values,
            isSubmited: true,
        });

        const { name, comment, deadlineDate, deadlineTime } = this.state.values;

        if (this.nameValidation()) {
            this.setState({ customError: 'Todo Name is required field' });
        } else if (!/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.exec(deadlineTime)) {
            this.setState({ customError: 'Invalid deadline time' });
        } else {
            this.setState({ customError: null });
            if (this.todoId) {
                this.props.editTodo({ name, comment, deadline: `${deadlineDate} ${deadlineTime}`, status: 0, _id: this.todoId });
            } else {
                this.props.addTodo(name, comment, `${deadlineDate} ${deadlineTime}`, 0);
            }
        }
    }

    getValues(value: object) {
        this.setState({ values: _.defaults(value, this.state.values) });
    }

    getToday() {
        const date = new Date();
        const dateT = date.toLocaleDateString().split('/');
        return `${dateT[2]}-${dateT[0].length === 1 ? '0' + dateT[0] : dateT[0]}-${dateT[1].length === 1 ? '0' + dateT[1] : dateT[1]}`;
    }

    nameValidation() {
        const reg = /^[a-zA-Z0-9_.]+$/;
        let validate = !reg.exec(this.state.submitedValues.name) && this.state.isSubmited;
        if (this.state.values.name !== this.state.submitedValues.name) validate = false;
        if (!this.state.values.name && this.state.isSubmited) validate = true;

        return validate;
    }

    timeValidation() {
        const reg = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        let validate = !reg.exec(this.state.submitedValues.deadlineTime) && this.state.isSubmited;
        if (this.state.values.deadlineTime !== this.state.submitedValues.deadlineTime) validate = false;
        return validate;
    }

    closeMessage() {
        this.setState({ customError: null });
        this.props.reset();
    }

    // Render Methods
    _renderError() {
        if ((this.state.customError || this.error) && !this.loading) {
            return <Message close={() => this.closeMessage()}>{this.error || this.state.customError}</Message>;
        }
    }

    _renderSuccess() {
        if (this.success) {
            return (
                <Message type="success" close={() => this.closeMessage()}>
                    Todo {this.todoId ? 'Edited' : 'Added'} Successfully!
                </Message>
            );
        }
    }

    _renderContent() {
        return (
            <main className="add-todo-container">
                {this._renderSuccess()}
                {this._renderError()}
                <h1 className="add-todo-title">{this.todoId ? 'Edit' : 'Add'} Todo</h1>
                <form className="add-todo-form" onSubmit={this.handleAddTodo.bind(this)}>
                    <InputStandard
                        name="name"
                        icon="fa fa-check-square"
                        placeholder="Todo Name"
                        type={InputType.text}
                        isValid={this.nameValidation() && !this.loading}
                        value={this.state.values.name}
                        getValue={(value: object) => this.getValues(value)}
                    />
                    <InputStandard
                        name="comment"
                        icon="fas fa-comment-dots"
                        placeholder="Comment"
                        type={InputType.text}
                        value={this.state.values.comment}
                        getValue={(value: object) => this.getValues(value)}
                    />
                    <InputStandard
                        name="deadlineDate"
                        icon="fas fa-calendar"
                        label="Deadline Date"
                        type={InputType.date}
                        defaultValue={this.getToday()}
                        value={this.state.values.deadlineDate}
                        getValue={(value: object) => this.getValues(value)}
                    />
                    <InputStandard
                        name="deadlineTime"
                        icon="fas fa-clock"
                        label="Deadline Time"
                        type={InputType.time}
                        isValid={this.timeValidation() && !this.loading}
                        value={this.state.values.deadlineTime}
                        getValue={(value: object) => this.getValues(value)}
                    />
                    <Button type="submit" title={`${this.todoId ? 'Edit' : 'Add'} Todo`} loading={this.loading} />
                </form>
            </main>
        );
    }

    render() {
        return <>{!this.session ? <Redirect to="/" /> : this._renderContent()}</>;
    }
}

const mapStateToProps = (state: any) => ({
    userLogin: state.userLogin,
    todoAdd: state.todoAdd,
    todoGet: state.todoGet,
    todoEdit: state.todoEdit,
});

const mapDispatchToProps = (dispatch: any) => ({
    addTodo: (name: string, comment: string, deadlineDate: string, status: number) => dispatch(addTodo(name, comment, deadlineDate, status)),
    getTodo: (id: string) => dispatch(getTodo(id)),
    editTodo: (todo: any) => dispatch(editTodo(todo)),
    reset: () => {
        dispatch({ type: TODO_ADD_RESET });
        dispatch({ type: TODO_GET_RESET });
        dispatch({ type: TODO_EDIT_RESET });
    },
    logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddTodoPage);
