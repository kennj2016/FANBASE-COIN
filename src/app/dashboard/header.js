import React from "react";
import './header.css';
import LogoImage from "../../images/F-logo-in-Blue.png";
import LogoColorImage from "../../images/F-logo-in-Blue.png";
import DropdownImage from "../../images/dropdownBlack.png";
import NavButtonM from "../../images/navButtonW.png";
import {NavLink,Link} from 'react-router-dom';
import Parse from 'parse';
import {startUrl} from "../../index.js";
import $ from 'jquery';
export const as3url = "https://s3.amazonaws.com/larecoin/profileImages/";

export class MainHeader extends React.Component {
	constructor(props){
		super(props);
		this.handleDropdown = this.handleDropdown.bind(this);
		this.handleMobileD = this.handleMobileD.bind(this);
		this.bgDrop = this.bgDrop.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.handleUpdateNewUser = this.handleUpdateNewUser.bind(this);
		this.state = {
			"src":"",
			"fName":"",
			"id":"",
			"lName":"",
			"email":"",
			"dropdown":false,
			"mobileDrop":false,
			"showFirstTimeUser":false,
			"notification":false,
			"type":""
		}
	}
	componentDidMount(){
		var cu = Parse.User.current();
		var r = this;
		if (cu) {
			this.setState({"id":Parse.User.current().id});
			var Users = Parse.Object.extend("_User");
			var query = new Parse.Query(Users);
			query.get(Parse.User.current().id, {
			success: function(results) {
				if (results.get('firstTimeLoggedIn')) {
					r.setState({"showFirstTimeUser":true})
				}
				r.setState({
					"fName":results.get('fname'),
					"lName":results.get('lname'),
					"src":typeof(results.get('src')) == "object" ? as3url + results.get('src').name() : "",
					"email":results.get('username'),
					"type":results.get('type')
				})
			}, error:function(err){
				if (err.code == 209) {
					Parse.User.logOut().then(() => {
					 	window.location.href = startUrl + "login";
					});
				} else {
					console.log(err)
				}
			}});
		} else {
			window.location.href = startUrl + "login";
		}
	}
	handleDropdown(){
		this.setState({"dropdown":!this.state.dropdown});
		this.setState({"mobileDrop":false});
	}
	handleMobileD(){
		this.setState({"mobileDrop":!this.state.mobileDrop});
		this.setState({"dropdown":false});
	}
	bgDrop(){
		this.setState({"dropdown":false,"mobileDrop":false});
	}
	handleLogout(){
		Parse.User.logOut().then(() => {
		 	window.location.href = startUrl + "login";
		});
	}
	handleUpdateNewUser(){
		var r = this;
		Parse.Cloud.run('updateFirstTimeUser', {
			"id":Parse.User.current().id
		}, {
		success: function(results) {
			r.setState({"showFirstTimeUser":false});
		}, error:function(err){
			if (err.code == 209) {
				Parse.User.logOut().then(() => {
				 	window.location.href = startUrl + "login";
				});
			} else {
				console.log(err)
			}
		}});
	}
	handleNotification = (e) => {
		this.setState({"notification":!this.state.notification});
	}
	render() {
		return (
			<div>
				<div className="bgAccountDropdown" onClick={this.bgDrop} style={{"display":this.state.dropdown == true || this.state.mobileDrop == true ? "block" : "none"}}></div>
				<div className="dHeader desktopH">
					<ul>
						<li className="logo"><Link to="/"><img src={LogoImage} style={{ height:"49px", width:"49px", marginTop:"-10px"}} /></Link></li>					
						<li className="pull-right accountDropdown" >
							<div className="dAccountPreview">
							{
								this.state.src == "" ?
								  <div>
									<Link to="/profile" ><div data-tooltip="Upload Image" data-enabled="true" data-placement="bottom" className="image noImage" style={{"backgroundColor":"white"}}>{this.state.fName.split('')[0]}</div></Link>
									<p className="fullname" onClick={this.handleDropdown}>{this.state.fName} {this.state.lName}</p>
									<img className="dropdownToggle" onClick={this.handleDropdown} style={{"transform":this.state.dropdown == true ? "rotate(180deg)" : "rotate(0deg)"}} src={DropdownImage} />
								  </div>
								: 
								  <div>
									<Link to="/profile" > <div data-tooltip="Upload Image" data-enabled="true" data-placement="bottom" className="image" style={{"backgroundColor":"white","backgroundImage":"url('"+this.state.src+"'"}} ></div></Link>
									<p className="fullname"  onClick={this.handleDropdown}>{this.state.fName} {this.state.lName}</p>
									<img className="dropdownToggle" onClick={this.handleDropdown} style={{"transform":this.state.dropdown == true ? "rotate(180deg)" : "rotate(0deg)"}} src={DropdownImage} />
								  </div>
							}
							</div>
							<div className={this.state.dropdown == true ? "dAccountDropdown visible" : "dAccountDropdown"}>
								<ul>
									<li className="initialScreen">
										{
											this.state.src == "" ?
											  <div>
												<Link to="/profile" ><div className="image noImage" style={{"backgroundColor":"white"}}>{this.state.fName.split('')[0]}</div></Link>
												<Link to="/profile">
													<p style={{"color":"rgb(6, 103, 208)"}} className="dropName">{this.state.fName} {this.state.lName}</p>
													<p style={{"fontSize":"13px"}} className="">ID: {this.state.id}</p>
												</Link>
												<p className="dropEmail">{this.state.email}</p>
											  </div>
											: 
											  <div>
												<Link to="/profile" ><div className="image" style={{"backgroundColor":"white","backgroundImage":"url('"+this.state.src+"'"}} ></div></Link>
												<Link to="/profile">
													<p style={{"color":"rgb(6, 103, 208)"}} className="dropName">{this.state.fName} {this.state.lName}</p>
													<p style={{"fontSize":"13px"}} className="">ID: {this.state.id}</p>
												</Link>
												<p className="dropEmail">{this.state.email}</p>
											  </div>
										}														
									</li>
									<Link to="/settings/profile"><li>Account Settings</li></Link>
									<Link to="/referrals"><li>Invite Friends <span className="tag green pull-right">Get $10</span></li></Link>
									<a onClick={this.handleLogout}><li>Log out</li></a>
									{
										this.state.type == "Admin" ?
										<a href="https://larecoin.github.io/admin/#/"><li>Admin Dashboard</li></a>
										: ""
									}
								</ul>
							</div>
						</li>
{/*						<li className="pull-right notificationBell">
							<a onClick={this.handleNotification} className="headerLink active">
								<i className="fa fa-bell"></i>
							</a>
							<div style={{"display": this.state.notification == true ? "block" : "none"}}>
								<div className="notifyTriangele"></div>
								<div className="notificationContainer">
								<div className="titleHeader">
									<span>Notifications</span>
								</div>
								<ul className="notifyContent">
									<a>
										<li className="active">
											<img className="notifyProfileImage" 
											src="https://s3.amazonaws.com/larecoin/profileImages/0c14ca7cfdc9eb09635be45f446c1586_profileImagejpeg.jpeg" />
											<div><b>Ali Fardos</b> sent your a friend request.</div>
											<div className="bttnContains">
												<a className="coFBTTN">Confirm</a>
												<a className="deleteFBTTN">Delete</a>
											</div>
											<span className="notifyLikeIcon"><i className="fa fa-user"></i> <span>July 7 at 2:30 PM</span></span>
										</li>
									</a>
								</ul>
								</div>
							</div>
						</li>*/}
					</ul>
				</div>
				<div className="dHeader mobileM">
					<ul>
						<li className="pull-left mobileNavButton" onClick={this.handleMobileD}><img src={NavButtonM} /></li>
						<li className="logo"><Link to="/"><img src={LogoImage} style={{ height:"49px", width:"49px", marginTop:"-10px"}} /></Link></li>
						<li className="pull-right accountDropdown"  onClick={this.handleDropdown}>
							<div className="dAccountPreview">
							{
								this.state.src == "" ?
								  <div>
									<div className="image noImage" style={{"backgroundColor":"white"}}>{this.state.fName.split('')[0]}</div>
								  </div>
								: 
								  <div>
									<div classNames="image" style={{"backgroundColor":"white","backgroundImage":"url('"+this.state.src+"'"}} ></div>
								  </div>
							}
							</div>
							<div className={this.state.dropdown == true ? "dAccountDropdown mobileDropdown visible" : "dAccountDropdown mobileDropdown"}>
								<ul>
									<li className="initialScreen">
										{
											this.state.src == "" ?
											  <div>
												<div className="image noImage" style={{"backgroundColor":"white"}}>{this.state.fName.split('')[0]}</div>
												<Link to="/profile"><p style={{"color":"rgb(6, 103, 208)"}} className="dropName">{this.state.fName} {this.state.lName}</p></Link>
												<p className="dropEmail">{this.state.email}</p>
											  </div>
											: 
											  <div>
												<div className="image" style={{"backgroundColor":"white","backgroundImage":"url('"+this.state.src+"'"}} ></div>
												<Link to="/profile"><p style={{"color":"rgb(6, 103, 208)"}} className="dropName">{this.state.fName} {this.state.lName}</p></Link>
												<p className="dropEmail">{this.state.email}</p>
											  </div>
										}														
									</li>
									<Link to="/settings/profile"><li>Account Settings</li></Link>
									<Link to="/referrals"><li>Invite Friends <span className="tag green pull-right">Get $10</span></li></Link>
									<a onClick={this.handleLogout}><li>Log out</li></a>
									{
										this.state.type == "Admin" ?
										<a href="https://larecoin.github.io/admin/#/"><li>Admin Dashboard</li></a>
										: ""
									}
								</ul>
							</div>
						</li>
					</ul>
				</div>
				<SubHeader mactive={this.state.mobileDrop} />
				{
					this.state.showFirstTimeUser == true ?
					<div>
						<div className="loginCongrats">
							<div className="verifyContainer">
								<span className="logoContain">
									<img src={LogoColorImage} style={{"width": "150px"}} />
								</span>
								<p className="title" style={{"padding-top": "40px"}}>Congratulations!</p>
								<p className="description">You just earned <b>17.47348 FNB</b> for joining during our beta phase. Welcome to Fanbase!</p>
								<div className="fardosBttnCont">
									<a onClick={this.handleUpdateNewUser}  className="fardosBttn">Go to Wallets</a>
								</div>
							</div>
						</div>
						<div className="loginCongratsBgC"></div>
					</div>
					: ""
				}
			</div>
		)
	}
}
class SubHeader extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"verified":""
		}
	}
	componentDidMount(){
		var cu = Parse.User.current();
		var r = this;
		if (cu) {
			var Users = Parse.Object.extend("_User");
			var query = new Parse.Query(Users);
			query.get(Parse.User.current().id, {
			success: function(results) {
				r.setState({
					"verified":results.get('accountVerifiedStatus'),
				})
			}, error:function(err){
				if (err.code == 209) {
					Parse.User.logOut().then(() => {
					 	window.location.href = startUrl + "login";
					});
				} else {
					console.log(err)
				}
			}});
		} else {
			window.location.href = startUrl + "login";
		}
	}
	render() {
		return (
			<div>
				<div className="subheader desktopSH">
					<ul>
						<NavLink to="/profile/aboutme" exact activeClassName="activeNewsFeed"><li>
							<span style={{"marginTop":"1px"}} className="svgImage">{userProfileSVG}</span></li>
						</NavLink>
{/*						<NavLink to="/profile" exact activeClassName="activeNewsFeed"><li style={{"marginRight":"10px"}}>
							<span style={{"marginTop":"1px"}} className="svgImage">{newsFeedIcon}</span></li>
						</NavLink>*/}
{/*						<NavLink to="/coins" activeClassName="active"><li>
							<span className="svgImage">{dashboardSVG}</span> All Coins</li>
						</NavLink>*/}
						<NavLink to="/exchange" activeClassName="active"><li>
							{/*<span style={{"marginTop":"1px"}} className="svgImage">{exchangeSVG}</span>*/} Buy Tokens</li>
						</NavLink>	
						<NavLink to="/exchange2" activeClassName="active"><li>
							{/*<span style={{"marginTop":"1px"}} className="svgImage">{exchangeSVG}</span>*/} Buy Tickets</li>
						</NavLink>
						<NavLink to="/wallets" activeClassName="active"><li>
					    {/*<span className="svgImage">{walletSVG}</span> */} My Tokens</li>
						</NavLink>
						<NavLink to="/wallets2" activeClassName="active"><li>
							{/*<span className="svgImage">{walletSVG}</span>*/} My Tickets</li>
						</NavLink>
						<NavLink to="/wallets3" activeClassName="active"><li>
							{/*<span className="svgImage">{walletSVG}</span>*/} My Collectibles</li>
						</NavLink>
						<NavLink to="/referrals" activeClassName="active"><li>
							{/*<span style={{"marginTop":"1px"}} className="svgImage">{referralsSVG}</span> */} My Friends</li>
						</NavLink>	
{/*						<NavLink to="/referrals" activeClassName="active"><li>
							<span style={{"marginTop":"1px"}} className="svgImage">{bountiesSVG}</span> Bounties</li>
						</NavLink>*/}
						<li className="toolbarVerificationBar pull-right" style={{"paddingTop":"0","float":"right"}}>
							<div className="milestoneBarWrap" style={{"width":"300px","paddingTop":"15px"}}>
								<div className="milestonebar" style={{"height":"30px"}}>
									<div className="activeBar" style={{"width":this.state.verified == "Complete" ? "100%" : this.state.verified == "Not Completed" ? "0%" : "50%" ,"paddingTop":"0px"}}>
										{
											this.state.verified == "Complete" ?
											<span style={{"fontSize":"12px"}}>Account Verified</span>
											: this.state.verified == "Not Completed" ?
											<Link style={{"fontSize":"12px","whiteSpace":"nowrap","marginLeft":"10px"}} to="/settings/profile">Verify Account</Link>
											: 
											<span style={{"fontSize":"12px"}}>Pending Verification</span>
										}
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div className={this.props.mactive == true ? "subheader mbsubHeader visible" : "subheader mbsubHeader"}>
					<ul>
{/*						<NavLink to="/coins" activeClassName="active"><li>
							<span className="svgImage">{dashboardSVG}</span> All Coins</li>
						</NavLink>*/}
						<NavLink to="/profile/aboutme" exact activeClassName="activeNewsFeed"><li>
							<span style={{"marginTop":"1px"}} className="svgImage">{userProfileSVG}</span> Profile</li>
						</NavLink>
						<NavLink to="/exchange" activeClassName="active"><li>
							<span style={{"marginTop":"1px"}} className="svgImage">{exchangeSVG}</span> Buy Coinsddddd</li>
						</NavLink>	
						<NavLink to="/wallets" activeClassName="active"><li>
							<span className="svgImage">{walletSVG}</span>My Wallets</li>
						</NavLink>
						<NavLink to="/referrals" activeClassName="active"><li>
							<span style={{"marginTop":"1px"}} className="svgImage">{referralsSVG}</span> Referrals</li>
						</NavLink>	

					</ul>
				</div>
			</div>
		)
	}
}







export class Footer extends React.Component {
	constructor(props){
		super(props);
		this.updateDimensions = this.updateDimensions.bind(this);
	}
	componentDidMount(){
		window.addEventListener("resize", this.updateDimensions);
		this.updateDimensions();
	}
	updateDimensions(){
		if ($('.page').height() < $(window).height()) {
			$('.dFooter').addClass('fixed');
		} else {
			$('.dFooter').removeClass('fixed');
		}
	}
	render() {
		return (
			<div>
				<div className="dFooter">
					<ul>
						<li><Link to="/dashboard/terms">TERMS OF SERVICE</Link></li>
						<li><Link to="/dashboard/privacy">PRIVACY POLICY</Link></li>
						<li><Link to="/dashboard/tokensalepolicy">LEARN ABOUT US</Link></li>
						<li><Link to="/dashboard/whitepaper">WHITE PAPER</Link></li>
						<li><Link to="/support">SUPPORT</Link></li>
						<li className="pull-right">©2018 Fanbase</li>
					</ul>
				</div>
			</div>
		)
	}
}

var dashboardSVG = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 94.036 94.036"><g><rect x="7.283" width="35.529" height="24.337"></rect><rect x="7.283" y="32.871" width="35.529" height="24.337"></rect><rect x="1.173" y="65.631" width="41.469" height="28.405"></rect><rect x="51.276" width="35.529" height="24.337"></rect><rect x="51.276" y="32.871" width="35.529" height="24.337"></rect><rect x="51.394" y="65.631" width="41.47" height="28.405"></rect></g></svg>;
var walletSVG = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 458.531 458.531" width="16" height="16">				<g>					<path d="M336.688,343.962L336.688,343.962c-21.972-0.001-39.848-17.876-39.848-39.848v-66.176     c0-21.972,17.876-39.847,39.848-39.847h103.83c0.629,0,1.254,0.019,1.876,0.047v-65.922c0-16.969-13.756-30.725-30.725-30.725     H30.726C13.756,101.49,0,115.246,0,132.215v277.621c0,16.969,13.756,30.726,30.726,30.726h380.943     c16.969,0,30.725-13.756,30.725-30.726v-65.922c-0.622,0.029-1.247,0.048-1.876,0.048H336.688z"></path>					<path d="M440.518,219.925h-103.83c-9.948,0-18.013,8.065-18.013,18.013v66.176c0,9.948,8.065,18.013,18.013,18.013h103.83     c9.948,0,18.013-8.064,18.013-18.013v-66.176C458.531,227.989,450.466,219.925,440.518,219.925z M372.466,297.024     c-14.359,0-25.999-11.64-25.999-25.999s11.64-25.999,25.999-25.999c14.359,0,25.999,11.64,25.999,25.999     C398.465,285.384,386.825,297.024,372.466,297.024z"></path>					<path d="M358.169,45.209c-6.874-20.806-29.313-32.1-50.118-25.226L151.958,71.552h214.914L358.169,45.209z"></path>				</g>				</svg>
var exchangeSVG = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 511.626 511.626">					<g>						<path d="M234.693,270.09c8.754-20.745,16.175-37.019,22.266-48.82c4.568-8.754,8.854-16.13,12.851-22.126							c3.993-5.996,8.85-11.849,14.558-17.558c5.715-5.711,12.278-9.998,19.705-12.85c7.419-2.855,15.697-4.283,24.838-4.283h73.084							v54.818c0,2.474,0.903,4.617,2.71,6.423c1.807,1.809,3.949,2.712,6.42,2.712c2.669,0,4.859-0.854,6.563-2.568l91.365-91.359							c1.718-1.715,2.573-3.901,2.573-6.567c0-2.666-0.855-4.853-2.573-6.574L417.976,30.26c-2.279-1.902-4.572-2.849-6.852-2.849							c-2.669,0-4.853,0.855-6.57,2.57c-1.704,1.713-2.56,3.9-2.56,6.565v54.814h-73.084c-12.946,0-25.126,1.574-36.549,4.714							c-11.423,3.14-21.56,7.135-30.409,11.991c-8.852,4.854-17.416,11.372-25.697,19.558c-8.28,8.182-15.324,16.084-21.126,23.697							c-5.804,7.611-11.897,17.127-18.272,28.549c-6.374,11.42-11.514,21.414-15.416,29.978c-3.903,8.566-8.613,19.13-14.132,31.693							c-8.757,20.746-16.18,37.022-22.27,48.822c-4.567,8.754-8.853,16.132-12.847,22.127c-3.996,5.996-8.853,11.848-14.562,17.557							c-5.711,5.715-12.278,9.999-19.701,12.854c-7.421,2.854-15.703,4.284-24.838,4.284H9.139c-2.666,0-4.856,0.849-6.567,2.566							c-1.709,1.711-2.568,3.895-2.568,6.563v54.823c0,2.663,0.862,4.853,2.575,6.57c1.714,1.712,3.905,2.567,6.567,2.567h63.954							c12.946,0,25.125-1.574,36.547-4.716c11.42-3.142,21.558-7.139,30.406-11.991c8.853-4.856,17.417-11.376,25.697-19.562							c8.278-8.179,15.324-16.084,21.128-23.694c5.802-7.615,11.894-17.129,18.271-28.548c6.374-11.424,11.516-21.416,15.416-29.979							C224.464,293.217,229.173,282.656,234.693,270.09z"></path>						<path d="M9.135,164.45h63.954c8.375,0,16.13,1.381,23.269,4.143s13.134,6.091,17.987,9.995c4.854,3.904,9.707,9.279,14.561,16.13							c4.853,6.855,8.708,12.9,11.563,18.131c2.853,5.236,6.374,12.137,10.562,20.701c14.659-34.451,27.694-60.432,39.115-77.943							c-30.454-42.825-69.473-64.241-117.058-64.241H9.135c-2.666,0-4.856,0.855-6.567,2.57C0.859,95.647,0,97.834,0,100.5v54.818							c0,2.667,0.855,4.851,2.568,6.563C4.283,163.596,6.473,164.45,9.135,164.45z"></path>						<path d="M417.983,286.085c-2.286-1.902-4.572-2.847-6.858-2.847c-2.662,0-4.853,0.852-6.563,2.566							c-1.711,1.711-2.566,3.901-2.566,6.563v54.823h-73.091c-8.378,0-16.132-1.383-23.271-4.147							c-7.139-2.759-13.135-6.088-17.987-9.993c-4.849-3.901-9.705-9.28-14.558-16.135c-4.856-6.852-8.713-12.898-11.567-18.135							c-2.852-5.226-6.373-12.135-10.561-20.693c-14.655,34.259-27.596,60.24-38.828,77.943c5.137,7.422,10.467,14.037,15.987,19.838							c5.518,5.804,10.754,10.896,15.702,15.276c4.949,4.374,10.564,8.186,16.844,11.416c6.283,3.237,11.8,5.948,16.563,8.139							c4.771,2.189,10.76,3.949,17.99,5.283c7.231,1.328,13.322,2.334,18.271,2.991c4.948,0.664,11.707,1.143,20.272,1.431							c8.562,0.287,15.51,0.376,20.834,0.287c5.335-0.096,13.045-0.198,23.134-0.287c10.089-0.093,18.179-0.144,24.271-0.144v54.819							c0,2.474,0.903,4.616,2.71,6.423c1.807,1.808,3.949,2.711,6.42,2.711c2.669,0,4.859-0.855,6.563-2.566l91.365-91.358							c1.711-1.718,2.566-3.901,2.566-6.57c0-2.666-0.855-4.853-2.573-6.563L417.983,286.085z"></path>					</g>				</svg>
var referralsSVG = <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" width="18" height="18" viewBox="0 0 457.03 457.03">					<path d="M421.512,207.074l-85.795,85.767c-47.352,47.38-124.169,47.38-171.529,0c-7.46-7.439-13.296-15.821-18.421-24.465   l39.864-39.861c1.895-1.911,4.235-3.006,6.471-4.296c2.756,9.416,7.567,18.33,14.972,25.736c23.648,23.667,62.128,23.634,85.762,0   l85.768-85.765c23.666-23.664,23.666-62.135,0-85.781c-23.635-23.646-62.105-23.646-85.768,0l-30.499,30.532   c-24.75-9.637-51.415-12.228-77.373-8.424l64.991-64.989c47.38-47.371,124.177-47.371,171.557,0   C468.869,82.897,468.869,159.706,421.512,207.074z M194.708,348.104l-30.521,30.532c-23.646,23.634-62.128,23.634-85.778,0   c-23.648-23.667-23.648-62.138,0-85.795l85.778-85.767c23.665-23.662,62.121-23.662,85.767,0   c7.388,7.39,12.204,16.302,14.986,25.706c2.249-1.307,4.56-2.369,6.454-4.266l39.861-39.845   c-5.092-8.678-10.958-17.03-18.421-24.477c-47.348-47.371-124.172-47.371-171.543,0L35.526,249.96   c-47.366,47.385-47.366,124.172,0,171.553c47.371,47.356,124.177,47.356,171.547,0l65.008-65.003   C246.109,360.336,219.437,357.723,194.708,348.104z"></path>				</svg>
var bountiesSVG = <svg version="1.1" width="20px" height="20px" x="0px" y="0px" viewBox="0 0 512 512" ><g><g>	<circle cx="256" cy="256" r="32"></circle></g></g><g><g><path d="M461.026,236C451.573,138.344,373.656,60.427,276,50.974V0h-40v50.974C138.344,60.427,60.427,138.344,50.974,236H0v40h50.974c9.453,97.656,87.37,175.573,185.026,185.026V512h40v-50.974c97.656-9.453,175.573-87.371,185.026-185.026H512v-40H461.026z M420.792,276C411.674,351.577,351.577,411.674,276,420.792V370h-40v50.792C160.423,411.674,100.326,351.577,91.208,276H142v-40H91.208C100.326,160.423,160.423,100.326,236,91.208V142h40V91.208c75.577,9.117,135.674,69.214,144.792,144.792H370v40H420.792z"></path></g></g></svg>
var newsFeedIcon = <svg x="0px" width="22" height="22" y="0px" viewBox="0 0 489.3 489.3"><path d="M79.55,229.675c-10.2,10.2-10.2,26.8,0,37.1c10.2,10.2,26.8,10.2,37.1,0c70.6-70.6,185.5-70.6,256.1,0
			c5.1,5.1,11.8,7.7,18.5,7.7s13.4-2.6,18.5-7.7c10.2-10.2,10.2-26.8,0-37.1C318.75,138.575,170.55,138.575,79.55,229.675z"/><path d="M150.35,300.475c-10.2,10.2-10.2,26.8,0,37.1c10.2,10.2,26.8,10.2,37.1,0c31.5-31.6,82.9-31.6,114.4,0
			c5.1,5.1,11.8,7.7,18.5,7.7s13.4-2.6,18.5-7.7c10.2-10.2,10.2-26.8,0-37C286.95,248.475,202.35,248.475,150.35,300.475z"/><circle cx="244.65" cy="394.675" r="34.9"/><path d="M481.65,157.675c-130.7-130.6-343.3-130.6-474,0c-10.2,10.2-10.2,26.8,0,37.1c10.2,10.2,26.8,10.2,37.1,0
			c110.2-110.3,289.6-110.3,399.9,0c5.1,5.1,11.8,7.7,18.5,7.7s13.4-2.6,18.5-7.7C491.85,184.575,491.85,167.975,481.65,157.675z"/></svg>
var userProfileSVG = <svg x="0px" y="0px" width="22" height="22" viewBox="0 0 60 60"><path d="M48.014,42.889l-9.553-4.776C37.56,37.662,37,36.756,37,35.748v-3.381c0.229-0.28,0.47-0.599,0.719-0.951
	c1.239-1.75,2.232-3.698,2.954-5.799C42.084,24.97,43,23.575,43,22v-4c0-0.963-0.36-1.896-1-2.625v-5.319
	c0.056-0.55,0.276-3.824-2.092-6.525C37.854,1.188,34.521,0,30,0s-7.854,1.188-9.908,3.53C17.724,6.231,17.944,9.506,18,10.056
	v5.319c-0.64,0.729-1,1.662-1,2.625v4c0,1.217,0.553,2.352,1.497,3.109c0.916,3.627,2.833,6.36,3.503,7.237v3.309
	c0,0.968-0.528,1.856-1.377,2.32l-8.921,4.866C8.801,44.424,7,47.458,7,50.762V54c0,4.746,15.045,6,23,6s23-1.254,23-6v-3.043
	C53,47.519,51.089,44.427,48.014,42.889z"/></svg>;

