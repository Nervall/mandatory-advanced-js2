import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import {Helmet} from "react-helmet";
import '../css/add.css';

class Add extends Component {

	constructor(props){
    super(props);
		this.state = { movie: {
						title: "",
						description: "", 
						director: "", 
						rating: 0
						},
						redirect: false,
						range: 0,
						error: ''
					}
			this.titleChange = this.titleChange.bind(this);
			this.directorChange = this.directorChange.bind(this);
			this.descriptionChange = this.descriptionChange.bind(this);
			this.ratingChange = this.ratingChange.bind(this);
			this.handleClick = this.handleClick.bind(this);
		}

	titleChange(e) {
		const value = e.target.value;
		if (value.length === 0 || value.length >= 40) {
			this.setState({ error: 'The Title input has to be between 1 to 40 characters' })
		} else {
		this.setState({ movie: { ...this.state.movie, title: value }})
		this.setState({ error: '' });
		}
	} 

	descriptionChange(e) {
		const value = e.target.value
		if (value.length === 0 || value.length >= 400) {
			this.setState({ error: 'The Description input has to be between 1 to 400 characters' })
		} else {
		this.setState({ movie: { ...this.state.movie, description: value }});
		this.setState({ error: '' });
		}
	}

 	directorChange(e) {
		const value = e.target.value;
		if (value.length === 0 || value.length >= 40) {
			this.setState({ error: 'The Director input has to be between 1 to 40 characters' })
		} else {
		this.setState({ movie: { ...this.state.movie, director: value }});
		this.setState({ error: '' });
		}
	} 

	ratingChange(e) {
		this.setState({ movie: { ...this.state.movie, rating: e.target.value }})
		this.setState({ range : e.target.value })
	} 

	handleClick(e) {
		e.preventDefault();
		let newMovie = this.state.movie;
		this.source = axios.CancelToken.source();
		axios.post('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies', newMovie, {headers: {"Content-Type": "application/json"}, cancelToken: this.source.token})
		.then((response) => {
			this.setState({ redirect: true})
		})
		.catch((error) => {
			if (axios.isCancel(error)) {
				return;
			}
			if (error.response && error.response.status >= 400 && error.response.status < 500 ) {
				this.setState({ error: 'Something went wrong with your request, please try again' })
			} 
			if (error.response.status >= 500 ) {
				this.setState({ error: 'Something went wrong with the server, please try again' })  
			} 
			else {
				this.setState({ error: 'There need to be content in all inputfields to add a movie' })  
			} 
		})
	}

	componentWillUnmount(){
		if (this.source) {
		  this.source.cancel();
		}
	}

  render() {
		if (this.state.redirect) {
			return <Redirect to="/" />
		}
		return (
		<>
		<Helmet>
		<title>My Movies - Add Movies</title>
		</Helmet>
		<main>
		<h1>Add a movie</h1>
	  <form>
			<div>
				<label htmlFor="title">Titel </label><br />
				<input type="text" name="title" className="movie-input-title" minLength="1" maxLength="40" required onChange={ this.titleChange }></input>
			</div>
			<div>
				<label htmlFor="description">Description </label><br />
				<textarea name="description" className="movie-input-des" minLength="1" maxLength="400" required onChange={ this.descriptionChange }></textarea>
			</div>
			<div>
				<label htmlFor="director">Director </label><br />
				<input type="text" name="director" className="movie-input-dir" minLength="1" maxLength="40" required onChange={ this.directorChange }></input>
			</div>
			<div className="movie-range-wrapper">
				<label htmlFor="rating">Rating </label><br />
				<input type="range" id="slider" name="rating" min="0.0" max="5.0" step="0.1" className="movie-range-rating" value={ this.state.range } onChange={ this.ratingChange }></input>
				<span id="movie-range-number">{ this.state.range }</span>
			</div>
	  </form>
			<button id="movie-button-submit" onClick={ this.handleClick }>Add Movie</button>
			<Link to='/'><button id="movie-button-back">Back</button></Link>
			<p style={{ color: "red" }}> { this.state.error } </p>
		</main>
		</>
	)
  }
}

export default Add;

