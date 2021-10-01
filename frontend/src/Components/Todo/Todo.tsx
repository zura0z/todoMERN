import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ProgressBar from '../ProgressBar/ProgressBar';

import { doneTodo } from '../../actions/todoActions';

import './Todo.css';

class Todo extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {
            time: new Date().getTime() + 4 * 60 * 60 * 1000,
        };
    }

    // Lifecycle Methods
    componentDidMount() {
        if (this.state.time <= Date.parse(this.todo.deadline)) {
            setInterval(() => this.setState({ time: new Date().getTime() + 4 * 60 * 60 * 1000 }), 1000);
        }
    }

    // Getters
    get todo() {
        return this.props.todo;
    }
    get createdAt() {
        return moment.utc(this.props.todo.createdAt).format('MMM Do, HH:mm');
    }
    get deadline() {
        return moment.utc(this.props.todo.deadline).format('MMM Do, HH:mm');
    }
    get loading() {
        return this.props.todoMarkAsDone.loading;
    }
    get success() {
        return this.props.todoMarkAsDone.success;
    }

    // Helper Functions
    markAsDone() {
        this.props.doneTodo(this.todo._id);
        this.props.markAsDone(this.todo);
    }

    // Render Methods
    _renderButtons() {
        if (this.todo.status === 0) {
            return (
                <div className="todoCard-buttons">
                    <button className="todoCard-doneBtn" onClick={() => this.markAsDone()} disabled={this.loading}>
                        <i className="fas fa-check" />
                    </button>
                    <Link className="todoCard-editBtn" to={`edit-todo/${this.todo._id}`}>
                        <i className="fas fa-edit" />
                    </Link>
                    <button className="todoCard-deleteBtn" onClick={() => this.props.openDeleteModal(this.todo)} disabled={this.loading}>
                        <i className="fas fa-trash" />
                    </button>
                </div>
            );
        }
        return (
            <button className="todoCard-doneDeleteBtn" onClick={() => this.props.openDeleteModal(this.todo)} disabled={this.loading}>
                <i className="fas fa-trash" />
            </button>
        );
    }

    render() {
        return (
            <div key={this.todo._id} className="todoCard-container">
                <h1 className="todoCard-name">{this.todo.name}</h1>
                <p className="todoCard-comment">{this.todo.comment}</p>
                <ProgressBar
                    start={Date.parse(this.todo.createdAt)}
                    value={this.state.time}
                    deadline={Date.parse(this.todo.deadline)}
                    status={this.todo.status}
                    tooltipText={`Created: ${this.createdAt} || Deadline: ${this.deadline}`}
                />
                {this._renderButtons()}
            </div>
        );
    }
}

const mapStateToProps = (state: any) => ({
    todoMarkAsDone: state.todoMarkAsDone,
});

const mapDispatchToProps = (dispatch: any) => ({
    doneTodo: (id: string) => dispatch(doneTodo(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Todo);
