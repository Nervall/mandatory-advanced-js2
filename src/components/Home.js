import React, { Component } from 'react'
import axios from 'axios';
import Table from './table.js';
import { Helmet } from "react-helmet";

class Home extends Component {
  constructor(props) {
      super(props); 
      this.state = { 
        data: null,
        error: '',
      };
      this.onDelete = this.onDelete.bind(this);
  }
      
      
  componentDidMount() {
    this.source = axios.CancelToken.source();
    axios.get('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies', {headers: {"Content-Type": "application/json"}, cancelToken: this.source.token})
      .then(response => {
      this.setState({ data: response.data})
      this.setState({ error: '' })
    })
      .catch(error => {
        if (axios.isCancel(error)) {
        return;
      }
      if (error.response.status >= 400 && error.response.status < 500 ) {
        this.setState({ error: 'Something went wrong with your request, please try again' })
      } 
      if (error.response.status > 500 ) {
        this.setState({ error: 'Something went wrong with the server, please try again' })  
      } 
      else {
        this.setState({ error: 'Something went wrong, please try again' })  
      } 
    });
  }

  componentWillUnmount(){
    if (this.source) {
      this.source.cancel();
    }
  }


  onDelete(id) {
    const data = this.state.data;
    this.source = axios.CancelToken.source();
    axios.delete('http://ec2-13-53-132-57.eu-north-1.compute.amazonaws.com:3000/movies/'+ id, {headers: {"Content-Type": "application/json"}, cancelToken: this.source.token})
      .then((response) => {
        const index = data.findIndex(x => x.id === id);
        if (index >= 0) {
          const newData = [...data.slice(0, index), ...data.slice(index + 1)];
          this.setState({data: newData})
      }
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          return;
        }
        if (error.response.status === 404) {
          this.setState({ error: 'The movie you try to delete is not existing anymore' })
        } 
        else {
          this.setState({ error: 'Something went wrong, please try again' })  
        } 
        })
    }

  render() {
    if (this.state.data === null) {
      return(<p>Loading...</p>)
    }
    return (
        <>
        <Helmet>
        <title>My Movies - Home</title>
        </Helmet>
        <Table data={ this.state.data } onDelete={ this.onDelete }></Table>
        <p style={{ color: "red"}}> { this.state.error } </p>
        </>
    )
  }
}

export default Home;
