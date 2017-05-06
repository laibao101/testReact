import React, {Component, PropTypes} from 'react';
import marked from 'marked';
import ReactCssTransitionGroup from 'react-addons-css-transition-group';
import CheckList from './CheckList';
import constants from './constants';
import { DragSource, DropTarget } from 'react-dnd';
import { Link } from 'react-router';

const cardDragSpec = {
    beginDrag(props){
        return {
            id:props.id,
            status:props.status
        };
    },
    endDrag(props){
        props.cardCallbacks.persistCardDrag(props.id,props.status);
    }
};

const cardDropSpec = {
    hover(props,monitor){
        const draggedId = monitor.getItem().id;
        props.cardCallbacks.updatePosition(draggedId,props.id);
    }
}

let collectDrag = (connect, monitor) => {
    return {
        connectDragSource:connect.dragSource()
    };
}

let collectDrop = (connect,monitor) => {
    return {
        connectDropTarget:connect.dropTarget()
    };
}


class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDetails: false
        };

        this.toggleDetails = this.toggleDetails.bind(this);
    };

    toggleDetails(){
        this.setState({
            showDetails: !this.state.showDetails
        });
    }

    render() {

        const { connectDragSource, connectDropTarget } = this.props;

        let cardDetails;
        if (this.state.showDetails) {
            cardDetails = (
                <div className="card__details">
                    <span dangerouslySetInnerHTML={{__html:marked(this.props.description)}}></span>
                    <CheckList
                        cardId={this.props.id}
                        tasks={this.props.tasks}
                        taskCallbacks={this.props.taskCallbacks}
                    />
                </div>
            );
        };

        const sideColor = {
            position:'absolute',
            zIndex:-1,
            top:0,
            bottom:0,
            left:0,
            width:7,
            backgroundColor:this.props.color
        };

        return connectDropTarget(connectDragSource(
            <div className="card">
                <div style={sideColor}></div>
                <div className="card_edit">
                    <Link to={'/edit/'+this.props.id}>&#9998;</Link>
                </div>
                <div className={this.state.showDetails ? "card__title card__title--is-open" : "card__title"} onClick={this.toggleDetails}>
                    {this.props.title}
                </div>
                <ReactCssTransitionGroup
                    transitionName="toggle"
                    transitionEnterTimeout={250}
                    transitionLeaveTimeout={250}
                >
                    {cardDetails}
                </ReactCssTransitionGroup>
            </div>
        ));
    }
}

Card.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    color: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.object),
    taskCallbacks:PropTypes.object,
    cardCallbacks:PropTypes.object,
    connectDragSource:PropTypes.func.isRequired,
    connectDropTarget:PropTypes.func.isRequired,
};

const dradHighOrderCard = DragSource(constants.CARD,cardDragSpec,collectDrag)(Card);
const dragDropHighOrderCard = DropTarget(constants.CARD,cardDropSpec,collectDrop)(dradHighOrderCard);

export default dragDropHighOrderCard;
