import React from "react"
import './exchange2.css';
import BitcoinLogo from "../../../images/bitcoinLogo.png";
import EthereumLogo from "../../../images/ethereumLogo.png";
import LitecoinLogo from "../../../images/litecoin.png";
import Monero from "../../../images/monero.png";
import NeoLogo from "../../../images/neo.png";
import DashLogo from "../../../images/dash.png";
import VergeLogo from "../../../images/verge.png";
import ZcashLogo from "../../../images/zcash.png";
import ZenCashLogo from "../../../images/zencash.png";
import LogoSW from "../../../images/f-in-blue1.png";



import $ from 'jquery';
import {comma} from "../widgets";

export class Exchange2LeftSide extends React.Component {
	constructor(props){
		super(props);
	}
	_handleKeyPress = (e) => {
		if (e.key === 'Enter') {
			this.props.handleCreateTransaction();
		}
	}
	render(){
		return (
			<div>
				<div className="cHeader">
					<ul>
						<li className="active">Buy</li>
						<li>Sell <span className="pull-right tag green">Coming Soon</span></li>
					</ul>
				</div>
				<div className="cBody">
					<div className="paymentMethod">
						<p className="title">Select Tickets</p>
						<ul className="coinWrapperUL" style={{"text-align":"left"}}>
							<li>
								<div className="content active" style={{"text-align":"center"}}>
									<div className="logoP larecoinColor">
										<img style={{"width":"40px"}} src={LogoSW} />
									</div>
									<p className="coinTitle">FNB</p>
								</div>
							</li>
							<li>
								<div className="content disabled" style={{"text-align":"center"}}>
									<div className="logoP bitcoin">
										<img src={BitcoinLogo} />
									</div>
									<p className="coinTitle">Bitcoin</p>
								</div>
								<span className="pull-right tag green">Coming Soon</span>
							</li>
							<li className="hideinMobile">
								<div className="content disabled" style={{"text-align":"center"}}>
									<div className="logoP bitcoincash">
										<img src={BitcoinLogo} />
									</div>
									<p className="coinTitle">Bitcoin Cash</p>
								</div>
								<span className="pull-right tag green">Coming Soon</span>
							</li>
							<li>
								<div className="content disabled" style={{"text-align":"center"}}>
									<div className="logoP ethereum">
										<img src={EthereumLogo} />
									</div>
									<p className="coinTitle">Ethereum</p>
								</div>
								<span className="pull-right tag green">Coming Soon</span>
							</li>
							<li className="hideinMobile">
								<div className="content disabled" style={{"text-align":"center"}}>
									<div className="logoP litecoin">
										<img src={LitecoinLogo} />
									</div>
									<p className="coinTitle">Litecoin</p>
								</div>
								<span className="pull-right tag green">Coming Soon</span>
							</li>

						</ul>
					</div>
					<hr />
					<br />
					<div className="amountToSend">

						{
							this.props.pCurrency != "USD" ?
							this.props.amount == "" || parseFloat(this.props.amount) < this.props.minimum ?  
							<p className="title">Buy Amount<span className="pull-right minimumAmount">${this.props.minimum} minimum</span></p> 
							: 
							<p className="title">Buy Amount</p>  

							:
							
							this.props.amount == "" || parseFloat(this.props.amount) < 100 ?  
							<p className="title">Buy Amount<span className="pull-right minimumAmount">$100 minimum</span></p> 
							: 
							<p className="title">Buy Amount</p>  





						}
						





						<input value={this.props.amount} onKeyPress={this._handleKeyPress}  onChange={this.props.handleInputAmount} type="tel" className="amountInput" maxLength="9" placeholder="0.00" />
						<select dir="rtl" className="amountSelect">
							<option>USD</option>
						</select>
						<br style={{"clear":"both"}} />
					</div>
					<div className="paymentMethod">
						<p className="title">Payment Method</p>
						<ul className="coinWrapperUL">
							<li>
								<div className={this.props.pCurrency == "BTC" ? "content active" : "content"} id="BTC:Bitcoin" onClick={this.props.handPaymentSelection}>
									<div className="logoP bitcoin" id="BTC:Bitcoin">
										<img src={BitcoinLogo} id="BTC:Bitcoin" />
									</div>
									<p className="coinTitle" id="BTC:Bitcoin" >Bitcoin</p>
								</div>
							</li>
							<li>
								<div className={this.props.pCurrency == "BCH" ? "content active" : "content"} id="BCH:Bitcoin Cash" onClick={this.props.handPaymentSelection}>
									<div className="logoP bitcoincash" id="BCH:Bitcoin Cash">
										<img src={BitcoinLogo}  id="BCH:Bitcoin Cash"/>
									</div>
									<p className="coinTitle" id="BCH:Bitcoin Cash">Bitcoin Cash</p>
								</div>
							</li>
							<li>
								<div className={this.props.pCurrency == "ETH" ? "content active" : "content"} id="ETH:Ethereum" onClick={this.props.handPaymentSelection}>
									<div className="logoP ethereum" id="ETH:Ethereum">
										<img src={EthereumLogo}  id="ETH:Ethereum"/>
									</div>
									<p className="coinTitle" id="ETH:Ethereum">Ethereum</p>
								</div>
							</li>
							<li>
								<div className={this.props.pCurrency == "LTC" ? "content active" : "content"} id="LTC:Litecoin" onClick={this.props.handPaymentSelection}>
									<div className="logoP litecoin" id="LTC:Litecoin">
										<img src={LitecoinLogo}  id="LTC:Litecoin"/>
									</div>
									<p className="coinTitle" id="LTC:Litecoin">Litecoin</p>
								</div>
							</li>
							<li>
								<div className={this.props.pCurrency == "XMR" ? "content active" : "content"} id="XMR:Monero" onClick={this.props.handPaymentSelection}>
									<div className="logoP monero" id="XMR:Monero">
										<img src={Monero}  id="XMR:Monero"/>
									</div>
									<p className="coinTitle" id="XMR:Monero">Monero</p>
								</div>
							</li>
							<li>
								<div className={this.props.pCurrency == "NEO" ? "content active" : "content"} id="NEO:NEO" onClick={this.props.handPaymentSelection}>
									<div className="logoP neo" id="NEO:NEO">
										<img src={NeoLogo}  id="NEO:NEO"/>
									</div>
									<p className="coinTitle" id="NEO:NEO">NEO</p>
								</div>
							</li>
							<li>
								<div className={this.props.pCurrency == "DASH" ? "content active" : "content"} id="DASH:Dash" onClick={this.props.handPaymentSelection}>
									<div className="logoP dash" id="DASH:Dash">
										<img src={DashLogo} id="DASH:Dash" />
									</div>
									<p className="coinTitle" id="DASH:Dash">Dash</p>
								</div>
							</li>
							<li>
								<div className={this.props.pCurrency == "XVG" ? "content active" : "content"} id="XVG:Verge" onClick={this.props.handPaymentSelection}>
									<div className="logoP verge" id="XVG:Verge">
										<img src={VergeLogo}  id="XVG:Verge"/>
									</div>
									<p className="coinTitle" id="XVG:Verge">Verge</p>
								</div>
							</li>
							<li>
								<div className={this.props.pCurrency == "ZEC" ? "content active" : "content"} id="ZEC:Zcash" onClick={this.props.handPaymentSelection}>
									<div className="logoP zcash" id="ZEC:Zcash">
										<img src={ZcashLogo}  id="ZEC:Zcash"/>
									</div>
									<p className="coinTitle" id="ZEC:Zcash">Zcash</p>
								</div>
							</li>
							<li>
								<div className={this.props.pCurrency == "USD" ? "content active" : "content"} id="USD:USD" onClick={this.props.handPaymentSelection}>
									<div className="logoP usd" id="USD:USD">
										<i className="fa fa-usd" id="USD:USD" />
									</div>
									<p className="coinTitle" id="USD:USD">USD</p>
								</div>
							</li>

							
{/*
							<li>
								<div className={this.props.pCurrency == "USD" ? "content active" : "content"} id="USD:USD" onClick={this.props.handPaymentSelection}>
									<div className="logoP usd" id="USD:USD">
										<i className="fa fa-usd" id="USD:USD" />
									</div>
									<p className="coinTitle" id="USD:USD">USD</p>
								</div>
							</li>*/}
							
						</ul>
					</div>
				</div>
			</div>
		)
	}
}


export class Exchange2Details extends React.Component {
	render(){
		var prop = this.props.stateInfo;
		return (
			<div>
				<div className="cBody exchangeDetails">
					<p className="initialTitle">You are buying</p>
					<p className="amountofLare">{calculateLareAmount(prop,"total")} FNB</p>{/* {calculateLareAmount(prop,"t")}*/}
					<p className="exchangeRate">@ ${prop.bonusExchangeRate} per FNB</p>
					<hr />
					<div className="bodyWrap">
						<div className="centerLineWrap">
							<div className="centerLine"></div>
							<div className="centerCircles">
								<div className="leftCircle">
									{PlusSVG}
								</div>
								<div className="leftCircle">
									{EqualSVG}
								</div>
								<div className="leftCircle">
									{BankSVG}
								</div>
								<div className="leftCircle">
									{walletSVG}
								</div>
							</div>
						</div>
						<div className="ExchangeDetailsWrap">
							<ul>
								<li>
									<p className="title">Amount without Bonus</p>
									<p className="subtitle">{calculateLareAmount(prop,"b")} FNB</p>
									<hr />
								</li>
								<li>
									<p className="title">Bonus Amount</p>
									<p className="subtitle" id="totalLareAMount">{calculateLareAmount(prop,"t")} FNB</p>
									<hr />
								</li>
								<li>
									<p className="title">Payment</p>
									<p className="subtitle">{convertToCoin(prop)} {prop.pCurrency}</p>
									<hr />
								</li>
								<li>
									<p className="title">Deposit to</p>
									<p className="subtitle">FNB Wallet</p>
								</li>
							</ul>
						</div>
					</div>
					<hr style={{"margin":"0","padding":"0","paddingBottom":"10px"}} />
					<div className="finalFeeWrap">
						<span className="pull-left title">Subtotal</span>
						<span className="pull-right title">${calculateLareAmount(prop,"subtotal")}</span>
						<div className="verticalLine"></div>
					</div>
					<div className="finalFeeWrap">
						<span className="pull-left title">Transaction Fee</span>
						<span className="pull-right title">${calculateLareAmount(prop,"fee")}</span>
						<div className="verticalLine"></div>
					</div>
					<div className="finalFeeWrap">
						<span className="pull-left title">Total</span>
						<span className="pull-right title">${calculateLareAmount(prop,"totalA")}</span>
						<div className="verticalLine"></div>
					</div>
				</div>
				{
					prop.pCurrency != "USD" ?
						prop.amount == "" || parseFloat(prop.amount) < prop.minimum ? 
						<a className="errorPurchase">{"$" + prop.minimum + " minimum"}</a> 
						: 
						<a onClick={this.props.handleCreateTransaction} className="confirmPurchase">Checkout</a>
					:
						prop.amount == "" || parseFloat(prop.amount) < 100 ? 
						<a className="errorPurchase">{"$100.00 minimum"}</a> 
						:
						<a onClick={this.props.handleCreateTransaction} className="confirmPurchase">Checkout</a>


				}
			</div>
		);
	}
}











function calculateLareAmount(object,t) {
	var rRate = 5;
	if (object.amount == "") {
		if (t == "totalA" || t == "fee" || t == "subtotal") {
			return "0.00"
		} else {
			return "0.00000"
		}
	}



	var totalPerDollar = Math.abs(1 / parseFloat(object.exchangeRate));
	var fee;
	if (object.pCurrency == "USD") {
		fee = parseFloat(object.USDFeeRate)/100;
	} else {
		fee = parseFloat(object.feeRate)/100;
	}




	var lareAmount = (parseFloat(object.amount) * totalPerDollar).toFixed(rRate);
	var fLare = (lareAmount - (lareAmount * fee).toFixed(rRate));
	if (t == "t") {
		return comma(fLare);		
	} else if (t == "b") {
		return comma((fLare * parseFloat(object.bonusRate)/100).toFixed(rRate));
	} else if (t == "total") {
		var bonus = (fLare * parseFloat(object.bonusRate)/100)
		return comma((bonus + fLare).toFixed(rRate))
	} else if (t == "subtotal") {
		return comma((object.amount - (object.amount * fee)).toFixed(2))
	} else if (t == "fee") {
		return comma((object.amount * fee).toFixed(2))
	} else if (t == "totalA") {
		return comma(parseFloat(object.amount).toFixed(2))
	}
}


function convertToCoin(object) {
	var btcinDollar = object.btcinDollar;
	var pCurrency = object.pCurrency;
	var array = object.rates;

	if (pCurrency == "BTC") {
		return comma((btcinDollar * object.amount).toFixed(8));
	} else if (pCurrency == "USD") {

		if (object.amount == "") {
			return "0.00";
		} else {
			var amounts = parseFloat(object.amount).toFixed(2)
			return comma(amounts.toString());
		}
		


	} else {
		if (array != null) {
			var rate = startsWith(array,pCurrency)[0].split(':')[1];
			var amount = ((btcinDollar * object.amount) / rate).toFixed(8);
			return comma(amount)
		}
		
	}
}

function startsWith(array, key) {
  const matcher = new RegExp(`^${key}`, 'g');
  return array.filter(word => word.match(matcher));
}



var PlusSVG = <svg version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 42 42" width="16px" height="16px"><path d="M37.059,16H26V4.941C26,2.224,23.718,0,21,0s-5,2.224-5,4.941V16H4.941C2.224,16,0,18.282,0,21s2.224,5,4.941,5H16v11.059  C16,39.776,18.282,42,21,42s5-2.224,5-4.941V26h11.059C39.776,26,42,23.718,42,21S39.776,16,37.059,16z" fill="rgb(6, 103, 208)"></path></svg>;
var EqualSVG = <svg x="0px" y="0px" viewBox="0 0 42 42" fill="rgb(6, 103, 208)" width="16px" height="16px"><path d="M4.941,18H16h10h11.059C39.776,18,42,15.718,42,13s-2.224-5-4.941-5H26H16H4.941C2.224,8,0,10.282,0,13S2.224,18,4.941,18z" /><path d="M37.059,24H26H16H4.941C2.224,24,0,26.282,0,29s2.224,5,4.941,5H16h10h11.059C39.776,34,42,31.718,42,29S39.776,24,37.059,24z" /></svg>
var BankSVG = <svg x="0px" y="0px" width="16px" height="16px" viewBox="0 0 47.001 47.001" fill="rgb(6, 103, 208)"> <path d="M44.845,42.718H2.136C0.956,42.718,0,43.674,0,44.855c0,1.179,0.956,2.135,2.136,2.135h42.708 c1.18,0,2.136-0.956,2.136-2.135C46.979,43.674,46.023,42.718,44.845,42.718z" /> <path d="M4.805,37.165c-1.18,0-2.136,0.956-2.136,2.136s0.956,2.137,2.136,2.137h37.37c1.18,0,2.136-0.957,2.136-2.137 s-0.956-2.136-2.136-2.136h-0.533V17.945h0.533c0.591,0,1.067-0.478,1.067-1.067s-0.478-1.067-1.067-1.067H4.805 c-0.59,0-1.067,0.478-1.067,1.067s0.478,1.067,1.067,1.067h0.534v19.219H4.805z M37.37,17.945v19.219h-6.406V17.945H37.37z M26.692,17.945v19.219h-6.406V17.945H26.692z M9.609,17.945h6.406v19.219H9.609V17.945z" /> <path d="M2.136,13.891h42.708c0.007,0,0.015,0,0.021,0c1.181,0,2.136-0.956,2.136-2.136c0-0.938-0.604-1.733-1.443-2.021 l-21.19-9.535c-0.557-0.25-1.194-0.25-1.752,0L1.26,9.808c-0.919,0.414-1.424,1.412-1.212,2.396 C0.259,13.188,1.129,13.891,2.136,13.891z"></path></svg>
var walletSVG = <svg x="0px" y="0px" width="16px" height="16px" fill="rgb(6, 103, 208)" viewBox="0 0 890.5 890.5" ><path d="M208.1,180.56l355-96.9l-18.8-38c-12.3-24.7-42.3-34.9-67-22.6l-317.8,157.5H208.1z"></path><path d="M673.3,86.46c-4.399,0-8.8,0.6-13.2,1.8l-83.399,22.8L322,180.56h289.1h126l-15.6-57.2 C715.5,101.06,695.3,86.46,673.3,86.46z"></path> <path d="M789.2,215.56h-11.4h-15.5h-15.5H628.5H193.8h-57h-48h-8.9H50.1c-15.8,0-29.9,7.3-39.1,18.8c-4.2,5.3-7.4,11.4-9.2,18.1 c-1.1,4.2-1.8,8.6-1.8,13.1v6v57v494.1c0,27.601,22.4,50,50,50h739.1c27.601,0,50-22.399,50-50v-139.5H542.4 c-46.9,0-85-38.1-85-85v-45.8v-15.5v-15.5v-34.4c0-23,9.199-43.899,24.1-59.199c13.2-13.601,30.9-22.801,50.7-25.101 c3.3-0.399,6.7-0.6,10.1-0.6h255.2H813h15.5h10.6v-136.5C839.2,237.96,816.8,215.56,789.2,215.56z"></path> <path d="M874.2,449.86c-5-4.6-10.9-8.1-17.5-10.4c-5.101-1.699-10.5-2.699-16.2-2.699h-1.3h-1h-15.5h-55.9H542.4 c-27.601,0-50,22.399-50,50v24.899v15.5v15.5v55.4c0,27.6,22.399,50,50,50h296.8h1.3c5.7,0,11.1-1,16.2-2.7 c6.6-2.2,12.5-5.8,17.5-10.4c10-9.1,16.3-22.3,16.3-36.899v-111.3C890.5,472.16,884.2,458.959,874.2,449.86z M646.8,552.36 c0,13.8-11.2,25-25,25h-16.6c-13.8,0-25-11.2-25-25v-16.6c0-8,3.7-15.101,9.6-19.601c4.3-3.3,9.601-5.399,15.4-5.399h4.2H621.8 c13.8,0,25,11.199,25,25V552.36L646.8,552.36z"></path></svg>