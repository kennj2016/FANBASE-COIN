import React from 'react';
import ReactDOM from 'react-dom';
import {Link,NavLink} from 'react-router-dom';
import {MainHeader,Footer} from "./header";

import {TermsExtension,PrivacyExtension,AMLCFTSiteExtension,TokenSaleExtension,WhitePaperExtenstion} from "../../site/legal/terms.js";






export class TermDash extends React.Component {
    constructor(props){
        super(props);
        this.handleWatchVideo = this.handleWatchVideo.bind(this)
        this.state = {
            "videoShow":false
        }
    }
    handleWatchVideo(){
        this.setState({"videoShow": !this.state.videoShow});
    }  	
	componentDidMount(){
		document.title = "FNB - A Tuition Token";
		window.scrollTo(0,0);
	}
	render() {
		return (
			<div>
			<div className="page">
					<MainHeader />
					<TermsExtension type="dash" />
					<Footer />
				</div>
			</div>
		)
	}
}
export class PrivacyDash extends React.Component {
    componentDidMount(){
        document.title = "FNB - A Tuition Token";
        window.scrollTo(0,0);
    }
    constructor(props){
        super(props);
        this.handleWatchVideo = this.handleWatchVideo.bind(this)
        this.state = {
            "videoShow":false
        }
    }
    handleWatchVideo(){
        this.setState({"videoShow": !this.state.videoShow});
    }    
    
	render() {
		return (
			<div>
			<div className="page">
				<MainHeader />
				<PrivacyExtension type="dash" />
				<Footer />
			</div>
		</div>
		)
	}
}
export class AMLCFTDash extends React.Component {
    componentDidMount(){
        document.title = "FNB - A Tuition Token";
        window.scrollTo(0,0);
    }
    constructor(props){
        super(props);
        this.handleWatchVideo = this.handleWatchVideo.bind(this)
        this.state = {
            "videoShow":false
        }
    }
    handleWatchVideo(){
        this.setState({"videoShow": !this.state.videoShow});
    } 
	render() {
		return (
			<div>
			<div className="page">
				<MainHeader />
				<AMLCFTSiteExtension type="dash" />
				<Footer />
			</div>
		</div>
		)
	}
}


export class TokensalepolicyDash extends React.Component {
    componentDidMount(){
        document.title = "FNB - A Tuition Token";
        window.scrollTo(0,0);
    }
    constructor(props){
        super(props);
        this.handleWatchVideo = this.handleWatchVideo.bind(this)
        this.state = {
            "videoShow":false
        }
    }
    handleWatchVideo(){
        this.setState({"videoShow": !this.state.videoShow});
    } 
	render() {
		return (
			<div>
			<div className="page">
				<MainHeader />
				<TokenSaleExtension type="dash" />
				<Footer />
			</div>
		</div>
		)
	}
}

export class WhitePaperDash extends React.Component {
    componentDidMount(){
        document.title = "FNB - A Tuition Token";
        window.scrollTo(0,0);
    }
    constructor(props){
        super(props);
        this.handleWatchVideo = this.handleWatchVideo.bind(this)
        this.state = {
            "videoShow":false
        }
    }
    handleWatchVideo(){
        this.setState({"videoShow": !this.state.videoShow});
    } 
	render() {
		return (
			<div>
			<div className="page">
				<MainHeader />
				<WhitePaperExtenstion type="dash" />
				<Footer />
			</div>
		</div>
		)
	}
}






