import { connect } from 'react-redux';
import _ from 'lodash';
import { Link, Redirect } from 'react-router-dom';
import StackGrid, { transitions } from 'react-stack-grid';
import sizeMe from 'react-sizeme';

import BaseComponent from '../../Components/Commons/Base.Component';

import Loader from '../../Components/Loader/Loader';
import Message from '../../Components/Message/Message';
import TodoCard from '../../Components/Todo/Todo';
import DeleteModal from '../../Components/DeleteModal/DeleteModal';
import StatusSwitch from '../../Components/StatusSwitch/StatusSwitch';

import { getAllTodos } from '../../actions/todoActions';
import { logout } from '../../actions/userActions';
import { TODO_GET_ALL_RESET } from '../../constants/todoConstants';

import noTodos from '../../utils/noTodos.gif';
import travolta from '../../utils/travolta.gif';
import emptyTodos from '../../utils/emptyTodos.png';

import './MyPage.css';

interface Todo {
    _id: string;
    name: string;
    comment?: string;
    deadline: string;
    status: number;
    createdAt: string;
    updatedAt: string;
}

class MyPage extends BaseComponent<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            activeTodos: [],
            doneTodos: [],
            todoState: 'activeTodos',
            openDeleteModal: false,
            selectedTodo: null,
        };
    }

    // Lifecycle Methods
    componentDidMount() {
        this.props.getAllTodos(this.keyword);
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (this.todos !== prevProps.todoGetAll.todos && this.todos?.length) {
            const activeTodos = this.todos.filter((todo: Todo) => todo.status === 0);
            const doneTodos = this.todos.filter((todo: Todo) => todo.status === 1);
            this.setState({ activeTodos: activeTodos, doneTodos: doneTodos });
        }

        if (this.keyword !== prevProps.match.params.keyword) {
            this.setState({ activeTodos: [], doneTodos: [] }, () => {
                this.props.reset();
                this.props.getAllTodos(this.keyword);
            });
        }

        if (this.error !== prevProps.todoGetAll.error) {
            if (this.error && this.error.endsWith('401')) {
                this.props.logout();
            }
        }
    }

    // Getters
    get loading() {
        return this.props.todoGetAll.loading;
    }

    get todos() {
        return this.props.todoGetAll.todos;
    }

    get error() {
        return this.props.todoGetAll.error;
    }

    get columnWidth() {
        return this.props.size.width <= 1050 && this.props.size.width >= 750 ? '50%' : this.props.size.width <= 750 ? '100%' : '33.33%';
    }

    get containerStyles() {
        const noTodosStyles = {
            display: 'flex',
            Position: 'relative', //
            justifyContent: 'center',
            minHeight: '80vh',
        };
        const haveTodosStyles = {
            padding: `0 ${this.props.size.width <= 750 ? '3px' : '20px'}`,
        };
        return this.todos && !this.todos.length ? noTodosStyles : haveTodosStyles;
    }

    get keyword() {
        return this.props.match.params.keyword;
    }

    // Helper Functions
    openDeleteModal(todo: any) {
        this.setState({ openDeleteModal: true, selectedTodo: todo });
    }

    closeDeleteModal() {
        this.setState({ openDeleteModal: false, selectedTodo: null });
    }

    removeTodo(todo: Todo) {
        let todos = this.state[this.state.todoState];
        todos = _.without(todos, todo);
        this.setState({ [this.state.todoState]: todos });
    }

    markAsDone(todo: Todo) {
        let doneTodos = this.state.doneTodos;
        doneTodos = doneTodos.unshift(todo);

        this.removeTodo(todo);
    }

    // Render Methods
    _renderError() {
        if (this.error) {
            return <Message close={() => this.props.reset()}>{this.error}</Message>;
        }
    }

    _renderNoTodos() {
        if (this.todos && !this.todos.length && !this.keyword) {
            return (
                <section className="my-page-no-todos">
                    <h1 className="my-page-no-todos-title">You have no Todos</h1>
                    <img className="my-page-empty-image" src={emptyTodos} alt="empty" />
                    <img className="my-page-no-todos-image" src={noTodos} alt="No Todos?" />
                    <Link className="my-page-no-todos-link" to="/add-todo">
                        <button className="my-page-no-todos-btn">Create your first Todo</button>
                    </Link>
                </section>
            );
        }
        if (this.todos && !this.todos.length && this.keyword) {
            return (
                <section className="my-page-no-todos">
                    <h1 className="my-page-no-todos-title">Woops, Todo not found</h1>
                    <img className="my-page-no-todos-image" src={travolta} alt="Todos not found" />
                    <Link className="my-page-no-todos-link" to="/my-page">
                        <button className="my-page-no-todos-btn">See All Todos</button>
                    </Link>
                </section>
            );
        }
    }

    _renderDeleteModal() {
        if (this.state.openDeleteModal) {
            return (
                <DeleteModal
                    todo={this.state.selectedTodo}
                    remove={(todo: Todo) => this.removeTodo(todo)}
                    close={() => this.closeDeleteModal()}
                />
            );
        }
    }

    _renderStatusSwitch() {
        if (!this.loading && this.todos?.length) {
            return <StatusSwitch setStatus={(status: string) => this.setState({ todoState: status })} />;
        }
    }

    _renderTodos() {
        return this.state[this.state.todoState]?.map((todo: Todo) => (
            <TodoCard
                key={todo._id}
                todo={todo}
                markAsDone={(todo: Todo) => this.markAsDone(todo)}
                openDeleteModal={(todo: any) => this.openDeleteModal(todo)}
            />
        ));
    }

    _renderContent() {
        return (
            <main className="my-page-container" style={this.containerStyles}>
                <Loader loading={this.loading} />

                {this._renderError()}
                {this._renderNoTodos()}
                {this._renderDeleteModal()}
                {this._renderStatusSwitch()}

                <StackGrid
                    columnWidth={this.columnWidth}
                    appear={transitions.scaleUp.appear}
                    appeared={transitions.scaleUp.appeared}
                    enter={transitions.scaleUp.enter}
                    entered={transitions.scaleUp.entered}
                    leaved={transitions.flip.leaved}
                    easing="ease-in"
                    duration={400}
                    className="my-page-todos"
                    monitorImagesLoaded={true}
                >
                    {this._renderTodos()}
                </StackGrid>
            </main>
        );
    }

    render() {
        return <>{!this.session ? <Redirect to="/" /> : this._renderContent()}</>;
    }
}

const mapStateToProps = (state: any) => ({
    userLogin: state.userLogin,
    todoGetAll: state.todoGetAll,
});

const mapDispatchToProps = (dispatch: any) => ({
    getAllTodos: (keyword: string) => dispatch(getAllTodos(keyword)),
    reset: () => dispatch({ type: TODO_GET_ALL_RESET }),
    logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(sizeMe()(MyPage));
