import React from 'react';
import ReactDOM from 'react-dom';
import "./roadmap.css";
import {Link,NavLink} from 'react-router-dom';
import {SiteHeader,EndWrapper,SiteFooter} from "../main";
import ReactGA from 'react-ga';
ReactGA.initialize('UA-115007597-1');

export class RoadmapSite extends React.Component {
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
        ReactGA.pageview(window.location.pathname + window.location.search);
    }
	render() {
		return (
			<div className="page" style={{"paddingBottom":"0"}}>
				<SiteHeader />
				<div className="pageContent">
<div className="timelineWrapper">
	<div className="rowWrappers rowthree" style={{"paddingTop":"100px","paddingBottom":"0px"}}>
	
		<p className="mainRowtitle">Stage 1<br /></p>
		<p className="roadStatus"><b>Status</b>: <span className="inprogress">In Progress</span></p>

	</div>	
 	<section className="steps steps-area blue">
        <div className="Fcontainer">
	            <ul id="stage1Road" className="timeline">
                <li className="timeline-box wow fadeInLeft">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">October, 2017</p>
                    <p className="timeline-details"> 
                    	<ul>
                    		<li>FNB Concept</li>
                    		<li>FNB Technical Design</li>
                    	</ul>
                    </p>
                </li>
                <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">November, 2017</p>
                    <p className="timeline-details"> 
                    	<ul>
                    		<li>Technical Specifications: Part 1</li>
                    	</ul>
                    </p>
                </li>
                <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">December, 2017</p>
                    <p className="timeline-details"> 
                    	<ul>
                    		<li>Initial Legal Structure</li>
							<li>Formation of Core Development Team</li>
                    	</ul>
                    </p>
                </li>
                <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">January, 2018</p>
                    <p className="timeline-details"> 
                    	<ul>
                    		<li>Whitepaper v1.0</li>
							<li>Smart Contract Creation</li>
							<li>Solidity Code Creation</li>
							<li>Token Sale Structure</li>
                    	</ul>
                    </p>
                </li>
                <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">February, 2018</p>
                    <p className="timeline-details"> 
                    	<ul>
    						<li>Internal Solidity Code Audit</li>
    						<li>Smart Contract Verified and Published</li>
    						<li>Initial Legal Writing : Phase 2</li>
    						<li>Initial Design and Programming</li>
    						<li>Testing & Debugging</li>
    						<li>Whitepaper V2.0</li>
    						<li>Video Introduction</li>
                    	</ul>
                    </p>
                </li>			
                <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">March, 2018</p>
                    <p className="timeline-details"> 
                    	<ul>
                    		<li>FNB: Pre-sale token sale Launch </li>
							<li>FNBX Beta Release in PHP</li>
							<li>FNBVia: Technical Specifications</li>
							<li>Press Releases and Advertising</li>
							<li>Online Marketing Campaign Launch</li>
                    	</ul>
                    </p>
                </li>	
                <li className="timeline-box wow fadeInLeft">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">April, 2018</p>
                    <p className="timeline-details"> 
                        <ul>
                            <li>Technical Specifications</li>
                            <li>FNBX Conversion in React</li>
                            <li>Use Case and Process Analysis</li>
                            <li>Testing and Debugging</li>
                            <li>Development Updates</li>
                        </ul>
                    </p>
                </li>

                <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">May, 2018</p>
                    <p className="timeline-details"> 
                        <ul>
                            <li>Incorporated in Nevada2</li>
                            <li>Technical Specifications: Part 3</li>
                            <li>General Whitepaper Update V3.0</li>
                            <li>Compliance and Legal Offering Documents</li>
                            <li>Secured Seed Accredited Investor for $100k</li>
                            <li>Formed an in house Legal Department</li>
                            <li>Formation of Advisory Board</li>
                            <li>FNBX Development Updates</li>
                            <li>Testing and Debugging FNBX V2.0 </li>
                            <li>Updated Legal Notices </li>
                            <li>Filed exemptions with SEC</li>
                            <li>Initial FNB Marketing Campaign Launch</li>
                            <li>Developer and Executive Portal Launch</li>
                            <li>New Solidity Code Smart Contract Update V2.0</li>
                            <li>New Smart Contract Verified and Published V2.0</li>
                            <li>FNBVia Announcement</li>
                        </ul>
                    </p>
                </li>


            </ul>
        </div>
</section>               
</div>
<div className="timelineWrapper">
	<div className="rowWrappers rowthree" style={{"paddingTop":"100px","paddingBottom":"0px"}}>
        <p className="mainRowtitle">Stage 2<br /></p>
        <p className="roadStatus"><b>Status</b>: <span className="inprogress">Not Started</span></p>
    </div>  
	
 	<section className="steps steps-area yellow">
        <div className="fcontainer">
            <ul id="stage1Road" className="timeline">

                <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">June, 2018</p>
                    <p className="timeline-details"> 
                    	<ul>
                            <li>Main Token Sale Launch</li>
                            <li>Bounties Program for FNB community</li>
                            <li>Continued FNB Marketing </li>
                            <li>Accelerated FNBVia Development</li>
                            <li>Workforce Expansion</li>
                            <li>Solidity Code Smart Contract Updates</li>
                    	</ul>
                    </p>
                </li>
				   <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">July, 2018</p>
                    <p className="timeline-details"> 
                    	<ul>
                            <li>FNBX Platform Updates V2.7</li>
                            <li>FNBR Technical Specifications</li>
                            <li>FNB Marketing Campaign</li>
                            <li>Workforce Expansion</li>
                            <li>Solidity Code Smart Contract Updates</li>
                    	</ul>
                    </p>
                </li>
				   <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">August, 2018</p>
                    <p className="timeline-details"> 
                    	<ul>
                            <li>FNBVia Beta Release V1.0</li>
                            <li>FNBR Accelerated Development</li>
                            <li>FNBR Testing and Debugging</li>
                            <li>FNBR Beta Release V1.0</li>
                            <li>iOS and Android Mobile : Technical Specifications</li>
                            <li>FNBBlocks Technical Specifications</li>
                            <li>FNB Marketing Campaign</li>
                            <li>Workforce Expansion</li>
                    	</ul>
                    </p>
                </li>
				   <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">September, 2018</p>
                    <p className="timeline-details"> 
                    	<ul>
                            <li>FNBX Platform Updates V3.0 with Integrated Marketplaces</li>
                            <li>FNBBlocks Technical Specifications : Part 2</li>
                            <li>iOS and Android Mobile App Development</li>
                            <li>FNB listed on Coin Directory (Coin Market Cap)</li>
                            <li>FNB Marketing Campaign</li>
                            <li>Workforce Expansion</li>
                            <li>Solidity Code Smart Contract Updates</li>
                    	</ul>
                    </p>
                </li>
				   <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">October, 2018</p>
                    <p className="timeline-details"> 
                    	<ul>
                            <li>FNBVia Beta Update V2.0</li>
                            <li>FNBVia Partners with 50 Universities</li>
                            <li>FNBR Update V2.0</li>
                            <li>Enhanced QA Debugging and Testing </li>
                            <li>FNB Marketing Campaign</li>
                    	</ul>
                    </p>
                </li>
				   <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">November, 2018</p>
                    <p className="timeline-details"> 
                    	<ul>
                            <li>FNBVia Beta Update V2.7</li>
                            <li>FNBBlocks Accelerated Development</li>
                            <li>FNBX Platform Updates V3.1</li>
                            <li>FNB Marketing Campaign</li>
                    	</ul>
                    </p>
                </li>
				   <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">December, 2018</p>
                    <p className="timeline-details"> 
                    	<ul>
                            <li>FNBBlocks TestNet Launch</li>
                            <li>Enhanced QA Debugging and Testing </li>
                            <li>FNB Marketing Campaign</li>
                    	</ul>
                    </p>
                </li>				
				
            	</ul>
        	</div>
	</section>               
</div>
<div className="timelineWrapper">
	<div className="rowWrappers rowthree" style={{"paddingTop":"100px","paddingBottom":"0px"}}>
        <p className="mainRowtitle">Stage 3<br /></p>
        <p className="roadStatus"><b>Status</b>: <span className="inprogress">Not Started</span></p>
		<p className="roadStatus" style={{"color":"gray","fontSize":"13px","letterSpacing":"1px"}}>Updates provided in 2019</p>
    </div>  
 	<section className="steps steps-area red">
        <div className="fcontainer">
            <ul id="stage1Road" className="timeline">
                <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">First Half, 2019</p>
                    <p className="timeline-details"> 
                    	<ul>
                            <li>Token Main Sale Complete</li>
                            <li>Listings on Exchanges</li>
                            <li>Platform Updates</li>
                            <li>Vesting Period Begins</li>
                    	</ul>
                    </p>
                </li>
                <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">Second Half, 2019</p>
                    <p className="timeline-details"> 
                    	<ul>
                            <li>FNBVia V3.0 Update</li>
                            <li>FNBX V3.3 Update</li>
                            <li>FNBR V2.7 Update</li>
                            <li>FNBBlocks MainNet Launch</li>
                            <li>Mobile App Updates</li>
                            <li>Vesting Period Ends</li>
                            <li>FNB Exchange Launch</li>
                    	</ul>
                    </p>
                </li>
               
            	</ul>
        	</div>
	</section>               
</div>

<div className="timelineWrapper">
	<div className="rowWrappers rowthree" style={{"paddingTop":"100px","paddingBottom":"0px"}}>
        <p className="mainRowtitle">Stage 4<br /></p>
        <p className="roadStatus"><b>Status</b>: <span className="inprogress">Not Started</span></p>
		<p className="roadStatus" style={{"color":"gray","fontSize":"13px","letterSpacing":"1px"}}>Updates provided in 2019</p>
    </div> 
 	<section className="steps steps-area green">
        <div className="fcontainer">
            <ul id="stage1Road" className="timeline">
                <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">First Half, 2020</p>
                    <p className="timeline-details"> 
                    	<ul>
                            <li>5,000,000+ in Student Global Network</li>
                            <li>10,000+ Business Network</li>
                    	</ul>
                    </p>
                </li>
                <li className="timeline-box wow">
                    <i className="token salen-layers"></i>
                    <p className="timeline-title">Second Half, 2020</p>
                    <p className="timeline-details"> 
                    	<ul>
                            <li>$10B+ in Scholarships</li>
                            <li>4,000+ Universities</li>
                            <li>1,000+ Programs</li>
                            <li>100+ Partnerships</li>
                    	</ul>
                    </p>
                </li>
            	</ul>
        	</div>
	</section>               
</div>


				<div className="timelineWrapper">
					<div className="rowWrappers rowthree" style={{"paddingTop":"100px","paddingBottom":"0px"}}>
				        <p className="mainRowtitle">Stage 5<br /></p>
				        <p className="roadStatus"><b>Status</b>: <span className="inprogress">Not Started</span></p>
						<p className="roadStatus" style={{"color":"gray","fontSize":"13px","letterSpacing":"1px"}}>Updates provided in 2019</p>
				    </div> 	
				 	<section className="steps steps-area green">
				        <div className="container">
				            <ul id="stage1Road" className="timeline">
				                <li className="timeline-box wow">
				                    <i className="token salen-layers"></i>
				                    <p className="timeline-title">First Half, 2021</p>
				                    <p className="timeline-details"> 
				                    	<ul>
				                    		<li>100,000,000+ in Student Global Network</li>
											<li>200,000+ Business Network</li>
				                    	</ul>
				                    </p>
				                </li>
				                <li className="timeline-box wow">
				                    <i className="token salen-layers"></i>
				                    <p className="timeline-title">Second Half, 2021</p>
				                    <p className="timeline-details"> 
				                    	<ul>
				                    		<li>$50B+ in Scholarships</li>
											<li>10,000+ Universities</li>
											<li>50,000+ Programs</li>
											<li>100+ Partnerships</li>
				                    	</ul>
				                    </p>
				                </li>
				            	</ul>
				        	</div>
					</section>               
				</div>

				</div>	
                <EndWrapper />
				<SiteFooter handleClose={this.handleWatchVideo} active={this.state.videoShow} />
			</div>
		)
	}
}
