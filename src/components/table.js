import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/table.css';
import { Delete, Edit, Info, Search } from '@material-ui/icons';

class Table extends Component {

	constructor(props) {
		super(props); 
			this.state = {
				filter: '',
			}
			this.renderTableData = this.renderTableData.bind(this);
			this.handleFilter = this.handleFilter.bind(this);
	}

	renderTableData(movie) {	
		return (
			<tr key={movie.id} className="movie-table-rows">
				<td>{movie.title}</td>
				<td>{movie.director}</td>
				<td className="movie-td-rating" align="center">{ movie.rating }</td>
				<td className="movie-td-info-icon" align="center"><Link to={ '/details/'+ movie.id } className="movie-info-icon" ><Info /></Link></td>
				<td className="movie-td-edit-icon" align="center"><Link to={ '/edit/'+ movie.id } className="movie-edit-icon"><Edit /></Link></td>
				<td className="movie-td-delete-icon" align="center"><button className="movie-delete-icon" onClick={ () => this.props.onDelete(movie.id) }><Delete /></button></td>
			</tr>
		)
	}

	handleFilter(e) {
		this.setState({ filter: e.target.value })
	}

	render() {
		let data = this.props.data;
		const filteredArr = data.filter((movie) => {
		  return (
		  movie.title.toLowerCase().includes(this.state.filter.toLowerCase()) ||
		  movie.director.toLowerCase().includes(this.state.filter.toLowerCase())
		  )
		});
		let render = filteredArr.map(this.renderTableData)
		if (!render.length) {
			render = 
			<tr>
			<td colSpan="6">No Title or Director match your search</td>
			</tr>
		}
	
		return (
			<>
			<div className="movie-table-search-wrapper">
				<Search className="movie-table-search-icon"/><label htmlFor="filter" id="movie-table-search-text"> Search Movie database... </label><br />
				<input type="text" name="filter" className="movie-table-search" onChange={ this.handleFilter }></input>
			</div>
			<table>
				<thead>
					<tr>
						<th align="left">Title</th>
						<th align="left">Director</th>
						<th>Rating</th>
						<th>Details</th>
						<th>Edit</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{ render }
				</tbody>
      </table>
			</>
		)
	}
}

export default Table;


