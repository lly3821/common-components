import React from 'react';
import { Link } from 'react-router-dom';
import './base.less';
import './app.less';

export default class App extends React.Component {

  render () {
    return (
      <div className="container">
        <header className="head">组件列表</header>
        <ul className="component-list">
          <Link to="/listview"><li>ListView</li></Link>
        </ul>
      </div>
    )
  }
}
