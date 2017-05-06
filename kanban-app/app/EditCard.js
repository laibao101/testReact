import React, {Component, PropTypes} from 'react';
import CardForm from './CardForm';

class EditCard extends Component{
	constructor(props){
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillMount(){
		const card = this.props.cards.find( card => card.id == this.props.params.card_id );
		this.setState({
			...card
		})
	}

	handleChange(field,value){
		this.setState({
			[field]:value
		});
	}

	handleSubmit(e){
		e.preventDefault();
		this.props.cardCallbacks.updateCard(this.state);
		this.props.history.pushState(null,'/');
	}

	handleClose(e){
		this.props.history.pushState(null,'/');
	}

	render(){
		return (
			<CardForm
				draftCard={this.state}
				buttonLabel="Edit Card"
				handleChange={this.handleChange}
				handleClose={this.handleClose}
				handleSubmit={this.handleSubmit}
			></CardForm>
		);
	}
}

EditCard.propTypes = {
	cardCallbacks:PropTypes.object
}

export default EditCard;
