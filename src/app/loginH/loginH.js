import React from 'react';
import './loginH.css'
import {Link} from 'react-router-dom';
import LogoW from '../../images/F-logo-in-Blue.png';
import LogoColor from '../../images/logoColor.png';
import navButtonW from '../../images/navButtonW.png';
import $ from "jquery";

export class LoginHeader extends React.Component {
	constructor(props){
		super(props);
		this.handleMobileSlider = this.handleMobileSlider.bind(this);
		this.resize = this.resize.bind(this);
		this.state = {
			"mobileSlider":false

		}
	}
	resize(){
		if ($( window ).width() > 890) {
			this.setState({"mobileSlider": false});
		}
	}
	componentDidMount() {
	  window.addEventListener('resize', this.resize)
	}

	componentWillUnmount() {
	  window.removeEventListener('resize', this.resize)
	}

	handleMobileSlider(){
		this.setState({"mobileSlider": !this.state.mobileSlider});
	}
	render() {
		return (
			<div>
				<div className="lHeader desktopH">
					<ul>

						<li className="pull-left logo">
							<Link to="/"><img src={LogoW} style={{ height:"49px", width:"49px", marginTop:"-10px"}} /></Link>
						</li>
						<li><Link to="/">FANS</Link></li>
						<li><Link to="/tokensale">CREATORS</Link></li>
						<li><Link to="roadmap">COLLECTORS</Link></li>
						<li><Link to="roadmap">LEARNERS</Link></li>
{/*						<li><a href="https://www.larecoin.com/solutions.html">Solutions</a></li>
*/}						<li>
							<Link className="lareButton " to='/login'>LOGIN</Link>
							<Link className="lareButton blue" to='/register'>Register</Link>
						</li>
					</ul>
				</div>
				<div className="mobileBGCover" style={{"display":this.state.mobileSlider == true ? "block" : "none"}} onClick={this.handleMobileSlider}></div>
				<div className="lHeader mobileH">
					<ul>
						<li className="pull-left navButton" onClick={this.handleMobileSlider}>
							<img style={{"width":"24px"}} src={navButtonW} />
						</li>
						<li className="pull-left logo" style={{"paddingTop":"23px"}}>
							<Link to="/"><img src={LogoW} /></Link>
						</li>
						<li>
							<Link className="lareButton " to='/login'>LOGIN</Link>
							<Link className="lareButton blue" to='/register'>Register</Link>
						</li>
					</ul>
				</div>
				<div className="mobileSlider" style={{"left":this.state.mobileSlider == true ? "0" : "-300px"}}>
					<a className="closeButton" onClick={this.handleMobileSlider} ><i className="fa fa-close"></i></a>
					<div className="mobileFooter">
						<img src={LogoW} style={{ height:"49px", width:"49px", marginTop:"-10px"}} />
					</div>
					<hr style={{"width": "40px","marginTop": "-20px","border":"1px solid white","marginBottom": "40px"}} />
					<ul>
						<li><Link to="/">What is FNB?</Link></li>
						<li><Link to="/tokensale">Token Sale</Link></li>
						<li><Link to="roadmap">Roadmap</Link></li>
						<div style={{"textAlign":"center","paddingTop":"15px"}}>
							<Link to="/login" style={{"float":"none","width":"120px","display":"inline-block"}} className="pull-right loginBttnNav"><li style={{"backgroundColor":"transparent"}}>LOG IN</li></Link>
							<Link to="/register" style={{"display":"inline-block"}}><li className="getStartedBttn mobileMenu" style={{"width":"120px","float":"none","backgroundColor":"white"}}>Register</li></Link>
						</div>
					</ul>
					<hr style={{"width": "40px","marginTop": "40px","border":"1px solid white","marginBottom": "40px"}} />
				</div>
			</div>
		)
	}
}


