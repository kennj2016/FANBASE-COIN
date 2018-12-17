import React from 'react';
import ReactDOM from 'react-dom';
import "./legal.css";
import {Link,NavLink} from 'react-router-dom';
import {SiteHeader,EndWrapper,SiteFooter} from "../main";
import Whitepaper from "../../images/whitepaper.pdf";
import ReactGA from 'react-ga';
import TokeSalePolicy from "../token_sale_policy.pdf";
ReactGA.initialize('UA-115007597-1');

export class TermSite extends React.Component {
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
		document.title = "Fanbase";
		window.scrollTo(0,0);
		ReactGA.pageview(window.location.pathname + window.location.search);
	}
	render() {
		return (
			<div>
			<div className="page" style={{"paddingBottom":"0"}}>
				<SiteHeader />
					<TermsExtension />
					<EndWrapper />
					<SiteFooter handleClose={this.handleWatchVideo} active={this.state.videoShow} />
				</div>
			</div>
		)
	}
}











export class PrivacySite extends React.Component {
    componentDidMount(){
        document.title = "Fanbase";
        window.scrollTo(0,0);
        ReactGA.pageview(window.location.pathname + window.location.search);
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
				<SiteHeader />
				<PrivacyExtension />
				<EndWrapper />
				<SiteFooter handleClose={this.handleWatchVideo} active={this.state.videoShow} />
			</div>
		</div>
		)
	}
}
export class AMLCFTSite extends React.Component {
    componentDidMount(){
        document.title = "Fanbase";
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
			<div className="page" style={{"paddingBottom":"0"}}>
				<SiteHeader />
				<AMLCFTSiteExtension />
				<EndWrapper />
				<SiteFooter handleClose={this.handleWatchVideo} active={this.state.videoShow} />
			</div>
		</div>
		)
	}
}


export class TokensalepolicySite extends React.Component {
    componentDidMount(){
        document.title = "Fanbase";
        window.scrollTo(0,0);
        ReactGA.pageview(window.location.pathname + window.location.search);
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
			<div className="page" style={{"paddingBottom":"0"}}>
				<SiteHeader />
				<TokenSaleExtension />
				<EndWrapper />
				<SiteFooter handleClose={this.handleWatchVideo} active={this.state.videoShow} />
			</div>
		</div>
		)
	}
}


export class WhitePaperSite extends React.Component {
    componentDidMount(){
        document.title = "Fanbase";
        window.scrollTo(0,0);
        ReactGA.pageview(window.location.pathname + window.location.search);
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
			<div className="page" style={{"paddingBottom":"0"}}>
				<SiteHeader />
				<WhitePaperExtenstion />
				<EndWrapper />
				<SiteFooter handleClose={this.handleWatchVideo} active={this.state.videoShow} />
			</div>
		</div>
		)
	}
}




export class WhitePaperExtenstion extends React.Component {
	render(){
		return (
			<div className="pageContent">
				<div className="mainHeaderTerms">
					{
						this.props.type == "dash" ?
						<p style={{"paddingTop":"80px","paddingBottom":"80px"}} className="mainTitle">White Paper</p>
						:
					<p className="mainTitle">White Paper</p>
					}
				</div>
				<div className="">
					<iframe style={{"width":"100%","height":"800px","border":"0"}} src={Whitepaper}></iframe>
				</div>
			</div>
		)
	}
}




export class TokenSaleExtension extends React.Component {
	render(){
		return (
			<div className="pageContent">
				<div className="mainHeaderTerms">
					{
						this.props.type == "dash" ?
						<p style={{"paddingTop":"80px","paddingBottom":"80px"}} className="mainTitle">Token Sale Policy</p>
						:
					<p className="mainTitle">Learn about our beliefs</p>
					}
				</div>
				<div className="row2">
				<p className="firstTitle">We believe...</p>
				<p className="paraDescr">in a world where a small-time director with a beautiful script has
				as much access to capital as a director at a major production
				studio.</p>
				<p className="paraDescr">in a world where a talented animator can skip university and raise
				enough money to complete a feature film before the age of
				twenty-one.</p>
				<p className="paraDescr">in a world where an author in a third world country can fund the
				publishing of her first memoir which details political turmoil and
				newfound freedoms.</p>
				<p className="paraDescr">in a world where an independent musician with an incredible melody
				can pre-sell his intellectual property so that he can afford studio
				time.</p>
				<p className="paraDescr">in a world where a digital artist can create obscure content and
				assign a one-off license that need only appeal to an avid collector,
				not a mass audience, to have value.</p>
				<p className="paraDescr">in a world where a superfan can own a percentage of the copyright of
				his favorite film franchise and get paid royalties from that
				investment.</p>
				</div>
				<br />
				<br />



			{/* Tonys Cards for Team, Cards Start */}

				 <div className="row3"> 
				 <div class="row4">
				 <div class="column">
				   <div class="card">
				   <img src={require("../site/Ron.jpg")} />
				   <br />
				   <h5>Ron Mears</h5>
				   <p className="text-muted role">CEO & CTO</p>
				   <hr />
				   <p className="school">Columbia University</p> 
				   <a target="_blank" href="https://www.linkedin.com/in/ronaldmears/">
				   	 <i className="fa fa-linkedin"></i>
				   </a>				   
				   </div>
				 </div>

				 <div class="column">
				 <div class="card">
				 <img src={require("../site/tianzengliu.jpg")} />
				 <br />
				 <h5>Tianzeng Liu</h5>
				 <p className="text-muted role">Full Stack Developer</p>
				 <hr />
				 <p className="school">The George Washington University</p> 
				 <a target="_blank" href="https://www.linkedin.com/in/ronaldmears/">
				 	<i className="fa fa-linkedin"></i>
				 </a>				 
				 </div>
				 </div>

				 <div class="column">
				 <div class="card">
				 <img src={require("../site/eytan.jpg")} />
				 <br />
				 <h5>Eytan Shander</h5>
				 <p className="text-muted role">Director of Media & Branding</p>
				 <hr />
				 <p className="school">Broadcaster on 97.5 the Fanatic and Fox 29 News Philadelphia</p> 
				 <a target="_blank" href="https://www.linkedin.com/in/ronaldmears/">
				   	<i className="fa fa-linkedin"></i>
				 </a>				 
				 </div>
				 </div>

				 <div class="column">
				 <div class="card">
				 <img src={require("../site/harris.jpg")} />
				 <br />
				 <h5>Harris Levine</h5>
				 <p className="text-muted role">Blockchain Engineer</p>
				 <hr />
				 <p className="school">Self-taught developer of distributed ledger technologies</p> 
				 <a target="_blank" href="https://www.linkedin.com/in/ronaldmears/">
				   	<i className="fa fa-linkedin"></i>
				 </a>				 
				 </div>
				 </div>

			     </div>
				 </div>
                {/*  Cards End  */}
          
				<div className="row2">
				<p className="firstTitle">The fantasy is real...</p>
				<p className="paraDescr">Fanbase puts media ownership in the hands of the
				fans who adore it and the artists that create it. At Fanbase, we are
				building a platform that allows the dreamers to become the doers. We
				cut out the corporate middlemen so that creatives control their own
				projects, and fans choose which projects to greenlight.</p>
				</div>

				<div className="row2">
				<p className="firstTitle">Are you a dreamer and a doer?</p>
				<p className="paraDescr">Right now we have paid internships available for writers, video editors, and animators with a deep knowledge of 
				blockchain technology and cryptocurrency. We are also looking for React.js, Node.js, MySQL and Solidity developers.</p>
				{/*<li className="getStartedBttn mobileMenu" style={{"width":"120px","float":"none","backgroundColor":"#2567e5","color":"white !important"}}>Register</li>*/}
				<div style={{textAlign:"center"}}>
				<a href="mailto:info@fnbsx.com">
				            <button className="getStartedBttn">Let's talk</button>
						 </a>
						 </div>
						 <Link to="/register">Get Started</Link>
				</div>



				{/*<div className="">
					<iframe style={{"width":"100%","height":"800px","border":"0"}} src={TokeSalePolicy}></iframe>
				</div>*/}
			</div>
		)
	}
}


export class PrivacyExtension extends React.Component {
	render(){
		return (
			<div className="pageContent">
				<div className="mainHeaderTerms">
					
					{
						this.props.type == "dash" ?
						<p style={{"paddingTop":"80px","paddingBottom":"80px"}} className="mainTitle">Privacy Policy</p>
						:
						<p className="mainTitle">Privacy Policy</p>
					}
				</div>
				<div className="row2">
				<p className="firstTitle" style={{"text-align":"center"}}>Effective date: September 20, 2018</p>
				<p className="paraDescr">Fanbase Exchange Co. ("us", "we", or "our") operates the www.fnbsx.com website and the
				Fanbase mobile application (the "Service"). This page informs you of our policies regarding the						
				collection, use, and disclosure of personal data when you use our Service and the choices you						
				have associated with that data. We use your data to provide and improve the Service. By using		
				the Service, you agree to the collection and use of information in accordance with this policy.						
				Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same	
				meanings as in our Terms and Conditions.</p>
				
				
				<p className="paraTitle">Information Collection And Use</p>
				<p className="paraDescr">We collect several different types of information for various purposes to provide and improve
				our Service to you.
				</p>
				<p className="paraTitle">Types of Data Collected</p>
				<p className="paraDescr"><i>Personal Data</i></p>
				<p className="paraDescr">While using our Service, we may ask you to provide us with certain personally identifiable
				information that can be used to contact or identify you ("Personal Data"). Our				
				Know-Your-Customer (“KYC”), Know-Your-Business (“KYB”), and Anti-Money Laundering				
				(“AML”), services require that third party verifiers must have access to your Personal Data. All				
				KYC information is being submitted to Fanbase and verified through third party providers.				
				Personally identifiable information may include, but is not limited to:</p>
				<ul style={{"marginLeft": "30px","paddingBottom":"10px"}}>
					<li className="paraDescrli">Email address</li>
					<li className="paraDescrli">First name and last name</li>
					<li className="paraDescrli">Phone number</li>
					<li className="paraDescrli">Address, State, Province, ZIP/Postal code, City</li>
					<li className="paraDescrli">Cookies and Usage Data</li>
				</ul>
				<p className="paraDescr"><i>Usage Data</i></p>
				<p className="paraDescr">We may also collect information that your browser sends whenever you visit our Service or
				when you access the Service by or through a mobile device ("Usage Data"). This Usage Data				
				may include information such as your computer's Internet Protocol address (e.g. IP address),				
				browser type, browser version, the pages of our Service that you visit, the time and date of your				
				visit, the time spent on those pages, unique device identifiers and other diagnostic data. When				
				you access the Service by or through a mobile device, this Usage Data may include information				
				such as the type of mobile device you use, your mobile device unique ID, the IP address of your				
				mobile device, your mobile operating system, the type of mobile Internet browser you use,				
				unique device identifiers and other diagnostic data.</p>
                <p className="paraDescr"><i>Tracking & Cookies Data</i></p>
                <p className="paraDescr">We use cookies and similar tracking technologies to track the activity on our Service and hold
				certain information. Cookies are files with small amount of data which may include an				
				anonymous unique identifier. Cookies are sent to your browser from a website and stored on				
				your device. Tracking technologies also used are beacons, tags, and scripts to collect and track				
				information and to improve and analyze our Service.</p>
                <p className="paraDescr">You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
				However, if you do not accept cookies, you may not be able to use some portions of our Service.			
				Examples of Cookies we use:</p>
				<ul style={{"marginLeft": "30px","paddingBottom":"10px"}}>
					<li className="paraDescrli">Session Cookies. We use Session Cookies to operate our Service.</li>
					<li className="paraDescrli">Preference Cookies. We use Preference Cookies to remember your preferences and various settings.</li>
					<li className="paraDescrli">Security Cookies. We use Security Cookies for security purposes.</li>
				</ul>
				<p className="paraTitle">Use of Data</p>
				<p className="paraDescr">Fanbase Exchange Co. uses the collected data for various purposes:</p>
				<ul style={{"marginLeft": "30px","paddingBottom":"10px"}}>
					<li className="paraDescrli">To provide and maintain the Service</li>
					<li className="paraDescrli">To notify you about changes to our Service</li>
					<li className="paraDescrli">To allow you to participate in interactive features of our Service when you choose to do so</li>
					<li className="paraDescrli">To provide customer care and support</li>
					<li className="paraDescrli">To provide analysis or valuable information so that we can improve the Service</li>
					<li className="paraDescrli">To monitor the usage of the Service</li>
					<li className="paraDescrli">To detect, prevent and address technical issues</li>
				</ul>
				<p className="paraTitle">Transfer Of Data</p>
				<p className="paraDescr">Your information, including Personal Data, may be transferred to — and maintained on —
				computers located outside of your state, province, country or other governmental jurisdiction				
				where the data protection laws may differ than those from your jurisdiction. If you are located				
				outside United States and choose to provide information to us, please note that we transfer the				
				data, including Personal Data, to United States and process it there. Your consent to this Privacy				
				Policy followed by your submission of such information represents your agreement to that				
				transfer. Fanbase Exchange Co. will take all steps reasonably necessary to ensure that your data				
				is treated securely and in accordance with this Privacy Policy and no transfer of your Personal				
				Data will take place to an organization or a country unless there are adequate controls in place				
				including the security of your data and other personal information.</p>
				<p className="paraTitle">Disclosure Of Data</p>
				<p className="paraDescr"><i>Legal Requirements</i></p>



				<p className="paraDescr">Fanbase Exchange Co. may disclose your Personal Data in the good faith belief that such action
				is necessary to:</p>
				<ul style={{"marginLeft": "30px","paddingBottom":"10px"}}>
					<li className="paraDescrli">To comply with a legal obligation</li>
					<li className="paraDescrli">To protect and defend the rights or property of Fanbase Exchange Co.</li>
					<li className="paraDescrli">To prevent or investigate possible wrongdoing in connection with the Service</li>
					<li className="paraDescrli">To protect the personal safety of users of the Service or the public</li>
					<li className="paraDescrli"> To protect against legal liability</li>
				</ul>


				
				<p className="paraTitle">Security Of Data</p>
				<p className="paraDescr">The security of your data is important to us, but remember that no method of transmission over
				the Internet, or method of electronic storage is 100% secure. While we strive to use				
				commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute				
				security. Service Providers We may employ third party companies and individuals to facilitate				
				our Service ("Service Providers"), to provide the Service on our behalf, to perform				
				Service-related services or to assist us in analyzing how our Service is used. These third parties				
				have access to your Personal Data only to perform these tasks on our behalf and are obligated not				
				to disclose or use it for any other purpose. Analytics We may use third-party Service Providers to				
				monitor and analyze the use of our Service.</p>
				<p className="paraTitle">Google Analytics</p>
				<p className="paraDescr">Google Analytics is a web analytics service offered by Google that tracks and reports website
				traffic. Google uses the data collected to track and monitor the use of our Service. This data is				
				shared with other Google services. Google may use the collected data to contextualize and				
				personalize the ads of its own advertising network.
				</p>
                <p className="paraDescr">For more information on the privacy practices of Google, please visit the Google Privacy &
				Terms web page: https://policies.google.com/privacy?hl=en</p>
				<p className="paraTitle">Links To Other Sites</p>
				<p className="paraDescr">Our Service may contain links to other sites that are not operated by us. If you click on a third
				party link, you will be directed to that third party's site. We strongly advise you to review the				
				Privacy Policy of every site you visit. We have no control over and assume no responsibility for				
				the content, privacy policies or practices of any third party sites or services. Children's Privacy				
				Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly				
				collect personally identifiable information from anyone under the age of 18. If you are a parent				
				or guardian and you are aware that your Children has provided us with Personal Data, please				
				contact us. If we become aware that we have collected Personal Data from children without				
				verification of parental consent, we take steps to remove that information from our servers.
				</p>

				<p className="paraTitle">Changes To This Privacy Policy</p>
				<p className="paraDescr">We may update our Privacy Policy from time to time. We will notify you of any changes by
				posting the new Privacy Policy on this page.</p>
				<p className="paraDescr">We will let you know via email and/or a prominent notice on our Service, prior to the change
				becoming effective and update the "effective date" at the top of this Privacy Policy. You are				
				advised to review this Privacy Policy periodically for any changes. Changes to this Privacy				
				Policy are effective when they are posted on this page.
				</p>
				<p className="paraTitle">Contact Us</p>
				<p className="paraDescr">If you have any questions about this Privacy Policy, please contact us by email at info@fnbsx.com.</p>

				</div>
			</div>
		)
	}
}








export class AMLCFTSiteExtension extends React.Component {
	render(){
		return (
			<div className="pageContent">
				<div className="mainHeaderTerms">
					{
						this.props.type == "dash" ?
						<p style={{"paddingTop":"80px","paddingBottom":"80px"}} className="mainTitle">Anti-Money Laundering the Financing of Terrorism (AML/CFT) Policy</p>
						:
						<p className="mainTitle">Anti-Money Laundering the Financing of Terrorism (AML/CFT) Policy</p>
					}
				</div>
				<br /><br />
				<div className="row2">
					<p className="paraDescr">The FNB AML Policy is designed to prevent money laundering, including the need to have adequate systems and controls in place to mitigate the risk of the firm being used to facilitate financial crime. This AML Policy sets out the minimum standards which must be complied with and includes:</p>
					<ul style={{"margin-left": "30px"}}>
						<li className="paraDescrli">
							The appointment of a Money Laundering Reporting Officer (MLRO) who has sufficient level of seniority and independence and who has responsibility for oversight of compliance with relevant legislation, regulations, rules and industry guidance;
						</li><br />
						<li className="paraDescrli">
							Establishing and maintaining a Risk Based Approach (RBA) towards assessing and managing the money laundering and terrorist financing risks to the company;
						</li><br />
						<li className="paraDescrli">
								Establishing and maintaining risk based systems and procedures to monitor on-going customer activity;
						</li><br />
						<li className="paraDescrli">
								Procedures for reporting suspicious activity internally and to the relevant law enforcement authorities as appropriate;
						</li><br />
						<li className="paraDescrli">
								The maintenance of appropriate records for the minimum prescribed periods.
						</li><br />
						<li className="paraDescrli">
								Training and awareness for all relevant employees
						</li><br />
					</ul>
					<p className="paraTitle">Counter Financing of Terrorism (CFT)</p>
					<p className="paraDescr">The Company takes a risk-based approach when adopting and implementing counter financing of terrorism (CFT) measures and in conducting AML risk assessments.</p>
					<p className="paraDescr">The company adopted internal CFT controls and make undefended decisions regarding CFT matters supersedes any business, strategic or other operating task.</p>
					<p className="paraTitle">International Sanctions Policy (ISP)</p>
					<p className="paraDescr">Our company is prohibited from transacting with individuals, companies and countries that are on prescribed sanctions lists. </p>
					<p className="paraTitle">Know Your Customer Procedures (KYC)</p>
					<p className="paraDescr">Individuals can be identified by passport or other identification document and utility bills stating their current post address. Companies have to be identified by extracts from the Chamber of Commerce or by notary deed. Copies have to be made and archived in files securely. </p>
					<p className="paraTitle">Contacting Us</p>
					<p className="paraDescr">If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at: info@fnbsx.com</p>
				</div>
			</div>
		)
	}
}











export class TermsExtension extends React.Component {

	render(){
		return (
				<div className="pageContent">
					<div className="mainHeaderTerms">
					{
						this.props.type == "dash" ?
						<p style={{"paddingTop":"80px","paddingBottom":"80px"}} className="mainTitle">Terms of Use</p>
						:
						<p className="mainTitle">Website Terms and Conditions of Use</p>
					}
					</div>
					<div className="row2">
						<p className="firstTitle" style={{"text-align":"center"}}>Effective date: September 20, 2018</p>
						<p className="paraTitle">Terms</p>
						<p className="paraDescr">By using this Website, accessible from www.fnbsx.com, you are agreeing to be bound by these
						Website Terms and Conditions of Use and agree that you are responsible for the agreement with
						any applicable local laws. If you disagree with any of these terms, you are prohibited from
						accessing this site. The materials contained in this Website are protected by copyright and trade
						mark law</p>
						<p className="paraTitle">Use License</p>
						<p className="paraDescr">Permission is granted to temporarily download one copy of the materials on Fanbase Exchange
						Co.'s Website for personal, non-commercial transitory viewing only. This is the grant of a
						license, not a transfer of title, and under this license you may not:</p>
						{/*<p className="paraTitle">General Rules · Scope of Application</p>*/}
						<ul style={{"marginLeft": "30px","paddingBottom":"10px"}}>
							<li className="paraDescrli">modify or copy the materials</li>
							<li className="paraDescrli">use the materials for any commercial purpose or for any public display</li>
							<li className="paraDescrli">attempt to reverse engineer any software contained on Fanbase Exchange Co.'s Website
							</li>
							<li className="paraDescrli">remove any copyright or other proprietary notations from the materials</li>
							<li className="paraDescrli">transfer the materials to another person or "mirror" the materials on any other server</li>
						</ul>
						<p className="paraDescr">Fanbase Exchange Co. retains the right to terminate usage upon violations of any of these
						restrictions, or for any other reason deemed necessary. Upon termination, your viewing rights
						will also be terminated and you should destroy any printed, electronic, or downloaded materials.</p>
						<p className="paraTitle">Disclaimer</p>
						<p className="paraDescr">All the materials on Fanbase Exchange Co.’s website are provided "as is". Fanbase Exchange
						Co. makes no warranties, expressed or implied, as to the useability of this site or the accuracy of						
						statements made by its users. Therefore, this disclaimer negates all other warranties and						
						assurances. Furthermore, Fanbase Exchange Co. does not make any representations concerning						
						the accuracy or reliability of the materials on its Website, or the accuracy or reliability of any	
						materials otherwise related to this site, or any sites linked to this Website.</p>
						{/*<ul style={{"marginLeft": "30px","paddingBottom":"10px"}}>
							<li className="paraDescrli">
								<p style={{"paddingLeft": "0"}} className="paraTitle">Purchaser</p>
								An individual or a merchant who initiated in the Use of the larecoin website and or in the purchase procedure of LARE separately specified by LARE.
							</li><br />
							<li className="paraDescrli">
								<p style={{"paddingLeft": "0"}}  className="paraTitle">LARE Officials</p>
								Members of LARE and related persons.
							</li><br />
							<li className="paraDescrli">
								<p style={{"paddingLeft": "0"}}  className="paraTitle">LARE website</p>
								Website which domain is  or otherwise any other domain which is forwarded from https://larecoin.com, operated and managed by LARE (If the domain or content of LARE's website has changed, regardless as the reason of the change, the changed domain is also described as LARE website).
							</li><br />
				</ul>*/}
						<p className="paraTitle">Limitations</p>
						<p className="paraDescr">Neither Fanbase Exchange Co., nor its suppliers, will be held accountable for any damages that
						arise with the use or inability to use the materials on Fanbase Exchange Co.’s Website, even if						
						Fanbase Exchange Co. or an authorized representative of this Website has been notified, orally						
						or written, of the possibility of such damage. Some jurisdictions do not allow limitations on						
						implied warranties or limitations of liability for incidental damages, these limitations may not						
						apply to you.</p>
						<p className="paraTitle">Revisions and Errata</p>
						<p className="paraDescr">The materials appearing on Fanbase Exchange Co.’s Website may include technical,
						typographical, or photographical errors. Fanbase Exchange Co. does not promise that any of the						
						materials in this Website are accurate, complete, or current. Fanbase Exchange Co. may change						
						the materials contained on its Website at any time without notice. Fanbase Exchange Co. does		
						not make any commitment to update the materials.</p>
						<p className="paraTitle">Links</p>
						<p className="paraDescr">Fanbase Exchange Co. has not reviewed all of the sites linked to its Website and is not
						responsible for the contents of any such linked site. The presence of any link does not imply
						endorsement by Fanbase Exchange Co. of the site. The use of any linked website is at the user’s	
						own risk.</p>
						<p className="paraTitle">Modifications</p>
						<p className="paraDescr">Fanbase Exchange Co. may revise these Terms and Conditions of Use for its Website at any time
						without prior notice. By using this Website, you are agreeing to be bound by the current version
						of these Terms and Conditions of Use.</p>
						<p className="paraTitle">Governing Law</p>
						<p className="paraDescr">Any claim related to Fanbase Exchange Co.'s Website shall be governed by the laws of the
						United States without regard to its conflict of law provisions.</p>
						</div>
						</div>
			)
	}
}


