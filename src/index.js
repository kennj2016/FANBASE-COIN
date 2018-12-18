import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter,Route, Switch,Redirect,Link} from 'react-router-dom';
import {Login,Register,ForgotPassword,PhoneVerify,ThankYou,VerifyEmailToPhone,PhoneCodeVerify,PhoneThankYou} from './app/login/login';
import {Wallets,Wallets2,Wallets3,Exchange,Exchange2,Referrals,ExchangeDetailsRoute,Transactions} from './app/dashboard/index/index';
import {AllCoins} from "./app/dashboard/allcoins/allcoins"
import {Profile,Security,Verification,Preferences,LimitsPage,ActivityPage} from './app/dashboard/settings/settings';
import {Support} from './app/dashboard/support/support';
import {TermDash,PrivacyDash,AMLCFTDash,TokensalepolicyDash,WhitePaperDash} from './app/dashboard/legal.js';
import {MainProfile,AboutMeProfile,FriendsPage} from './app/dashboard/profile/profile.js';

import {NewsPage} from "./app/dashboard/news/news";
import {IndexPage,TokenSaleSite} from "./site/main";
import {RoadmapSite} from "./site/roadmap/roadmap";
import {TermSite,PrivacySite,AMLCFTSite,TokensalepolicySite,WhitePaperSite} from "./site/legal/terms";
import SuccessImage from "./images/sucess.png"
import error from "./images/error.png"
import Parse from 'parse';
import './index.css'
//export const startUrl = "http://localhost:3004/#/";
//export const startUrl = "https://larecoin.com/test/#/";
export const startUrl = "https://fnbsx.github.io/fnbsx-dec/#/";

Parse.initialize("ZF3GT5g2UuyztbZSZgkeP8WLC4qKYHrkJX2Vccf8wcxAyzWJKabpjzytBf");
Parse.serverURL = 'https://larecoinprod.herokuapp.com/parse';

class R extends React.Component {
	componentDidMount() {
		var currentUser = Parse.User.current();
		if (currentUser) {
			//Parse.User.logOut().then(() => {});	
			var Users = Parse.Object.extend("_User");
			var query = new Parse.Query(Users);
			query.get(currentUser.id, {
			  success: function(results) {
				if (results.get('eVerified') == false) {
					window.location.href = startUrl + "thankyou";
				} else if (results.get('phoneVerified') == false) {
					Parse.Cloud.run('phoneVerifiedRelogin', {
						"id": currentUser.id
					}, {
					success: function(results) {
						window.location.href = startUrl + "phoneverify/" + results;
					}, error:function(err) {
						window.location.href = startUrl + "login";
					}});
				} else {
					window.location.href = startUrl + "dashboard";
				}

			  },
			  error: function(object, error) {
			   window.location.href = startUrl + "login";
			  }
			});
		} else {
			window.location.href = startUrl + "login";
		}
	}
	render() {
		return (
			<h1></h1>
		)
	}
}

class App extends React.Component {
	componentDidMount() {
	}
	render() {
		return (
			<HashRouter>
				<Switch>
				 	<Route exact path="/" component={IndexPage} />
				 	<Route exact path="/tokensale" component={TokenSaleSite} />
				 	<Route exact path="/roadmap" component={RoadmapSite} />
				 	<Route exact path="/terms" component={TermSite} />
				 	<Route exact path="/privacy" component={PrivacySite} />
				 	<Route exact path="/amlcft" component={AMLCFTSite} />
				 	<Route exact path="/tokensalepolicy" component={TokensalepolicySite} />
				 	<Route exact path="/whitepaper" component={WhitePaperSite} />
				 	
				 	<Route exact path="/register" component={Register} />
				 	<Route extact path='/register/:key' component={Register} />
				 	<Route path="/login" component={Login} />
				 	<Route path="/forgot" component={ForgotPassword} />
				 	<Route exact path="/phoneverify" component={R} />
				 	<Route exact path="/phoneverify/:key" component={PhoneVerify} />
				 	<Route path='/phoneverify/:key/:phone' component={PhoneCodeVerify} />
				 	<Route exact path="/verifyemailtophone" component={VerifyEmailToPhone}></Route>
				 	<Route path='/verifyemailtophone/:t/:key' component={VerifyEmailToPhone} />
				 	<Route path="/thankyou" component={ThankYou} />
				 	<Route path="/phonethankyou" component={PhoneThankYou} />
					 <Route path="/coins" component={AllCoins} />
					 
					 <Route path="/wallets" component={Wallets} />
					 {/*Tonys Wallets2 Route*/}
					 <Route path="/wallets2" component={Wallets2} />
					 <Route path="/wallets3" component={Wallets3} />

					 <Route path="/transactions" component={Transactions} />
					 
					 <Route exact path="/exchange" component={Exchange} />
					 {/*Tonys Exchnage2 Route*/}
					 <Route exact path="/exchange2" component={Exchange2} />

				 	<Route path="/exchange/:key" component={ExchangeDetailsRoute} />
				 	<Route path="/referrals" component={Referrals} />
				 	<Route exact path="/support" component={Support} />
				 	<Route exact path="/support/:key" component={Support} />

				 	<Route exact path="/settings/profile" component={Profile} />
				 	<Route exact path="/settings/security" component={Security} />
				 	<Route exact path="/settings/preferences" component={Preferences} />
				 	<Route exact path="/settings/limits" component={LimitsPage} />
				 	<Route exact path="/settings/activity" component={ActivityPage} />
				 	<Route exact path="/news" component={NewsPage} />


				 	<Route exact path="/profile" component={MainProfile} />
				 	<Route exact path="/profile/aboutme" component={AboutMeProfile} />
				 	<Route exact path="/profile/friends" component={FriendsPage} />


				 	<Route exact path="/profile/:key" component={MainProfile} />
				 	<Route exact path="/profile/:key/aboutme" component={AboutMeProfile} />
				 	<Route exact path="/profile/:key/friends" component={FriendsPage} />

				 	<Route exact path="/settings/verify" component={Verification} />
				 	<Route exact path="/verifyuserSend/:key" component={verifyuserSend} />


				 	<Route exact path="/dashboard/terms" component={TermDash} />
				 	<Route exact path="/dashboard/privacy" component={PrivacyDash} />
				 	<Route exact path="/dashboard/tokensalepolicy" component={TokensalepolicyDash} />
				 	<Route exact path="/dashboard/amlcft" component={AMLCFTDash} />
				 	<Route exact path="/dashboard/whitepaper" component={WhitePaperDash} />


				</Switch>
			</HashRouter>
		)
	}
}

class verifyuserSend extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"success":false,
			"error":false,
			"errorMessage":"",
			"currentUser":false
		}
	}
	componentDidMount(){
		var key = this.props.match.params.key;
		var r = this;
		if (Parse.User.current()) {
			r.setState({"currentUser":true})
		} else {
			r.setState({"currentUser":false})
		}
		Parse.Cloud.run('sendUserConfirm', {
			"id":key,
		}, {
		success: function(results) {
			r.setState({"success":true})
		}, error:function(err){
			r.setState({"error":true,"errorMessage":err.message})
		}});	
	}
	render(){
		return (
			<div>
			{
				this.state.success == false && this.state.error == false ?
					<div className="loadingScreen">
						<div class="loading-spinner"></div>
					</div>
				:
				""
			}
			{
				this.state.success == true ?
				<div className="successWrapper">
					<img src={SuccessImage} />
					<p className="sWTitle">Transfer Complete!</p>
					<p className="sWSubtitle">We sent your FNB to the user.</p>
					{
						this.state.currentUser == true ?
							<Link className="gotoDashboard" to="/wallets">Go to Dashboard</Link>
						:
							<Link className="gotoDashboard" to="/login">Log in</Link>
					}
				</div>	
				: ""
			}
			{
				this.state.error == true ?
				<div className="successWrapper">
					<img src={error} />
					<p className="sWTitle error">Something went wrong!</p>
					<p className="sWSubtitle">This transfer is invalid. Please try again.</p>
					{
						this.state.currentUser == true ?
							<Link className="gotoDashboard" to="/wallets">Go to Dashboard</Link>
						:
							<Link className="gotoDashboard" to="/login">Log in</Link>
					}
				</div>	
				: ""
			}
			</div>
		)

	}

}



ReactDOM.render(
	<App />,
	document.getElementById('larecoin')
);

