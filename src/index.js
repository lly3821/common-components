import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { render } from 'react-dom';
import App from './app';
import ListViewDemo from './examples/listview';

const RouteNode = (
  <Router>
    <Route exact component={App} path="/" />
    <Route exact component={ListViewDemo} path="/listview" />
  </Router>
  
)

render(RouteNode, document.getElementById('root'))
