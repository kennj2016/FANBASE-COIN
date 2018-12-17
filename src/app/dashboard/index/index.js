import React from "react"
import {MainHeader,Footer} from "../header";
import {TokenSummary,OpenTransactionsTable,PortfolioSummary,PortfolioTable,AllTransactionsTable,comma} from "../widgets";
import {DepositDetails,WithdrawalDetails} from "../wallet/wallets.js";
import {DepositDetails2,WithdrawalDetails2} from "../wallet2/wallets2.js";
import {DepositDetails3,WithdrawalDetails3} from "../wallet3/wallets3.js";
import {ExchangeLeftSide,ExchangeDetails} from "../exchange/exchange";
import {Exchange2LeftSide,Exchange2Details} from "../exchange2/exchange2";
import './index.css';
import '../widgets.css';
import Parse from 'parse';
import $ from "jquery";
import QRCode from "qrcode.react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  RedditShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  EmailShareButton,
} from 'react-share';
import noReferrals from "../../../images/noReferrals.png";
import {startUrl} from "../../../index.js";
import backButton from "../../../images/backButton.png";
import {Link} from 'react-router-dom';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-115007597-1');


export class Index extends React.Component {
	componentDidMount() {
		window.scrollTo(0, 0)
		document.title = "All Coins – FNB";
		ReactGA.pageview(window.location.pathname + window.location.search);

	}
	render() {
		return (
			<div>
				<div className="page indexPageWrap">
					<MainHeader />
					<div className="dashWrapperB">
						<div className="dashModal indexPagePortofilo" style={{"width":"40%"}}>
							<div className="content" style={{"height":"700px"}}>
								<div className="cHeader">
									<p className="title">Portfolio Summary</p>
								</div>
								<div className="cBody">
									<PortfolioSummary type="v" />
								</div>
							</div>
						</div>
						<div className="dashModal TokenSummaryPorfolio" style={{"width":"60%"}}>
							<div className="content" style={{"height":"331px"}}>
								<div className="cHeader">
									<p className="title">Token Summary</p>
								</div>
								<div className="cBody">
									<TokenSummary />
								</div>
							</div>
							<div className="content" style={{"height":"auto","marginTop":"20px"}}>
								<div className="cHeader">
									<p className="title">Open Orders</p>
								</div>
								<div className="cBody">
									<OpenTransactionsTable />
								</div>
							</div>
						</div>
						<br style={{"clear":"both"}} />
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}

export class Wallets extends React.Component {
	constructor(props){
		super(props);	
		this.handleChangeOpen = this.handleChangeOpen.bind(this);
		this.handleBoxChange = this.handleBoxChange.bind(this);
		this.state = {
			"openActive":true,
			"walletsChangeSummary":false,
			"typeChange":"deposit",
			"view2Summary":false,
			"depositType":"none",
			"verifiedUser":false,
			"sendCoinSelected":"",
			"totalLareBalance":""
		}
	}

	componentDidMount() {
	ReactGA.pageview(window.location.pathname + window.location.search);
	
		$('.mobileVersionShow span').click(function(){
			window.scrollTo(0, 0);
		});
		window.scrollTo(0, 0)
		document.title = "Wallets – FNB";
		var r = this;
		var Users = Parse.Object.extend("_User");
		var query = new Parse.Query(Users);
		query.get(Parse.User.current().id, {
		success: function(results) {
			r.setState({"verifiedUser":results.get('accountVerified')})
			
		}, error:function(err){
			alert(err)
		}});
	}
	runReferralLinks = (e) => {
		//169610329.39444453
		Parse.Cloud.run('runReferralCode', {
			"limit":1000
		}, {
		success: function(results) {
			alert('a')
		}, error:function(err){
			console.log(err)
		}});
	}

	handleChangeOpen(){
		this.setState({"openActive": !this.state.openActive});
	}
	handleBoxChange(e){
		this.setState({
			"walletsChangeSummary": true,
			"typeChange":e.target.attributes.type.value,
			"sendCoinSelected":e.target.attributes.coinsend.value,
			"totalLareBalance":e.target.attributes.totalLareBalance.value
		});
	}
	handleCancelWalletsChange(e) {
		this.setState({
			"walletsChangeSummary": false
		});		
	}
	render() {
		return (
			<div>
				<div className="page">
					<MainHeader />
					<div className="dashWrapperB ">
						<div className="dashModal PortfolioPageWrap mobileVerisonHide" style={{"width":"40%"}}>
							<div className="content " style={{"height":"auto"}}>
								<div className="cHeader">
									<p className="title">My Tokens</p>
								</div>
								<div className="cBody">
									<PortfolioTable handleBoxChange={this.handleBoxChange} />
								</div>
							</div>
						</div>
						{
							this.state.walletsChangeSummary == false ?
							<div className="dashModal PortfolioSummaryWrap" style={{"width":"60%"}}>
							{
								this.state.view2Summary == false ?
								<div className="content" style={{"height":"400px"}}>
									<div className="cHeader">
										<p className="title">Portfolio Summary <a onClick={(e) => this.setState({"view2Summary":!this.state.view2Summary})} className="pull-right viewallA">Token Summary</a></p>
									</div>
									<div className="cBody">
										<PortfolioSummary type="h" />
										<br style={{"clear":"both"}} />
									</div>
								</div>
								:
								<div className="content" style={{"height":"331px"}}>
									<div className="cHeader">
										<p className="title">Token Summary <a onClick={(e) => this.setState({"view2Summary":!this.state.view2Summary})} className="pull-right viewallA">Porfgfsgtfolio Summaryyyy</a></p>
									</div>
									<div className="cBody">
										<TokenSummary />
									</div>
								</div>
							}
							</div>
							: 
								this.state.typeChange == "deposit" ?
								<div className="dashModal PortfolioSummaryWrap" style={{"width":"60%"}}>
									{
											this.state.depositType == "none" ?
												this.state.verifiedUser == true ?
													<div className="content" style={{"height":"auto"}}>
														<div className="cHeader">
															<p className="title">Deposit Options <a onClick={(e) => this.setState({"walletsChangeSummary":!this.state.walletsChangeSummary})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
														</div>
														<div className="cBody">
															<div className="bttnContainerTransfer">
																<a className="buyNowBttn wireTransferBttn" onClick={(e) => this.setState({"typeChange":"deposit","depositType":"wire"})}>Deposit via Wire Transfer</a>&emsp;
																<a className="buyNowBttn electronicCheckBttn" onClick={(e) => this.setState({"typeChange":"deposit","depositType":"electronic"})} >Deposit via Electronic Check</a>&emsp;
																<a className="buyNowBttn debitCreditBttn" onClick={(e) => this.setState({"typeChange":"deposit","depositType":"card"})}>Deposit via Debit/Credit Card</a>
															</div>
															<br style={{"clear":"both"}} />
														</div>
													</div>
													:
													<div className="content" style={{"height":"auto"}}>
														<div className="cHeader">
															<p className="title">Deposit Options <a onClick={(e) => this.setState({"walletsChangeSummary":!this.state.walletsChangeSummary})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
														</div>
														<div className="cBody">
															<div className="verifyYourAccountAlert">
																<p className="title">Account Verification Required</p>
																<p className="subtitle">To deposit money using wire transfer, electronic check or a debit/credit card, you must verify your account.</p>
																<Link className="buyNowBttn verifyAccount" to="/settings/profile">Verify Account</Link>
															</div>
															<br style={{"clear":"both"}} />
														</div>
													</div>
											: ""
									}
									{
									    this.state.depositType == "wire" ?
											<div className="content" style={{"height":"auto"}}>
												<div className="cHeader">
													<p className="title">Deposit by Wire Transfer <a onClick={(e) => this.setState({"typeChange":"deposit","depositType":"none"})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
												</div>
												<div className="cBody">
													<DepositDetails />	
													<br style={{"clear":"both"}} />
												</div>
											</div>
										: ""
									}
									{
										this.state.depositType == "electronic" ?
											<div className="content" style={{"height":"auto"}}>
												<div className="cHeader">
													<p className="title">Deposit by Check <a onClick={(e) => this.setState({"typeChange":"deposit","depositType":"none"})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
												</div>
												<div className="cBody">
													<DepositDetails />
													<br style={{"clear":"both"}} />
												</div>
											</div>
										: ""
									}
									{
										this.state.depositType == "card" ?
											<div className="content" style={{"height":"auto"}}>
												<div className="cHeader">
													<p className="title">Deposit by Credit/Debit Card <a onClick={(e) => this.setState({"typeChange":"deposit","depositType":"none"})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
												</div>
												<div className="cBody">
													<DepositDetails />
													<br style={{"clear":"both"}} />
												</div>
											</div>
										:
										""
									}
								</div>
								:
								<div className="dashModal PortfolioSummaryWrap" style={{"width":"60%"}}>
									<div className="content" style={{"height":"auto"}}>
										<div className="cHeader">
											<p className="title">Send {this.state.sendCoinSelected}<a onClick={(e) => this.setState({"walletsChangeSummary":!this.state.walletsChangeSummary})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
										</div>
										<div className="cBody">
											<WithdrawalDetails sendtype={this.state.sendCoinSelected} totalLareBalance={this.state.totalLareBalance} />
											<br style={{"clear":"both"}} />
										</div>
									</div>
								</div>
						}
						<div className="dashModal PortfolioPageWrap mobileVersionShow" style={{"width":"40%"}}>
							<div className="content " style={{"height":"auto"}}>
								<div className="cHeader">
									<p className="title">My Wallets</p>
								</div>
								<div className="cBody">
									<PortfolioTable handleBoxChange={this.handleBoxChange} />
								</div>
							</div>
						</div>
						<div className="dashModal historySummaryWRap" style={{"width":"60%"}}>
							<div className="content" style={{"max-height":"460px"}}>
								<div className="cHeader">
								{
									this.state.openActive == false ?
									<p className="title">Trade History <a onClick={this.handleChangeOpen} className="pull-right viewallA" >Open Orders</a> </p>
									: 
									<p className="title">Open Orders <a onClick={this.handleChangeOpen} className="pull-right viewallA" >Trade History</a> </p>
								}
								</div>
								<div className="cBody" style={{"max-height":"430px","overflow":"scroll"}}>
									{
										this.state.openActive == true ?
										<OpenTransactionsTable />
										:
										<AllTransactionsTable type="All" />
									}
								</div>
							</div>
						</div>
						<br style={{"clear":"both"}} />
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}

{/* Tonys Wallets2 Start */}
export class Wallets2 extends React.Component {
	constructor(props){
		super(props);	
		this.handleChangeOpen = this.handleChangeOpen.bind(this);
		this.handleBoxChange = this.handleBoxChange.bind(this);
		this.state = {
			"openActive":true,
			"walletsChangeSummary":false,
			"typeChange":"deposit",
			"view2Summary":false,
			"depositType":"none",
			"verifiedUser":false,
			"sendCoinSelected":"",
			"totalLareBalance":""
		}
	}

	componentDidMount() {
	ReactGA.pageview(window.location.pathname + window.location.search);
	
		$('.mobileVersionShow span').click(function(){
			window.scrollTo(0, 0);
		});
		window.scrollTo(0, 0)
		document.title = "Wallets – FNB";
		var r = this;
		var Users = Parse.Object.extend("_User");
		var query = new Parse.Query(Users);
		query.get(Parse.User.current().id, {
		success: function(results) {
			r.setState({"verifiedUser":results.get('accountVerified')})
			
		}, error:function(err){
			alert(err)
		}});
	}
	runReferralLinks = (e) => {
		//169610329.39444453
		Parse.Cloud.run('runReferralCode', {
			"limit":1000
		}, {
		success: function(results) {
			alert('a')
		}, error:function(err){
			console.log(err)
		}});
	}

	handleChangeOpen(){
		this.setState({"openActive": !this.state.openActive});
	}
	handleBoxChange(e){
		this.setState({
			"walletsChangeSummary": true,
			"typeChange":e.target.attributes.type.value,
			"sendCoinSelected":e.target.attributes.coinsend.value,
			"totalLareBalance":e.target.attributes.totalLareBalance.value
		});
	}
	handleCancelWalletsChange(e) {
		this.setState({
			"walletsChangeSummary": false
		});		
	}
	render() {
		return (
			<div>
				<div className="page">
					<MainHeader />
					<div className="dashWrapperB ">
						<div className="dashModal PortfolioPageWrap mobileVerisonHide" style={{"width":"40%"}}>
							<div className="content " style={{"height":"auto"}}>
								<div className="cHeader">
									<p className="title">My Tickets</p>
								</div>
								<div className="cBody">
									<PortfolioTable handleBoxChange={this.handleBoxChange} />
								</div>
							</div>
						</div>
						{
							this.state.walletsChangeSummary == false ?
							<div className="dashModal PortfolioSummaryWrap" style={{"width":"60%"}}>
							{
								this.state.view2Summary == false ?
								<div className="content" style={{"height":"400px"}}>
									<div className="cHeader">
										<p className="title">Portfolio Summary <a onClick={(e) => this.setState({"view2Summary":!this.state.view2Summary})} className="pull-right viewallA">Token Summary</a></p>
									</div>
									<div className="cBody">
										<PortfolioSummary type="h" />
										<br style={{"clear":"both"}} />
									</div>
								</div>
								:
								<div className="content" style={{"height":"331px"}}>
									<div className="cHeader">
										<p className="title">Token Summary <a onClick={(e) => this.setState({"view2Summary":!this.state.view2Summary})} className="pull-right viewallA">Porfgfsgtfolio Summaryyyy</a></p>
									</div>
									<div className="cBody">
										<TokenSummary />
									</div>
								</div>
							}
							</div>
							: 
								this.state.typeChange == "deposit" ?
								<div className="dashModal PortfolioSummaryWrap" style={{"width":"60%"}}>
									{
											this.state.depositType == "none" ?
												this.state.verifiedUser == true ?
													<div className="content" style={{"height":"auto"}}>
														<div className="cHeader">
															<p className="title">Deposit Options <a onClick={(e) => this.setState({"walletsChangeSummary":!this.state.walletsChangeSummary})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
														</div>
														<div className="cBody">
															<div className="bttnContainerTransfer">
																<a className="buyNowBttn wireTransferBttn" onClick={(e) => this.setState({"typeChange":"deposit","depositType":"wire"})}>Deposit via Wire Transfer</a>&emsp;
																<a className="buyNowBttn electronicCheckBttn" onClick={(e) => this.setState({"typeChange":"deposit","depositType":"electronic"})} >Deposit via Electronic Check</a>&emsp;
																<a className="buyNowBttn debitCreditBttn" onClick={(e) => this.setState({"typeChange":"deposit","depositType":"card"})}>Deposit via Debit/Credit Card</a>
															</div>
															<br style={{"clear":"both"}} />
														</div>
													</div>
													:
													<div className="content" style={{"height":"auto"}}>
														<div className="cHeader">
															<p className="title">Deposit Options <a onClick={(e) => this.setState({"walletsChangeSummary":!this.state.walletsChangeSummary})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
														</div>
														<div className="cBody">
															<div className="verifyYourAccountAlert">
																<p className="title">Account Verification Required</p>
																<p className="subtitle">To deposit money using wire transfer, electronic check or a debit/credit card, you must verify your account.</p>
																<Link className="buyNowBttn verifyAccount" to="/settings/profile">Verify Account</Link>
															</div>
															<br style={{"clear":"both"}} />
														</div>
													</div>
											: ""
									}
									{
									    this.state.depositType == "wire" ?
											<div className="content" style={{"height":"auto"}}>
												<div className="cHeader">
													<p className="title">Deposit by Wire Transfer <a onClick={(e) => this.setState({"typeChange":"deposit","depositType":"none"})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
												</div>
												<div className="cBody">
													<DepositDetails />	
													<br style={{"clear":"both"}} />
												</div>
											</div>
										: ""
									}
									{
										this.state.depositType == "electronic" ?
											<div className="content" style={{"height":"auto"}}>
												<div className="cHeader">
													<p className="title">Deposit by Check <a onClick={(e) => this.setState({"typeChange":"deposit","depositType":"none"})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
												</div>
												<div className="cBody">
													<DepositDetails />
													<br style={{"clear":"both"}} />
												</div>
											</div>
										: ""
									}
									{
										this.state.depositType == "card" ?
											<div className="content" style={{"height":"auto"}}>
												<div className="cHeader">
													<p className="title">Deposit by Credit/Debit Card <a onClick={(e) => this.setState({"typeChange":"deposit","depositType":"none"})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
												</div>
												<div className="cBody">
													<DepositDetails />
													<br style={{"clear":"both"}} />
												</div>
											</div>
										:
										""
									}
								</div>
								:
								<div className="dashModal PortfolioSummaryWrap" style={{"width":"60%"}}>
									<div className="content" style={{"height":"auto"}}>
										<div className="cHeader">
											<p className="title">Send {this.state.sendCoinSelected}<a onClick={(e) => this.setState({"walletsChangeSummary":!this.state.walletsChangeSummary})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
										</div>
										<div className="cBody">
											<WithdrawalDetails sendtype={this.state.sendCoinSelected} totalLareBalance={this.state.totalLareBalance} />
											<br style={{"clear":"both"}} />
										</div>
									</div>
								</div>
						}
						<div className="dashModal PortfolioPageWrap mobileVersionShow" style={{"width":"40%"}}>
							<div className="content " style={{"height":"auto"}}>
								<div className="cHeader">
									<p className="title">My Wallets</p>
								</div>
								<div className="cBody">
									<PortfolioTable handleBoxChange={this.handleBoxChange} />
								</div>
							</div>
						</div>
						<div className="dashModal historySummaryWRap" style={{"width":"60%"}}>
							<div className="content" style={{"max-height":"460px"}}>
								<div className="cHeader">
								{
									this.state.openActive == false ?
									<p className="title">Trade History <a onClick={this.handleChangeOpen} className="pull-right viewallA" >Open Orders</a> </p>
									: 
									<p className="title">Open Orders <a onClick={this.handleChangeOpen} className="pull-right viewallA" >Trade History</a> </p>
								}
								</div>
								<div className="cBody" style={{"max-height":"430px","overflow":"scroll"}}>
									{
										this.state.openActive == true ?
										<OpenTransactionsTable />
										:
										<AllTransactionsTable type="All" />
									}
								</div>
							</div>
						</div>
						<br style={{"clear":"both"}} />
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}

{/* Tonys Wallets2 End */}

{/* Tonys Wallets3 Start */}
export class Wallets3 extends React.Component {
	constructor(props){
		super(props);	
		this.handleChangeOpen = this.handleChangeOpen.bind(this);
		this.handleBoxChange = this.handleBoxChange.bind(this);
		this.state = {
			"openActive":true,
			"walletsChangeSummary":false,
			"typeChange":"deposit",
			"view2Summary":false,
			"depositType":"none",
			"verifiedUser":false,
			"sendCoinSelected":"",
			"totalLareBalance":""
		}
	}

	componentDidMount() {
	ReactGA.pageview(window.location.pathname + window.location.search);
	
		$('.mobileVersionShow span').click(function(){
			window.scrollTo(0, 0);
		});
		window.scrollTo(0, 0)
		document.title = "Wallets – FNB";
		var r = this;
		var Users = Parse.Object.extend("_User");
		var query = new Parse.Query(Users);
		query.get(Parse.User.current().id, {
		success: function(results) {
			r.setState({"verifiedUser":results.get('accountVerified')})
			
		}, error:function(err){
			alert(err)
		}});
	}
	runReferralLinks = (e) => {
		//169610329.39444453
		Parse.Cloud.run('runReferralCode', {
			"limit":1000
		}, {
		success: function(results) {
			alert('a')
		}, error:function(err){
			console.log(err)
		}});
	}

	handleChangeOpen(){
		this.setState({"openActive": !this.state.openActive});
	}
	handleBoxChange(e){
		this.setState({
			"walletsChangeSummary": true,
			"typeChange":e.target.attributes.type.value,
			"sendCoinSelected":e.target.attributes.coinsend.value,
			"totalLareBalance":e.target.attributes.totalLareBalance.value
		});
	}
	handleCancelWalletsChange(e) {
		this.setState({
			"walletsChangeSummary": false
		});		
	}
	render() {
		return (
			<div>
				<div className="page">
					<MainHeader />
					<div className="dashWrapperB ">
						<div className="dashModal PortfolioPageWrap mobileVerisonHide" style={{"width":"40%"}}>
							<div className="content " style={{"height":"auto"}}>
								<div className="cHeader">
									<p className="title">My Collectibles</p>
								</div>
								<div className="cBody">
									<PortfolioTable handleBoxChange={this.handleBoxChange} />
								</div>
							</div>
						</div>
						{
							this.state.walletsChangeSummary == false ?
							<div className="dashModal PortfolioSummaryWrap" style={{"width":"60%"}}>
							{
								this.state.view2Summary == false ?
								<div className="content" style={{"height":"400px"}}>
									<div className="cHeader">
										<p className="title">Portfolio Summary <a onClick={(e) => this.setState({"view2Summary":!this.state.view2Summary})} className="pull-right viewallA">Token Summary</a></p>
									</div>
									<div className="cBody">
										<PortfolioSummary type="h" />
										<br style={{"clear":"both"}} />
									</div>
								</div>
								:
								<div className="content" style={{"height":"331px"}}>
									<div className="cHeader">
										<p className="title">Token Summary <a onClick={(e) => this.setState({"view2Summary":!this.state.view2Summary})} className="pull-right viewallA">Porfgfsgtfolio Summaryyyy</a></p>
									</div>
									<div className="cBody">
										<TokenSummary />
									</div>
								</div>
							}
							</div>
							: 
								this.state.typeChange == "deposit" ?
								<div className="dashModal PortfolioSummaryWrap" style={{"width":"60%"}}>
									{
											this.state.depositType == "none" ?
												this.state.verifiedUser == true ?
													<div className="content" style={{"height":"auto"}}>
														<div className="cHeader">
															<p className="title">Deposit Options <a onClick={(e) => this.setState({"walletsChangeSummary":!this.state.walletsChangeSummary})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
														</div>
														<div className="cBody">
															<div className="bttnContainerTransfer">
																<a className="buyNowBttn wireTransferBttn" onClick={(e) => this.setState({"typeChange":"deposit","depositType":"wire"})}>Deposit via Wire Transfer</a>&emsp;
																<a className="buyNowBttn electronicCheckBttn" onClick={(e) => this.setState({"typeChange":"deposit","depositType":"electronic"})} >Deposit via Electronic Check</a>&emsp;
																<a className="buyNowBttn debitCreditBttn" onClick={(e) => this.setState({"typeChange":"deposit","depositType":"card"})}>Deposit via Debit/Credit Card</a>
															</div>
															<br style={{"clear":"both"}} />
														</div>
													</div>
													:
													<div className="content" style={{"height":"auto"}}>
														<div className="cHeader">
															<p className="title">Deposit Options <a onClick={(e) => this.setState({"walletsChangeSummary":!this.state.walletsChangeSummary})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
														</div>
														<div className="cBody">
															<div className="verifyYourAccountAlert">
																<p className="title">Account Verification Required</p>
																<p className="subtitle">To deposit money using wire transfer, electronic check or a debit/credit card, you must verify your account.</p>
																<Link className="buyNowBttn verifyAccount" to="/settings/profile">Verify Account</Link>
															</div>
															<br style={{"clear":"both"}} />
														</div>
													</div>
											: ""
									}
									{
									    this.state.depositType == "wire" ?
											<div className="content" style={{"height":"auto"}}>
												<div className="cHeader">
													<p className="title">Deposit by Wire Transfer <a onClick={(e) => this.setState({"typeChange":"deposit","depositType":"none"})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
												</div>
												<div className="cBody">
													<DepositDetails />	
													<br style={{"clear":"both"}} />
												</div>
											</div>
										: ""
									}
									{
										this.state.depositType == "electronic" ?
											<div className="content" style={{"height":"auto"}}>
												<div className="cHeader">
													<p className="title">Deposit by Check <a onClick={(e) => this.setState({"typeChange":"deposit","depositType":"none"})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
												</div>
												<div className="cBody">
													<DepositDetails />
													<br style={{"clear":"both"}} />
												</div>
											</div>
										: ""
									}
									{
										this.state.depositType == "card" ?
											<div className="content" style={{"height":"auto"}}>
												<div className="cHeader">
													<p className="title">Deposit by Credit/Debit Card <a onClick={(e) => this.setState({"typeChange":"deposit","depositType":"none"})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
												</div>
												<div className="cBody">
													<DepositDetails />
													<br style={{"clear":"both"}} />
												</div>
											</div>
										:
										""
									}
								</div>
								:
								<div className="dashModal PortfolioSummaryWrap" style={{"width":"60%"}}>
									<div className="content" style={{"height":"auto"}}>
										<div className="cHeader">
											<p className="title">Send {this.state.sendCoinSelected}<a onClick={(e) => this.setState({"walletsChangeSummary":!this.state.walletsChangeSummary})} className="pull-right" style={{"cursor":"pointer"}}><i className="fa fa-close"></i></a></p>
										</div>
										<div className="cBody">
											<WithdrawalDetails sendtype={this.state.sendCoinSelected} totalLareBalance={this.state.totalLareBalance} />
											<br style={{"clear":"both"}} />
										</div>
									</div>
								</div>
						}
						<div className="dashModal PortfolioPageWrap mobileVersionShow" style={{"width":"40%"}}>
							<div className="content " style={{"height":"auto"}}>
								<div className="cHeader">
									<p className="title">My Wallets</p>
								</div>
								<div className="cBody">
									<PortfolioTable handleBoxChange={this.handleBoxChange} />
								</div>
							</div>
						</div>
						<div className="dashModal historySummaryWRap" style={{"width":"60%"}}>
							<div className="content" style={{"max-height":"460px"}}>
								<div className="cHeader">
								{
									this.state.openActive == false ?
									<p className="title">Trade History <a onClick={this.handleChangeOpen} className="pull-right viewallA" >Open Orders</a> </p>
									: 
									<p className="title">Open Orders <a onClick={this.handleChangeOpen} className="pull-right viewallA" >Trade History</a> </p>
								}
								</div>
								<div className="cBody" style={{"max-height":"430px","overflow":"scroll"}}>
									{
										this.state.openActive == true ?
										<OpenTransactionsTable />
										:
										<AllTransactionsTable type="All" />
									}
								</div>
							</div>
						</div>
						<br style={{"clear":"both"}} />
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}

{/* Tonys Wallets3 End */}


export class Exchange extends React.Component {
	constructor(props){
		super(props);
		this.handleInputAmount = this.handleInputAmount.bind(this);
		this.handPaymentSelection = this.handPaymentSelection.bind(this);
		this.handleCreateTransaction = this.handleCreateTransaction.bind(this);
		this.setTotalLare = this.setTotalLare.bind(this);
		this.state = {
			"pCurrency":"BTC",
			"verifiedUser":false,
			"fullCurrency":"Bitcoin",
			"amount":"",
			"exchangeRate":"0.56085",
			"bonusRate":"100",
			"feeRate":"2",
			"USDFeeRate":"0",
			"minimum":50.00,
			"btcinDollar":"",
			"rates": null,
			"totalLare":"",
			"completeTrans":false,
			"usdPopup":false,
			"usdPopupPlace":0,
			"finalResults":null,
			"loadingScreen":false,
			"bonusExchangeRate":"0.28425",
			"coinBuyUSA":false
		}
	}
	componentDidMount(){
		ReactGA.pageview(window.location.pathname + window.location.search);

		var r = this;
		$.getJSON('https://blockchain.info/tobtc?currency=USD&value=1', function(data) {
		  	r.setState({"btcinDollar":data});
		});
		Parse.Cloud.run('getRates', {}, {
		success: function(results) {
			var array = $.map(results, function(value, index) {
			    return [index+ ":" +value["rate_btc"]];
			});
			r.setState({"rates":array});
		},error:function(err){
			alert(err)
		}});

		window.scrollTo(0, 0)
		document.title = "Buy Coins – FNB";
		var Users = Parse.Object.extend("_User");
		var query = new Parse.Query(Users);
		query.get(Parse.User.current().id, {
		success: function(results) {
			r.setState({"verifiedUser":results.get('accountVerified'),"accreditedStatus":results.get('accreditedStatus')})
		}, error:function(err){
			alert(err)
		}});		
	}
	handPaymentSelection(e){
		var value = e.target.attributes.id.value.split(':');
		this.setState({"pCurrency":value[0],"fullCurrency":value[1]});
	}
	handleInputAmount(e){
		this.setState({"amount":e.target.value.replace(/\D/g,'')});
	}
	setTotalLare(e){
		this.setState({"totalLare":e.target.value});
	}
	handleCreateTransaction() {
		var r = this;
		r.setState({"loadingScreen":true});
		var Config = Parse.Object.extend("config");
		var ConfigQ = new Parse.Query(Config);
		ConfigQ.get('k7t0S4tWWZ', {
		success: function(CQResults) {
			var coinBuyUSA = CQResults.get('coinBuyUSA');
			if (coinBuyUSA == true) {
				if (r.state.verifiedUser == true && r.state.accreditedStatus == "Complete") {

					if (r.state.pCurrency != "USD") {
						if (r.state.amount < r.state.minimum) {} else {
							r.setState({"totalLare":$('#totalLareAMount').html().split(' ')[0],"loadingScreen":true});
							var userPointer = {
							  "__type": 'Pointer',
							  "className": '_User',
							  "objectId":  Parse.User.current().id
							}
							Parse.Cloud.run('createTransaction', {
								"user":userPointer,
								"email": Parse.User.current().get('username'),
								"bonusPercent":r.state.bonusRate,
								"totalLare":$('#totalLareAMount').html().split(' ')[0],
								"feePercent":r.state.feeRate,
								"c1":"USD",
								"c2":r.state.pCurrency,
								"amount":r.state.amount
							}, {
							success: function(results) {
								r.setState({"finalResults":results,"completeTrans":true,"loadingScreen":false});
							},error:function(err){
									r.setState({"loadingScreen":false});
								alert(err)
							}});
						}
					} else {
						if (r.state.amount < r.state.minimum) {} else {
							r.setState({"totalLare":$('#totalLareAMount').html().split(' ')[0]});
							r.setState({"usdPopup":true,"usdPopupPlace":0});
						}
					}
				} else {
					r.setState({"coinBuyUSA":true,"loadingScreen":false})
				}
			} else {

				if (r.state.pCurrency != "USD") {
					if (r.state.amount < r.state.minimum) {} else {
						r.setState({"totalLare":$('#totalLareAMount').html().split(' ')[0],"loadingScreen":true});
						var userPointer = {
						  "__type": 'Pointer',
						  "className": '_User',
						  "objectId":  Parse.User.current().id
						}
						Parse.Cloud.run('createTransaction', {
							"user":userPointer,
							"email": Parse.User.current().get('username'),
							"bonusPercent":r.state.bonusRate,
							"totalLare":$('#totalLareAMount').html().split(' ')[0],
							"feePercent":r.state.feeRate,
							"c1":"USD",
							"c2":r.state.pCurrency,
							"amount":r.state.amount
						}, {
						success: function(results) {
							r.setState({"finalResults":results,"completeTrans":true,"loadingScreen":false});
						},error:function(err){
								r.setState({"loadingScreen":false});
							alert(err)
						}});
					}
				} else {
					if (r.state.amount < r.state.minimum) {} else {
						r.setState({"totalLare":$('#totalLareAMount').html().split(' ')[0]});
						r.setState({"usdPopup":true,"usdPopupPlace":0});
					}
				}
			}
		}, error:function(err){
			console.log(err)
		}});

	}
	render() {
		return (
			<div>
				<div className="page exchangePageWrap">
					<MainHeader />
					{
						this.state.completeTrans == false ?
							<div className="dashWrapperB exchangeWrap">
								<div className="dashModal seperator" style={{"width":"7.5%"}}></div>
								<div className="dashModal ExchangeLeftSide" style={{"width":"50%"}}>
									<div className="content" style={{"height":"auto","width":"100%","float":"right"}}>
										<ExchangeLeftSide minimum={this.state.minimum} pCurrency={this.state.pCurrency} handleCreateTransaction={this.handleCreateTransaction}  amount={this.state.amount} handleInputAmount={this.handleInputAmount} handPaymentSelection={this.handPaymentSelection} />
									</div>
								</div>
								<div className="dashModal exchnageDetails" style={{"width":"35%"}}>
									<div className="content" style={{"height":"auto","width":"100%","margin":"0 ","boxShadow":"inset -1px 0 0 #e0e6ed, inset 1px 0 0 #e0e6ed","border":"0"}}>
										<ExchangeDetails stateInfo={this.state} handleCreateTransaction={this.handleCreateTransaction} setTotalLare={this.setTotalLare} />
									</div>
								</div>
								<div className="dashModal seperator" style={{"width":"7.5%"}}></div>
								<br style={{"clear":"both"}} />
							</div>
					:
						<div className="dashWrapperB exchangeResultsPage" style={{"margin":"0 auto"}}>
							<div className="dashModal seperator" style={{"width":"15%","margin":"0 auto","textAlign":"right"}}><Link to="/exchange/1"><img style={{"width":"20px","cursor":"pointer"}} src={backButton}/></Link></div>	
							<div className="dashModal contentPage" style={{"width":"30%","margin":"0 auto"}}>
								<div className="content" style={{"height":"auto","margin":"0 auto"}}>
									<div className="completeTransactionWrap">
										<p className="smallUppercaseTitle">Amount to Send</p>
										<p className="bigTitle red" style={{"paddingBottom":"10px"}}>{comma(this.state.finalResults.amount)} {this.state.pCurrency}</p>
										<p className="bigTitle smalldescription">Send the <b>EXACT</b> amount only</p>

										<hr />
										<p className="smallUppercaseTitle gray">USD Amount</p>
										<p className="bigTitle ">${amountRounding(this.state.amount)}</p>
										<hr />
										<p className="smallUppercaseTitle gray">Purchased FNB</p>
										<p className="bigTitle ">{comma(this.state.totalLare)}</p>
										<hr />
										<p className="smallUppercaseTitle">Your payment id is</p>
										<p className="bigTitle small">{this.state.finalResults.txn_id}</p>										
									</div>
								</div>
							</div>	
							<div className="dashModal contentPageDetails" style={{"width":"40%","margin":"0 auto"}}>
								<div className="content" style={{"height":"auto","margin":"0 auto"}}>
									<div className="completeTransactionWrap">
										<p className="smallUppercaseTitle">Send your coins to this address</p>
										<p className="bigTitle small">{this.state.finalResults.address}</p>
										<p className="bigTitle smalldescription">Please allow 2 - 4 hours for the coins to show on your dashboard.</p>
										<hr />
										<p className="smallUppercaseTitle">Scan QR Code</p>
										<p className="svgQRCODE">
											 <QRCode value={this.state.finalResults.address} size="150" renderAs="svg" />
										</p>
										<hr />
										
										<Timer seconds={this.state.finalResults.timeout} />
									</div>
								</div>
							</div>	
							<div className="dashModal seperator" style={{"width":"10%","margin":"0 auto"}}></div>	
							<br style={{"clear":"both"}} />
						</div>
					}
					{
						this.state.usdPopup == true ?
						<div>
							<div onClick={(e) => this.setState({"usdPopup":!this.state.usdPopup,"loadingScreen":false})} style={{"z-index":"123"}} className="loadingScreen"></div>
							{
								this.state.verifiedUser == false ?

									<div className="usdPopupmethodsWrap">
										<div onClick={(e) => this.setState({"usdPopup":!this.state.usdPopup,"loadingScreen":false})} className="closeButton"><i className="fa fa-close"></i></div>
										<div className="verifyYourAccountAlert" style={{"paddingBottom":"0"}}>
											<p className="title">Account Verification Required</p>
											<p className="subtitle">To deposit money using electronic check or a debit/credit card, you must verify your account.</p>
											<Link className="buyNowBttn verifyAccount" to="/settings/profile">Verify Account</Link>
										</div>
									</div>
								:
								<div>
									<div className="usdPopupmethodsWrap" style={{"display":this.state.usdPopupPlace == 0 ? "block" : "none"}}>
										<div onClick={(e) => this.setState({"usdPopup":!this.state.usdPopup,"loadingScreen":false})} className="closeButton"><i className="fa fa-close"></i></div>
										<p className="title">Select Checkout Method</p>
										<div className="bttnContainers">
											<a onClick={(e) => this.setState({"usdPopupPlace":1})}>Wire Transfer</a>
											<a style={{"backgroundColor":"#28c101"}} onClick={(e) => this.setState({"usdPopupPlace":2})}>Cash App</a>
										</div>
									</div>
									<div className="usdPopupmethodsWrap" style={{"display":this.state.usdPopupPlace == 1 ? "block" : "none"}}>
										<div onClick={(e) => this.setState({"usdPopup":!this.state.usdPopup,"loadingScreen":false})} className="closeButton"><i className="fa fa-close"></i></div>
										<div onClick={(e) => this.setState({"usdPopupPlace":0})} className="leftButton"><i className="fa fa-arrow-left"></i></div>
										
										<div className="electronicCheckWrap" style={{"paddingTop":"0"}}>
											<DepositDetails amount={this.state.amount} type="electronic" />
										</div>
									</div>
									<div className="usdPopupmethodsWrap" style={{"display":this.state.usdPopupPlace == 2 ? "block" : "none"}}>
										<div onClick={(e) => this.setState({"usdPopup":!this.state.usdPopup,"loadingScreen":false})} className="closeButton"><i className="fa fa-close"></i></div>
										<div onClick={(e) => this.setState({"usdPopupPlace":0})} className="leftButton"><i className="fa fa-arrow-left"></i></div>
										<DepositDetails amount={this.state.amount} type="cashapp" />
									</div>
								</div>
								}
						</div>
						:
						""
					}
					{
						this.state.coinBuyUSA == true ?
						<div>
								<div onClick={(e) => this.setState({"coinBuyUSA":!this.state.coinBuyUSA})} className="loadingScreen"></div>
								<div className="usdPopupmethodsWrap">
									<div onClick={(e) => this.setState({"coinBuyUSA":!this.state.coinBuyUSA})} className="closeButton"><i className="fa fa-close"></i></div>
									<div className="verifyYourAccountAlert" style={{"paddingBottom":"0"}}>
										<p className="title">Account Verification Required</p>
										<p className="subtitle">To buy FNB using these cryptocurrencies, you must verify and become accredited.</p>
										<Link className="buyNowBttn verifyAccount" to="/settings/profile">Verify Account</Link>
									</div>
								</div>
							</div>
						:
						""
					}
				</div>
				{
					this.state.loadingScreen == true ?
					<div className="loadingScreen">
							<div className="loading-spinner"></div>
					</div>
					:
					""
				}
				<Footer />
			</div>
		)
	}
}

{/* Tonys Exchange2 Component Start*/} 
export class Exchange2 extends React.Component {
	constructor(props){
		super(props);
		this.handleInputAmount = this.handleInputAmount.bind(this);
		this.handPaymentSelection = this.handPaymentSelection.bind(this);
		this.handleCreateTransaction = this.handleCreateTransaction.bind(this);
		this.setTotalLare = this.setTotalLare.bind(this);
		this.state = {
			"pCurrency":"BTC",
			"verifiedUser":false,
			"fullCurrency":"Bitcoin",
			"amount":"",
			"exchangeRate":"0.56085",
			"bonusRate":"100",
			"feeRate":"2",
			"USDFeeRate":"0",
			"minimum":50.00,
			"btcinDollar":"",
			"rates": null,
			"totalLare":"",
			"completeTrans":false,
			"usdPopup":false,
			"usdPopupPlace":0,
			"finalResults":null,
			"loadingScreen":false,
			"bonusExchangeRate":"0.28425",
			"coinBuyUSA":false
		}
	}
	componentDidMount(){
		ReactGA.pageview(window.location.pathname + window.location.search);

		var r = this;
		$.getJSON('https://blockchain.info/tobtc?currency=USD&value=1', function(data) {
		  	r.setState({"btcinDollar":data});
		});
		Parse.Cloud.run('getRates', {}, {
		success: function(results) {
			var array = $.map(results, function(value, index) {
			    return [index+ ":" +value["rate_btc"]];
			});
			r.setState({"rates":array});
		},error:function(err){
			alert(err)
		}});

		window.scrollTo(0, 0)
		document.title = "Buy Coins – FNB";
		var Users = Parse.Object.extend("_User");
		var query = new Parse.Query(Users);
		query.get(Parse.User.current().id, {
		success: function(results) {
			r.setState({"verifiedUser":results.get('accountVerified'),"accreditedStatus":results.get('accreditedStatus')})
		}, error:function(err){
			alert(err)
		}});		
	}
	handPaymentSelection(e){
		var value = e.target.attributes.id.value.split(':');
		this.setState({"pCurrency":value[0],"fullCurrency":value[1]});
	}
	handleInputAmount(e){
		this.setState({"amount":e.target.value.replace(/\D/g,'')});
	}
	setTotalLare(e){
		this.setState({"totalLare":e.target.value});
	}
	handleCreateTransaction() {
		var r = this;
		r.setState({"loadingScreen":true});
		var Config = Parse.Object.extend("config");
		var ConfigQ = new Parse.Query(Config);
		ConfigQ.get('k7t0S4tWWZ', {
		success: function(CQResults) {
			var coinBuyUSA = CQResults.get('coinBuyUSA');
			if (coinBuyUSA == true) {
				if (r.state.verifiedUser == true && r.state.accreditedStatus == "Complete") {

					if (r.state.pCurrency != "USD") {
						if (r.state.amount < r.state.minimum) {} else {
							r.setState({"totalLare":$('#totalLareAMount').html().split(' ')[0],"loadingScreen":true});
							var userPointer = {
							  "__type": 'Pointer',
							  "className": '_User',
							  "objectId":  Parse.User.current().id
							}
							Parse.Cloud.run('createTransaction', {
								"user":userPointer,
								"email": Parse.User.current().get('username'),
								"bonusPercent":r.state.bonusRate,
								"totalLare":$('#totalLareAMount').html().split(' ')[0],
								"feePercent":r.state.feeRate,
								"c1":"USD",
								"c2":r.state.pCurrency,
								"amount":r.state.amount
							}, {
							success: function(results) {
								r.setState({"finalResults":results,"completeTrans":true,"loadingScreen":false});
							},error:function(err){
									r.setState({"loadingScreen":false});
								alert(err)
							}});
						}
					} else {
						if (r.state.amount < r.state.minimum) {} else {
							r.setState({"totalLare":$('#totalLareAMount').html().split(' ')[0]});
							r.setState({"usdPopup":true,"usdPopupPlace":0});
						}
					}
				} else {
					r.setState({"coinBuyUSA":true,"loadingScreen":false})
				}
			} else {

				if (r.state.pCurrency != "USD") {
					if (r.state.amount < r.state.minimum) {} else {
						r.setState({"totalLare":$('#totalLareAMount').html().split(' ')[0],"loadingScreen":true});
						var userPointer = {
						  "__type": 'Pointer',
						  "className": '_User',
						  "objectId":  Parse.User.current().id
						}
						Parse.Cloud.run('createTransaction', {
							"user":userPointer,
							"email": Parse.User.current().get('username'),
							"bonusPercent":r.state.bonusRate,
							"totalLare":$('#totalLareAMount').html().split(' ')[0],
							"feePercent":r.state.feeRate,
							"c1":"USD",
							"c2":r.state.pCurrency,
							"amount":r.state.amount
						}, {
						success: function(results) {
							r.setState({"finalResults":results,"completeTrans":true,"loadingScreen":false});
						},error:function(err){
								r.setState({"loadingScreen":false});
							alert(err)
						}});
					}
				} else {
					if (r.state.amount < r.state.minimum) {} else {
						r.setState({"totalLare":$('#totalLareAMount').html().split(' ')[0]});
						r.setState({"usdPopup":true,"usdPopupPlace":0});
					}
				}
			}
		}, error:function(err){
			console.log(err)
		}});

	}
	render() {
		return (
			<div>
				<div className="page exchangePageWrap">
					<MainHeader />
					{
						this.state.completeTrans == false ?
							<div className="dashWrapperB exchangeWrap">
								<div className="dashModal seperator" style={{"width":"7.5%"}}></div>
								<div className="dashModal Exchange2LeftSide" style={{"width":"50%"}}>
									<div className="content" style={{"height":"auto","width":"100%","float":"right"}}>
										<Exchange2LeftSide minimum={this.state.minimum} pCurrency={this.state.pCurrency} handleCreateTransaction={this.handleCreateTransaction}  amount={this.state.amount} handleInputAmount={this.handleInputAmount} handPaymentSelection={this.handPaymentSelection} />
									</div>
								</div>
								<div className="dashModal exchnageDetails" style={{"width":"35%"}}>
									<div className="content" style={{"height":"auto","width":"100%","margin":"0 ","boxShadow":"inset -1px 0 0 #e0e6ed, inset 1px 0 0 #e0e6ed","border":"0"}}>
										<Exchange2Details stateInfo={this.state} handleCreateTransaction={this.handleCreateTransaction} setTotalLare={this.setTotalLare} />
									</div>
								</div>
								<div className="dashModal seperator" style={{"width":"7.5%"}}></div>
								<br style={{"clear":"both"}} />
							</div>
					:
						<div className="dashWrapperB exchangeResultsPage" style={{"margin":"0 auto"}}>
							<div className="dashModal seperator" style={{"width":"15%","margin":"0 auto","textAlign":"right"}}><Link to="/exchange/1"><img style={{"width":"20px","cursor":"pointer"}} src={backButton}/></Link></div>	
							<div className="dashModal contentPage" style={{"width":"30%","margin":"0 auto"}}>
								<div className="content" style={{"height":"auto","margin":"0 auto"}}>
									<div className="completeTransactionWrap">
										<p className="smallUppercaseTitle">Amount to Send</p>
										<p className="bigTitle red" style={{"paddingBottom":"10px"}}>{comma(this.state.finalResults.amount)} {this.state.pCurrency}</p>
										<p className="bigTitle smalldescription">Send the <b>EXACT</b> amount only</p>

										<hr />
										<p className="smallUppercaseTitle gray">USD Amount</p>
										<p className="bigTitle ">${amountRounding(this.state.amount)}</p>
										<hr />
										<p className="smallUppercaseTitle gray">Purchased FNB</p>
										<p className="bigTitle ">{comma(this.state.totalLare)}</p>
										<hr />
										<p className="smallUppercaseTitle">Your payment id is</p>
										<p className="bigTitle small">{this.state.finalResults.txn_id}</p>										
									</div>
								</div>
							</div>	
							<div className="dashModal contentPageDetails" style={{"width":"40%","margin":"0 auto"}}>
								<div className="content" style={{"height":"auto","margin":"0 auto"}}>
									<div className="completeTransactionWrap">
										<p className="smallUppercaseTitle">Send your coins to this address</p>
										<p className="bigTitle small">{this.state.finalResults.address}</p>
										<p className="bigTitle smalldescription">Please allow 2 - 4 hours for the coins to show on your dashboard.</p>
										<hr />
										<p className="smallUppercaseTitle">Scan QR Code</p>
										<p className="svgQRCODE">
											 <QRCode value={this.state.finalResults.address} size="150" renderAs="svg" />
										</p>
										<hr />
										
										<Timer seconds={this.state.finalResults.timeout} />
									</div>
								</div>
							</div>	
							<div className="dashModal seperator" style={{"width":"10%","margin":"0 auto"}}></div>	
							<br style={{"clear":"both"}} />
						</div>
					}
					{
						this.state.usdPopup == true ?
						<div>
							<div onClick={(e) => this.setState({"usdPopup":!this.state.usdPopup,"loadingScreen":false})} style={{"z-index":"123"}} className="loadingScreen"></div>
							{
								this.state.verifiedUser == false ?

									<div className="usdPopupmethodsWrap">
										<div onClick={(e) => this.setState({"usdPopup":!this.state.usdPopup,"loadingScreen":false})} className="closeButton"><i className="fa fa-close"></i></div>
										<div className="verifyYourAccountAlert" style={{"paddingBottom":"0"}}>
											<p className="title">Account Verification Required</p>
											<p className="subtitle">To deposit money using electronic check or a debit/credit card, you must verify your account.</p>
											<Link className="buyNowBttn verifyAccount" to="/settings/profile">Verify Account</Link>
										</div>
									</div>
								:
								<div>
									<div className="usdPopupmethodsWrap" style={{"display":this.state.usdPopupPlace == 0 ? "block" : "none"}}>
										<div onClick={(e) => this.setState({"usdPopup":!this.state.usdPopup,"loadingScreen":false})} className="closeButton"><i className="fa fa-close"></i></div>
										<p className="title">Select Checkout Method</p>
										<div className="bttnContainers">
											<a onClick={(e) => this.setState({"usdPopupPlace":1})}>Wire Transfer</a>
											<a style={{"backgroundColor":"#28c101"}} onClick={(e) => this.setState({"usdPopupPlace":2})}>Cash App</a>
										</div>
									</div>
									<div className="usdPopupmethodsWrap" style={{"display":this.state.usdPopupPlace == 1 ? "block" : "none"}}>
										<div onClick={(e) => this.setState({"usdPopup":!this.state.usdPopup,"loadingScreen":false})} className="closeButton"><i className="fa fa-close"></i></div>
										<div onClick={(e) => this.setState({"usdPopupPlace":0})} className="leftButton"><i className="fa fa-arrow-left"></i></div>
										
										<div className="electronicCheckWrap" style={{"paddingTop":"0"}}>
											<DepositDetails amount={this.state.amount} type="electronic" />
										</div>
									</div>
									<div className="usdPopupmethodsWrap" style={{"display":this.state.usdPopupPlace == 2 ? "block" : "none"}}>
										<div onClick={(e) => this.setState({"usdPopup":!this.state.usdPopup,"loadingScreen":false})} className="closeButton"><i className="fa fa-close"></i></div>
										<div onClick={(e) => this.setState({"usdPopupPlace":0})} className="leftButton"><i className="fa fa-arrow-left"></i></div>
										<DepositDetails amount={this.state.amount} type="cashapp" />
									</div>
								</div>
								}
						</div>
						:
						""
					}
					{
						this.state.coinBuyUSA == true ?
						<div>
								<div onClick={(e) => this.setState({"coinBuyUSA":!this.state.coinBuyUSA})} className="loadingScreen"></div>
								<div className="usdPopupmethodsWrap">
									<div onClick={(e) => this.setState({"coinBuyUSA":!this.state.coinBuyUSA})} className="closeButton"><i className="fa fa-close"></i></div>
									<div className="verifyYourAccountAlert" style={{"paddingBottom":"0"}}>
										<p className="title">Account Verification Required</p>
										<p className="subtitle">To buy FNB using these cryptocurrencies, you must verify and become accredited.</p>
										<Link className="buyNowBttn verifyAccount" to="/settings/profile">Verify Account</Link>
									</div>
								</div>
							</div>
						:
						""
					}
				</div>
				{
					this.state.loadingScreen == true ?
					<div className="loadingScreen">
							<div className="loading-spinner"></div>
					</div>
					:
					""
				}
				<Footer />
			</div>
		)
	}
}

{/* Tonys Exchange2 Component End */}

export class ExchangeDetailsRoute extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"amount":500,
			"totalSend":0,
			"txn_id":"123123123123",
			"address":"123123123",
			"totalFNB":1000,
			"timeout":null,
			"pCurrency":"FNB",
			"details":""
		}
	}
	componentDidMount() {
		var key = this.props.match.params.key;
		var r = this;
		var Transactions = Parse.Object.extend("Transactions");
		var query = new Parse.Query(Transactions);
		query.get(key, {
		  success: function(data) {
			var a = new Date();
			var b = new Date(data.get('ExpireDate'));
			var difference = (b - a) / 1000;
		  	r.setState({
		  		"amount":data.get('amount'),
		  		"totalSend":data.get('totalSend'),
		  		"txn_id":data.get('txn_id'),
		  		"address":data.get('address'),
		  		"totalLare":data.get('totalLare'),
		  		"pCurrency":data.get('currencyTo'),
		  		"timeout":difference,
		  		"details":data.get('Details') == undefined ? "" : data.get('Details')
		  	});
		  },
		  error: function(object, error) {
		  	if (error.message == "Object not found.") {
		  		window.location.href = startUrl + "exchange";
		  	} else {
		  		alert(error.message)
		  	}
		  }
		});
		window.scrollTo(0, 0)
		document.title = "Exchange Details – FNB";

	}
	render() {
		return (
			<div>
				<div className="page">
					<MainHeader />
						<div className="dashWrapperB exchangeResultsPage" style={{"margin":"0 auto"}}>
							<div className="dashModal seperator" style={{"width":"15%","margin":"0 auto","textAlign":"right"}}><Link to="/wallets"><img style={{"width":"20px"}} src={backButton} /></Link></div>	
							<div className="dashModal contentPage" style={{"width":"30%","margin":"0 auto"}}>
								<div className="content" style={{"height":"auto","margin":"0 auto"}}>
									<div className="completeTransactionWrap">
										<p className="smallUppercaseTitle">Amount to Send</p>
										<p className="bigTitle red" style={{"paddingBottom":"10px"}}>{comma(this.state.totalSend)} {this.state.pCurrency}</p>
										<p className="bigTitle smalldescription">Send the <b>EXACT</b> amount only</p>
										<hr />
										<p className="smallUppercaseTitle gray">USD Amount</p>
										<p className="bigTitle ">${amountRounding(this.state.amount)}</p>
										<hr />
										<p className="smallUppercaseTitle gray">Purchased FNB</p>
										<p className="bigTitle ">{comma(this.state.totalLare)}</p>
										<hr />
										<p className="smallUppercaseTitle">Your payment id is</p>
										<p className="bigTitle small">{this.state.txn_id}</p>										
									</div>
								</div>
							</div>	
							<div className="dashModal contentPageDetails" style={{"width":"40%","margin":"0 auto"}}>
								<div className="content" style={{"height":"auto","margin":"0 auto"}}>
									<div className="completeTransactionWrap">
										<p className="smallUppercaseTitle">Send your coins to this address</p>
										<p className="bigTitle small">{this.state.address}</p>
										<p className="bigTitle smalldescription">Please allow 2 - 4 hours for the coins to show on your dashboard.</p>
										<hr />
										<p className="smallUppercaseTitle" style={{"paddingTop":"10px"}}>Scan QR Code</p>
										<p className="svgQRCODE">
											 <QRCode value={this.state.address} size={150} renderAs="svg" />
										</p>
										
										{
											this.state.details != "Cancelled / Timed Out" || this.state.details != "Complete" || this.state.details != "Canceled By User" ?
											<span>
												<hr />
													{
														this.state.timeout != null?
														<Timer seconds={this.state.timeout} />
														: ""
													}
											</span>
											: ""
										}
										{
											this.state.details != "" ?
											<span>
												<hr />
												<p className="smallUppercaseTitle">Status</p>
												<p className="bigTitle small">{this.state.details}</p>
											</span>
											: <br />
										}
									</div>
								</div>
							</div>	
							<div className="dashModal seperator" style={{"width":"10%","margin":"0 auto"}}></div>	
							<br style={{"clear":"both"}} />
						</div>		








					</div>
				<Footer />
			</div>
		)
	}
}











function amountRounding(amount) {
	return comma(parseFloat(amount).toFixed(2))
}



export class Timer extends React.Component {
  constructor() {
    super();
    this.state = { time: {}, seconds: null };
    this.timer = 0;
    this.countDown = this.countDown.bind(this);
  }
  secondsToTime(secs){
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
  componentWillMount() {
  	this.setState({"seconds":this.props.seconds});
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    if (this.timer == 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }
  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
    if (seconds == 0) { 
      clearInterval(this.timer);
    }
  }
  render() {
    return(
      <div className="totalTimerWRap">
      	{
      		this.props.hide == undefined || this.props.hide == "false" ?
      		<p className="smallUppercaseTitle" style={{"paddingTop":"10px"}}>Deposit the amount in</p>
      		:
      		""
      	}
        <p className="totalTimer"><b>{this.state.time.h}</b> {this.state.time.h == 1 ? "hour" : "hours"} <b>{this.state.time.m}</b> minutes <b>{this.state.time.s}</b> seconds</p>
      </div>
    );
  }
}







export class Referrals extends React.Component {
	constructor(props){
		super(props);
		this.handleInput = this.handleInput.bind(this);
		this.handleEmailSend = this.handleEmailSend.bind(this);
		this.state = {
			"emailSend":"",
			"referralLink":"",
			"totalReferred":0,
			"copied":false,
			"results":[]
		}
	}
	handleInput(e){
		this.setState({"emailSend":e.target.value})
	}
	handleEmailSend(e){
		var r = this;
		if (this.state.emailSend == "") {
				this.refs.errorMessageEmail.innerHTML = "Type an email to get started!"
				this.refs.errorMessageEmail.style.color = "red";
		} else {
			var string = this.state.emailSend.replace(/ /g, '').split(',');
			if (string.length > 40) {
				this.refs.errorMessageEmail.innerHTML = "The maximum to send is 40 people at a time."
				this.refs.errorMessageEmail.style.color = "red";
			} else {
				var invalid = false;
				for (var i = 0; i < string.length; i++) {
					var em = string[i];
					if (isEmail(em)) {
						this.refs.errorMessageEmail.innerHTML = 'Use commas "," to seperate several people';
						this.refs.errorMessageEmail.style.color = "grey";
					} else {
						invalid = true;
						this.refs.errorMessageEmail.innerHTML = "Some of your emails are invalid!"
						this.refs.errorMessageEmail.style.color = "red";
					}
				}
				if (invalid == false) {
					Parse.Cloud.run('sendReferralEmails', {
						"emails":string,
						"referralLink":r.state.referralLink,
						"email":Parse.User.current().get('username'),
						"fname":Parse.User.current().get('fname'),
						"lname":Parse.User.current().get('lname')
					}, {
					success: function(results) {
						r.refs.referralsButtons.innerHTML = "Sent!";
						$(r.refs.referralsButtons).addClass('successEmailSent');
					}, error:function(err){
						alert(err)
					}});
				}
			}
		}
	}
	componentDidMount(){
		var r = this;
		ReactGA.pageview(window.location.pathname + window.location.search);
		var Users = Parse.Object.extend("_User");
		var query = new Parse.Query(Users);
		query.get(Parse.User.current().id, {
		success: function(results) {
			r.setState({"referralLink":results.get('refURL')});
			
		}, error:function(err){
			alert(err)
		}});

		var userPointer = {
		  "__type": 'Pointer',
		  "className": '_User',
		  "objectId":  Parse.User.current().id
		}
		var Referrals = Parse.Object.extend("Referrals");
		var query = new Parse.Query(Referrals);
		query.equalTo("referee", userPointer);
		query.equalTo("active", false);
		query.find({
		  success: function(results) {
		  	for (var i = 0; i < results.length; i++) {
		  		r.setState({"totalReferred":r.state.totalReferred + parseFloat(results[i].get('totalRewarded'))})
		  	}
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});
		$(this.refs.emailAddresses).focus();
		window.scrollTo(0, 0)
		document.title = "Referrals – FNB";

	}
	render() {
		return (
			<div>
				<div className="page referralsPage">
					<MainHeader />
					<div className="dashWrapperB referralWraps" style={{"backgroundColor":"white"}}>
						<div className="dashModal" style={{"width":"100%"}}>
							<div className="content noBorder" style={{"height":"auto"}}>
								<div className="dashModal seperator" style={{"width":"15%","paddingLeft":"0"}}></div>
								<div className="dashModal contentPage" style={{"width":"70%","paddingLeft":"0","margin":"0 auto"}}>
									<div className="referralWrap contentPage" style={{"paddingTop":"60px"}}>
										<p className="title">Invite your family and friends to recieve rewards</p>
										<p className="description">Invite a friend who buys or sells $100 of digital currency or more, and you'll earn $10 worth of free FNB!</p>
									</div>
								

									<div className="dashModal contentPage" style={{"width":"100%","paddingLeft":"0"}}>
										<div className="inviteFriendWrap">
											<input value={this.state.emailSend} ref="emailAddresses" onChange={this.handleInput} type="text" placeholder="Invite family and friends by email" /><a onClick={this.handleEmailSend} ref="referralsButtons" className="referralsButton">Invite</a>
											<p className="referralsComman" ref="errorMessageEmail">Use commas "," to seperate several people</p>
										</div>
									</div>
								</div>
								<div className="dashModal seperator" style={{"width":"15%","paddingLeft":"0"}}></div>
								<br style={{"clear":"both"}} />

									<div className="dashModal contentPage" style={{"width":"50%","paddingLeft":"0"}}>
										<div className="inviteFriendWrap shareLink socialLinks" style={{"boxShadow":"none","paddingTop":"20px"}}>
											<p className="title" style={{"fontSize":"15px"}}>My Referral Link:</p>
											<input style={{"marginTop":"20px"}} type="text" disabled value={this.state.referralLink} />
										        <CopyToClipboard text={this.state.referralLink}
										          onCopy={() => this.setState({copied: true})}>
										          {
										          	this.state.copied == true ?  <a style={{"marginTop":"20px"}}  className="referralsButton copyLink copied">Copied!</a> : <a style={{"marginTop":"20px"}} className="referralsButton copyLink">Copy Link</a>
										          }
										        </CopyToClipboard>
										</div>
									</div>
									<div className="dashModal contentPage" style={{"width":"50%","paddingLeft":"0"}}>
										<div className="socialLinks" style={{"paddingTop":"20px","textAlign":"center"}}>
											<p className="title" style={{"fontSize":"15px","paddingBottom":"20px"}}>Share Link:</p>

											<FacebookShareButton url="https://www.larecoin.com" quote={this.state.referralLink}>
												<div style={{"textAlign":"center"}} className="facebook">
										         	<i className="fa fa-facebook"></i>
												</div>
											 </FacebookShareButton>
											 <TwitterShareButton url="https://www.larecoin.com" title="Larecoin Share Link Description">
												<div style={{"textAlign":"center"}} className="twitter">
													<i className="fa fa-twitter"></i>
												</div>	
											</TwitterShareButton>
											 <LinkedinShareButton url="https://www.larecoin.com" title="Larecoin Share Link Description">
												<div style={{"textAlign":"center"}} className="linkedin">
													<i className="fa fa-linkedin"></i>
												</div>	
											</LinkedinShareButton>
											 <TelegramShareButton url="https://www.larecoin.com" title="Larecoin Share Link Description">
												<div style={{"textAlign":"center"}} className="linkedin">
													<i className="fa fa-telegram"></i>
												</div>	
											</TelegramShareButton>
										</div>
									</div>
									<br style={{"clear":"both"}} />
								<div className="dashModal contentPageTablePart" style={{"width":"47%","paddingLeft":"0"}}>
									<div className="content" style={{"height":"auto"}}>
										<ReferralsTables />
									</div>
								</div>
								<div className="dashModal contentPageTablePart" style={{"width":"5%","paddingLeft":"0"}}></div>
								<div className="dashModal contentPageTablePart" style={{"width":"47%","paddingLeft":"0"}}>
									<div className="content" style={{"height":"auto"}}>
										<div className="invitedFriends totalEarnedWrap">
											<p className="subtitle">Total Earned</p>
											<p className="totalEarned">{comma(this.state.totalReferred)} FNB</p>
											{/*<a className="claimBonus" href="">Claim Bonus</a>*/}
										</div>
									</div>
								</div>
								<br style={{"clear":"both"}} />
							</div>
						</div>
						<br style={{"clear":"both"}} />
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}


class ReferralsTables extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"results":[]
		}
	}
	componentDidMount(){
		var r = this;
		var userPointer = {
		  "__type": 'Pointer',
		  "className": '_User',
		  "objectId":  Parse.User.current().id
		}
		var Referrals = Parse.Object.extend("Referrals");
		var query = new Parse.Query(Referrals);
		query.equalTo("referee", userPointer);
		query.find({
		  success: function(results) {
		  	r.setState({"results":results});
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});
	}
	render(){
		return (
			<div className="invitedFriends">
				{
					this.state.results.length == 0 ?
						<div className="noReferralsYet">
							<p className="noReferralsYetTitle">No Referrals Yet.</p>
						</div>
					 :
					 <div>
					 	<p className="title">Invited Friends</p>
						<table>
							<tr>
								<th></th>
								<th></th>
							</tr>
							<tbody>
							{
								this.state.results.map(function(object,key) {
									return (
										<tr>
											<td>{object.get('emailAddress')}</td>
											{
												object.get('userReferred') == undefined ?
												<td className="inviteSent">Invite Sent</td>
												: object.get('active') == true ?
												<td className="registered">Registered</td>
												: object.get('active') == false ?
												<td className="rewardedAmount">{object.get('totalRewarded') + " FNB "}</td>
												: ""
											}
										</tr>
									)
								})
							}
							</tbody>
						</table>
					</div>
				}
			</div>	
		)
	}
}





export class Transactions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"transactionData":[],
			"queryLimit":50,
			"transactionPage":0,
			"transactionPageTotal":7
		}
	}
	componentDidMount(){
		ReactGA.pageview(window.location.pathname + window.location.search);
		this.loadFSession(this.state.transactionPage);
	}
	loadFSession = (pageNumber) => {
		var r = this;
		var userPointer = {
		  "__type": 'Pointer',
		  "className": '_User',
		  "objectId":  Parse.User.current().id
		}
		var Transactions = Parse.Object.extend("Transactions");
		var query = new Parse.Query(Transactions);
		query.equalTo("userId", userPointer);
		query.count({
		  success: function(results) {
		  	r.setState({"transactionPageTotal":Math.round(results / r.state.queryLimit)});
		  }
		});

		var Transactions = Parse.Object.extend("Transactions");
		var query = new Parse.Query(Transactions);
		query.equalTo("userId", userPointer);
		query.limit(this.state.queryLimit);
		query.descending('updatedAt');
		query.skip(pageNumber * this.state.queryLimit);
		query.find({
		  success: function(results) {
		  	r.setState({"transactionData":results});
		  },
		  error: function(error) {
		   alert(error)
		  }
		});

		this.setState({"transactionPage":pageNumber});
	}

	render(){
		return (
			<div>
				<div className="page transactionsPage">
					<MainHeader />
					
					<div className="dashWrapperB referralWraps" style={{"backgroundColor":"white"}}>
						<div className="transactionsTable">
							<p className="transHistoryTitle">Transactions History</p>
							<table>
								<thead>
									<tr>
										<th>Date</th>
										<th className="sentAmountTH">From</th>
										<th className="arrowTH"></th>
										<th className="receivedTH">To</th>
										<th>Address</th>
										<th>Txn Id</th>
										<th>Details</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
								  	 {
								  	 	this.state.transactionData.map(function(index,key){
								  	 		return (
								  	 				<tr key={key}>
											    		<td>{formatDate(index.get('createdAt').toString())}</td>
											    		<td className="sentAmountTD">{index.get('currencyFrom')}</td>
											    		<td className="arrowTD"><i className="fa fa-angle-right"></i></td>
											    		<td className="receivedTD">{index.get('currencyTo')}</td>
											    		<td>{index.get('address')}</td>
											    		<td>{index.get('txn_id')}</td>
											    		<td>{index.get('Details')}</td>
														{
															index.get('status') == "Open" ?
															<td className="openTrans">{index.get('status')}</td>
															: index.get('status') == "Complete" ?
															<td className="completeTrans">{index.get('status')} <i className="fa fa-check"></i></td>
															: index.get('status') == "Error"?
															<td className="errorTrans">{index.get('status')} <i className="fa fa-check"></i></td>
															: index.get('status') == "Pending" ?
															<td className="openTrans">{index.get('status')} <i className="fa fa-check"></i></td>
															: index.get('status') == "Canceled" ?
															<td className="errorTrans">{index.get('status')} <i className="fa fa-check"></i></td>
															: 
															<td className="openTrans">Open</td>
														}
													</tr>
												)
								  	 	},this)
								  	 }

									{
										this.state.transactionPageTotal != 0 ?
										<tr style={{"paddingRight":"0px"}}>
											<td colspan="4">
												Showing {this.state.transactionPage + 1} of {this.state.transactionPageTotal} pages
											</td>
											<td className="bttmFooterPaginate" colspan="4">
												<ul>
													{
														this.state.transactionPage > 0 ?
														<li onClick={(e)=>this.loadFSession(this.state.transactionPage - 1)} >Previous</li>
														:
														<li className="disabled">Previous</li>
													}
													{[...Array(this.state.transactionPageTotal)].map((e, i) => {
													    return <li onClick={(e)=>this.loadFSession(i)} className={this.state.transactionPage == i ? "active" : ""} key={i}>{i + 1}</li>
													},this)}
													{
														this.state.transactionPage >= 0 && this.state.transactionPage+1 != this.state.transactionPageTotal ?
														<li onClick={(e)=>this.loadFSession(this.state.transactionPage + 1)} >Next</li>
														:
														<li className="disabled">Next</li>
													}
												</ul>
											</td>
										</tr>
										: ""
									}
								</tbody>
							</table>
						</div>
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
function isEmail(object) {
    var re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(object).toLowerCase());
}
