import React from 'react';
import {render} from 'react-dom';
import { Router, Route } from 'react-router';
import KanbanBoardContainer from './KanbanBoardContainer';
import KanbanBoard from './KanbanBoard';
import NewCard from './NewCard';
import EditCard from './EditCard';
import createBrowserHistory from 'history/lib/createBrowserHistory';

render(
    <Router history={createBrowserHistory()}>
        <Route component={KanbanBoardContainer}>
            <Route path="/" component={KanbanBoard}>
                <Route path="new" component={NewCard}></Route>
                <Route path="edit/:card_id" component={EditCard}></Route>
            </Route>
        </Route>
    </Router>,
    document.getElementById('root')
);

//
// render(
//     <KanbanBoardContainer></KanbanBoardContainer>,
//     document.getElementById('root')
// );
