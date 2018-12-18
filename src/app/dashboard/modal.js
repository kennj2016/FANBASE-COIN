import React from 'react';
import ReactDOM from 'react-dom';
export class ModalWrapper extends React.Component {

	render(){

		return (

			<div>
			{
				this.props.active == true ?
				<div>
					<div className="modalBG" onClick={this.props.hide}></div>
					<div className="modalContentWrap" style={this.props.style}>
						<a className="modalCloseBttn" onClick={this.props.hide}><i className="fa fa-times"></i></a>
						<div className="content">
						{
							this.props.children
						}
						</div>
					</div>
				</div>
				: ""
		} 
		</div>
		)
	}

}