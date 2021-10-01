import React from 'react';
import { connect } from 'react-redux';

import { deleteTodo } from '../../actions/todoActions';

import './DeleteModal.css';

interface IProps {
    todo: any;
    todoDelete: any;
    close: () => void;
    remove: (todo: any) => void;
    deleteTodo: (id: string) => void;
}

class DeleteModal extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);
    }

    // Lifecycle Methods
    componentDidMount() {
        document.body.style.overflowY = 'hidden';
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (this.success !== prevProps.todoDelete.success && this.success) {
            this.props.close();
            this.props.remove(this.props.todo);
        }
    }

    componentWillUnmount() {
        document.body.style.overflowY = 'auto';
    }

    // Getters
    get loading() {
        return this.props.todoDelete.loading;
    }
    get error() {
        return this.props.todoDelete.error;
    }
    get success() {
        return this.props.todoDelete.success;
    }

    // Helper Functions
    close() {
        !this.loading && this.props.close();
    }

    render() {
        return (
            <div className="deleteModal-overlay" onClick={() => this.close()}>
                <div className="deleteModal-container" onClick={(e) => e.stopPropagation()}>
                    <div className="deleteModal-header">
                        <h3>Delete</h3>
                    </div>
                    <div className="deleteModal-body">
                        Are you sure that you want to delete <b>{this.props.todo.name}</b> ?
                    </div>
                    <div className="deleteModal-footer">
                        <button
                            className="deleteModal-buttons deleteBtn"
                            disabled={this.loading}
                            onClick={() => this.props.deleteTodo(this.props.todo._id)}
                        >
                            Delete
                        </button>
                        <button className="deleteModal-buttons cancelBtn" disabled={this.loading} onClick={() => this.close()}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: any) => ({
    todoDelete: state.todoDelete,
});

const mapDispatchToProps = (dispatch: any) => ({
    deleteTodo: (id: string) => dispatch(deleteTodo(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModal);
