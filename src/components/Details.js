import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {Helmet} from "react-helmet";
import '../css/details.css';

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
        movie: null,
        error: ''
    }
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
        this.setState({ error: 'The movie is not existing anymore' })
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

  render() {
    let data = this.state.movie;
    if (data === null) {
      return(<p>Loading...</p>)
    }
    return (
      <main>
        <Helmet>
				<title> {"My Movies -" + data.title }</title>
				</Helmet>
        <div className="movie-details-wrapper">
        <p className="movie-details-title"><b>Title </b><br /> { data.title }</p>
        <p className="movie-details-rating"> { data.rating }</p>
        <img className="movie-details-picture" src={require('../img/details.jpg')} alt={ data.title }></img>
        <p className="movie-details-description"><b>Description</b><br /> { data.description }</p>
        <p className="movie-details-director"><b>Director</b><br /> { data.director }</p>
        </div>
        <Link to={'/edit/' + data.id}> <button id="movie-button-submit">Edit</button></Link>
        <Link to="/"><button id="movie-button-back">Back</button></Link>
        <p style={{ color: 'red' }}> { this.state.error }</p>
      </main>
    )
  }
}

export default Details;