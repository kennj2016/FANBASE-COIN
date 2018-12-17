import React from 'react';
import './login.css';
import {Link,Redirect} from 'react-router-dom';
import {startUrl} from "../../index";
import {LoginHeader} from '../loginH/loginH';
import {setRegions,set_city_state} from './city_state.js';
import Parse from 'parse';
import $ from 'jquery';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/libphonenumber.js';
import 'react-intl-tel-input/dist/main.css';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-115007597-1');



export class Login extends React.Component {
	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			"email":"",
			"password":"",
			"errorMessage":""
		}
	}
	componentDidMount(){
		if (Parse.User.current()) {
			window.location.href = startUrl + "wallets";
		}
		ReactGA.pageview(window.location.pathname + window.location.search);
	}
	_handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.handleSubmit();
		}
	}
	handleSubmit(e) {
		var lg = this.refs.loginButton;
		var iLg = "Login"
		var r = this;
		lg.innerHTML = "<span class='spinner'></span>";
		$(lg).addClass('loadingState');
		if (isEmpty(this.state.email)) {
			this.refs.email.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');
		} else if (!isEmail(this.state.email)) {
			this.refs.email.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			this.setState({"errorMessage":"Your email address is invalid"});

			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');

		} else if (isEmpty(this.state.password)) {
			this.refs.email.style.backgroundColor = "#f3f3f3";
			this.refs.password.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			this.setState({"errorMessage":""});
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');
		} else {
			this.refs.email.style.backgroundColor = "#f3f3f3";
			this.refs.password.style.backgroundColor = "#f3f3f3";
			$('.errorMessage').html("");
			Parse.User.logIn(this.state.email.toLowerCase(), this.state.password, {
			  success: function(user) {
			  	var types = detectmob();
				 Parse.Cloud.run('loginUserAttempt', {
				 	"id": user.id,
				 	"date":new Date(),
				 	"type":types,
				 	"description":"Login",
				 	"email":r.state.email.toLowerCase()

				}, {
				  success: function(results) {},error:function(err){}}); 

				var Users = Parse.Object.extend("_User");
				var query = new Parse.Query(Users);
				query.get(user.id, {
				success: function(results) {
					if (results.get('eVerified') == false) {
						window.location.href = startUrl + "thankyou";
					} else if (results.get('phoneVerified') == false) {
						window.location.href = startUrl + "phoneverify";
					} else {
						window.location.href = startUrl + "wallets";
					}
				  },error:function(err){
						lg.innerHTML = iLg;
						$(lg).removeClass('loadingState');
				  		$('.errorMessage').html(err.message);
				  }}); 	
			  },
			  error: function(user, error) {

				lg.innerHTML = iLg;
				$(lg).removeClass('loadingState');

			  	$('.errorMessage').html(error.message);
			  }
			});
		}
	}
	render() {
		return (
			<div>
				<LoginHeader />
				<div className="loginScreen">
					<div className="screenWrapper loginPartWrap">
						<p className="mainTitle">Login to your account</p>
						<label ref="errorMessage" className="errorMessage">{this.state.errorMessage}</label>
						<div className="loginWrap">
							<input type="text" onKeyPress={this._handleKeyPress} value={this.state.email} ref="email" onChange={(e) => this.setState({ "email": e.target.value })} placeholder="Email" />
							<input type="password" onKeyPress={this._handleKeyPress} value={this.state.password} ref="password" onChange={(e) => this.setState({ "password": e.target.value })} placeholder="Password" />
							<label>
								<input type="checkbox" />
								<span>Keep me logged in on this computer</span>
							</label>
							<a className="loadingButton" ref="loginButton" onClick={this.handleSubmit}>Login</a>
						</div>
						<div className="extraSigns">
							<Link className="pull-left" to='/forgot'>Forgot password?</Link>
							<Link className="pull-right" to='/register'>Don't have an account? Register</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}






export class Register extends React.Component {
	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handlePassword = this.handlePassword.bind(this);
		this.handleCountryChange = this.handleCountryChange.bind(this);
		this.state = {
			"fname":'',
			"lname":'',
			"emailAddress":'',
			"password":'',
			"vpassword":'',
			"country":'default',
			"state":"default",
			"checked":false,
			"validPassword":false,
			"errorMessage":""
		}
	}
	_handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.handleSubmit();
		}
	}
	componentDidMount() {
		if (Parse.User.current()) {
			window.location.href = startUrl + "wallets";
		} else {
			setRegions();
		}
		ReactGA.pageview(window.location.pathname + window.location.search);
	}
	handlePassword() {
		var e = this.refs.password;
		  var $input = $(e),
		      value = e.value,
		      $rulesItems = $input.closest('.field').find('.passwordVerify').find('li'),
		      rules = {
		          "1 lowercase" : /[a-z]/,
		          "1 uppercase" : /[A-Z]/,
		          "1 number"              : /[0-9]/,
		          "8 characters"    : /.{9,}/
		      };
		  e.classList.toggle('hasValue', e.value);
		  $rulesItems.each((i, elm) => {
		    var valid,
		        ruleName = elm.innerText.toLowerCase();
		    if( rules[ruleName] ){
		      valid = new RegExp(rules[ruleName]).test(value);
		      elm.classList.toggle('pass', valid);
		    }
		  });
	}
	handleCountryChange(e){
		this.setState({ "country": e.target.value })
		set_city_state(this.refs.countries,this.refs.state)
	}
	handleSubmit(e) {
		const a = this.state;
		const r = this.refs;
		var key = this.props.match.params.key;
		var lg = this.refs.loginButton;
		var iLg = "Create Account"
		lg.innerHTML = "<span class='spinner'></span>";
		$(lg).addClass('loadingState');
		var checks = $('.passwordVerify > li.pass');
		if (isEmpty(a.fname)) {
			r.fname.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');
		} else if (isEmpty(a.lname)) {
			r.fname.style.backgroundColor = "#f3f3f3";
			r.lname.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');

		} else if (isEmpty(a.emailAddress)) {
			r.fname.style.backgroundColor = "#f3f3f3";
			r.lname.style.backgroundColor = "#f3f3f3";
			r.email.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');

		} else if (!isEmail(a.emailAddress)) {
			r.fname.style.backgroundColor = "#f3f3f3";
			r.lname.style.backgroundColor = "#f3f3f3";
			r.email.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			this.setState({"errorMessage":"Email is invalid"});
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');
		} else if (isEmpty(a.password)) {
			r.fname.style.backgroundColor = "#f3f3f3";
			r.lname.style.backgroundColor = "#f3f3f3";
			r.email.style.backgroundColor = "#f3f3f3";
			r.password.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');

		} else if (isEmpty(a.vpassword)) {
			r.fname.style.backgroundColor = "#f3f3f3";
			r.lname.style.backgroundColor = "#f3f3f3";
			r.email.style.backgroundColor = "#f3f3f3";
			r.password.style.backgroundColor = "#f3f3f3";
			r.vpassword.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');


		} else if (a.password != a.vpassword) {
			this.setState({"errorMessage":"Passwords do not match"});
			r.fname.style.backgroundColor = "#f3f3f3";
			r.lname.style.backgroundColor = "#f3f3f3";
			r.email.style.backgroundColor = "#f3f3f3";
			r.password.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			r.vpassword.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');

		} else if (checks.length != 4) {
			this.setState({"errorMessage":""});
			r.fname.style.backgroundColor = "#f3f3f3";
			r.lname.style.backgroundColor = "#f3f3f3";
			r.email.style.backgroundColor = "#f3f3f3";
			r.password.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			r.vpassword.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');

		} else if (this.state.country == "default") {
			this.setState({"errorMessage":""});
			r.fname.style.backgroundColor = "#f3f3f3";
			r.lname.style.backgroundColor = "#f3f3f3";
			r.email.style.backgroundColor = "#f3f3f3";
			r.password.style.backgroundColor =  "#f3f3f3";
			r.vpassword.style.backgroundColor =  "#f3f3f3";
			r.countries.style.backgroundColor = "rgba(255, 0, 0, 0.05)";	
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');

		} else if (this.state.state == "default") {
			this.setState({"errorMessage":""});
			r.fname.style.backgroundColor = "#f3f3f3";
			r.lname.style.backgroundColor = "#f3f3f3";
			r.email.style.backgroundColor = "#f3f3f3";
			r.password.style.backgroundColor =  "#f3f3f3";
			r.vpassword.style.backgroundColor =  "#f3f3f3";
			r.countries.style.backgroundColor = "#f3f3f3";
			r.state.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');

		} else if (!this.state.checked) {
			r.fname.style.backgroundColor = "#f3f3f3";
			r.lname.style.backgroundColor = "#f3f3f3";
			r.email.style.backgroundColor = "#f3f3f3";
			r.password.style.backgroundColor =  "#f3f3f3";
			r.vpassword.style.backgroundColor =  "#f3f3f3";
			r.countries.style.backgroundColor = "#f3f3f3";
			r.state.style.backgroundColor = "#f3f3f3";
			this.setState({"errorMessage":"Please agree to the Terms & Conditions"});
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');
		} else {
			r.fname.style.backgroundColor = "#f3f3f3";
			r.lname.style.backgroundColor = "#f3f3f3";
			r.email.style.backgroundColor = "#f3f3f3";
			r.password.style.backgroundColor =  "#f3f3f3";
			r.vpassword.style.backgroundColor =  "#f3f3f3";
			r.countries.style.backgroundColor = "#f3f3f3";
			r.state.style.backgroundColor = "#f3f3f3";
			this.setState({"errorMessage":""});
			$('.errorMessage').html('');
			var user = new Parse.User();
			user.set("fname", this.state.fname);
			user.set("lname", this.state.lname);
			user.set("email", this.state.emailAddress.toLowerCase());
			user.set("username",this.state.emailAddress.toLowerCase());
			user.set("password",this.state.password);
			user.set("country",this.state.country);
			user.set("state",this.state.state);
			user.signUp(null, {
			  success: function(user) {
				Parse.Cloud.run('verifyEmailSignup', {
				 	"email": $('#emailAddressS').val().toLowerCase(),
				 	"objectId":user.id,
				 	"t":user.get('sessionToken'),
				 	"referred":key,
				 	"fname":a.fname
				}, {
				  success: function(results) {}});
			  		window.location.href = startUrl + "thankyou";
			  },
			  error: function(user, error) {
				lg.innerHTML = iLg;
				$(lg).removeClass('loadingState');

			  	if (error.message == "invalid session token") {
					Parse.User.logOut().then(() => {});
			  	} else {
			  		$('.errorMessage').html(error.message);
			  	}
			  }
			});
		}
	}	
	render() {
		return (
			<div>
				<LoginHeader />
				<div className="loginScreen createAccountWrap">
					<div className="screenWrapper">
						<p className="mainTitle">Create your account</p>
						<label ref="errorMessage" className="errorMessage">{this.state.errorMessage}</label>
						<div className="loginWrap" style={{"height":"auto"}} >
							<div className="rgTextW fifty">
								<input type="text" ref="fname" onKeyPress={this._handleKeyPress} onChange={(e) => this.setState({ "fname": e.target.value })}  placeholder="First Name" />
							</div>
							<div className="rgTextW fifty">
								<input type="text" ref="lname" onKeyPress={this._handleKeyPress} onChange={(e) => this.setState({ "lname": e.target.value })}  placeholder="Last Name" />
							</div>
							<div className="rgTextW">
								<input type="text" id="emailAddressS" ref="email" onKeyPress={this._handleKeyPress} onChange={(e) => this.setState({ "emailAddress": e.target.value })}  placeholder="Email Address" />
							</div>
							<div className="rgTextW field">
								<p className="mustHaveAtLeast">Must have at least</p>
								<ul className="passwordVerify">
								    <li>1 lowercase</li>
								    <li>1 uppercase</li>
								    <li>1 number</li>
								    <li>8 characters</li>
								 </ul>
								<input type="password" ref="password" onKeyPress={this._handleKeyPress} onKeyUp={this.handlePassword} onChange={(e) => this.setState({ "password": e.target.value })}  placeholder="Choose a Password" />
							</div>
							<div className="rgTextW">
								<input type="password" ref="vpassword" onKeyPress={this._handleKeyPress} onChange={(e) => this.setState({ "vpassword": e.target.value }) }  placeholder="Verify Password" />
							</div>
							<div className="rgTextW">
								<p className="stateLabel pull-left">Select your country</p>
								<select id="countries" ref="countries" className="stateSelect pull-right" onChange={this.handleCountryChange} >
									<option value="default">Choose your country</option>
								</select>
								<br style={{"clear":"both"}} />
							</div>
							<br />
							<div className="rgTextW" style={{"display":this.state.country == "default" ? "none" : "block","marginBottom":"20px"}}>
								<p className="stateLabel pull-left">Select your state</p>
								<select id="showStateInput" ref="state" className="stateSelect pull-right" onChange={(e) => this.setState({ "state": e.target.value })  } >
									<option>Choose your state</option>
								</select>
								<br style={{"clear":"both"}} />
							</div>
							<hr style={{"marginTop":"0","clear":"both"}} />
							<label>
								<input style={{"marginTop":"18px"}} type="checkbox" onClick={(e) => this.setState({ "checked": !this.state.checked })} checked={this.state.checked} />
								<span style={{"width":"95%"}}>I certify that I am 18 years or older. I have read, understand and agree to the <a target="_blank" href="https://www.larecoin.com/terms.html">Terms of Use</a>, <a target="_blank" href="https://www.larecoin.com/privacy.html">Privacy Policy</a>, <a target="_blank" href="https://www.larecoin.com/tokensalepolicy.html">Token Sale Policy</a> and <a target="_blank" href="https://www.larecoin.com/amlcft.html">KYC/AML Policy</a>.</span>
							</label>
							<br style={{"clear":"both"}} />
							<a style={{"width":"100%","textAlign":"center","marginTop":"20px","float":"none","display":"block"}} onClick={this.handleSubmit} ref="loginButton" className="loadingButton">Create Account</a>
						</div>
						<div className="extraSigns">
							<Link className="pull-right" to='/login'>Already have an account? Login</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}










export class ForgotPassword extends React.Component {
	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			"email":'',
			"errorMessage":""
		}
	}
	componentDidMount(){
		ReactGA.pageview(window.location.pathname + window.location.search);
		
		if (Parse.User.current()) {
			window.location.href = startUrl + "wallets";
		}		
	}
	_handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.handleSubmit();
		}
	}
	handleSubmit(e){
		var lg = this.refs.loginButton;
		var iLg = "Reset Password"
		lg.innerHTML = "<span class='spinner'></span>";
		$(lg).addClass('loadingState');
		if (isEmpty(this.state.email)) {
			this.refs.email.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');
		} else if (!isEmail(this.state.email)) {
			this.refs.email.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
			this.setState({"errorMessage":"Your email is invalid"});
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');
		} else {
			this.setState({"errorMessage":"Forgot Password"});
			this.refs.email.style.backgroundColor = "#f3f3f3";
			this.setState({"errorMessage":""});
			Parse.User.requestPasswordReset(this.state.email, {
			  success: function() {
				lg.innerHTML = iLg;
			 	$('.mainTitle').html('We sent you an email.');
			  },
			  error: function(error) {
				lg.innerHTML = iLg;
				$(lg).removeClass('loadingState');
			   $('.errorMessage').html(error.message);
			  }
			});
		}
	}
	render() {
		return (
			<div>
				<LoginHeader />
				<div className="loginScreen">
					<div className="screenWrapper">
						<p className="mainTitle">Forgot Password</p>
						<label className="errorMessage">{this.state.errorMessage}</label>
						<div className="loginWrap" style={{"height":"170px"}}>
							<input ref="email" onKeyPress={this._handleKeyPress} onChange={(e) => this.setState({ "email": e.target.value })} type="text" placeholder="Email Address" />
							<a style={{"width":"100%","textAlign":"center"}} className="loadingButton" ref="loginButton" onClick={this.handleSubmit}>Reset Password</a>
						</div>
						<div className="extraSigns">
							<Link className="pull-right" to='/login'>I remember it. Login.</Link>
						</div>
					</div>
				</div>
			</div>
		);
	}
}


export class VerifyEmailToPhone extends React.Component {
	constructor(props){
		super(props);
	}
	componentDidMount(){
		Parse.initialize("ZF3GT5g2UuyztbZSZgkeP8WLC4qKYHrkJX2Vccf8wcxAyzWJKabpjzytBf");
		Parse.serverURL = 'https://larecoinprod.herokuapp.com/parse';
		ReactGA.pageview(window.location.pathname + window.location.search);
		var currentUser = Parse.User.current();
		var key = this.props.match.params.key;
		var t = this.props.match.params.t;
		Parse.Cloud.run('checkEmailVerified', {
		 	"key": this.props.match.params.key,
		}, {
		  success: function(results) {
		  	if (results == "Fully Verified") {
		  		window.location.href = startUrl + "login";
		  	} else {
				Parse.User.become(t).then(function (user) {
				  window.location.href = startUrl + "phoneverify/" +key;
				}, function (error) {
					alert(error.message)
				  window.location.href = startUrl + "login";
				});
		  	}
		  }, error:function(err){
		  		alert(err.message)
		  		window.location.href = startUrl + "login";
		  }});
		}
	render() {
		return (
			<div>
				<div className="loadingScreen">
					  <div class="loading-spinner"></div>
				</div>
			</div>
		);
	}
}




export class PhoneVerify extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"number":""
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handlePhone = this.handlePhone.bind(this);
	}

	componentDidMount(){
		var key = this.props.match.params.key;
		Parse.initialize("ZF3GT5g2UuyztbZSZgkeP8WLC4qKYHrkJX2Vccf8wcxAyzWJKabpjzytBf");
		Parse.serverURL = 'https://larecoinprod.herokuapp.com/parse';
		ReactGA.pageview(window.location.pathname + window.location.search);
		if (Parse.User.current()) {
			Parse.Cloud.run('checkValidVerification', {
			 	"key":  key
			}, {
			success: function(results) {
			}, error:function(err) {
				if (err == "emailNotVerified") {
					window.location.href = startUrl + "thankyou";
				} else if (err == "fullverified" || err == "NotValid") {
					window.location.href = startUrl + "login";
				} else {
					window.location.href = startUrl + "login";
				}
			}});
		} else {

			window.location.href = startUrl + "login";
		}
		var r = this;
		$('.numberInput').keypress(function(e){
			if (e.key === 'Enter') {
				r.handleSubmit();
			}
		});

	}
	handlePhone(status, value, countryData, number, id){
		this.setState({"number":number});
	}
	handleSubmit() {
		const value = $('.intl-tel-input input');
		var fValue = this.state.number.replace(/ /g,"").replace(/-/g,'');
		var key = this.props.match.params.key;
		var lg = this.refs.loginButton;
		var iLg = "Get the code";
		lg.innerHTML = "<span class='spinner'></span>";
		$(lg).addClass('loadingState');

		if (fValue == "") {
			value.css('backgroundColor',"rgba(255,0,0,0.05)");
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');
		} else {
			value.css('backgroundColor',"#f3f3f3");
			Parse.Cloud.run('sendPhoneNumberCode', {
			 	"pn":fValue,
			 	"key":key
			}, {
			success: function(results) {
				window.location.href = startUrl + "phoneverify/"+key+ "/" +"1";
			}, error:function(err){
				lg.innerHTML = iLg;
				$(lg).removeClass('loadingState');
				$('.mainTitle').html(err.message);
			}});
		}
	}
	render() {
		return (
			<div>
				<LoginHeader />
				<div className="loginScreen phoneVerifiedWrapone">
					<div className="screenWrapper">
						<p className="mainTitle" style={{"paddingBottom":"0"}}>Phone Number</p>
						<p className="mainDescription">We will send you a 6 digit code.</p>
						<div className="loginWrap phoneNumberEnter" style={{"height":"auto","width":"500px"}}>
							<IntlTelInput onPhoneNumberChange={ this.handlePhone }  id="phone" format="true" css={['intl-tel-input', 'numberInput']} style={{"width":"450px"}} utilsScript={'libphonenumber.js'} />
							<br />
							<br style={{"clear":"both"}} />	
							<a style={{"width":"100%","textAlign":"center"}} onClick={this.handleSubmit} ref="loginButton" className="loadingButton">Get the code</a>
							<br style={{"clear":"both"}} />	
						</div>
					</div>
				</div>
			</div>
		);
	}
}



export class PhoneCodeVerify extends React.Component {
	constructor(props){
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	    this.state = { time: {}, seconds: "300","finished":false };
	    this.timer = 0;
	    this.countDown = this.countDown.bind(this);
	}
	  secondsToTime(secs) {
	    let hours = Math.floor(secs / (60 * 60));
	    let divisor_for_minutes = secs % (60 * 60);
	    let minutes = Math.floor(divisor_for_minutes / 60);
	    let divisor_for_seconds = divisor_for_minutes % 60;
	    let seconds = Math.ceil(divisor_for_seconds);
	    let obj = {
	      "h": hours,
	      "m": minutes,
	      "s": seconds
	    };
	    return obj;
	  }
	  countDown() {
	    let seconds = this.state.seconds - 1;
	    this.setState({
	      time: this.secondsToTime(seconds),
	      seconds: seconds,
	    });

	    if (seconds == 0) { 
	      clearInterval(this.timer);
		  this.setState({ "finished": true });
	    }
	  }
	componentDidMount(){
		ReactGA.pageview(window.location.pathname + window.location.search);
	    let timeLeftVar = this.secondsToTime(this.state.seconds);
	    this.setState({ time: timeLeftVar });
	    this.timer = setInterval(this.countDown, 1000);
		var key = this.props.match.params.key;
		var r = this;
		Parse.initialize("ZF3GT5g2UuyztbZSZgkeP8WLC4qKYHrkJX2Vccf8wcxAyzWJKabpjzytBf");
		Parse.serverURL = 'https://larecoinprod.herokuapp.com/parse';
		if (Parse.User.current()) {
			Parse.Cloud.run('checkValidVerification', {
			 	"key":  key
			}, {
				success: function(results) {}, error:function(err) {
				if (err == "emailNotVerified") {
					window.location.href = startUrl + "thankyou";
				} else if (err == "fullverified" || err == "NotValid") {
					Parse.User.logOut().then(() => {window.location.href = startUrl + "login";});	
				} else {
					window.location.href = startUrl + "login";
				}
			}});
		} else {
			window.location.href = startUrl + "login";
		}
	    var charLimit = 1;
	    $(".inputsP").keypress(function(e){
			if (e.key === 'Enter') {
				r.handleSubmit();
			}
		}).keydown(function(e) {
	        var keys = [8,9,13,96,97,98,99,100,101,102,103,104,105,19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45,48, 46, 144, 145];
	        if (e.which == 8 && this.value.length == 0) {
	            $(this).prev('.inputsP').focus();
	        } else if ($.inArray(e.which, keys) >= 0) {
	            return true;
	        } else if (this.value.length >= charLimit) {
	            $(this).next('.inputsP').focus();
	            return false;
	        } else if (e.shiftKey || e.which <= 48 || e.which >= 58) {
	            return false;
	        }
	    }).keyup (function () {
	        if (this.value.length >= charLimit) {
	            $(this).next('.inputsP').focus();
	            return false;
	        }
	    });

	}
    handleSubmit(e) {
		var lg = this.refs.loginButton;
		var iLg = "Verify Phone Number"
		lg.innerHTML = "<span class='spinner'></span>";
		$(lg).addClass('loadingState');
    	var one = this.refs.one;
    	var two = this.refs.two;
    	var three = this.refs.three;
    	var four = this.refs.four;
    	var five = this.refs.five;
    	var six = this.refs.six;
    	var key = this.props.match.params.key;
    	if (isEmpty(one.value)) {
    		one.style.backgroundColor = "rgba(255,0,0,0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');
    	} else if (isEmpty(two.value)) {
    		one.style.backgroundColor = "#f3f3f3";
    		two.style.backgroundColor = "rgba(255,0,0,0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');
    	} else if (isEmpty(three.value)) {
    		one.style.backgroundColor = "#f3f3f3";
    		two.style.backgroundColor = "#f3f3f3";
    		three.style.backgroundColor = "rgba(255,0,0,0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');

    	}else if (isEmpty(four.value)) {
    		one.style.backgroundColor = "#f3f3f3";
    		two.style.backgroundColor = "#f3f3f3";
    		three.style.backgroundColor = "#f3f3f3";
    		four.style.backgroundColor = "rgba(255,0,0,0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');

    	}else if (isEmpty(five.value)) {
    		one.style.backgroundColor = "#f3f3f3";
    		two.style.backgroundColor = "#f3f3f3";
    		three.style.backgroundColor = "#f3f3f3";
    		four.style.backgroundColor = "#f3f3f3";
    		five.style.backgroundColor = "rgba(255,0,0,0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');

    	}else if (isEmpty(six.value)) {
    		one.style.backgroundColor = "#f3f3f3";
    		two.style.backgroundColor = "#f3f3f3";
    		three.style.backgroundColor = "#f3f3f3";
    		four.style.backgroundColor = "#f3f3f3";
    		five.style.backgroundColor = "#f3f3f3";
    		six.style.backgroundColor = "rgba(255,0,0,0.05)";
			lg.innerHTML = iLg;
			$(lg).removeClass('loadingState');

    	} else {
    		var code = one.value+two.value+three.value+four.value+five.value+six.value;
			Parse.Cloud.run('verifyPhoneNumberCode', {
				"key": key,
				"code":code
			}, {
			success: function(results) {
				window.location.href = startUrl + "phonethankyou";
				
			}, error:function(err) {
				lg.innerHTML = iLg;
				$(lg).removeClass('loadingState');
				$('.mainTitle').html(err.message);
			}});
    	}
    }
	render() {
		return (
			<div>
				<LoginHeader />
				<div className="loginScreen phoneVerifiedWrapone">
					<div className="screenWrapper">
						<p className="mainTitle" style={{"paddingBottom":"0"}}>Verify your Phone</p>
				        {
				        	this.state.finished == false ?
				        		 <p className="timerCount">Enter code in {this.state.time.m}m : {this.state.time.s}s</p>
				        	:
				        		<Redirect to={"/phoneverify/" + this.props.match.params.key} /> 
				         }
						<div className="loginWrap verifyPhoneWrap" style={{"height":"auto","width":"500px","marginTop":"30px"}}>
							<div className="rgTextW">
								<input type="tel" ref="one" className="inputsP numberInput" style={{"fontSize":"30px"}} maxLength="1" />
								<input type="tel" ref="two" className="inputsP numberInput" style={{"fontSize":"30px"}} maxLength="1" />
								<input type="tel" ref="three" className="inputsP numberInput" style={{"fontSize":"30px"}} maxLength="1" />
								<input type="tel" ref="four" className="inputsP numberInput" style={{"fontSize":"30px"}} maxLength="1" />
								<input type="tel" ref="five" className="inputsP numberInput" style={{"fontSize":"30px"}} maxLength="1" />
								<input type="tel" ref="six" className="inputsP numberInput" style={{"fontSize":"30px"}} maxLength="1" />
							</div>
							<br style={{"clear":"both"}} />	
							<a style={{"width":"100%","textAlign":"center"}} onClick={this.handleSubmit} ref="loginButton" className="loadingButton">Verify Phone Number</a>
							<br style={{"clear":"both"}} />	
						</div>
					</div>
				</div>
			</div>
		);
	}
}









export class ThankYou extends React.Component {
	constructor(props){
		super(props);
		this.sendEmail = this.sendEmail.bind(this);
	}
	componentDidMount(props){
		Parse.initialize("ZF3GT5g2UuyztbZSZgkeP8WLC4qKYHrkJX2Vccf8wcxAyzWJKabpjzytBf");
		Parse.serverURL = 'https://larecoinprod.herokuapp.com/parse';
		ReactGA.pageview(window.location.pathname + window.location.search);
		var currentUser = Parse.User.current();
		if (currentUser) {

		var Users = Parse.Object.extend("_User");
			var query = new Parse.Query(Users);
			query.get(currentUser.id, {
			success: function(results) {
				if (results.get('eVerified') != false && results.get('phoneVerified') == false) {
					window.location.href = startUrl + "phoneverify";
				} else if (results.get('eVerified') == true && results.get('phoneVerified') == true) {
					window.location.href = startUrl + "wallets";
				}
			  },error:function(err){
			  	window.location.href = startUrl + "login";
			  }});
		} else {
			window.location.href = startUrl + "login";
		}
	}
	sendEmail() {
		Parse.Cloud.run('verifyEmailSignup', {
		 	"email": Parse.User.current().getUsername(),
		 	"objectId": Parse.User.current().id,
			"t":Parse.User.current().get('sessionToken')
		}, {
		  success: function(results) {}});
			$('.footer-like').css('backgroundColor',"#2ecc71");
		  	$('.thankyouMessage').attr('style',"color:rgb(46, 204, 113) !important");
		  	$('.footer-like > p > span').html('We sent another email to you.');
		  	$('#sendAgainEmail').css('display',"none");
		}
	render() {
		return (
			<div>
				<LoginHeader />
				<div className="loginScreen thankyouScreen">
					<div className="screenWrapper">
					  <div className="wrapper-1">
					    <div className="wrapper-2">
					      <span className="thankyouMessage">Thank you!</span>
					      <br />
					      <p>We sent you an email.</p>
					      <p><b>Verify</b> your <b>email address</b> quickly to get started!</p>
					    </div>
					    <div className="footer-like">
					      <p><span>Email not received?</span>
					       	<a id="sendAgainEmail" onClick={this.sendEmail}> Click here to send again</a>
					      </p>
					    </div>
					  </div>
				  </div>
				</div>
			</div>
		);
	}
}



export class PhoneThankYou extends React.Component {
	constructor(props){
		super(props);
	}
	componentDidMount(props){
		ReactGA.pageview(window.location.pathname + window.location.search);
		Parse.initialize("ZF3GT5g2UuyztbZSZgkeP8WLC4qKYHrkJX2Vccf8wcxAyzWJKabpjzytBf");
		Parse.serverURL = 'https://larecoinprod.herokuapp.com/parse';
		var currentUser = Parse.User.current();
		if (currentUser) {
		var Users = Parse.Object.extend("_User");
			var query = new Parse.Query(Users);
			query.get(currentUser.id, {
			success: function(results) {
				if (results.get('eVerified') != false && results.get('phoneVerified') == false) {
					window.location.href = startUrl + "phoneverify";
				} else if (results.get('eVerified') == true && results.get('phoneVerified') == true) {
					Parse.User.logOut().then(() => {});
				}
			  }, error:function(err){
			  	window.location.href = startUrl + "login";
			  }});


		} else {
			window.location.href = startUrl + "login";
		}
	}
	render() {
		return (
			<div>
				<LoginHeader />
				<div className="loginScreen thankyouScreen">
					<div className="screenWrapper">
					  <div className="wrapper-1">
					    <div className="wrapper-2">
					      <span className="thankyouMessage">Success!</span>
					      <br />
					      <p>Your phone number has been <b>verified succesfully</b>!</p>
					   		<br /><br />
					   		<Link className="loginBttn" to="/login">Login to account</Link>
					    </div>

					  </div>
				  </div>
				</div>
			</div>
		);
	}
}
function detectmob() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}

function isEmpty(object) {
	 return (object.length === 0 || !object.trim());
}
function isEmail(object) {
    var re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(object).toLowerCase());
}