import React from "react"
import './widgets.css';
import CloseButton from "../../images/closeBtn.png";
import {Link} from 'react-router-dom';
import LogoSW from "../../images/f-in-blue1.png";
import BitcoinLogo from "../../images/bitcoinLogo.png";
import EthereumLogo from "../../images/ethereumLogo.png";
import LitecoinLogo from "../../images/litecoin.png";
import RippleLogo from "../../images/ripple.png";
import NeoLogo from "../../images/neo.png";
import DashLogo from "../../images/dash.png";
import VergeLogo from "../../images/verge.png";
import ZcashLogo from "../../images/zcash.png";
import ZenCashLogo from "../../images/zencash.png";
import $ from 'jquery';
import Parse from "parse";
import {startUrl} from "../../index";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Countdown from 'react-cntdwn';


export class TokenSummary extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"milestone":"Presale",
			"tier":"Presale",
			"bonus":"100",
			"totaltobeIssued":"2000000000",
			"rate":"0.280425",
			"particapants":"",
			"issued":""
		}
	}
	componentDidMount() {
		var r = this


		var GameScore = Parse.Object.extend("_User");
		var query = new Parse.Query(GameScore);
		query.count({
		  success: function(results) {
			  var usersTotal = results;
		      var config = Parse.Object.extend("config");
		      var query2 = new Parse.Query(config);
		      query2.get("k7t0S4tWWZ", {
		        success: function(ob) {
		          var data = ob.get('totalLare');
		          r.setState({"particapants":usersTotal,"issued":parseFloat(data).toFixed(5)})
		        },
		        error: function(object, err) {
					if (err.code == 209) {
						Parse.User.logOut().then(() => {
						 	window.location.href = startUrl + "login";
						});
					} else {
						console.log(err)
					}
		        }
		      });
		  },
		  error: function(err) {
			if (err.code == 209) {
				Parse.User.logOut().then(() => {
				 	window.location.href = startUrl + "login";
				});
			} else {
				console.log(err)
			}
		  }
		});


	}
	render() {
		return (
			<div>
				<div className="tSWrap TokenSummaryWrapper">
					<div className="innerTS">
						<div className="upperTSDash">
							<ul>
								<li>
									<p className="title">Milestone</p>
									<p className="subtitle">{this.state.milestone}</p>
								</li>
								<li>
									<p className="title">Tier</p>
									<p className="subtitle">{this.state.tier}</p>
								</li>
								<li>
									<p className="title">Bonus</p>
									<p className="subtitle">{this.state.bonus}%</p>
								</li>
								<li className="pull-right tobeIssued">
									<p className="title">Total to be Issued</p>
									<p className="subtitle">{comma(this.state.totaltobeIssued)}</p>
								</li>
							</ul>
						</div>
						<div className="milestoneBarWrap">
							<div className="milestonebar">
								<div className="activeBar" style={{"width":calculateIP(this.state.issued,this.state.totaltobeIssued)}}>
									<span className="milestoneTitle" >{calculateIP(this.state.issued,this.state.totaltobeIssued)}</span>
								</div>
							</div>
						</div>
						<div className="upperTSDash lowerTSDash">
							<ul style={{"textAlign":"center"}}>
								<li className="pull-left">
									<p className="title">Rate</p>
									<p className="subtitle">${comma(this.state.rate)}/ FNB</p>
								</li>
								<li>
									<p className="title">Users</p>
									<p className="subtitle">{comma(this.state.particapants)}</p>
								</li>
								<li className="pull-right">
									<p className="title">Issued</p>
									<p className="subtitle">{comma(this.state.issued)}</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
export class OpenTransactionsTable extends React.Component {
	constructor(props){
		super(props);
		this.handleAddress = this.handleAddress.bind(this)
		this.handleCancel = this.handleCancel.bind(this);
		this.handleTransactionClick = this.handleTransactionClick.bind(this);
		this.state = {
			"results":[],
			"showAreYouSure":false,
			"objectIdDelete":"",
			"indexDelete":""
		}
	}
	componentDidMount() {
		var r = this;


		var userPointer = {
		  "__type": 'Pointer',
		  "className": '_User',
		  "objectId":  Parse.User.current().id
		}
		Parse.Cloud.run('getTransaction', {
			"status":"Open",
			"user":userPointer
		}, {
		success: function(results) {
        	const posts = results.map(function(postData) {
        		var object = {
        			"objectId":postData.id,
        			"createdAt":postData.createdAt.toString(),
        			"currencyFrom":postData.get('currencyFrom'),
        			"currencyTo":postData.get('currencyTo'),
        			"totalSend":postData.get('totalSend'),
        			"ExpireDate":postData.get('ExpireDate'),
        			"address":postData.get('address'),
        			"details":postData.get('Details')
        		}
        		r.setState({ "results":r.state.results.concat(object)})
        	},r);
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
	componentDidUpdate(e){
		var height = this.refs.OpenTransactionsTablea.offsetHeight;
		if (this.state.results.length > 2) {
			this.refs.OpenTransactionsTablea.style.height = parseFloat(height) + 40 + "px";
		}
	}
	handleAddress(e) {
	}
	handleCancel(e){
		var objectID = this.state.objectIdDelete;
		var i = this.state.indexDelete;
		var r = this;
		Parse.Cloud.run('cancelTransaction', {
			"objectId":objectID
		}, {
		success: function(results) {
			var results = [...r.state.results];
			results.splice(i, 1);
			r.setState({"results":results,"showAreYouSure":false});

			var height = r.refs.OpenTransactionsTablea.offsetHeight;
			if (r.state.results.length > 2) {
				r.refs.OpenTransactionsTablea.style.height = parseFloat(height) + 40 + "px";
			}
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
	handleTransactionClick(e){
		window.location.href = startUrl + "exchange/" + e.target.attributes.idA.value;
	}
	render() {
		return (
			<div>
				{
					this.state.showAreYouSure == true ?
						<div>
						<div className="areyousureModalBgCover"></div>
							<div className="areyousureModal">
								<p className="closeScreenI"><i className="fa fa-close"></i></p>
								<p className="areyoursureTitle">Are you sure?</p>
								<p className="areyoursureSubtitle">Once you <b>cancel this transaction</b>, it will <b>no longer</b> be active.</p>
								<a onClick={(e) => this.setState({"showAreYouSure":false})} className="nevermindBttn">Never Mind</a>
								<a onClick={this.handleCancel} className="nevermindBttn confirmBttn">Confirm</a>
							</div>
						</div>
					: ""
				}
				<div className="transTable OpenTransactionsTablea" ref="OpenTransactionsTablea">
					{ this.state.results.length != 0 ?
						<table>
							<thead>
								<tr>
									<th>Date</th>
									<th>Send Amount</th>
									<th>Currency</th>
									<th>Address</th>
									<th></th>
									<th>Status</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
						    	{
						          this.state.results.map(function(post,index) {
						            return (
										<tr key={index} ref={"OpenT" + index}>
											<td className="date">{formatDate(post.createdAt)} {formatTime(post.createdAt)}</td>
											<td>{post.totalSend}</td>
											<td>{post.currencyFrom}</td>
											<CopyToClipboard text={post.address}><td className="addressTD">{post.address}</td></CopyToClipboard>
											<td><CopyToClipboard text={post.address} addressKey={post.address}><span addressKey={post.address} className="tag green">Copy</span></CopyToClipboard></td>
											<td>{post.details}</td>
											<td className="transTableActions">
												<a onClick={(e) => this.setState({"objectIdDelete":post.objectId,"indexDelete":index,"showAreYouSure":true})} index={index} objectID={post.objectId} className="cancelBtn"><img index={index} objectID={post.objectId} src={CloseButton} /></a>
												<span style={{"color":"blue"}} idA={post.objectId} onClick={this.handleTransactionClick}>Details</span>
											</td>
										</tr>
									);
						          },this)
						      	}						
							</tbody>
						</table>
					: 
					<div>
						<div className="emptyTransactions">
							<p className="title" style={{"paddingBottom":"30px"}}>No Open Orders</p>
							<Link className="buyNowBttn" to="/exchange">Buy Coins</Link>
							<br /><br /><br /><br />
						</div>
					</div>	
				}
				</div>
				{
					this.state.results.length > 2 ?
					<div className="viewalltransactions">
						<a href="">View All</a>
					</div>
					: 
					""
				}
			</div>
		)
	}
}









export class PortfolioSummary extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"totalLare":"0",
			"exchangeRate":"0.56085",
			"rates":[],
			"zero":false,
			"btcinDollar":"0"
		}
	}
	componentDidMount() {
		var r = this;
		 $.getJSON('https://blockchain.info/tobtc?currency=USD&value=1', function(data) {
		  	r.setState({"btcinDollar":data});
		});
		Parse.Cloud.run('getRatesandtotalLare', {
			"id":Parse.User.current().id
		}, {
		success: function(results) {
			r.setState({"totalLare":results.totalLare});
			if (results.totalLare != "0") {
				var array = $.map(results.res, function(value, index) {
				    return [index+ ":" +value["rate_btc"]];
				});
				r.setState({"rates":array,"zero":false});
				createPie(".pieID.legend", ".pieID.pie");

			} else {
				r.setState({"zero":true});
				createPie(".pieID.legend", ".pieID.pie");
			}
		},error:function(err){
			if (err.code == 209) {
				Parse.User.logOut().then(() => {
				 	window.location.href = startUrl + "login";
				});
			} else {
				console.log(err)
			}
		}});
		function sliceSize(dataNum, dataTotal) {
		  return (dataNum / dataTotal) * 360;
		}
		function addSlice(sliceSize, pieElement, offset, sliceID, color) {
		  $(pieElement).append("<div class='slice "+sliceID+"'><span></span></div>");
		  var offset = offset - 1;
		  var sizeRotation = -179 + sliceSize;
		  $("."+sliceID).css({
		    "transform": "rotate("+offset+"deg) translate3d(0,0,0)"
		  });
		  $("."+sliceID+" span").css({
		    "transform"       : "rotate("+sizeRotation+"deg) translate3d(0,0,0)",
		    "background-color": color
		  });
		}
		function iterateSlices(sliceSize, pieElement, offset, dataCount, sliceCount, color) {
		  var sliceID = "s"+dataCount+"-"+sliceCount;
		  var maxSize = 179;
		  if(sliceSize<=maxSize) {
		    addSlice(sliceSize, pieElement, offset, sliceID, color);
		  } else {
		    addSlice(maxSize, pieElement, offset, sliceID, color);
		    iterateSlices(sliceSize-maxSize, pieElement, offset+maxSize, dataCount, sliceCount+1, color);
		  }
		}
		function createPie(dataElement, pieElement) {
		  var listData = [];
		  $(dataElement+" .dataPointH").each(function() {
		    listData.push(Number($(this).html()));
		  });
		  var listTotal = 0;
		  for(var i=0; i<listData.length; i++) {
		    listTotal += listData[i];
		  }
		  var offset = 0;
		  var color = [
		    "#4D8AFF", 
		    "orange", 
		    "rgb(111, 124, 186)", 
		    "rgb(141, 196, 81)", 
		    "rgb(181, 181, 181)", 
		    "rgb(6, 103, 208)"
		  ];
		  for(var i=0; i<listData.length; i++) {
		    var size = sliceSize(listData[i], listTotal);
		    iterateSlices(size, pieElement, offset, i, 0, color[i]);
		    $(dataElement+" li:nth-child("+(i+1)+") .circleL").css("background-color", color[i]);
		    offset += size;
		  }
		}
	}
	render() {
		return (
			<div className={this.props.type == "v" ? "pS" : "pShoriz"} style={{"position":"relative"}}>
				
			{ this.state.rates.length == 0 ?
				<div className="loadingScreenSummary">
					<div className="loading-spinner" style={{"border":"2px solid rgb(6, 103, 208)","borderRight":"transparent"}}></div>
				</div>
				:
				<div>
					<div className="protfoilioWrapper">
						<div className="portfolioSummaryWrap">
						    <div className="pieID pie"></div>
						    <p className="totalAmountPie">${comma(laretoAnother(this.state,"USD"))}
						    	<span style={{"display":"block","font-size":"10px","text-transform":"uppercase","color":"gray"}}>equiv. in USD</span>
						    </p>
						 </div>
					 </div>
				     <ul className="pieID legend">
					      <li>
					        <span className="circleL"><i className="fa fa-usd"></i></span>
					        <span className="dataPointH">0</span> 
					        <span className="dataPoint">0</span>
					        <p className="title">Total USD</p>
					      </li>
					     <li>
					        <span className="circleL"><img src={BitcoinLogo} /></span>
					        <span className="dataPointH">0</span> 
					        <span className="dataPoint">0</span>
					        <p className="title">Bitcoin</p>
					      </li>
					      <li>
					        <span className="circleL"><img className="ethereumLogo" src={EthereumLogo} /></span>
					        <span className="dataPointH">0</span> 
					        <span className="dataPoint">0</span>
					        <p className="title">Ethereum</p>
					      </li>
					      <li>
					        <span className="circleL"><img className="bitcoincash" src={BitcoinLogo} /></span>
					        <span className="dataPointH">0</span> 
					        <span className="dataPoint">0</span>
					        <p className="title">Bitcoin Cash</p>
					      </li>
					      <li>
					        <span className="circleL"><img style={{"width":"13px"}} src={LitecoinLogo} /></span>
					        <span className="dataPointH">0</span> 
					        <span className="dataPoint">0</span>
					        <p className="title">Litecoin</p>
					      </li>
						  <li>
							<span className="circleL"><img style={{"width":"8px"}} src={LogoSW} /></span>
							<span className="dataPointH">{this.state.totalLare}</span>
							<span className="dataPoint">{comma(this.state.totalLare)}</span>
							<p className="title">FNB</p>
						  </li>
				    </ul>
				    <br style={{"clear":"both"}} />
			    </div>
			  		}
			  	<br style={{"clear":"both"}} />
			</div>

		)

	}
}
/*

<li>
<span className="circleL"><i className="fa fa-usd"></i></span>
<span className="dataPointH">{this.state.totalLare == "0" ? "0" :laretoAnother(this.state,"USD")}</span> 
<span className="dataPoint">${comma(laretoAnother(this.state,"USD"))}</span>
<p className="title">Total USD</p>
</li>
<li>
<span className="circleL"><img src={BitcoinLogo} /></span>
<span className="dataPointH">{laretoAnother(this.state,"BTC")}</span> 
<span className="dataPoint">{comma(laretoAnother(this.state,"BTC"))}</span>
<p className="title">Bitcoin</p>
</li>
<li>
<span className="circleL"><img className="ethereumLogo" src={EthereumLogo} /></span>
<span className="dataPointH">{laretoAnother(this.state,"ETH")}</span> 
<span className="dataPoint">{comma(laretoAnother(this.state,"ETH"))}</span>
<p className="title">Ethereum</p>
</li>
<li>
<span className="circleL"><img className="bitcoincash" src={BitcoinLogo} /></span>
<span className="dataPointH">{laretoAnother(this.state,"BCH")}</span> 
<span className="dataPoint">{comma(laretoAnother(this.state,"BCH"))}</span>
<p className="title">Bitcoin Cash</p>
</li>
<li>
<span className="circleL"><img style={{"width":"13px"}} src={LitecoinLogo} /></span>
<span className="dataPointH">{laretoAnother(this.state,"LTC")}</span> 
<span className="dataPoint">{comma(laretoAnother(this.state,"LTC"))}</span>
<p className="title">Litecoin</p>
</li>
<li>
<span className="circleL"><img style={{"width":"8px"}} src={LogoSW} /></span>
<span className="dataPointH">{this.state.totalLare}</span>
<span className="dataPoint">{comma(this.state.totalLare)}</span>
<p className="title">Larecoin</p>
</li>
*/
export class PortfolioTable extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"totalLare":"0",
			"exchangeRate":"0.56085",
			"totalTimeLeft":""
		}
	}
	componentDidMount() {
		var r = this;
		Parse.Cloud.run('getTotalLare', {
			"id":Parse.User.current().id,
		}, {
		success: function(results) {
			r.setState({"totalLare":results});
		},error:function(err){
			if (err.code == 209) {
				Parse.User.logOut().then(() => {
				 	window.location.href = startUrl + "login";
				});
			} else {
				console.log(err)
			}
		}});
		var date1 = new Date();
		var date2 = new Date("01/04/2019");
		var timeDiff = Math.abs(date2.getTime() - date1.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
		r.setState({"totalTimeLeft":diffDays})
	}
	handleFinish(){

	}
	render() {
		return (
			<div>
				<div className="porfolioTable mywalletsWidget">
					<ul>
						<li>
							<div className="logoP larecoin"><img src={LogoSW} /></div>
							<div className="porfolioDetails">
								<span>FNB</span>
								<span>{this.state.totalLare} FNB = ${comma(laretoAnother(this.state,"USD"))}</span>
							</div>
							<div className="mobileWidthhundred">
								<span className="pull-right"><Link to="exchange"><span className="buyNowBttn deposit" coinsend="Larecoin" totalLareBalance={this.state.totalLare} >Deposit</span></Link></span>
								<span className="pull-right"><span className="buyNowBttn tradeBttn" type="withdraw" coinsend="Larecoin" totalLareBalance={this.state.totalLare} onClick={this.props.handleBoxChange}>Send</span></span>
								{/*<span className="pull-right"><Link className="buyNowBttn tradeBttn" to="/exchange">Trade</Link></span>*/}
							</div>
						</li>
						<li>
							<div className="logoP usd" style={{"background-color":"rgb(77, 138, 255)","color":"white"}}><i class="fa fa-usd"></i></div>
							<div className="porfolioDetails">
								<span>USD</span>
								<span>$0.00</span>
							</div>
							<div className="mobileHide">
								<span className="pull-right"><span className="buyNowBttn tradeBttn">Send</span></span>
								<span className="pull-right"><Link className="buyNowBttn deposit" to="/exchange">Deposit</Link></span>
							</div>
						</li>

						<li>
							<div className="logoP bitcoin"><img src={BitcoinLogo} /></div>
							<div className="porfolioDetails">
								<span>Bitcoin</span>
								<span>0.0000 BCH = $0.00</span>
							</div>
							<div className="mobileHide">
{/*								<span className="pull-right"><Link className="buyNowBttn tradeBttn" to="/exchange">Trade</Link></span>
*/}								<span className="pull-right"><span className="buyNowBttn tradeBttn">Send</span></span>
								<span className="pull-right"><Link className="buyNowBttn deposit" to="/exchange">Deposit</Link></span>
							</div>
						</li>

						<li>
							<div className="logoP ethereum"><img src={EthereumLogo} /></div>
							<div className="porfolioDetails">
								<span>Ethereum</span>
								<span>0.0000 ETH = $0.00</span>
							</div>
							<div className="mobileHide">
{/*								<span className="pull-right"><Link className="buyNowBttn tradeBttn" to="/exchange">Trade</Link></span>
*/}								<span className="pull-right"><span className="buyNowBttn tradeBttn">Send</span></span>
								<span className="pull-right"><Link className="buyNowBttn deposit" to="/exchange">Deposit</Link></span>
							</div>
						</li>
						<li>
							<div className="logoP bitcoincash"><img src={BitcoinLogo} /></div>
							<div className="porfolioDetails">
								<span>Bitcoin Cash</span>
								<span>0.0000 BTH = $0.00</span>
							</div>
							<div className="mobileHide">
{/*								<span className="pull-right"><Link className="buyNowBttn tradeBttn" to="/exchange">Trade</Link></span>
*/}								<span className="pull-right"><span className="buyNowBttn tradeBttn">Send</span></span>
								<span className="pull-right"><Link className="buyNowBttn deposit" to="/exchange">Deposit</Link></span>
							</div>
						</li>
						<li>
							<div className="logoP litecoin"><img src={LitecoinLogo} /></div>
							<div className="porfolioDetails">
								<span>Litecoin</span>
								<span>0.0000 LTC = $0.00</span>
							</div>
							<div className="mobileHide">
{/*								<span className="pull-right"><Link className="buyNowBttn tradeBttn" to="/exchange">Trade</Link></span>
*/}								<span className="pull-right"><span className="buyNowBttn tradeBttn">Send</span></span>
								<span className="pull-right"><Link className="buyNowBttn deposit" to="/exchange">Deposit</Link></span>
							</div>
						</li>
						<li>
							<div className="logoP ripple"><img src={RippleLogo} /></div>
							<div className="porfolioDetails">
								<span>Ripple</span>
								<span>0.0000 XRP = $0.00</span>
							</div>
							<div className="mobileHide">
{/*								<span className="pull-right"><Link className="buyNowBttn tradeBttn" to="/exchange">Trade</Link></span>
*/}								<span className="pull-right"><span className="buyNowBttn tradeBttn">Send</span></span>
								<span className="pull-right"><Link className="buyNowBttn deposit" to="/exchange">Deposit</Link></span>
							</div>
						</li>	
						<li>
							<div className="logoP neo"><img style={{"width":"18px"}} src={NeoLogo} /></div>
							<div className="porfolioDetails">
								<span>NEO</span>
								<span>0.0000 NEO = $0.00</span>
							</div>
							<div className="mobileHide">
{/*								<span className="pull-right"><Link className="buyNowBttn tradeBttn" to="/exchange">Trade</Link></span>
*/}								<span className="pull-right"><span className="buyNowBttn tradeBttn">Send</span></span>
								<span className="pull-right"><Link className="buyNowBttn deposit" to="/exchange">Deposit</Link></span>
							</div>
						</li>	
						<li>
							<div className="logoP dash"><img src={DashLogo} /></div>
							<div className="porfolioDetails">
								<span>DASH</span>
								<span>0.0000 DASH = $0.00</span>
							</div>
							<div className="mobileHide">
{/*								<span className="pull-right"><Link className="buyNowBttn tradeBttn" to="/exchange">Trade</Link></span>
*/}								<span className="pull-right"><span className="buyNowBttn tradeBttn">Send</span></span>
								<span className="pull-right"><Link className="buyNowBttn deposit" to="/exchange">Deposit</Link></span>
							</div>
						</li>	
{/*						<li>
							<div className="logoP verge"><img style={{"width":"17px"}} src={VergeLogo} /></div>
							<div className="porfolioDetails">
								<span>Verge</span>
								<span>0.0000 XVG = $0.00</span>
							</div>
							<div className="mobileHide">
								<span className="pull-right"><Link className="buyNowBttn tradeBttn" to="/exchange">Trade</Link></span>
							<span className="pull-right"><span className="buyNowBttn tradeBttn">Send</span></span>
								<span className="pull-right"><Link className="buyNowBttn deposit" to="/exchange">Deposit</Link></span>
							</div>
						</li>	
						<li>
							<div className="logoP zcash" style={{"paddingTop":"6px"}}><img src={ZcashLogo} /></div>
							<div className="porfolioDetails">
								<span>Zcash</span>
								<span>0.0000 XVG = $0.00</span>
							</div>
							<div className="mobileHide">
								<span className="pull-right"><Link className="buyNowBttn tradeBttn" to="/exchange">Trade</Link></span>
								<span className="pull-right"><span className="buyNowBttn tradeBttn">Send</span></span>
								<span className="pull-right"><Link className="buyNowBttn deposit" to="/exchange">Deposit</Link></span>
							</div>
						</li>*/}
					</ul>
					<div className="bgCoverDiv">
						<p className="title">All Wallets will be unlocked by January 4 2019.</p>
						<div className="timerCointdown">
							<iframe width="350" height="180" src="https://w2.countingdownto.com/2159201" frameborder="0"></iframe>
							<Link to="/exchange" className="overlayTimerCointDown"></Link>
						</div>
					</div>
				</div>
			</div>
		)
	}
}





export class AllTransactionsTable extends React.Component {
	constructor(props){
		super(props);
		this.handleTransactionClick = this.handleTransactionClick.bind(this);
		this.state = {
			"results":[],
			"open":[],
			"openActive":false
		}
	}
	componentWillReceiveProps(nextProps){
		if (nextProps.type == "Open") {
			this.setState({"openActive":true});
		} else {
			this.setState({"openActive":false});
		}
	}
	componentDidUpdate(e){
		var height = this.refs.OpenTransactionsTablea.offsetHeight;
		if (this.state.results.length > 2) {
			this.refs.OpenTransactionsTablea.style.height = parseFloat(height) + 40 + "px";
		}
	}
	componentDidMount() {
		var r = this;
		var userPointer = {
		  "__type": 'Pointer',
		  "className": '_User',
		  "objectId":  Parse.User.current().id
		}
		Parse.Cloud.run('getTransaction', {
			"status":"All",
			"user":userPointer
		}, {
		success: function(results) {
        	const posts = results.map(function(postData,index) {

        		if (postData.get('status') != "Open") {
	        		var object = {
	        			"type":postData.get('type'),
	        			"objectId":postData.id,
	        			"totalLare":postData.get('totalLare'),
	        			"createdAt":postData.createdAt.toString(),
	        			"status":postData.get('status'),
	        			"currencyFrom":postData.get('currencyFrom'),
	        			"address":postData.get('address'),
	        			"txn_id":postData.get('txn_id')
	        		}
	        		r.setState({ "results":r.state.results.concat(object)})
        		} else {

	        		var object = {
	        			"type":postData.get('type'),
	        			"objectId":postData.id,
	        			"totalLare":postData.get('totalLare'),
	        			"createdAt":postData.createdAt.toString(),
	        			"status":postData.get('status'),
	        			"currencyFrom":postData.get('currencyFrom'),
	        			"address":postData.get('address'),
	        			"txn_id":postData.get('txn_id')
	        		}
	        		r.setState({"open":r.state.open.concat(object)})
        		}
        	},r);
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
	handleTransactionClick(e){
		window.location.href = startUrl + "exchange/" + e.target.attributes.idA.value;
	}
	render() {
		return (
			<div>
				<div className="transTable allTransactions" ref="OpenTransactionsTablea">
					{ this.state.results.length != 0 ?
							this.state.openActive == false ?
							<table>
								<thead>
									<tr>
										<th>Date</th>
										<th>Type</th>
										<th className="currency">Currency</th>
										<th className="amount">Amount</th>
										<th className="amount">TxID</th>
										<th className="status">Status</th>
									</tr>
								</thead>
								<tbody>
									{
								          this.state.results.map(function(post,index) {
								            return (
												<tr key={index}>
													<td className="date">{formatDate(post.createdAt)} {formatTime(post.createdAt)}</td>
													{post.type == "Deposit" ? <td className="typeTransaction Deposit">Deposit</td> : <td className="typeTransaction Withdraw">Withdraw</td>}
													<td className="currency">{post.currencyFrom}</td>
													<td className="amount">{post.totalLare} {post.currencyFrom}</td>
													<td className="amount">{post.txn_id}</td>
													{
														post.status == "Open" ?
														<td onClick={this.handleTransactionClick} idA={post.objectId} className="openTrans">Open <i idA={post.objectId} className="fa fa-ellipsis-h"></i></td>
														: post.status == "Complete" ?
														<td onClick={this.handleTransactionClick} idA={post.objectId} className="completeTrans">Complete <i idA={post.objectId} className="fa fa-check"></i></td>
														: post.status == "Error"?
														<td idA={post.objectId} className="errorTrans">Error <i idA={post.objectId} className="fa fa-info-circle"></i></td>
														: post.status == "Pending" ?
														<td onClick={this.handleTransactionClick} idA={post.objectId} className="openTrans">Pending <i idA={post.objectId} className="fa fa-ellipsis-h"></i></td>
														: post.status == "Canceled" ?
															<td idA={post.objectId} className="errorTrans">Canceled <i idA={post.objectId} className="fa fa-check"></i></td>
														: ""
													}
												</tr>
											);
								          },this)
								      	}
								</tbody>
							</table>
							: 
							<OpenTransactionsTable />
					: 
					<div>
						<div className="emptyTransactions" style={{"paddingBottom":"5s0px"}}>
							<p className="title">No Transaction History</p>
							
						</div>
					</div>	
				}
				</div>
				{
					this.state.results.length > 2 ? 
					<div className="viewalltransactions">
						<a href="">View All</a>
					</div>
					: ""
				}
			</div>
		)
	}
}







export class Timer2 extends React.Component {
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
    let timeLeftVar = this.secondsToTime(parseFloat(this.state.seconds));





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
        <p style={{"top":"80px"}}><b>{this.state.time.h}</b> {this.state.time.h == 1 ? "hour" : "hours"} <b>{this.state.time.m}</b> minutes <b>{this.state.time.s}</b> seconds</p>
    );
  }
}



function amountRounding(amount) {
	return comma(parseFloat(amount).toFixed(2))
}
function startsWith(array, key) {
  const matcher = new RegExp(`^${key}`, 'g');
  return array.filter(word => word.match(matcher));
}

function laretoAnother(object,t) {
	if (object.totalLare == "0") {
		return "0.00"
	} else {
	var a = parseFloat(object.totalLare);
	var exchangeRate = parseFloat(object.exchangeRate);
	var totalPerDollar = Math.abs(1 / parseFloat(object.exchangeRate));

	var amount = "";
	if (t == "USD") {
		amount = (object.totalLare * exchangeRate).toFixed(2);
	} else if (t == "BTC") {
		var dollar = (object.totalLare * exchangeRate);
		amount = (object.btcinDollar * dollar).toFixed(8);
	} else {
		var dollar = (object.totalLare * exchangeRate);
		var btc = (object.btcinDollar * dollar);

		if (object.rates.length != 0) {

			var rate = startsWith(object.rates,t)[0].split(':')[1];
			amount = ((btc) / rate).toFixed(5);
		}
	}
	return amount;
	}
}

class Timer extends React.Component {
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
    
    // Check if we're at zero.
    if (seconds == 0) { 
      clearInterval(this.timer);
    }
  }

  render() {
    return(
      <div>
        {this.state.time.m}min {this.state.time.s}sec
      </div>
    );
  }
}
function formatTime(dates) {
	var date = new Date(dates);
	var options = {
	  hour: 'numeric',
	  minute: 'numeric',
	  hour12: true
	};
	var timeString = date.toLocaleString('en-US', options);


	return timeString;
}


function formatDate(dates) {
	var date = new Date(dates);
	var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	return mS[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
}


function secondsTimer(expireDate) {

	var t1 = new Date();
	var t2 = new Date(expireDate);
	var dif = t1.getTime() - t2.getTime();
	var Seconds_from_T1_to_T2 = dif / 1000;
	var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);



	//alert(Seconds_Between_Dates)
	return <Timer seconds={Seconds_Between_Dates} />
}









function calculateIP(x,y) {
	var cal = parseFloat(x) / parseFloat(y);
	return Math.ceil(cal * 100) + "%";
}
export function comma(n) {
    var parts=n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}
var arrowRight = <svg version="1.1" id="Capa_1"x="0px" y="0px"
	 width="10px" height="10px" viewBox="0 0 306 306">
	<g>
		<g id="chevron-right">
			<polygon points="94.35,0 58.65,35.7 175.95,153 58.65,270.3 94.35,306 247.35,153"/>
		</g>
	</g>
</svg>;