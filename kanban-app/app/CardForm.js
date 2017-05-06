import React,{ Component, PropTypes } from 'react';

class CardForm extends Component{
	constructor(props){
		super(props);

		this.handleClose = this.handleClose.bind(this);
	}

	handleChange(field,e){
		this.props.handleChange(field,e.target.value);
	}

	handleClose(e){
		e.preventDefault();
		this.props.handleClose();
	}


	render(){
		return (
			<div>
				<div className="card big">
					<form onSubmit={this.props.handleSubmit}>
						<input
							type="text"
							defaultValue={this.props.draftCard.title}
							placeholder="Title"
							required={true}
							autoFocus={true}
							onChange={this.handleChange.bind(this,'title')}
						/>
						<textarea
							defaultValue={this.props.draftCard.description}
							placeholder="Description"
							required={true}
							onChange={this.handleChange.bind(this,'description')}
						></textarea>
						<label htmlFor="status">Status</label>
						<select
							id="status"
							defaultValue={this.props.draftCard.status}
							onChange={this.handleChange.bind(this,'status')}
						>
							<option value="todo">To Do</option>
							<option value="in-progress">In Progress</option>
							<option value="done">Done</option>
						</select>
						<br/>
						<label htmlFor="color">Color</label>
						<input
							type="color"
							id="color"
							defaultValue={this.props.draftCard.color}
							onChange={this.handleChange.bind(this,'color')}
						/>
						<div className="actions">
							<button type="submit">{this.props.buttonLabel}</button>
						</div>
					</form>
				</div>
				<div className="overlay" onClick={this.handleClose}></div>
			</div>
		);
	}
}

CardForm.propTypes = {
	buttonLabel:PropTypes.string.isRequired,
	draftCard:PropTypes.shape({
		title:PropTypes.string,
		description:PropTypes.string,
		status:PropTypes.string,
		color:PropTypes.string,
	}).isRequired,
	handleChange:PropTypes.func.isRequired,
	handleSubmit:PropTypes.func.isRequired,
	handleClose:PropTypes.func.isRequired
}

export default CardForm;
