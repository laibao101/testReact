import React, {Component, PropTypes} from 'react';
import KanbanBoard from './KanbanBoard';
import update from 'react-addons-update';
import { throttle } from './util';

import 'babel-polyfill';
import 'whatwg-fetch';

const API_URL = 'http://kanbanapi.pro-react.com';
const API_HEADERS = {
	'Content-Type':'application/json',
	Authorization:'any-string-you-like'
}

class KanbanBoardContainer extends Component {
	constructor(props){
		super(props);
		this.state = {
			cards:[]
		};

		this.addTask = this.addTask.bind(this);
		this.toggleTask = this.toggleTask.bind(this);
		this.deleteTask = this.deleteTask.bind(this);
		this.addCard = this.addCard.bind(this);
		this.updateCard = this.updateCard.bind(this);
		this.persistCardDrag = this.persistCardDrag.bind(this);
		this.updateCardStatus = throttle(this.updateCardStatus.bind(this));
		this.updateCardPosition = throttle(this.updateCardPosition.bind(this),50000);
	}

	addTask(cardId,taskName){
		const cardIndex = this.state.cards.findIndex( card => card.id == cardId);

		const prevState = this.state;

		const newTask = {
			id:Date.now(),
			name:taskName,
			done:false
		};

		const nextState = update(this.state.cards,{
			[cardIndex]:{
				tasks:{$push:[newTask]}
			}
		});

		this.setState({
			cards:nextState
		});

		fetch(`${API_URL}/cards/${cardId}/tasks`,{
			method:'post',
			headers:API_HEADERS,
			body:JSON.stringify(newTask)
		})
			.then( res => {
				if (!res.ok) {
					throw new Error("Server response wasn't OK");
				}
				return res.json();
			})
			.then( data => {
				newTask.id = data.id;
				this.setState({
					cards:nextState
				});
			})
			.catch(err => {
				console.error(err);
				this.setState({
					cards:prevState
				});
			});
	}

	deleteTask(cardId,taskId,taskIndex){
		const cardIndex = this.state.cards.findIndex( card => card.id == cardId);

		const prevState = this.state;

		const nextState = update(this.state.cards,{
			[cardIndex]:{
				tasks:{$splice:[[taskIndex,1]]}
			}
		});

		this.setState({
			cards:nextState
		});

		fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`,{method:'delete',headers:API_HEADERS})
			.then( res => {
				if (!res.ok) {
					throw new Error("Server response wasn't OK");
				}
			})
			.catch(err => {
				console.error(err);
				this.setState({
					cards:prevState
				});
			});
	}

	toggleTask(cardId,taskId,taskIndex){
		const cardIndex = this.state.cards.findIndex( card => card.id == cardId);

		const prevState = this.state;

		let newDoneValue;

		const nextState = update(this.state.cards,{
			[cardIndex]:{
				tasks:{
					[taskIndex]:{
						done:{
							$apply: done => {
								newDoneValue = !done;
								return newDoneValue;
							}
						}
					}
				}
			}
		});

		this.setState({
			cards:nextState
		});

		fetch(`${API_URL}/cards/${cardId}/tasks/${taskId}`,{
			method:'put',
			headers:API_HEADERS,
			body:JSON.stringify({done:newDoneValue})
		})
			.then( res => {
				if (!res.ok) {
					throw new Error("Server response wasn't OK");
				}
			})
			.catch(err => {
				console.error(err);
				this.setState({
					cards:prevState
				});
			});
	}

	updateCardStatus(cardId,listId){
		const cardIndex = this.state.cards.findIndex( card => card.id == cardId);

		const card = this.state.cards[cardIndex];

		if (card.status !== listId) {
			this.setState(update(
				this.state,{
					cards:{
						[cardIndex]:{
							status:{
								$set:listId
							}
						}
					}
				}
			));
		}
	}

	updateCardPosition(cardId,afterId){
		if (cardId !== afterId) {
			const cardIndex = this.state.cards.findIndex( card => card.id == cardId);

			const card = this.state.cards[cardIndex];

			const afterIndex = this.state.cards.findIndex( card => card.id == afterId);

			this.setState(update(
				this.state,{
					cards:{
						$splice:[
							[cardIndex,1],
							[afterIndex,0,card]
						]
					}
				}
			));
		}
	}

	persistCardDrag(cardId,status){
		const cardIndex = this.state.cards.findIndex( card => card.id == cardId);

		const card = this.state.cards[cardIndex];


		fetch(`${API_URL}/cards/${cardId}`,{
			method:'put',
			headers:API_HEADERS,
			body:JSON.stringify({status:card.status,row_order_position:cardIndex})
		})
			.then( res => {
				if (!res.ok) {
					throw new Error("Server response wasn't OK");
				}
			})
			.catch(err => {
				console.error(err);
				this.setState(update(
					this.state,{
						cards:{
							[cardIndex]:{
								status:{
									$set:status
								}
							}
						}
					}
				));
			});
	}

	addCard(card){
		const prevState = this.state;

		console.log(card);

		if (card.id == null) {
			let card = Object.assign({},card,{id:Date.now()});
		}

		const nextState = update(this.state.cards,{
			$push:[card]
		});

		this.setState({
			cards:nextState
		});

		fetch(`${API_URL}/cards`,{
			method:'post',
			headers:API_HEADERS,
			body:JSON.stringify(card)
		})
			.then( res => {
				if (!res.ok) {
					throw new Error("Server response wasn't OK");
				}else if(res.ok){
					return res.json();
				}
			})
			.then(data => {
				card.id = data.id;
				this.setState({
					cards:nextState
				});
			})
			.catch(err => {
				console.error(err);
				this.setState(prevState);
			});
	}

	updateCard(card){
		const prevState = this.state;

		const cardIndex = this.state.cards.findIndex( card => card.id == cardId);

		const nextState = update(this.state.cards,{
			[cardIndex]:{
				$set:card
			}
		});

		this.setState({
			cards:nextState
		});

		fetch(`${API_URL}/cards/${card.id}`,{
			method:'put',
			headers:API_HEADERS,
			body:JSON.stringify(card)
		})
			.then( res => {
				if (!res.ok) {
					throw new Error("Server response wasn't OK");
				}
			})
			.catch(err => {
				console.error(err);
				this.setState(prevState);
			});
	}

	componentDidMount(){
		fetch(`${API_URL}/cards`)
		.then(res => res.json())
		.then(data => this.setState({cards:data}) )
		.catch(err => console.error(err));
	}

    render() {
		let KanbanBoard = this.props.children && React.cloneElement(
			this.props.children,{
				cards:this.state.cards,
				taskCallbacks:{
					toggle:this.toggleTask,
					delete:this.deleteTask,
					add:this.addTask
				},
				cardCallbacks:{
					updateStatus:this.updateCardStatus,
					updatePosition:this.updateCardPosition,
					persistCardDrag:this.persistCardDrag,
					addCard:this.addCard,
					updateCard:this.updateCard
				}
			}
		);

		return KanbanBoard;
        // return (
		// 	<KanbanBoard
		// 		cards={this.state.cards}
		// 		taskCallbacks={{
		// 			toggle:this.toggleTask,
		// 			delete:this.deleteTask,
		// 			add:this.addTask
		// 		}}
		// 		cardCallbacks={{
		// 			updateStatus:this.updateCardStatus,
		// 			updatePosition:this.updateCardPosition,
		// 			persistCardDrag:this.persistCardDrag,
		// 			addCard:this.addCard,
		// 			updateCard:this.updateCard
		// 		}}
		// 	></KanbanBoard>
		// )
    }
};

export default KanbanBoardContainer;
