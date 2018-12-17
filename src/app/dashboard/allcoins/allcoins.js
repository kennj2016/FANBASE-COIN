import React from "react"
import {MainHeader,Footer} from "../header";
import {NavLink,Link} from 'react-router-dom';
import './allcoins.css';
import Parse from 'parse';
import $ from "jquery";
import LogoColorImage from "../../../images/logoSW.png";



export class AllCoins extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"data":[],
			"loading":true
		}
	}
	componentDidMount() {
		window.scrollTo(0, 0)
		document.title = "Coins – FNB";
		var r = this;
		this.loadCoins();


		window.setInterval(function(){
			r.loadCoins();
		}, 10000);




	}
	loadCoins = (e) => {
		var r = this;
		Parse.Cloud.run('webCrawler', {
			 "url":"https://coinmarketcap.com/"
		}, {
		success: function(results) {
			var htmlDATA = document.createElement( 'html' ).innerHTML = results;
			var dataFound = $(htmlDATA).find('#currencies tr');
			r.setState({"data":[]});
			$.each( dataFound, function( key, o ) {
				if (key != 0) {
					var sorting = $(o).find('.sorting_1').html();
					var currencyImage = $(o).find('.currency-name img').attr('data-src');
					var currencyImage2 = $(o).find('.currency-name img').attr('src');
					var currencyName = $(o).find('.currency-name').attr("data-sort");
					var marketCap = $(o).find('.market-cap').text();
					var price = $(o).find('.no-wrap.text-right .price').text();
					var volume = $(o).find('.no-wrap.text-right .volume').text();
					var circulatingSupply = $(o).find('.circulating-supply a span:nth-of-type(1)').text();
					var circulatingSupply2 = $(o).find('.circulating-supply a span:nth-of-type(2)').text();
					var percentageCahnge = $(o).find('.percent-change').text();
					var fO = {
						"sorting":key,
						"currencyImage":currencyImage == undefined ? currencyImage2 : currencyImage,
						"currencyName":currencyName,
						"marketCap":marketCap,
						"price":price,
						"volume":volume,
						"circulatingSupply":circulatingSupply + " " +circulatingSupply2,
						"percentageCahnge":percentageCahnge
					}
					r.setState(previousState => ({
					    "data": [...previousState.data, fO]
					}));
					r.setState({"loading":false});
				}
			});
			
		}, error:function(err){
			alert(err.message)
		}});
	}
	render() {
		return (
			<div>
				<div className="page">
					<MainHeader />
					<div className="dashWrapperB">
						<div className="dashModal indexPagePortofilo" style={{"width":"100%"}}>
							<div className="content" style={{"height":"700px","overflow":"scroll"}}>
								<div className="cBody allCointsTable">
									<table>
										<thead>
											<tr>	
												<th>#</th>
												<th>Name</th>
												<th>Market Cap</th>
												<th>Price</th>
												<th>Volume (24h)</th>
												<th>Circulating Supply</th>
												<th>Change (24h)</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{
												this.state.data.map(function(o,i){
													return (
														<tr key={i}>
															<td style={{"color":"gray"}}>{o.sorting}</td>
															<td>
																<img src={o.currencyImage} />
																<span className="coinName">{o.currencyName}</span>
															</td>
															<td>${comma(parseFloat(o.marketCap))}</td>
															<td>{o.price}</td>
															<td>{o.volume}</td>
															<td>{o.circulatingSupply}</td>
															<td className={o.percentageCahnge[0] == "-" ? "errorCoins" : "successCoins"}>{o.percentageCahnge}</td>
															<td>
																<Link to="/exchange" style={{"marginTop":"0"}} className="buyNowBttn deposit">Buy</Link>
																<Link to="/exchange" style={{"marginTop":"0"}} className="buyNowBttn tradeBttn">Sell</Link>
															</td>
														</tr>
													)
												})
											}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

				</div>
				<Footer />
			</div>
		)
	}
}



class SubHeader extends React.Component {
	constructor(props){
		super(props);
	}
	render() {
		return (
			<div>
				<div className="allCoinsSubHeader">
					<ul>
						<NavLink to="/info" exact activeClassName="active"><li>Directory</li></NavLink>
						<NavLink to="/info/news" activeClassName="active"><li>News</li></NavLink>
						<NavLink to="/info/jobs" activeClassName="active"><li>Jobs</li></NavLink>
						<NavLink to="/info/travel" activeClassName="active"><li>Travel</li></NavLink>
						<NavLink to="/info/shopping" activeClassName="active"><li>Shopping</li></NavLink>
						<NavLink to="/info/games" activeClassName="active"><li>Games</li></NavLink>
						<NavLink to="/info/forum" activeClassName="active"><li>Forum</li></NavLink>
						<li className="pull-right inputContainSelectAll">
							<select>
								<option>USD</option>
							</select>
							<input placeholder="Search" type="text" />
							<i className="fa fa-search"></i>
						</li>
					</ul>
				</div>
				<div className="allCoinsSubHeader SubSubheaderWrap">
					<ul>
						<NavLink to="/info" exact activeClassName="active"><li className="active"><i className="fa fa-list"></i> Lists</li></NavLink>
						<NavLink to="/info/trending" activeClassName="active"><li>Trending</li></NavLink>
						<li className="pull-right inputContainSelectAll">
							<select>
								<option>50</option>
								<option>100</option>
								<option>150</option>
								<option>200</option>
								<option>250</option>
							</select>
							<i className="fa fa-search"></i>
						</li>

					</ul>
				</div>
			</div>
		)
	}
}






const comma = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}





