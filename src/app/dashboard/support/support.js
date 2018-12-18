import React from "react"
import {MainHeader,Footer} from "../header";
import './support.css';
import Parse from 'parse';
import $ from "jquery";
import ReactGA from 'react-ga';
ReactGA.initialize('UA-115007597-1');

export class Support extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this)
		this.state = {
			"message":"",
			"category":"default",
			"complete":false,
			"caseNumber":"",
			"currentDate":"",
			"username":""
		}
	}
	componentDidMount(){
		ReactGA.pageview(window.location.pathname + window.location.search);
		document.title = "Support - FNB";
		this.setState({"username":Parse.User.current().id,"currentDate":formatDate(new Date().toString())});
		var key = this.props.match.params.key;
		if (key) {
			if (key == "rsl") {
				this.setState({"category":"Login | My Account","message":"I want to raise my sending limits to"});
			} else if (key == 'rwl') {
				this.setState({"category":"Login | My Account","message":"I want to raise my withdrawal limits to"});
			} else {
				this.setState({"category":"Report | Compliant","message":"I am reporting Post ID:" + key+" because"});
			}
		}
	}
	handleSubmit(){
		var r = this;
		var userEmail = Parse.User.current().get('email')
		var name = Parse.User.current().get('fname');
		Parse.Cloud.run('submitSupportTicket', {
			"userEmail":userEmail,
			"name":name,
			"message":r.state.message,
			"category":r.state.category,
			"userId":Parse.User.current().id
		}, {
		success: function(results) {
			console.log(results)
			r.setState({"complete":true,"caseNumber":results});
		},error:function(err){
			alert(err)
		}});
	}
	render(){
		return (
			<div>
				<div className="page indexPageWrap">
					<MainHeader />
					<div className="dashWrapperB">
						<div className="dashModal " style={{"width":"15%"}}></div>
						<div className="dashModal " style={{"width":"70%"}}>
						{
							this.state.complete == false ?
							<div className="content supportContainer" style={{"height":"auto"}}>
								<p className="supportTitle">Support a Ticket</p>
								<p className="supportDescription">Submit your questions below. We will respond within 24 hours.</p>
								<br /><br />
								<span className="pull-left usernameField"><b>User ID:</b> {this.state.username}</span>
								<span className="pull-right usernameField">{this.state.currentDate}</span>
								<select value={this.state.category} onChange={(e) => this.setState({"category":e.target.value})} className="supportSelect">
									<option value="default">Choose a Category</option>
									<option>Login | My Account</option>
									<option>Feature Suggestion</option>
									<option>Accreditation | Verification</option>
									<option>Financial Transaction</option>
									<option>Technical Support</option>
									<option>Report | Compliant</option>
								</select>
								<textarea value={this.state.message} onChange={(e) => this.setState({"message":e.target.value})} rows="10" placeholder="How can we help?"></textarea>
								{
									this.state.message == "" || this.state.category == "default" ?
									<a className="viewallA disabled">Choose category default</a>
									:
									<a onClick={this.handleSubmit} className="viewallA">Submit Request</a>
								}
							</div>
							:
							<div className="content supportContainer successSupportContainer" style={{"height":"auto"}}>
								<p className="supportImage">
									<i className="fa fa-check"></i>
								</p>
								<p className="supportTitle">Case #{this.state.caseNumber}</p>
								<p className="supportDescription">We received your request. Please allow 24 - 48 hours for us to respond back. We also sent you an email for your reference.</p>
							</div>
						}
						</div>
						<div className="dashModal " style={{"width":"15%"}}></div>

						<br style={{"clear":"both"}} />
					</div>
				</div>
				<Footer />
			</div>
		)

	}



}

function formatDate(dates) {
	var date = new Date(dates);
	var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	return mS[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
}
