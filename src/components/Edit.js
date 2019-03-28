import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import {Helmet} from "react-helmet";


class Edit extends Component {
	constructor(props) {
			super(props);
			this.state = {
				movie: null, 
				redirect: false,
				error: '',
			}
			this.titleChange = this.titleChange.bind(this);
			this.directorChange = this.directorChange.bind(this);
			this.descriptionChange = this.descriptionChange.bind(this);
			this.ratingChange = this.ratingChange.bind(this);
			this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount() {
		let movieId = this.props.match.params.id;
		this.source = axios.CancelToken.source();
		axios.get('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/'+ movieId, {headers: {"Content-Type": "application/json"}, cancelToken: this.source.token})
			.then((response) => {
				this.setState({ movie: response.data});
		})
		.catch((error) => {
			if (axios.isCancel(error)) {
				return;
			}
			if (error.response.status === 404) {
				this.setState({ error: 'The movie you try to edit is not existing anymore' })
			} 
			else {
				this.setState({ error: 'Something went wrong, please try again' })  
			} 
		})
	}

	componentWillUnmount(){
		if (this.source) {
		  this.source.cancel();
		}
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

	directorChange(e) {
		const value = e.target.value;
		if (value.length === 0 || value.length >= 40) {
			this.setState({ error: 'The Director input has to be between 1 to 40 characters' })
		} else {
		this.setState({ movie: { ...this.state.movie, director: value }});
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

	ratingChange(e) {
		this.setState({ movie: { ...this.state.movie, rating: e.target.value }})
	}

	handleClick() {
		const data = this.state.movie;
		this.source = axios.CancelToken.source();
		const movieId = this.props.match.params.id;
		axios.put('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/'+ movieId, data, {headers: {"Content-Type": "application/json"}, cancelToken: this.source.token})
		.then((response) => {
				this.setState({ redirect: true})
		})
		.catch(error => {
			if (axios.isCancel(error)) {
				return;
				}
			if (error.response.status === 404) {
				this.setState({ error: 'The movie you try to update is not existing anymore' })

				} 
				else {
				this.setState({ error: 'Something went wrong, please try again' })  
				} 
		})
	}

	render() {
		let data = this.state.movie;
		if (data === null) {
			return(<p>Loading...</p>)
		}
		if (this.state.redirect) {
				return <Redirect to="/" />
		}
		return (
			<main>
				<Helmet>
					<title> {"My Movies Edit: -  " + data.title }</title>
				</Helmet>
			<h1>Edit Movie</h1>
			<form>
				<div>
					<label htmlFor="title">Title </label><br />
					<input type="text" name="title" className="movie-input-title" value={data.title} onChange={ this.titleChange } minLength="1" maxLength="40"></input>
				</div>
				<div>
					<label htmlFor="description">Description </label><br />
					<textarea name="description" className="movie-input-des" value={ data.description } onChange={ this.descriptionChange } minLength="1" maxLength="400"></textarea>
				</div>
				<div>
					<label htmlFor="director">Director </label><br />
					<input type="text" name="director" className="movie-input-dir" value={ data.director } onChange={ this.directorChange } minLength="1" maxLength="40"></input>
				</div>
				<div>
					<label htmlFor="rating">Rating </label><br />
					<input type="range" id="slider" name="rating" min="0.0" max="5.0" step="0.1" value={ data.rating } onChange={ this.ratingChange }></input>
					<span id="movie-range-number">{ data.rating }</span>
				</div>
			</form>
				<button id="movie-button-submit" onClick={ this.handleClick }>Submit</button>
				<Link to='/'><button id="movie-button-back">Back</button></Link>
				<p style={{ color: "red"}}>{ this.state.error }</p>
			</main>
		)
	}
}

export default Edit;
