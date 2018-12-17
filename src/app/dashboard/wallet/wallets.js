import React from "react";
import "./wallets.css";
import {Timer} from "../index/index";
import Parse from "parse";
import $ from "jquery";
import {startUrl} from "../../../index.js";
import {Link} from 'react-router-dom';
import LogoSW from "../../../images/f-in-blue1.png";




export class DepositDetails extends React.Component {
	constructor(props){
		super(props);
		this.handleInputAmount = this.handleInputAmount.bind(this);
		this.handleDeposit = this.handleDeposit.bind(this);
		this.state = {
			"amount":"",
			"minimum":100,
			"type":"USD",
			"showSuccess":false,
			"referenceNumber":"",
			"confirmNumber":"",
			"totalLare":"0"
		}
	}
	componentDidMount() {
		this.setState({"referenceNumber":Parse.User.current().id});
		var r = this;
		Parse.Cloud.run('getRatesandtotalLare', {
			"id":Parse.User.current().id
		}, {
		success: function(results) {
			r.setState({"totalLare":results.totalLare});
		},error:function(err){
			if (err.code == 209) {
				Parse.User.logOut().then(() => {
				 	window.location.href = startUrl + "login";
				});
			} else {
				console.log(err)
			}
		}});
	}
	componentWillReceiveProps(prps) {
		if (prps.amount != undefined) {
			this.setState({"amount":prps.amount});
		}
	}
	handleInputAmount(e) {
		this.setState({"amount":e.target.value});
	}
	handleDeposit() {

		var r = this;
		var totalPerDollar = Math.abs(1 / parseFloat("0.56085"));
		var lareAmount = (parseFloat(this.state.amount) * totalPerDollar).toFixed(5);
		var date = new Date(); date.setDate(date.getDate() + 3);
		var Transactions = Parse.Object.extend("Transactions");
		var transacte = new Transactions();
		transacte.set("userId", {
		  "__type": 'Pointer',
		  "className": '_User',
		  "objectId":  Parse.User.current().id
		});
		transacte.set("currencyFrom", "USD");
		transacte.set("currencyTo", "LARE");
		transacte.set("amount", this.state.amount);
		transacte.set("bonusPercent", "100");
		transacte.set("totalLare", lareAmount);
		transacte.set("feePercent", "0");
		transacte.set("txn_id", "");
		transacte.set("confirms_needed", "");
		transacte.set("address", "");
		transacte.set("status", "Open");
		transacte.set("Details", "Waiting for buyer to send funds through "+this.props.type == "electronic" ? "Wire Transfer" : this.props.type == "cashapp" ? "Cash App" : ""+"...");
		transacte.set("totalSend",this.state.amount);
		transacte.set("ExpireDate", date.toString());
		transacte.set("type", this.props.type == "electronic" ? "Wire Transfer" : this.props.type == "cashapp" ? "Cash App" : "");
		transacte.set("status_url", "");
		transacte.set("cpFee", "");
		transacte.save(null, {
		  success: function(data) {
		  	
		    r.setState({"confirmNumber":data.id,"showSuccess":true});
		  },
		  error: function(gameScore, error) {
		    
		    console.log('Failed to create new object, with error code: ' + error.message);
		  }
		});
	}	
	render() {
		return (
			<div>
			{
				this.props.type == "electronic" ?

				this.state.showSuccess == false ?
				<div className="DepositDetailsWrapper">
					<p style={{"fontWeight":"300","textTransform":"none","fontSize":"25px","paddingBottom":"40px","textCenter":"center"}} className="title">Wire Transfer</p>
					<div className="pull-right depositTiming">	
						<p className="customTimerTitle">Deposit within</p>
						<Timer hide="true" seconds="21600" />
					</div>
					<div className="porfolioTable">
						<ul>
							<li>
								<div className="logoP larecoin" style={{"background-color":"rgb(77, 138, 255)","color":"white"}}><img style={{"width":"8px"}} src={LogoSW} /></div>
								<div className="porfolioDetails">
									<span>FNB</span>
									<span>Available Balance: {this.state.totalLare} FNB</span>
								</div>
							</li>
						</ul>
					</div>
					{
						this.state.amount == "" || parseFloat(this.state.amount) < this.state.minimum ?
						"" :
						<div>
							<div className="wiretransferDetailsWrap1">
								<p className="title">Wire Transfer Only:</p>
								<ul className="wiretransferDetails">
									<li>
										<p>FNB</p>
										<p>8 The Green, Ste A</p>
										<p>Dover DE, 19909</p>
									</li>
									<li>
										<p><b>Routing/ABA:</b><span>540060102</span></p>
										<p><b>Account #:</b><span>381047217041</span></p>
										<p><b>Swift Code:</b><span>BOFAUS3N</span></p>
										<p className="warningMessage">Bank of America's SWIFT code BOFAUS3N should be used for incoming wires in U.S. dollars. Bank of America's SWIFT code BOFAUS6S should be used for incoming wires in foreign currency.</p>
									</li>
								</ul>
							</div>
							<div className="wiretransferDetailsWrap">
								<ul className="wiretransferDetails">
									<li>
										<p className="title">Bank Details:</p>
										<p>Bank of America</p>
										<p>15 Apple Blossom Lane</p>
										<p>Manalapan NJ 07726</p>
									</li>
									<li>
										<p className="title">Your Reference #</p>  
										<p className="warningMessage">* Must include ref # or risk losing your deposit</p>
										<p className="referenceNumber">{this.state.referenceNumber}</p>
									</li>
								</ul>
							</div>
						</div>
					}
					<div className="amountWrapperDetails">
						<div className="amountSendwrapper">
							<p className="title">Enter Amount</p>  
							<div className="amountToSend">
								<input value={this.state.amount} onChange={this.handleInputAmount} type="tel" className="amountInput" maxLength="9" placeholder="0.00" />
								<select dir="rtl" className="amountSelect">
									<option>USD</option>
								</select>
								<br style={{"clear":"both"}} />
							</div>
						</div>
						<div className="confirmDeposit">
							{
								this.state.amount == "" || parseFloat(this.state.amount) < this.state.minimum ? 
									<a className="red confirmDepositBttn">$100.00 minimum</a>
								:
									<a onClick={this.handleDeposit} className="confirmDepositBttn">Confirm Deposit</a>
							}
						</div>
						<br style={{"clear":"both"}} />
					</div>
				</div>
			:
			<div className="depositSuccessScreen">
				<p className="transferSuccess">Success!</p>
				<p className="transferSubtitle">Please allow 72 hours from when the wire transfer posts for your deposit to process.</p>
				<p className="wireTransferTitle">Wire Transfer ID</p>
				<p className="wireTransferConfirm">{this.state.confirmNumber}</p>
			</div>
			: this.props.type == "cashapp" ?


			this.state.showSuccess == false ?
				<div className="DepositDetailsWrapper" style={{"padding":"0"}}>
					<p style={{"fontWeight":"300","textTransform":"none","fontSize":"25px","paddingBottom":"40px","textCenter":"center"}} className="title">Cash App Transfer</p>
					<div className="porfolioTable">
						<ul>
							<li>
								<div className="logoP larecoin" style={{"background-color":"rgb(77, 138, 255)","color":"white"}}><img style={{"width":"8px"}} src={LogoSW} /></div>
								<div className="porfolioDetails">
									<span>FNB</span>
									<span>Available Balance: {this.state.totalLare} FNB</span>
								</div>
							</li>
						</ul>
					</div>
					{
						this.state.amount == "" || parseFloat(this.state.amount) < this.state.minimum ?
						"" :
						<div>
							<div className="wiretransferDetailsWrap">
								<ul className="wiretransferDetails">
									<li>
										<p className="title">Transfer Details:</p>
										<p>Send ${this.state.amount} to</p>
										<br />
										<p style={{"fontSize":"30px","fontWeight":"800"}}>$FNB</p>
										<br />
										<p>on the <a target="_blank" href="https://cash.me/">cash app</a></p>
									</li>
									<li>
										<p className="title">Your Reference #</p>  
										<p className="warningMessage">* Must include ref # or risk losing your deposit</p>
										<p className="referenceNumber">{this.state.referenceNumber}</p>
									</li>
								</ul>
							</div>
						</div>
					}
					<div className="amountWrapperDetails">
						<div className="amountSendwrapper">
							<p className="title">Enter Amount</p>  
							<div className="amountToSend">
								<input value={this.state.amount} onChange={this.handleInputAmount} type="tel" className="amountInput" maxLength="9" placeholder="0.00" />
								<select dir="rtl" className="amountSelect">
									<option>USD</option>
								</select>
								<br style={{"clear":"both"}} />
							</div>
						</div>
						<div className="confirmDeposit">
							{
								this.state.amount == "" || parseFloat(this.state.amount) < this.state.minimum ? 
									<a className="red confirmDepositBttn">$100.00 min</a>
								:
									<a onClick={this.handleDeposit} className="confirmDepositBttn">Confirm Deposit</a>
							}
						</div>
						<br style={{"clear":"both"}} />
					</div>
				</div>
				:
				<div className="depositSuccessScreen">
					<p className="transferSuccess">Success!</p>
					<p className="transferSubtitle">Please allow 72 hours from when the <a target="_blank" href="https://cash.me/">Cash App</a> posts for your deposit to process.</p>
					<p className="wireTransferTitle">Cash App Transfer ID</p>
					<p className="wireTransferConfirm">{this.state.confirmNumber}</p>
				</div>

			: ""
		}
		</div>
		)
	}

}



export class WithdrawalDetails extends React.Component {
	constructor(props){
		super(props);
		this.handleInputAmount = this.handleInputAmount.bind(this);
		this.handleUserTransfer = this.handleUserTransfer.bind(this);
		this.handleUsernameFind = this.handleUsernameFind.bind(this);
		this.state = {
			"amount":"",
			"minimum":1,
			"username":"",
			"emails":[],
			"userFound":false,
			"areyousureSign":false,
			"userObjectId":"",
			"userIds":[],
			"userSendComplete":false,
			"verifiedUser":false,
			"userSendLock":false
		}
	}	
	componentDidMount(){
		var r = this
		var Users = Parse.Object.extend("_User");
		var query = new Parse.Query(Users);
		query.get(Parse.User.current().id, {
		success: function(results) {
			r.setState({"verifiedUser":results.get('accountVerified')})
		}, error:function(err){
			console.log(err)
		}});

		var Config = Parse.Object.extend("config");
		var ConfigQ = new Parse.Query(Config);
		ConfigQ.get('k7t0S4tWWZ', {
		success: function(results) {
			r.setState({"userSendLock":results.get('userSendLock')})
		}, error:function(err){
			console.log(err)
		}});


	}
	handleInputAmount(e) {
		var value = parseFloat(e.target.value);
		var maxAmount = parseFloat(this.props.totalLareBalance);
		if (e.target.value != "") {
			if (parseFloat(e.target.value) <= maxAmount) {
				this.setState({"amount":e.target.value});
			}
		} else {
			this.setState({"amount":e.target.value});
		}
	}
	handleUsernameFind(e){
		var user = e.target.value;
		this.setState({"username":e.target.value});
		var errorColor = "rgba(255,0,0,0.05)";
		var successColor = "rgba(40,205,106,0.05)";
		var r = this;
		if (user.toLowerCase().indexOf( "@" ) > -1 ) {
			var User = Parse.Object.extend("_User");
			var query = new Parse.Query(User);
			query.equalTo("username", user.toLowerCase());
			query.first({
			  success: function(object) {
			  	if (object != undefined) {
					$(r.refs.emailFieldRef).css('backgroundColor',successColor);
					r.setState({"userFound":true,"userObjectId":object.id});
					$(r.refs.userNotFoundToggle).html('1 LARE Minimum')
					$(r.refs.userNotFoundToggle1).html('1 LARE Minimum')
			  	} else {
					$(r.refs.emailFieldRef).css('backgroundColor',errorColor)
					r.setState({"userFound":false,"userObjectId":""});
					$(r.refs.userNotFoundToggle).html('User not Found')
					$(r.refs.userNotFoundToggle1).html('User not Found');
			  	}
			  },
			  error: function(error) {
			   console.log(error)
			  }
			});

	} else {

		$(r.refs.emailFieldRef).css('backgroundColor',"white")
		r.setState({"userFound":false,"userObjectId":""});

	}



		





		
	}
	handleUserTransfer(){
		var r = this;
		Parse.Cloud.run('sendToUser', {
			"sendFrom":Parse.User.current().id,
			"sendTo":r.state.userObjectId,
			"userSendTo":r.state.username,
			"amount":r.state.amount,
			"userEmail":Parse.User.current().get('username'),
			"fname":Parse.User.current().get('fname'),
		}, {
		success: function(results) {
			r.setState({"areyousureSign":false,"userSendComplete":true});
		}, error:function(err) {
			if (err.code == 209) {
				Parse.User.logOut().then(() => {
				 	window.location.href = startUrl + "login";
				});
			} else {
				console.log(err)
			}
		}});
	}
	render() {
		return (
			<div className="WithdrawalDetailsWrapper">
				{
					this.state.verifiedUser == false ?
						<div className="cBody">
							<div className="verifyYourAccountAlert">
								<p className="title">Account Verification Required</p>
								<p className="subtitle">To send money to another user, you must verify your account.</p>
								<Link className="buyNowBttn verifyAccount" to="/settings/profile">Verify Account</Link>
							</div>
							<br style={{"clear":"both"}} />
						</div>
					: this.state.userSendLock == true ?
						<div className="cBody">
							<br />
							<div className="verifyYourAccountAlert">
								<p className="title">Temporarly Unavailable</p>
								<p className="subtitle">We are currently working on releasing an update, this feature is temporarily unavailable.</p>
							</div>
							<br style={{"clear":"both"}} />
						</div>	
					:				
					<div>
				<div className="porfolioTable">
					<ul>
						<li>
							<div className="logoP usd" style={{"background-color":"rgb(77, 138, 255)","color":"white"}}><i class="fa fa-usd"></i></div>
							<div className="porfolioDetails">
								<span>{this.props.sendtype}</span>
								<span>Available Balance:{this.props.totalLareBalance}</span>
							</div>
						</li>
					</ul>
				</div>			
				<div className="amountWrapperDetails">
					<div className="amountSendwrapper" style={{"width":"100%","paddingTop":"0"}}>
						<div className="amountToSend">
							<input value={this.state.amount} onChange={this.handleInputAmount} type="tel" className="amountInput"  max={this.props.totalLareBalance} maxLength="9" placeholder="0.00" />
							<span className="amountSelect" style={{"paddingTop":"18px","cursor":"pointer"}} onClick={(e) => this.setState({"amount":this.props.totalLareBalance})}>Max</span>
							<br style={{"clear":"both"}} />
						</div>
					</div>
				</div>
				<div className="amountWrapperDetails">
					<div className="amountSendwrapper" style={{"paddingTop":"0","width":"70%"}}>
						<div className="amountToSend" style={{"paddingRight":"0px","paddingTop":"0"}}>
							<input ref="emailFieldRef" value={this.state.username} style={{"border":"1px solid rgba(0,0,0,0.09)","width":"100%"}} onChange={this.handleUsernameFind} type="text" className="amountInput" placeholder="Email Address" />
							<br style={{"clear":"both"}} />
							<br />
							<p className="emailWarning">To send FNB, please make sure your Receiver has an active account and their email address is typed in correctly</p>
						</div>
					</div>
					<div className="confirmDeposit">
						{
							this.state.amount != "" && this.state.userFound == true  ?
								parseFloat(this.state.amount) < this.state.minimum ?
									<a style={{"marginTop":"7px","marginRight":"30px"}} ref="userNotFoundToggle1" className="red confirmDepositBttn">1 FNB minimum</a>
								:
									<a style={{"marginTop":"7px","marginRight":"30px"}} onClick={(e) => this.setState({"areyousureSign":true})} className="confirmDepositBttn">Confirm Transfer</a>
							:
							<a style={{"marginTop":"7px","marginRight":"30px"}} ref="userNotFoundToggle" className="red confirmDepositBttn">1 FNB minimum</a>
						}
					</div>
					<br style={{"clear":"both"}} />
				</div>
				{
					this.state.areyousureSign == true ?
					<div>
						<div onClick={(e) => this.setState({"areyousureSign":!this.state.areyousureSign})} className="loadingScreen"></div>
						<div className="usdPopupmethodsWrap">
							<div onClick={(e) => this.setState({"areyousureSign":!this.state.areyousureSign})} className="closeButton"><i className="fa fa-close"></i></div>
							<div className="verifyYourAccountAlert" style={{"paddingBottom":"0"}}>
								<p className="title">Are you sure?</p>
								<p className="subtitle">Are you sure you want to send FNB in the amount of <b>{this.state.amount}</b> to <b>{this.state.username}</b>.</p>
								<a className="buyNowBttn cancelAreyousure" style={{"backgroundColor":"#f3f3f3","color":"black","marginRight":"10px"}}>Cancel</a>
								<a className="buyNowBttn verifyAccount" onClick={this.handleUserTransfer}>Confirm</a>
							</div>
						</div>
					</div>
					: 
					""
				}
				{
					this.state.userSendComplete == true ?
					<div>
						<div onClick={(e) => this.setState({"userSendComplete":!this.state.userSendComplete})} className="loadingScreen"></div>
						<div className="usdPopupmethodsWrap">
							<div onClick={(e) => this.setState({"userSendComplete":!this.state.userSendComplete})} className="closeButton"><i className="fa fa-close"></i></div>
							<div className="verifyYourAccountAlert" style={{"paddingBottom":"0"}}>
								<p className="title" style={{"color":"#28cd6a"}}>Final Confirmation</p>
								<p className="subtitle">We sent you an email. Please finalize the transaction by clicking the link in that email.</p>
								<a className="buyNowBttn verifyAccount" style={{"backgroundColor":"#28cd6a"}} onClick={(e) => this.setState({"userSendComplete":!this.state.userSendComplete})}>Done</a>
							</div>
						</div>
					</div>
					: 
					""
				}

				</div>
				}


			</div>
		)
	}
}



