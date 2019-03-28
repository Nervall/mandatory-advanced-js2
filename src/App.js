import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Add from './components/Add.js';
import Edit from './components/Edit.js';
import Home from './components/Home.js';
import Details from './components/Details.js';
//import Logo from './img/my_movies.png';

class App extends Component {

  render() {
    return (
			<Router>
      <div className="movie-wrapper">
      <header>
      <img src={require('./img/my_movies.png')}  alt="logo" className="movie-header-logotyp" />
			<nav>
				<div className="movie-header-homeButton"><Link className="movie-header-homeLink" to='/'>Home</Link></div>
				<div className="movie-header-AddButton"><Link className="movie-header-addLink" to='/add'>Add Movie</Link></div>
			</nav>
      </header>
      <main>
			<Route exact path='/' component={ Home } />
			<Route path='/add' component={ Add } />
			<Route path='/edit/:id' component={ Edit } />
      <Route path='/details/:id' component={ Details } />
      </main>
      </div>
			</Router>
    );
  }
}

export default App;
