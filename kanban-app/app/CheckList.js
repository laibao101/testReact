import React, {Component, PropTypes} from 'react';


class CheckList extends Component {
    render() {
        let tasks = this.props.tasks.map((task,taskIndex) => (
            <li className="checklist__task" key={task.id}>
                <input
                    type="checkbox"
                    defaultChecked={task.done}
                    onChange={this.props.taskCallbacks.toggle.bind(null,this.props.cardId,task.id,taskIndex)}
                />
                {task.name}
                {' '}
                <a
                    href="#"
                    className="checklist__task--remove"
                    onClick={this.props.taskCallbacks.delete.bind(null,this.props.cardId,task.id,taskIndex)}
                />
            </li>
        ));

        return (
            <div className="checklist">
                <ul>{tasks}</ul>
                <input
                    type="text"
                    className="checklist--add-task"
                    placeholder="Type then hit Enter to add a task"
                    onKeyPress={this.checkInputKeyPress.bind(this)}
                />
            </div>
        );
    }

    checkInputKeyPress(e){
        if (e.key === 'Enter') {
            this.props.taskCallbacks.add(this.props.cardId,e.target.value);
            e.target.value = '';
        }
    }
}

CheckList.propTypes = {
    cardId: PropTypes.number,
    tasks: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks:PropTypes.object
};

export default CheckList;
