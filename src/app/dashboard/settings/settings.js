import React from "react"
import {MainHeader,Footer} from "../header";
import {NavLink,Link} from 'react-router-dom';
import "./settings.css";
import Parse from "parse";
import $ from "jquery";
import {startUrl} from "../../../index.js";
import {as3url} from "../header.js";
import UploadImage from "../../../images/upload-button.png";
import pendingVerification from "../../../images/pendingVerification.png";
import completeVerify from "../../../images/completeVerify.png";
import Timezone from "./timezone.json";
import SignatureCanvas from 'react-signature-canvas'
import ReactGA from 'react-ga';
import {setRegions,set_city_state} from './city_state.js';
import {ModalWrapper} from "../modal.js";
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/libphonenumber.js';
import 'react-intl-tel-input/dist/main.css';
ReactGA.initialize('UA-115007597-1');



export class Profile extends React.Component {
	constructor(props){
		super(props);
		this.handleFullPageSave = this.handleFullPageSave.bind(this);
		this.handleImageUpload = this.handleImageUpload.bind(this);
		this.uploadImage = this.uploadImage.bind(this);
		this.handleChangePassword = this.handleChangePassword.bind(this);
		this.handleResetP = this.handleResetP.bind(this);
		this.state = {
			"src":"",
			"username":"",
			"email":"",
			"fname":"",
			"lname":"",
			"monthDate":"default",
			"dayDate":"default",
			"yearDate":"default",
			"streetAddress":"",
			"streetAddress2":"",
			"city":"",
			"state":"",
			"postalcode":"",
			"country":"",
			"changePasswordReset":false,
			"verifiedUser":false,
			"accredtionType":true,
			"countryA":"",
			"accreditedStatus":"Not Completed",
			"file2":false,
			"stepNumber":"1",
			"approvalAccredit":false,
			"approvalAccredit2":false,
			"accountVerified":false,
			"uploadAccreditionBttn":false
		}
	}
	componentDidMount(){
		ReactGA.pageview(window.location.pathname + window.location.search);
		var currentUser = Parse.User.current();
		if (currentUser) {
			var r = this;
			setRegions();
			this.setState({"email":currentUser.get('email'),"username":currentUser.get('username')})
			var r = this;
			var Users = Parse.Object.extend("_User");
			var query = new Parse.Query(Users);
			query.get(Parse.User.current().id, {
			success: function(results) {
				r.setState({
					"country":results.get('country'),
					"state":results.get('state') == "" || results.get('state') == undefined ? "" : results.get('state'),
					"fname":results.get('fname'),
					"lname":results.get('lname'),
					"src":typeof(results.get('src')) == "object" ? as3url + results.get('src').name() : "",
					"monthDate":results.get('monthDate') == undefined ? "default" : results.get('monthDate'),
					"dayDate":results.get('dayDate') == undefined ? "default" : results.get('dayDate'),
					"yearDate":results.get('yearDate') == undefined ? "default" : results.get('yearDate'),
					"streetAddress":results.get('streetAddress') == undefined ? "" : results.get('streetAddress'),
					"streetAddress2":results.get('streetAddress2') == undefined ? "" : results.get('streetAddress2'),
					"city":results.get('city') == undefined ? "" : results.get('city'),
					"postalcode":results.get('postalcode') == undefined ? "" : results.get('postalcode'),
					"verifiedUser":results.get('accountVerifiedStatus') == undefined ? "Not Completed" : results.get('accountVerifiedStatus'),
					"accreditedStatus":results.get('accreditedStatus') == undefined ? "Not Completed" : results.get('accreditedStatus'),
					"accountVerified":results.get('accountVerified') == undefined ? false : results.get('accountVerified')
				});
				setTimeout(function(){
					//if (results.get('state') != "") {
						r.handleCountryChange();
						$('#showStateInput').val(r.state.state)
					
				},0)
			}, error:function(err) {
				if (err.code == 209) {
					Parse.User.logOut().then(() => {
					 	window.location.href = startUrl + "login";
					});
				} else {
					alert(err.message)
				}
			}});	
		$.get("https://ipinfo.io", function(response) {
		 	r.setState({"countryA":response.country})
		}, "jsonp");

	} else {
		window.location.href = startUrl + "login/";
	}
	window.scrollTo(0, 0)
	document.title = "Profile – FNB";
	}
	handleFile2 = () => {
		$("#fileInput2").click();
	}
	handleFile2Change = () => {
		var files = document.getElementById('fileInput2').files;
		var wrap = document.getElementById('fileInput2Wrap');
		if (files.length > 0) {
			if (files[0].type == "image/png" || files[0].type == "image/jpeg" || files[0].type == "image/jpg" || files[0].type == "application/pdf") {
				if (files[0].size < 5e+6) {
					$(wrap).css('backgroundColor',"rgba(20, 191, 6, 0.1)");
					$(wrap).find('.titles').html('1 file selected');
					$(wrap).find('.titles').css('color','black');
					this.setState({"file2":true});		
				} else {
					$(wrap).css('backgroundColor',"rgba(255, 0, 0,0.05)");
					$(wrap).find('.titles').html('File size must be less than 5 mb.');
					$(wrap).find('.titles').css('color','red');	
					this.setState({"file2":false});		
				}
			} else {
				$(wrap).css('backgroundColor',"rgba(255, 0, 0,0.05)");
				$(wrap).find('.titles').html('Invalid File Format');
				$(wrap).find('.titles').css('color','red');
				this.setState({"file2":false});
			}
		}		
	}
	handleFullPageSave(){
		var r = this;
		var ref = this.refs;
		var errorColor = "rgba(255,0,0,0.05)";
		var successColor = "#f3f3f3";

		if (this.state.fname == "") {
			$(ref.fnameRef).css('backgroundColor',errorColor);
		} else if (this.state.lname == "") {
			$(ref.fnameRef).css('backgroundColor',successColor);
			$(ref.lnameRef).css('backgroundColor',errorColor);
		} else if (this.state.streetAddress == "") {
			$(ref.fnameRef).css('backgroundColor',successColor);
			$(ref.lnameRef).css('backgroundColor',successColor);
			$(ref.monthBRef).css('backgroundColor',successColor);
			$(ref.dayDateRef).css('backgroundColor',successColor);
			$(ref.yearDateRef).css('backgroundColor',successColor);
			$(ref.streetAddressRef).css('backgroundColor',errorColor);
		} else if (this.state.city == "") {
			$(ref.fnameRef).css('backgroundColor',successColor);
			$(ref.lnameRef).css('backgroundColor',successColor);
			$(ref.monthBRef).css('backgroundColor',successColor);
			$(ref.dayDateRef).css('backgroundColor',successColor);
			$(ref.yearDateRef).css('backgroundColor',successColor);
			$(ref.streetAddressRef).css('backgroundColor',successColor);
			$(ref.cityRef).css('backgroundColor',errorColor);
		} else if (this.state.state == "") {
			$(ref.fnameRef).css('backgroundColor',successColor);
			$(ref.lnameRef).css('backgroundColor',successColor);
			$(ref.monthBRef).css('backgroundColor',successColor);
			$(ref.dayDateRef).css('backgroundColor',successColor);
			$(ref.yearDateRef).css('backgroundColor',successColor);
			$(ref.streetAddressRef).css('backgroundColor',successColor);
			$(ref.stateRef).css('backgroundColor',errorColor);
		} else if (this.state.postalcode == "") {
			$(ref.fnameRef).css('backgroundColor',successColor);
			$(ref.lnameRef).css('backgroundColor',successColor);
			$(ref.monthBRef).css('backgroundColor',successColor);
			$(ref.dayDateRef).css('backgroundColor',successColor);
			$(ref.yearDateRef).css('backgroundColor',successColor);
			$(ref.streetAddressRef).css('backgroundColor',successColor);
			$(ref.stateRef).css('backgroundColor',successColor);
			$(ref.cityRef).css('backgroundColor',successColor);
			$(ref.postalcodeRef).css('backgroundColor',errorColor);
		} else {
			$(ref.fnameRef).css('backgroundColor',successColor);
			$(ref.lnameRef).css('backgroundColor',successColor);
			$(ref.monthBRef).css('backgroundColor',successColor);
			$(ref.dayDateRef).css('backgroundColor',successColor);
			$(ref.yearDateRef).css('backgroundColor',successColor);
			$(ref.streetAddressRef).css('backgroundColor',successColor);
			$(ref.stateRef).css('backgroundColor',successColor);
			$(ref.cityRef).css('backgroundColor',successColor);
			$(ref.postalcodeRef).css('backgroundColor',successColor);	
			
		    var User = Parse.Object.extend("_User");
		    var query = new Parse.Query(User);
		    query.equalTo("objectId",Parse.User.current().id);
		    query.first({
		      success: function(data) {
		        data.set('fname',r.state.fname)
		        data.set('lname',r.state.lname)
		        data.set('monthDate',r.state.monthDate)
		        data.set('dayDate',r.state.dayDate)
		        data.set('yearDate',r.state.yearDate)
		        data.set('streetAddress',r.state.streetAddress)
		        data.set('streetAddress2',r.state.streetAddress2)
		        data.set('city',r.state.city);
		        data.set('state',r.state.state);
		        data.set('postalcode',r.state.postalcode);
		        data.save();
		        window.location.reload();
		      },
		      error: function(error) {
		      	alert(error.message)
		      }
		    });
		}
	}
	handleImageUpload(e){
		$(this.refs.fileImageUpload).click();
	}
	uploadImage(e) {
		var fileUploadControl = e.target;
		if (fileUploadControl.files.length > 0) {
		  var file = fileUploadControl.files[0];
		  if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg") {
			  	var name = this.state.fname + "-" + this.state.lname+ "profileImage" + file.type.split('/').pop();
				var parseFile = new Parse.File(name, file);
				parseFile.save().then(function(object) {
				var GameScore = Parse.Object.extend("_User");
				var query = new Parse.Query(GameScore);
				query.equalTo("objectId", Parse.User.current().id);
				query.first({
				  success: function(data) {
						data.set("src", parseFile);
						data.save(null, {
						  success: function(gameScore) {
							window.location.reload();
						  }, error:function(err){
						  	alert(JSON.stringify(err))
						  }
						});
				  },
				  error: function(error) {
				    alert("Error: " + error.code + " " + error.message);
				  }
				});
				}, function(error) {
				 alert(JSON.stringify(error))
				});

		  } else {
		  	this.refs.changePictureTab.innerHTML = "Invalid File Format."
		  	this.refs.changePictureTab.style.color = "red";
		  }
		}
	}
	handleChangePassword(){
		this.setState({"changePasswordReset":!this.state.changePasswordReset});
	}
	handleResetP(){
		Parse.User.requestPasswordReset(this.state.email, {
		  success: function() {
			Parse.User.logOut().then(() => {
				window.location.href = startUrl + "login/";
			});
		  },
		  error: function(error) {
		    alert(error.message);
		  }
		});
	}
	handleAccred = (e) => {
		var r = this;
		var signature = this.refs.signatureCanvas;
		if (this.state.file2 == false) {
			$("#fileInput2Wrap").css('backgroundColor',"rgba(255, 0, 0,0.05)");
			$("#fileInput2Wrap").find('.titles').html('File size must be less than 5 mb.');
			$("#fileInput2Wrap").find('.titles').css('color','red');				
		} else if (signature.isEmpty()) {
			$('.sigCanvas').css('border-color','red');
		} else if (this.state.approvalAccredit == false) {
			$('.requiredCheckbox').css('color','red');
		} else {
			$('.sigCanvas').css('border-color','green');
			$('.requiredCheckbox').css('color','black');
			var data = signature.toDataURL({
			   format: 'jpeg',
			   quality: 1
			});
			r.setState({"uploadAccreditionBttn":true});
			var file2 = this.refs.fileInput2.files[0];
			var parseFile1 = new Parse.File("signature.jpg",{ base64: data } );parseFile1.save();
			var parseFile2 = new Parse.File(file2.name,  file2);parseFile2.save();
			var Verification = Parse.Object.extend("Verification");
			var verify = new Verification();
			verify.set("documentType1","Proof of Accreditation");
			verify.set("documentNumber","");
			verify.set("issuingCountry","");
			verify.set("complete",false);
			verify.set("documentType2","Signature");
			verify.set("file1", parseFile1);
			verify.set("file2", parseFile2);
			verify.set('type','Accreditation');
			verify.set('Name',r.state.fname + " " + r.state.lname);
			verify.set('Address',r.state.streetAddress + " " + r.state.state + " " + r.state.postalcode + " " + r.state.country);
			verify.set('user',{
			  "__type": 'Pointer',
			  "className": '_User',
			  "objectId":  Parse.User.current().id
			});
			verify.save(null, {
			  success: function(gameScore) {
				var GameScore = Parse.Object.extend("_User");
				var query = new Parse.Query(GameScore);
				query.equalTo("objectId",Parse.User.current().id);
				query.first({
				  success: function(data) {
						data.set("accreditedStatus", "Validate Required");
						data.save(null, {
						  success: function(gameScore) {
							r.setState({"accreditedStatus":"Validate Required"});
						  }, error:function(err) {
						  	alert(err)
						  }
						});
				  },
				  error: function(error) {
				   alert(error)
				  }
				});
			  },
			  error: function(gameScore, error) {
			  	alert(error.message);
			  }
			});
		}
	}
	handleSigErasor = (e) => {
		this.refs.signatureCanvas.clear();
	}
	handleCountryChange = (e) => {
		//this.setState({ "country": e.target.value })
		set_city_state(this.refs.countries,this.refs.state)
	}
	render(){
		return (
			<div>
				<div className="page settingsPage" >
					<MainHeader />
					<div className="dashWrapperB">
						<div className="dashModal seperator" style={{"width":"10%"}}></div>						
						<div className="dashModal contentPage" style={{"width":"80%"}}>
							<div className="content " style={{"height":"auto"}}>
								<SettingsHeader />
								<div className="settingsWrapper">
									<div className="billingDetailsWrap">
									<div className="navigationTop">
										<span>1</span>
									</div>
									<p className="title">Billing Details <span className="subtitle">You must verify your identity to make payments in USD.</span>
									<span className="pull-right steps23c">Step 1 of 3</span>
									</p>
									<div className="personalDetails ">
										<div className="leftSide">
											<div className="inputGroups">
												<p className="">
													<span>Your personal information is never shown to other users.</span>
												</p>
											</div>
										</div>
										<div className="rightSide">
											<div className="inputGroups">
												<p style={{"marginLeft": "3px","marginBottom": "5px"}}>
													<span style={{"fontWeight": "400"}}>Legal Name <span className="requiredField">* Required</span></span>
												</p>
												<p className="input50">
													<input ref="fnameRef" style={{"width": "48%"}} type="text" placeholder="First Name" onChange={(e) => this.setState({ "fname": e.target.value })} value={this.state.fname} />
													<input ref="lnameRef" style={{"width":"49%"}} type="text" placeholder="Last name" onChange={(e) => this.setState({ "lname": e.target.value })} value={this.state.lname}/>
												</p>
											</div>	

											<div className="inputGroups">
												<p style={{"marginLeft": "3px","marginBottom": "5px"}}>
													<span style={{"fontWeight": "400"}}>Street Address 1 <span className="requiredField">* Required</span></span>
												</p>
												<p className="">
													<input  ref="streetAddressRef"  style={{"width": "100%"}} type="text" placeholder="Street Address 1" value={this.state.streetAddress} onChange={(e) => this.setState({ "streetAddress": e.target.value })}  />
												</p>
											</div>
											<div className="inputGroups">
												<p style={{"marginLeft": "3px","marginBottom": "5px"}}>
													<span style={{"fontWeight": "400"}}>Street Address 2</span>
												</p>
												<p className="">
													<input  ref="streetAddressRef"  style={{"width": "100%"}} type="text" placeholder="Optional" value={this.state.streetAddress2} onChange={(e) => this.setState({ "streetAddress2": e.target.value })}  />
												</p>
											</div>
											<div className="inputGroups">
												<p style={{"marginLeft": "3px","marginBottom": "5px"}}>
													<span style={{"fontWeight": "400"}}>City <span className="requiredField">* Required</span></span>
												</p>
												<p className="">
													<input ref="cityRef" style={{"width": "100%"}} type="text" placeholder="City" value={this.state.city} onChange={(e) => this.setState({ "city": e.target.value })}/>
												</p>
											</div>	
											<div className="inputGroups" style={{"width": "100%"}}>
												<div className="pull-left postalSelect"  style={{"width": "49%","marginRight":"5px"}}>
													<p style={{"marginLeft": "3px","marginBottom": "5px","width":"100%"}}>
														<span style={{"fontWeight": "400"}}>State <span className="requiredField">* Required</span></span>
													</p>
													<p className="">
														<select style={{"width":"100%"}} value={this.state.state} id="showStateInput" ref="state" className="stateSelect" onChange={(e) => this.setState({ "state": e.target.value })  } >
															<option value="default">Choose your state</option>
														</select>
													</p>
												</div>
												<div className="pull-left postalSelect"  style={{"width": "49%","marginRight":"5px"}}>
													<p style={{"marginLeft": "3px","marginBottom": "5px","width":"100%"}}>
														<span style={{"fontWeight": "400"}}>Postal Code <span className="requiredField">* Required</span></span>
													</p>
													<p className="">
														<input ref="postalcodeRef" style={{"width": "100%"}} type="text" value={this.state.postalcode} onChange={(e) => this.setState({ "postalcode": e.target.value })}/>
													</p>
												</div>
											</div>	
											<br style={{"clear": "both"}} />
											<div className="inputGroups">
												<p style={{"marginLeft": "3px","marginBottom": "5px","width" :"40%"}}>
													<span style={{"fontWeight": "400"}}>Country </span>
												</p>
												<p className="countrySelect">
												<select value={this.state.country} id="countries" ref="countries" disabled className="stateSelect" style={{"width":"100%","backgroundColor":"#f3f3f3"}} >
													<option value="default">Choose your country</option>
												</select>
												</p>
											</div>
											<p className="uploadButton pull-right" style={{"marginTop": "20px","marginLeft": "-10px"}}>
												<a onClick={this.handleFullPageSave} style={{"background": "rgb(0, 106, 208)", "border": "0px", "color": "white"}}>Save</a>
											</p>
										</div>
										<br style={{"clear": "both"}} />
										</div>
										<br style={{"clear": "both"}} />
										

										<div className="verifcationWrapper">
											<div className="navigationTop">
												<span>2</span>
											</div>
											<p className="title">Verification
												<span className="pull-right steps23c" style={{"marginTop":"0"}}>Step 2 of 3</span>
											</p>
											<div>
												{
													this.state.postalcode == "" ?
														<div className="lockedWrapper">
															<p><i className="fa fa-lock"></i></p>
															<p className="lockedTitle">Verification is locked.</p>
															<p className="locekdDescr">Once you enter your billing details, you can verify your account.</p>
														</div>
													:
													this.state.verifiedUser == "Not Completed" ?
													<div className="validingStatusWrap">
														<p className="uploadButton" style={{"marginTop": "20px"}}>
															<Link to="/settings/verify" style={{"background": "rgb(0, 106, 208)", "border": "0px", "color": "white"}}>Verify your account</Link>
														</p>
													</div>
													: this.state.verifiedUser == "Validate Required" ?
													<div className="validingStatusWrap">
														<p style={{"border":"0"}} className="title">Pending Verification</p>
														<p className="description">Verification may take up to 72 hours. As soon as your information <br />is approved you will be able to make a USD deposit.</p>
													</div>
													:
													<div className="validingStatusWrap">
														<p style={{"border":"0"}} className="title green">You are verified!</p>
													</div>
												}
											</div>
										</div>
										<br style={{"clear": "both"}} />
										


										<div className=" verifcationWrapper">
											


											<div className="navigationTop" style={{"top":"25px"}}>
												<span>3</span>
											</div>
									


									{
										this.state.countryA == "US" && this.state.accountVerified == true ?
										this.state.accreditedStatus == "Not Completed" || this.state.accreditedStatus == "" ?
										<div>
											<p className="title">Accreditation
												<span className="subtitle"></span>
												<span className="pull-right steps23c">Step 3 of 3</span>
											</p><br />
											


											<div className="rectanglewhitehide"></div>
											<span>I am a:</span>
											<div className="iamaccrediationchoice">
												<a onClick={(e) => this.setState({"accredtionType":true})} className={this.state.accredtionType == true ? "" : "disabled"}>Accredited</a>
												<a onClick={(e) => this.setState({"accredtionType":false})} className={this.state.accredtionType == false ? "" : "disabled"}>Non Accredited</a>
											</div>
											{
												this.state.accredtionType == true ?
												<div className="">
													<br /><br />
													<div className="requiredCheckbox"> 
														<label>
															<input checked={this.state.approvalAccredit} onChange={(e) => this.setState({"approvalAccredit":!this.state.approvalAccredit})} className="pull-left" type="checkbox" />
															<p className="pull-left agreementCheckbox">I have a net worth of at least $1,000,000, excluding the value of my primary 
															residence, or I have had a single income of greater than $200,000 each year 
															(or $300,000 combined income if married) for the past two (2) years, and 
															expect to make the same amount this year. Or, I am a bank, insurance company, 
															registered investment company, small business investment company, charitable 
															entity (with assets exceeding $5,000,000), a trust (with assets exceeding $5,000,000), 
															or a business in which all of the equity owners are accredited investors.</p>
														</label>
													</div>
													<div className="leftSideScreen accrediationWrapper" style={{"verticalAlign":"top"}}>
													<br />
														<div onClick={this.handleFile2} ref="fileInput2Wrap"  id="fileInput2Wrap" class="proofofIDScreen">
															<p class="titles">Proof of Accreditation</p>
															<p class="descriptions">(Max 5 MB, only .png, .jpeg or .pdf files accepted)</p>
															<div class="uploadFiles" style={{"font-size": "14px","text-align":"center","text-transform": "uppercase","padding-top": "20px","padding-bottom": "10px"}}>
															</div>
															<p class="text-center"><img src={UploadImage} /></p>
															<input type="file" onChange={this.handleFile2Change} hidden ref="fileInput2" id="fileInput2" />
															<span className="subtitle" style={{"width":"100%","textAlign":"center","marginTop":"40px"}} >Upload a certified letter from a CPA or attorney verifying you are an accredited investor.</span>
														</div>
													</div>
													<br />
													<div className="leftSideScreen accrediationWrapper2" style={{"paddingRight":"0","verticalAlign":"top"}}>
														<span style={{"marginBottom":"5px","width":"500px"}} className="subtitle"> <a onClick={this.handleSigErasor} className="fBttn clearSignature pull-right">Clear Signature</a> </span>
														<SignatureCanvas penColor='black' clearOnResize={false} canvasProps={{width: 500, height: 200, className: 'sigCanvas'}} ref="signatureCanvas" />
														<span className="subtitle signatureCanvas">Sign name</span>
														<span className="subtitle" style={{"width":"100%","textAlign":"center","textDecoration":"underline"}} >Sign your name if you agree to our <Link style={{"color":"blue"}} to="/dashboard/tokensalepolicy">token sale policy</Link></span>
													</div>
													<br style={{"clear": "both"}} />

													<p className="uploadButton" style={{"marginTop": "20px","textAlign":"right"}}>
														
														{
															this.state.uploadAccreditionBttn == false ?
															<a onClick={this.handleAccred} style={{"background": "#28cd6a", "border": "0px", "color": "white"}}>Submit for Approval</a>
															: 
															<a style={{"background": "#2278ec", "border": "0px", "color": "white"}}>Uplaoding Files...</a>
														}
													</p>
												</div>
												: 
												<div>
												<br />
												<br />
												<ul className="nonAccreditedUL">
													<li>Fanbase does not have any offerings available to non accredited investors at this time. If this should change you will be informed by email.</li>
													{
														this.state.approvalAccredit2 == true ?
														<li>Please <a className="" href="">click here</a> to sign offering documents through a FINRA approved portal.</li>
														: ""
													}
												</ul>
											</div>
											}
									</div> 
									: this.state.accreditedStatus == "Validate Required" ?
											<div>
												<p className="title">Accreditation</p><br />
												<div className="validingStatusWrap">

													<p style={{"border":"0"}} className="title">Pending Accreditation</p>
													<p className="description">Accreditation may take up to 72 hours. As soon as your information <br />is approved you will be able to make a USD deposit.</p>
												</div>
											</div>
											:
											<div>
												<p className="title">Accreditation</p><br />
												<div className="validingStatusWrap">
													<p style={{"border":"0"}} className="title green">Your accrediation has been verified!</p>
												</div>
											</div>
									: 
									<div>
										<p className="title">Accreditation
											<span className="subtitle"></span>
											<span className="pull-right steps23c">Step 3 of 3</span>
										</p><br />
										<div className="lockedWrapper">
											<p><i className="fa fa-lock"></i></p>
											<p className="lockedTitle">Accreditation is locked.</p>
											<p className="locekdDescr">Once you enter your billing details and verify your account above, you can be accredited.</p>
										</div>
									</div>
								}
								</div>
							</div>
							</div>
							</div>
						</div>
						<br style={{"clear":"both"}} />
					</div>
					<div className="dashModal seperator" style={{"width":"10%"}}></div>
				</div>
				<Footer />
{/*
													<li>
														<div className="requiredCheckbox"> 
														<label>
															<input checked={this.state.approvalAccredit2} onChange={(e) => this.setState({"approvalAccredit2":!this.state.approvalAccredit2})} className="pull-left" type="checkbox" />
															<p className="pull-left agreementCheckbox">I have a net worth of at least $1,000,000, excluding the value of my primary 
															residence, or I have had a single income of greater than $200,000 each year 
															(or $300,000 combined income if married) for the past two (2) years, and 
															expect to make the same amount this year. Or, I am a bank, insurance company, 
															registered investment company, small business investment company, charitable 
															entity (with assets exceeding $5,000,000), a trust (with assets exceeding $5,000,000), 
															or a business in which all of the equity owners are accredited investors.</p>
														</label>
														</div>
													</li>*/}

				
			</div>
		)
	}
}

export class Security extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"phone":"",
			"phoneVerified":false,
			"changePasswordReset":false,
			"verifyMessage":false,
			"verifyMessage1":false,
			"messageType1":"",
			"messageType":"",
			"addNewPhone":false,
			"newNumber":"",
			"phonesArray":[],
			"email":"",
			"numberAdd":false,
			"verifyCode":"",
			"codeEntered":""
		}
	}
	componentDidMount(){
		var r = this;
		window.scrollTo(0, 0)
		document.title = "Security – FNB";
		ReactGA.pageview(window.location.pathname + window.location.search);
		if (Parse.User.current()) {
			var userPointer = {
			  "__type": 'Pointer',
			  "className": '_User',
			  "objectId":  Parse.User.current().id
			}
			var Users = Parse.Object.extend("_User");
			var query = new Parse.Query(Users);
			query.get(Parse.User.current().id, {
			success: function(results) {
				r.setState({
					"email":results.get('email'),
					"phone":results.get('phone'),
					"phoneVerified":results.get('phoneVerified'),
					"phonesArray":results.get('phones') == undefined ? [] : results.get('phones')
				});
			}, error:function(err){
				alert(err)
			}});
		}
	}
	handleChangePassword = (e) => {
		this.setState({"changePasswordReset":!this.state.changePasswordReset});
	}
	handleResetP = (e) => {
		Parse.User.requestPasswordReset(this.state.email, {
		  success: function() {
			Parse.User.logOut().then(() => {
				window.location.href = startUrl + "login";
			});
		  },
		  error: function(error) {
		    alert(error.message);
		  }
		});
	}
	handlePhone = (status, value, countryData, number, id) => {
		this.setState({"newNumber":number});
	}
	sendNewNumberV = (e) => {
		var r = this;
		var phoning = r.state.newNumber.replace(/-/g,'').replace(/ /g,'');
		if (this.state.newNumber != "" && phoning != this.state.phone && this.state.phonesArray.includes(phoning) == false ) {
			Parse.Cloud.run('sendAdditionalPhoneCode', {
				"pn":r.state.newNumber
			}, {
			success: function(results) {
				r.setState({"verifyCode":results,"numberAdd":true});
			}, error:function(err){
				if (err.code == 209) {
					Parse.User.logOut().then(() => {
					 	window.location.href = startUrl + "login";
					});
				} else {
					console.log(err)
				}
			}});
		} else {
			alert('Number is already added.')
		}
	}
	verifyCodeNumber = (e) => {
		var r = this;
		if (this.state.verifyCode == this.state.codeEntered) {
			var userPointer = {
			  "__type": 'Pointer',
			  "className": '_User',
			  "objectId":  Parse.User.current().id
			}
			var Users = Parse.Object.extend("_User");
			var query = new Parse.Query(Users);
			query.get(Parse.User.current().id, {
			success: function(data) {
				var phones = data.get('phones') == undefined ? [] : data.get('phones');
				var email = r.state.newNumber.replace(/-/g,'').replace(/ /g,'');
				phones.push(email + ":::" + "verified");
				data.set('phones',phones);
				data.save();
				var emailer = data.get('username');
				Parse.Cloud.run('newPhoneNumnberAddedEmail', {
					"phone":email,
					"email":emailer
				}, {
				success: function(results) {
					window.location.reload();
				}, error:function(err){
					if (err.code == 209) {
						Parse.User.logOut().then(() => {
						 	window.location.href = startUrl + "login";
						});
					} else {
						console.log(err)
					}
				}});
				
			}, error:function(err){
				alert(err)
			}});
		}
	}
	render(){
		return (
			<div>
				<div className="page settingsPage">
					<MainHeader />
					<div className="dashWrapperB">
						<div className="dashModal seperator" style={{"width":"10%"}}></div>						
						<div className="dashModal contentPage" style={{"width":"80%"}}>
							<div className="content " style={{"height":"auto"}}>
								<SettingsHeader />
								<div className="settingsWrapper">
										<p className="title">Phone Number</p>
										<div class="instantChangesCo" style={{"paddingLeft": "0px","paddingTop": "20px","paddingBottom": "20px"}}>
											<ul>
												{
													this.state.phone != "" ?
													<li style={{"padding": "0","width":"50%"}}>
														<p class="phoneNumber">
															<span className="phoneNumb">{this.state.phone}</span>
															{ this.state.phoneVerified == true ? <span class="verified">Verified</span> : "" }
															<span class="primaryPhone">Primary Phone</span>
															<br /><br />
															

															{
																this.state.phonesArray.map(function(p,i){
																return(	
																	<span>
																		<span className="phoneNumb">{p.split(':::')[0]}</span>
																		{ p.split(':::')[1] == "verified" ? <span class="verified">Verified</span> : "" }
																	<br /><br />
																	</span>
																	);
																})
															}



															<p class="uploadButton">
																<input onClick={(e) => this.setState({"addNewPhone":true})} type="submit" value="Verify another phone" />
															</p>
														</p>
													</li> : 
													<li style={{"padding": "0","width":"50%"}}>
														<p class="uploadButton">
															<input type="submit" value="Add a Primary Phone" />
														</p>
													</li>
												}
												<li style={{"width":"50%"}}>
													<div className="changePictureCon changePasswordContainer">
														<p className="changePictureText pull-left ">
															<span>{this.state.changePasswordReset == true ? "Are you sure?" : "Change Password"}</span>
															<span>{this.state.changePasswordReset == true ? "We will send a reset password email." : "We send you a reset password email."}</span>
														</p>
														<p className="uploadButton pull-right">
															{
																this.state.changePasswordReset == true ?
																<span>
																	<a onClick={this.handleChangePassword}>Never Mind</a>&emsp;
																	<a onClick={this.handleResetP} style={{"background": "rgb(0, 106, 208)", "border": "0px", "color": "white"}}>Reset</a>
																</span>
																: 
																<a onClick={this.handleChangePassword}>Change Password</a>
															}
														</p>
														<br style={{"clear": "both"}} />
													</div>
												</li>
											</ul>
										</div>
										<br />
										<p className="title">Two Factor Authentication</p>
										<br />
										<div className="pull-left twoFactor1" style={{"width":"50%"}}>
											<p className="changePictureText" style={{"paddingLeft":"0"}}>
												<span ref="changePictureTab">Your two factor method is: SMS</span>
												<span>For more security, enable an authenticator app.</span>
												<br />

												<i className="fa fa-check" style={{"color":"#28cd6a"}}></i>
											</p>

										</div>
										<div className="pull-left twoFactor2" style={{"width":"50%"}}>
											<p className="changePictureText" style={{"paddingLeft":"0"}}>
												<span>Require verification code to send:</span>
												<br />
												<label>
													<input checked type="radio" name="verifcationcode" />
													<span className="changePictureText" style={{"paddingLeft":"10px","float":"right","paddingTop":"5px"}}><span style={{"fontWeight":"200"}}>By email and phone</span></span>
												</label>
											</p>
											<br />
											<p class="uploadButton">
												<input type="submit" value="Save" />
											</p>
										</div>
										<br style={{"clear":"both"}} />
										<br /><br />
								</div>
							</div>
						</div>
						<div className="dashModal seperator" style={{"width":"10%"}}></div>
						<br style={{"clear":"both"}} />
					</div>
				</div>
				{
					this.state.verifyMessage == true ?
					<div>
						<div onClick={(e) => this.setState({"verifyMessage":!this.state.verifyMessage})} className="loadingScreen"></div>
						<div className="usdPopupmethodsWrap">
							<div onClick={(e) => this.setState({"verifyMessage":!this.state.verifyMessage})} className="closeButton"><i className="fa fa-close"></i></div>
							<div className="verifyYourAccountAlert" style={{"paddingBottom":"0"}}>
								<p className="title">Are you sure?</p>
								<p className="subtitle">Are you sure you want to delete {this.state.messageType}</p>
								<a onClick={(e) => this.setState({"verifyMessage":!this.state.verifyMessage})} className="buyNowBttn cancelAreyousure" style={{"backgroundColor":"#f3f3f3","color":"black","marginRight":"10px"}}>Cancel</a>
								<a className="buyNowBttn verifyAccount" onClick={this.removeThemDevices}>Confirm</a>
							</div>
						</div>
					</div>
					: ""
				}
				{
					this.state.verifyMessage1 == true ?
					<div>
						<div onClick={(e) => this.setState({"verifyMessage1":!this.state.verifyMessage1})} className="loadingScreen"></div>
						<div className="usdPopupmethodsWrap">
							<div onClick={(e) => this.setState({"verifyMessage1":!this.state.verifyMessage1})} className="closeButton"><i className="fa fa-close"></i></div>
							<div className="verifyYourAccountAlert" style={{"paddingBottom":"0"}}>
								<p className="title">Are you sure?</p>
								<p className="subtitle">Are you sure you want to delete {this.state.messageType1}</p>
								<a onClick={(e) => this.setState({"verifyMessage1":!this.state.verifyMessage1})} className="buyNowBttn cancelAreyousure" style={{"backgroundColor":"#f3f3f3","color":"black","marginRight":"10px"}}>Cancel</a>
								<a className="buyNowBttn verifyAccount" onClick={this.removeAllSessions1}>Confirm</a>
							</div>
						</div>
					</div>
					: ""
				}
				<Footer />
				<ModalWrapper active={this.state.addNewPhone} hide={(e) => this.setState({"addNewPhone":false})}>
					<div className="addNewPhoneWrapper">
						{
							this.state.numberAdd == false ?
							<span>
								<p className="title">Verify a new number</p>
								<p class="uploadButton" style={{"marginTop":"10px"}}>
									<a onClick={this.sendNewNumberV} style={{"backgroundColor":"#007bff","color":"white","display":"block","paddingTop":"13px","paddingBottom":"13px"}}>Send verification code</a>
									<IntlTelInput onPhoneNumberChange={ this.handlePhone }  id="phone" format="true" css={['intl-tel-input', 'numberInput']} style={{"width":"100%"}} utilsScript={'libphonenumber.js'} />
								</p>
							</span>
							:
							<span>
								<p className="title">What's the 6 digit number?</p>
								<input value={this.state.codeEntered} onChange={(e) => this.setState({"codeEntered":e.target.value})} type="number" style={{"fontSize":"20px"}} max="6" className="numberInput" />
								<p class="uploadButton" style={{"marginTop":"5px"}}>
									<a onClick={this.verifyCodeNumber} style={{"backgroundColor":"#28cd6a","color":"white","display":"block","paddingTop":"13px","paddingBottom":"13px"}}>Verify Number</a>
								</p>
							</span>
						}
					</div>
				</ModalWrapper>
			</div>
		)
	}
}



export class Preferences extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"language":"",
			"localCurrency":"",
			"timezone":""
		}
	}
	componentDidMount(){
		ReactGA.pageview(window.location.pathname + window.location.search);
		var r = this;
		window.scrollTo(0, 0)
		document.title = "Preferences – FNB";
		var _User = Parse.Object.extend("_User");
		var query = new Parse.Query(_User);
		query.get(Parse.User.current().id, {
		  success: function(data) {
		   	r.setState({"timezone":data.get('timezone')});
		  },
		  error: function(object, error) {
		   console.log(error)
		  }
		});
	}
	handleTimeZonChange = (e) => {
		this.setState({ "timezone": e.target.value });
		var value = e.target.value;
		var _User = Parse.Object.extend("_User");
		var query = new Parse.Query(_User);
		query.equalTo("objectId", Parse.User.current().id);
		query.first({
		  success: function(data) {
		   data.set('timezone',value);
		   data.save();
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});
	}
	render(){
		return (
			<div>
				<div className="page settingsPage">
					<MainHeader />
					<div className="dashWrapperB">
						<div className="dashModal seperator" style={{"width":"10%"}}></div>						
						<div className="dashModal contentPage" style={{"width":"80%"}}>
							<div className="content " style={{"height":"auto"}}>
								<SettingsHeader />
								<div className="settingsWrapper Preferences">
									<p className="title">Preferences</p>
									<div className="nextDetailsInput" style={{"width":"100%"}}>
										<div class="documentRightSide" style={{"width":"100%","float":"none"}}>
											<label className="pull-left">Select Language</label>
											<select style={{"width":"400px"}} className="pull-right" onChange={(e) => this.setState({ "language": e.target.value })}>
												<option value="english">English</option>
											</select>
											<br style={{"clear":"both"}} /><br />
											<label className="pull-left">Local Currency</label>
											<select style={{"width":"400px"}} className="pull-right" onChange={(e) => this.setState({ "localCurrency": e.target.value })}>
												<option value="usd">United States Dollar (USD)</option>
											</select>
											<br style={{"clear":"both"}} /><br />
											<label className="pull-left">Time Zone</label>
											<select style={{"width":"400px"}} className="pull-right" value={this.state.timezone} onChange={this.handleTimeZonChange}>
												{
												    Object.keys(Timezone).map((type,i) => {
												       	return (<option key={i} value={type}>{type}</option>);
												    })
												}
											</select>
											<br style={{"clear":"both"}} /><br />
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="dashModal seperator" style={{"width":"10%"}}></div>
						<br style={{"clear":"both"}} />
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}



export class Verification extends React.Component {
	constructor(props){
		super(props);
		this.handleFile1 = this.handleFile1.bind(this);
		this.handleFile1Change = this.handleFile1Change.bind(this);
		this.handleFile2 = this.handleFile2.bind(this);
		this.handleFile2Change = this.handleFile2Change.bind(this);
		this.handleSubmit =this.handleSubmit.bind(this);
		this.state = {
			"documentType1":"default",
			"documentNumber":"",
			"issuingCountry":"default",
			"documentType2":"default",
			"file1":false,
			"file2":false,
			"file3":false,
			"disabledSubmit":false,
			"states":"",
			"fname":"",
			"lname":""
		}
	}
	componentDidMount(){
		var r = this;
		ReactGA.pageview(window.location.pathname + window.location.search);
		var Users = Parse.Object.extend("_User");
		var query = new Parse.Query(Users);
		query.get(Parse.User.current().id, {
		success: function(results) {
			r.setState({
				"states":results.get('accountVerifiedStatus'),
				"fname":results.get('fname'),
				"lname":results.get('lname')
			});
		}, error:function(err){
			alert(err)
		}});

		window.scrollTo(0, 0)
		document.title = "Verification – FNB";

	}
	handleFile1(){
		$(this.refs.fileInput1).click();
	}
	handleFile1Change(){
		var files = this.refs.fileInput1.files;
		var wrap = this.refs.fileInput1Wrap;
		if (files.length > 0) {
			if (files[0].type == "image/png" || files[0].type == "image/jpeg" || files[0].type == "image/jpg" || files[0].type == "application/pdf") {
				if (files[0].size < 5e+6) {
					$(wrap).css('backgroundColor',"rgba(20, 191, 6, 0.1)");
					$(wrap).find('.titles').html('1 file selected');
					$(wrap).find('.titles').css('color','black');	
					this.setState({"file1":true});
				} else {
					$(wrap).css('backgroundColor',"rgba(255, 0, 0,0.05)");
					$(wrap).find('.titles').html('File size must be less than 5 mb.');
					$(wrap).find('.titles').css('color','red');	
					this.setState({"file1":false});				
				}
			} else {
				$(wrap).css('backgroundColor',"rgba(255, 0, 0,0.05)");
				$(wrap).find('.titles').html('Invalid File Format');
				$(wrap).find('.titles').css('color','red');
				this.setState({"file1":false});
			}
		}
	}
	handleFile2(){
		$(this.refs.fileInput2).click();
	}
	handleFile3 = (e) => {
		$(this.refs.fileInput3).click();
	}
	handleFile2Change(){
		var files = this.refs.fileInput2.files;
		var wrap = this.refs.fileInput2Wrap;
		if (files.length > 0) {
			if (files[0].type == "image/png" || files[0].type == "image/jpeg" || files[0].type == "image/jpg" || files[0].type == "application/pdf") {
				if (files[0].size < 5e+6) {
					$(wrap).css('backgroundColor',"rgba(20, 191, 6, 0.1)");
					$(wrap).find('.titles').html('1 file selected');
					$(wrap).find('.titles').css('color','black');
					this.setState({"file2":true});		
				} else {
					$(wrap).css('backgroundColor',"rgba(255, 0, 0,0.05)");
					$(wrap).find('.titles').html('File size must be less than 5 mb.');
					$(wrap).find('.titles').css('color','red');	
					this.setState({"file2":false});		
				}
			} else {
				$(wrap).css('backgroundColor',"rgba(255, 0, 0,0.05)");
				$(wrap).find('.titles').html('Invalid File Format');
				$(wrap).find('.titles').css('color','red');
				this.setState({"file2":false});
			}
		}		
	}
	handleFile3Change = (e) => {
		var files = this.refs.fileInput3.files;
		var wrap = this.refs.fileInput3Wrap;
		if (files.length > 0) {
			if (files[0].type == "image/png" || files[0].type == "image/jpeg" || files[0].type == "image/jpg" || files[0].type == "application/pdf") {
				if (files[0].size < 5e+6) {
					$(wrap).css('backgroundColor',"rgba(20, 191, 6, 0.1)");
					$(wrap).find('.titles').html('1 file selected');
					$(wrap).find('.titles').css('color','black');
					this.setState({"file3":true});		
				} else {
					$(wrap).css('backgroundColor',"rgba(255, 0, 0,0.05)");
					$(wrap).find('.titles').html('File size must be less than 5 mb.');
					$(wrap).find('.titles').css('color','red');	
					this.setState({"file3":false});		
				}
			} else {
				$(wrap).css('backgroundColor',"rgba(255, 0, 0,0.05)");
				$(wrap).find('.titles').html('Invalid File Format');
				$(wrap).find('.titles').css('color','red');
				this.setState({"file3":false});
			}
		}		
	}
	handleSubmit(e) {
		var r = this;
		var ref = this.refs;
		var wrap1 = this.refs.fileInput1Wrap;
		var wrap2 = this.refs.fileInput2Wrap;
		var wrap3 = this.refs.fileInput3Wrap;

		if (r.state.documentType1 == "default") {
			$(ref.documentType1).css('backgroundColor',"rgba(255, 0, 0,0.05)");
		} else if (r.state.documentNumber == "") {
			$(ref.documentType1).css('backgroundColor',"#f3f3f3");
			$(ref.documentNumber).css('backgroundColor',"rgba(255, 0, 0,0.05)");
		} else if (r.state.issuingCountry == "default") {
			$(ref.documentType1).css('backgroundColor',"#f3f3f3");
			$(ref.documentNumber).css('backgroundColor',"#f3f3f3");
			$(ref.issuingCountry).css('backgroundColor',"rgba(255, 0, 0,0.05)");
		} else if (r.state.documentType2 == "default") {
			$(ref.documentType1).css('backgroundColor',"#f3f3f3");
			$(ref.issuingCountry).css('backgroundColor',"#f3f3f3");
			$(ref.documentNumber).css('backgroundColor',"#f3f3f3");
			$(ref.documentType2).css('backgroundColor',"rgba(255, 0, 0,0.05)");
		} else if (r.state.file1 == false) {
			$(ref.documentType1).css('backgroundColor',"#f3f3f3");
			$(ref.issuingCountry).css('backgroundColor',"#f3f3f3");
			$(ref.documentNumber).css('backgroundColor',"#f3f3f3");
			$(ref.documentType2).css('backgroundColor',"#f3f3f3");
			$(wrap1).css('backgroundColor',"rgba(255, 0, 0,0.05)");
		} else if (r.state.file3 == false) {
			$(ref.documentType1).css('backgroundColor',"#f3f3f3");
			$(ref.issuingCountry).css('backgroundColor',"#f3f3f3");
			$(ref.documentNumber).css('backgroundColor',"#f3f3f3");
			$(ref.documentType2).css('backgroundColor',"#f3f3f3");
			$(wrap1).css('backgroundColor',"rgba(20, 191, 6, 0.1)");
			$(wrap3).css('backgroundColor',"rgba(255, 0, 0,0.05)");
		} else if (r.state.file2 == false) {
			$(ref.documentType1).css('backgroundColor',"#f3f3f3");
			$(ref.issuingCountry).css('backgroundColor',"#f3f3f3");
			$(ref.documentNumber).css('backgroundColor',"#f3f3f3");
			$(ref.documentType2).css('backgroundColor',"#f3f3f3");
			$(wrap1).css('backgroundColor',"rgba(20, 191, 6, 0.1)");
			$(wrap2).css('backgroundColor',"rgba(255, 0, 0,0.05)");
			$(wrap3).css('backgroundColor',"rgba(20, 191, 6, 0.1)");
		} else {
			$(ref.documentType1).css('backgroundColor',"#f3f3f3");
			$(ref.issuingCountry).css('backgroundColor',"#f3f3f3");
			$(ref.documentNumber).css('backgroundColor',"#f3f3f3");
			$(ref.documentType2).css('backgroundColor',"#f3f3f3");
			$(wrap1).css('backgroundColor',"rgba(20, 191, 6, 0.1)");
			$(wrap2).css('backgroundColor',"rgba(20, 191, 6, 0.1)");
			$(wrap3).css('backgroundColor',"rgba(20, 191, 6, 0.1)");
			this.setState({"disabledSubmit":true})


			var file1 = this.refs.fileInput1.files[0];
			var file2 = this.refs.fileInput2.files[0];
			var file3 = this.refs.fileInput3.files[0];
			var parseFile1 = new Parse.File(file1.name, file1);parseFile1.save();
			var parseFile2 = new Parse.File(file2.name, file2);parseFile2.save();
			var parseFile3 = new Parse.File(file3.name, file3);parseFile3.save();
			var Verification = Parse.Object.extend("Verification");
			var verify = new Verification();
			verify.set("documentType1",r.state.documentType1);
			verify.set("documentNumber",r.state.documentNumber);
			verify.set("issuingCountry",r.state.issuingCountry);
			verify.set("documentType2",r.state.documentType2);
			verify.set("file1", parseFile1);
			verify.set("file2", parseFile2);
			verify.set("file3", parseFile3);
			verify.set('type','Verification');
			verify.set("complete",false);
			verify.set('Name',r.state.fname + " " + r.state.lname);
			verify.set('user', {
			  "__type": 'Pointer',
			  "className": '_User',
			  "objectId":  Parse.User.current().id
			});
			verify.save(null, {
			  success: function(gameScore) {
				var GameScore = Parse.Object.extend("_User");
				var query = new Parse.Query(GameScore);
				query.equalTo("objectId",Parse.User.current().id);
				query.first({
				  success: function(data) {
						data.set("accountVerifiedStatus", "Validate Required");
						data.save(null, {
						  success: function(gameScore) {
							r.setState({"states":"Validate Required"});
						  }, error:function(err) {
						  	alert(err)
						  }
						});
				  },
				  error: function(error) {
				   alert(error)
				  }
				});
			  },
			  error: function(gameScore, error) {
			  	alert(error.message);
			  }
			});
		}
	}
	render(){
		return (
			<div>
				<div className="page settingsPage">
					<MainHeader />
					<div className="dashWrapperB">
						<div className="dashModal seperator" style={{"width":"10%"}}></div>						
						<div className="dashModal contentPage" style={{"width":"80%"}}>
							<div className="content " style={{"height":"auto"}}>
								<SettingsHeader />
								{
									this.state.states == "Not Completed" ?
										<div class="settingsWrapper verifyAccountWrap">
											<p class="tabtitle">Verify your account</p>
											<div class="activeSessions idActive">
												<div style={{"width": "50%","float": "left","padding-right": "100px"}}>
													<p class="title">Proof of ID Requirements</p>
													<ul>
														<li>Legal traceable documents (scan or photograph of your documents)</li>
														<li>Documents accepted: 
															<ul>
																<li>Passports</li>
																<li>ID Cards</li>
																<li>Drivers License</li>
															</ul>
														</li>
													</ul>
												</div>
												<div style={{"width": "50%","float": "left","padding-right": "100px"}}>
													<p class="title">Proof of address requirements</p>
													<ul>
														<li>It must include the name and residential address.</li>
														<li>Documents accepted: 
															<ul>
																<li>Utility Bill</li>
																<li>Phone Bill</li>
																<li>Internet Bill</li>
																<li>Bank Statement</li>
															</ul>
														</li>
													</ul>
												</div>
												<br style={{"clear":"both"}} />
												<p class="subtitleWarning">You can upload files in <b>PNG</b>,<b>JPG</b>,<b>JPEG</b> or <b>PDF</b> formats. <br />Files must <b>not be larger than 5MB</b>.</p>
											</div>
											<hr />
											<div>
												<p class="title" style={{"text-align": "center","padding-top": "30px","padding-bottom": "50px","border":"0"}}>Identification Documents</p>
												<div class="leftSideScreen">
													<div onClick={this.handleFile1} ref="fileInput1Wrap" class="proofofIDScreen">
														<p class="titles">Proof of ID</p>
														<p class="descriptions">(Max 5 MB, only .png, .jpeg or .pdf files accepted)</p>
														<div class="uploadFiles" style={{"font-size": "14px","text-align":"center","text-transform": "uppercase","padding-top": "20px","padding-bottom": "10px"}}></div>
														<p class="text-center"><img src={UploadImage}/></p>
														<input type="file" onChange={this.handleFile1Change} hidden ref="fileInput1" />
													</div>
												</div>
												<div class="documentRightSide">
													<label className="pull-left">Document Type</label>
													<select className="pull-right" ref="documentType1" onChange={(e) => this.setState({ "documentType1": e.target.value })}>
														<option value="default">Choose a Document Type</option>
														<option value="passport">Passport</option>
														<option value="IDCard">ID Card</option>
														<option id="DriversLicense">Drivers License</option>
													</select>
													<br style={{"clear":"both"}} /><br />
													<label className="pull-left">Document Number</label>
													<input className="pull-right" ref="documentNumber" type="text" value={this.state.documentNumber} onChange={(e) => this.setState({ "documentNumber": e.target.value })} />
													<br style={{"clear":"both"}} /><br />
													<label className="pull-left">Issuing Country</label>
													<select className="pull-right" ref="issuingCountry" onChange={(e) => this.setState({ "issuingCountry": e.target.value })}>
														<option value="default">Choose the Country</option>
													<option value="Afghanistan">Afghanistan</option><option value="Albania">Albania</option><option value="Algeria">Algeria</option><option value="Amundsen-Scott">Amundsen-Scott</option><option value="Andorra">Andorra</option><option value="Angola">Angola</option><option value="Anguilla">Anguilla</option><option value="Antigua/Barbuda">Antigua/Barbuda</option><option value="Arctic Ocean">Arctic Ocean</option><option value="Argentina">Argentina</option><option value="Armenia">Armenia</option><option value="Aruba">Aruba</option><option value="Assorted">Assorted</option><option value="Atlantic Ocean (North)">Atlantic Ocean (North)</option><option value="Atlantic Ocean (South)">Atlantic Ocean (South)</option><option value="Australia">Australia</option><option value="Austria">Austria</option><option value="Azerbaijan">Azerbaijan</option><option value="Bahamas">Bahamas</option><option value="Bahrain">Bahrain</option><option value="Bangladesh">Bangladesh</option><option value="Barbados">Barbados</option><option value="Belarus">Belarus</option><option value="Belgium">Belgium</option><option value="Belize">Belize</option><option value="Benin">Benin</option><option value="Bermuda">Bermuda</option><option value="Bhutan">Bhutan</option><option value="Bolivia">Bolivia</option><option value="Bosnia-Herzegovina">Bosnia-Herzegovina</option><option value="Botswana">Botswana</option><option value="Brazil">Brazil</option><option value="Brunei">Brunei</option><option value="Bulgaria">Bulgaria</option><option value="Burkina Faso">Burkina Faso</option><option value="Burma (Myanmar)">Burma (Myanmar)</option><option value="Burundi">Burundi</option><option value="Cambodia">Cambodia</option><option value="Cameroon">Cameroon</option><option value="Canada">Canada</option><option value="Cape Verde">Cape Verde</option><option value="Caribbean Sea">Caribbean Sea</option><option value="Central African Republic">Central African Republic</option><option value="Chad">Chad</option><option value="Chile">Chile</option><option value="China">China</option><option value="Colombia">Colombia</option><option value="Comoros">Comoros</option><option value="Congo, Dem.">Congo, Dem.</option><option value="Congo, Rep.">Congo, Rep.</option><option value="Costa Rica">Costa Rica</option><option value="Cozumel">Cozumel</option><option value="Croatia">Croatia</option><option value="Cuba">Cuba</option><option value="Cyprus">Cyprus</option><option value="Czech Republic">Czech Republic</option><option value="Denmark">Denmark</option><option value="Djibouti">Djibouti</option><option value="Dominica">Dominica</option><option value="Dominican Republic">Dominican Republic</option><option value="East Timor">East Timor</option><option value="Ecuador">Ecuador</option><option value="Egypt">Egypt</option><option value="El Salvador">El Salvador</option><option value="Equatorial Guinea">Equatorial Guinea</option><option value="Eritrea">Eritrea</option><option value="Estonia">Estonia</option><option value="Ethiopia">Ethiopia</option><option value="Fiji">Fiji</option><option value="Finland">Finland</option><option value="France">France</option><option value="Gabon">Gabon</option><option value="Gambia">Gambia</option><option value="Georgia">Georgia</option><option value="Germany">Germany</option><option value="Ghana">Ghana</option><option value="Greece">Greece</option><option value="Greek Isles">Greek Isles</option><option value="Greenland">Greenland</option><option value="Grenada">Grenada</option><option value="Guadeloupe">Guadeloupe</option><option value="Guatemala">Guatemala</option><option value="Guinea">Guinea</option><option value="Guinea-Bissau">Guinea-Bissau</option><option value="Guyana">Guyana</option><option value="Haiti">Haiti</option><option value="Honduras">Honduras</option><option value="Hungary">Hungary</option><option value="Iceland">Iceland</option><option value="India">India</option><option value="Indian Ocean">Indian Ocean</option><option value="Indonesia">Indonesia</option><option value="Iran">Iran</option><option value="Iraq">Iraq</option><option value="Ireland">Ireland</option><option value="Israel">Israel</option><option value="Italy">Italy</option><option value="Jamaica">Jamaica</option><option value="Japan">Japan</option><option value="Jordan">Jordan</option><option value="Kazakhstan">Kazakhstan</option><option value="Kenya">Kenya</option><option value="Kiribati">Kiribati</option><option value="Korea (north)">Korea (north)</option><option value="Korea (south)">Korea (south)</option><option value="Kuwait">Kuwait</option><option value="Kyrgyzstan">Kyrgyzstan</option><option value="Laos">Laos</option><option value="Latvia">Latvia</option><option value="Lebanon">Lebanon</option><option value="Lesotho">Lesotho</option><option value="Liberia">Liberia</option><option value="Libya">Libya</option><option value="Liechtenstein">Liechtenstein</option><option value="Lithuania">Lithuania</option><option value="Luxembourg">Luxembourg</option><option value="Macedonia">Macedonia</option><option value="Madagascar">Madagascar</option><option value="Malawi">Malawi</option><option value="Malaysia">Malaysia</option><option value="Maldives">Maldives</option><option value="Mali">Mali</option><option value="Malta">Malta</option><option value="Martinique">Martinique</option><option value="Mauritania">Mauritania</option><option value="Mauritius">Mauritius</option><option value="Mediterranean Sea">Mediterranean Sea</option><option value="Mexico">Mexico</option><option value="Micronesia">Micronesia</option><option value="Moldova">Moldova</option><option value="Monaco">Monaco</option><option value="Mongolia">Mongolia</option><option value="Montserrat">Montserrat</option><option value="Morocco">Morocco</option><option value="Mozambique">Mozambique</option><option value="Namibia">Namibia</option><option value="Nauru">Nauru</option><option value="Nepal">Nepal</option><option value="Netherlands">Netherlands</option><option value="Netherlands Antilles">Netherlands Antilles</option><option value="New Zealand">New Zealand</option><option value="Nicaragua">Nicaragua</option><option value="Niger">Niger</option><option value="Nigeria">Nigeria</option><option value="Norway">Norway</option><option value="Oceania">Oceania</option><option value="Oman">Oman</option><option value="Pacific Ocean (North)">Pacific Ocean (North)</option><option value="Pacific Ocean (South)">Pacific Ocean (South)</option><option value="Pakistan">Pakistan</option><option value="Palau">Palau</option><option value="Panama">Panama</option><option value="Papua New Guinea">Papua New Guinea</option><option value="Paraguay">Paraguay</option><option value="Peru">Peru</option><option value="Philippines">Philippines</option><option value="Poland">Poland</option><option value="Portugal">Portugal</option><option value="Puerto Rico">Puerto Rico</option><option value="Qatar">Qatar</option><option value="Romania">Romania</option><option value="Russian Federation">Russian Federation</option><option value="Rwanda">Rwanda</option><option value="Samoa">Samoa</option><option value="San Andres">San Andres</option><option value="San Marino">San Marino</option><option value="Sao Tome/Principe">Sao Tome/Principe</option><option value="Saudi Arabia">Saudi Arabia</option><option value="Senegal">Senegal</option><option value="Serbia/Montenegro (Yugoslavia)">Serbia/Montenegro (Yugoslavia)</option><option value="Seychelles">Seychelles</option><option value="Sierra Leone">Sierra Leone</option><option value="Singapore">Singapore</option><option value="Slovakia">Slovakia</option><option value="Slovenia">Slovenia</option><option value="Somalia">Somalia</option><option value="South Africa">South Africa</option><option value="Spain">Spain</option><option value="Sri Lanka">Sri Lanka</option><option value="St Vincent/Grenadines">St Vincent/Grenadines</option><option value="St. Barts">St. Barts</option><option value="St. Kitts/Nevis">St. Kitts/Nevis</option><option value="St. Lucia">St. Lucia</option><option value="St. Martin/Sint Maarten">St. Martin/Sint Maarten</option><option value="Sudan">Sudan</option><option value="Suriname">Suriname</option><option value="Swaziland">Swaziland</option><option value="Sweden">Sweden</option><option value="Switzerland">Switzerland</option><option value="Syria">Syria</option><option value="Taiwan">Taiwan</option><option value="Tajikistan">Tajikistan</option><option value="Tanzania">Tanzania</option><option value="Thailand">Thailand</option><option value="Togo">Togo</option><option value="Tonga">Tonga</option><option value="Trinidad/Tobago">Trinidad/Tobago</option><option value="Tunisia">Tunisia</option><option value="Turkey">Turkey</option><option value="Turkmenistan">Turkmenistan</option><option value="Turks/Caicos">Turks/Caicos</option><option value="Tuvalu">Tuvalu</option><option value="Uganda">Uganda</option><option value="Ukraine">Ukraine</option><option value="United Arab Emirates">United Arab Emirates</option><option value="United Kingdom">United Kingdom</option><option value="United States">United States</option><option value="Uruguay">Uruguay</option><option value="Uzbekistan">Uzbekistan</option><option value="Vanuatu">Vanuatu</option><option value="Vatican City">Vatican City</option><option value="Venezuela">Venezuela</option><option value="Vietnam">Vietnam</option><option value="Yemen">Yemen</option><option value="Zambia">Zambia</option><option value="Zimbabwe">Zimbabwe</option></select>
													<br style={{"clear":"both"}} /><br />
												</div>
											</div>
											<br style={{"clear":"both"}} /><br /><br />
											<hr />
											<div>
												<div class="leftSideScreen">
													<div onClick={this.handleFile3} ref="fileInput3Wrap" class="proofofIDScreen">
														<p class="titles">Photo holding ID and current date</p>
														<p class="descriptions">(Max 5 MB, only .png, .jpeg or .pdf files accepted)</p>
														<div class="uploadFiles" style={{"font-size": "14px","text-align":"center","text-transform": "uppercase","padding-top": "20px","padding-bottom": "10px"}}></div>
														<p class="text-center"><img src={UploadImage}/></p>
														<input type="file" onChange={this.handleFile3Change} hidden ref="fileInput3" />
													</div>
												</div>
												<div class="documentRightSide">
													<p class="subtitleWarning">Upload a <b>clear photo holding ID</b>.</p>
												</div>
											</div>
											<br style={{"clear":"both"}} /><br /><br />
											<hr style={{"padding-bottom": "60px","margin": "0"}} />
											<div>
												<div class="leftSideScreen">
													<div onClick={this.handleFile2} ref="fileInput2Wrap" class="proofofIDScreen">
														<p class="titles">Proof of Address</p>
														<p class="descriptions">(Max 5 MB, only .png, .jpeg or .pdf files accepted)</p>
														<div class="uploadFiles" style={{"font-size": "14px","text-align":"center","text-transform": "uppercase","padding-top": "20px","padding-bottom": "10px"}}>
														</div>
														<p class="text-center"><img src={UploadImage} /></p>
														<input type="file" onChange={this.handleFile2Change} hidden ref="fileInput2" />
														<span className="subtitle" style={{"width":"100%","textAlign":"center","marginTop":"40px"}} >Upload a utility bill as a form of address verification.</span>
													</div>
												</div>
												<div class="documentRightSide">
													<label className="pull-left">Document Type</label>
													<select className="pull-right" ref="documentType2"  onChange={(e) => this.setState({ "documentType2": e.target.value })}>
														<option value="default">Choose a Document Type</option>
														<option value="utility">Utility</option>
														<option value="phoneBill">Phone Bill</option>
														<option value="internetBill">Internet Bill</option>
														<option value="bankStatement">Bank Statement</option>
													</select>
												</div>
											</div>
											<br style={{"clear":"both"}} /><br /><br />
											<p class="uploadButton pull-right">
												
												{
													this.state.disabledSubmit == false ?
													<input type="submit" onClick={this.handleSubmit} style={{"backgroundColor":"#28cd6a"}} value="Verify Account" />
													: 
													<input type="submit" style={{"backgroundColor":"#2278ec"}} value="Uploading Files..." />
												}

											</p>
											<br style={{"clear":"both"}} />
											<br />
									</div>
								: this.state.states == "Validate Required" ?
									<div className="validingStatusWrap">
										<p className="image"><img src={pendingVerification} /></p>
										<p className="title">Pending Verification</p>
										<p className="description">Verification may take up to 72 hours. As soon as your information <br />is approved you will be able to make a USD deposit.</p>
									</div>
								: this.state.states == "Complete" ?
									<div className="validingStatusWrap">
										<p className="image"><img src={completeVerify} /></p>
										<p className="title green">You are verified!</p>
										<p className="description">We added $10.00 worth of FNB to your account!</p>
									</div>
								: "" }
							</div>
						</div>
						<div className="dashModal seperator" style={{"width":"10%"}}></div>
						<br style={{"clear":"both"}} />
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}


export class LimitsPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}
	componentDidMount(){
		ReactGA.pageview(window.location.pathname + window.location.search);
		var r = this;
		window.scrollTo(0, 0)
		document.title = "Limits – FNB";
	}
	render(){
		return (
			<div>
				<div className="page settingsPage">
					<MainHeader />
					<div className="dashWrapperB">
						<div className="dashModal seperator" style={{"width":"10%"}}></div>						
						<div className="dashModal contentPage" style={{"width":"80%"}}>
							<div className="content " style={{"height":"auto"}}>
								<SettingsHeader />
								<div className="settingsWrapper Preferences">
									<p className="title">Send Limits</p>
									<br />
									<div className="pull-left twoFactor2" style={{"width":"50%"}}>
										<p className="changePictureText" style={{"paddingLeft":"0"}}>
											<span>Limit the amount you can buy/send or trade:</span>
											<br />
											<label>
												<input checked type="radio" name="" />
												<span className="changePictureText" style={{"paddingLeft":"10px","float":"right","paddingTop":"5px"}}><span style={{"fontWeight":"200"}}>$2,000</span></span>
											</label>
										</p>
										<br />
										<p class="uploadButton">
											<Link style={{"backgroundColor":"rgb(6, 103, 208)",'color':'white'}} to="/support/rsl/">Raise Limits</Link>
										</p>
									</div>
									<div className="pull-left twoFactor2" style={{"width":"50%"}}>
										<p className="changePictureText" style={{"paddingLeft":"0"}}>
											<span>Withdraw Limits</span>
											<br />
											<label>
												<input checked type="radio" name="" />
												<span className="changePictureText" style={{"paddingLeft":"10px","float":"right","paddingTop":"5px"}}><span style={{"fontWeight":"200"}}>$2,000</span></span>
											</label>
										</p>
										<br />
										<p class="uploadButton">
											<Link style={{"backgroundColor":"rgb(6, 103, 208)",'color':'white'}} to="/support/rwl/">Raise Limits</Link>
										</p>
									</div>								
								</div>
								<br style={{"clear":"both"}} />
								<br />
								<br />
							</div>
						</div>
						<div className="dashModal seperator" style={{"width":"10%"}}></div>
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}

export class ActivityPage extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"accountActivityPage":0,
			"accountActivityTotal":7,
			"webSessionsPage":0,
			"webSessionsTotal":0,
			"webSessions":[],
			"sessionData":[],
			"queryLimit":10
		}
	}
	componentDidMount(){
		ReactGA.pageview(window.location.pathname + window.location.search);
		var r = this;
		window.scrollTo(0, 0)
		document.title = "Activity – FNB";
		if (Parse.User.current()) {
			var userPointer = {
			  "__type": 'Pointer',
			  "className": '_User',
			  "objectId":  Parse.User.current().id
			}
			var Users = Parse.Object.extend("_User");
			var query = new Parse.Query(Users);
			query.get(Parse.User.current().id, {
			success: function(results) {
				r.setState({
					"phone":results.get('phone'),
					"phoneVerified":results.get('phoneVerified')
				})
			}, error:function(err){
				alert(err)
			}});
			this.loadFSession(this.state.accountActivityPage)
			this.loadWebSession(this.state.webSessionsPage);
			this.loadConfirmedDevices(this.state.confirmedDevicesPage);
		}
	}
	loadFSession = (pageNumber) => {
		var r = this;
		var userPointer = {
		  "__type": 'Pointer',
		  "className": '_User',
		  "objectId":  Parse.User.current().id
		}
		var FSession = Parse.Object.extend("FSession");
		var query = new Parse.Query(FSession);
		query.equalTo("user", userPointer);
		query.count({
		  success: function(results) {
		  	r.setState({"accountActivityTotal":Math.round(results / r.state.queryLimit)});
		  }
		});
		var FSession = Parse.Object.extend("FSession");
		var query = new Parse.Query(FSession);
		query.equalTo("user", userPointer);
		query.limit(this.state.queryLimit);
		query.descending('createdAt');
		query.skip(pageNumber * this.state.queryLimit);
		query.find({
		  success: function(results) {
		  	r.setState({"sessionData":results});
		  },
		  error: function(error) {
		   alert(error)
		  }
		});
		this.setState({"accountActivityPage":pageNumber});
	}
	loadWebSession = (pageNumber) => {
		var r = this;
		var userPointer = {
		  "__type": 'Pointer',
		  "className": '_User',
		  "objectId":  Parse.User.current().id
		}
		var FSession = Parse.Object.extend("_Session");
		var query = new Parse.Query(FSession);
		query.equalTo("user", userPointer);
		query.count({
		  success: function(results) {
		  	r.setState({"webSessionsTotal":Math.round(results / r.state.queryLimit)});
		  }
		});
		var FSession = Parse.Object.extend("_Session");
		var query = new Parse.Query(FSession);
		query.equalTo("user", userPointer);
		query.limit(this.state.queryLimit);
		query.skip(pageNumber * this.state.queryLimit);
		query.find({
		  success: function(results) {
		  	r.setState({"webSessions":results});
		  },
		  error: function(error) {
		   alert(error)
		  }
		});
		this.setState({"webSessionsPage":pageNumber});
	}
	loadConfirmedDevices = (pageNumber) => {
		var r = this;
		var userPointer = {
		  "__type": 'Pointer',
		  "className": '_User',
		  "objectId":  Parse.User.current().id
		}
		var FSession = Parse.Object.extend("confirmedDevices");
		var query = new Parse.Query(FSession);
		query.equalTo("user", userPointer);
		query.count({
		  success: function(results) {
		  	r.setState({"confirmedDevicesTotal":Math.round(results / r.state.queryLimit)});
		  }
		});
		var FSession = Parse.Object.extend("confirmedDevices");
		var query = new Parse.Query(FSession);
		query.equalTo("user", userPointer);
		query.limit(this.state.queryLimit);
		query.skip(pageNumber * this.state.queryLimit);
		query.find({
		  success: function(results) {
		  	r.setState({"confirmedDevices":results});
		  },
		  error: function(error) {
		   alert(error)
		  }
		});
		this.setState({"confirmedDevicesPage":pageNumber});
	}
	removeAllSessions = (e) => {
		if (e.type == "1") {
			this.setState({"verifyMessage1":true,"messageType1":"this session. This will also log you out of the platform.","pendingDelete1":e.id})
		} else if (e.type == "All") {
			this.setState({"verifyMessage1":true,"messageType1":"all your sessions. This will also log you out of the platform.","pendingDelete1":"all"})
		}
	}

	removeAllSessions1 =(e) => {

		if (this.state.pendingDelete1 == "all") {

			var _Session = Parse.Object.extend("_Session");
			var query = new Parse.Query(_Session);
			query.equalTo("user",  {
			  "__type": 'Pointer',
			  "className": '_User',
			  "objectId":  Parse.User.current().id
			});
			query.find({
			  success: function(results) {
			  	
			  	for (var i = 0; i < results.length; i++) {
			  		var object = results[i];
				    object.destroy({
					  success: function(myObject) {
			  	
					  },
					  error: function(myObject, error) {
					   console.log(error)
					  }
					});
			  	}
				Parse.User.logOut().then(() => {
					window.location.href = startUrl + "login/";
				});	
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});

		} else {

			var id = this.state.pendingDelete1;
			var GameScore = Parse.Object.extend("_Session");
			var query = new Parse.Query(GameScore);
			query.get(id, {
			  success: function(gameScore) {
				   gameScore.destroy({
					  success: function(myObject) {
						Parse.User.logOut().then(() => {
							window.location.href = startUrl + "login/";
						});					  	
					  },
					  error: function(myObject, error) {
					   console.log(error)
					  }
					});
			  },
			  error: function(object, error) {
			    console.log(error)
			  }
			});

		}


	}



	removeDevices = (e) => {
		if (e.type == "1") {
			this.setState({"verifyMessage":true,"messageType":"this device. This will also log you out.","pendingDelete":e.id})
		} else if (e.type == "All") {
			this.setState({"verifyMessage":true,"messageType":"all your devices. This will also log you out.","pendingDelete":"all"})
		}
	}
	removeThemDevices = (e) => {

		if (this.state.pendingDelete == "all") {

			var confirmedDevices = Parse.Object.extend("confirmedDevices");
			var query = new Parse.Query(confirmedDevices);
			query.equalTo("user",  {
			  "__type": 'Pointer',
			  "className": '_User',
			  "objectId":  Parse.User.current().id
			});
			query.find({
			  success: function(results) {
			  	
			  	for (var i = 0; i < results.length; i++) {
			  		var object = results[i];
				    object.destroy({
					  success: function(myObject) {
			  	
					  },
					  error: function(myObject, error) {
					   console.log(error)
					  }
					});
			  	}
				Parse.User.logOut().then(() => {
					window.location.href = startUrl + "login/";
				});	
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});

		} else {
			var id = this.state.pendingDelete;
			var GameScore = Parse.Object.extend("confirmedDevices");
			var query = new Parse.Query(GameScore);
			query.get(id, {
			  success: function(gameScore) {
				   gameScore.destroy({
					  success: function(myObject) {
						Parse.User.logOut().then(() => {
							window.location.href = startUrl + "login/";
						});					  	
					  },
					  error: function(myObject, error) {
					   console.log(error)
					  }
					});
			  },
			  error: function(object, error) {
			    console.log(error)
			  }
			});
		}
	}
	render(){
		return (
			<div>
				<div className="page settingsPage">
					<MainHeader />
					<div className="dashWrapperB">
						<div className="dashModal seperator" style={{"width":"10%"}}></div>						
						<div className="dashModal contentPage" style={{"width":"80%"}}>
							<div className="content " style={{"height":"auto"}}>
								<SettingsHeader />
								<div className="settingsWrapper Preferences">
									
									<p style={{"border":"0"}} className="title">Web Sessions</p>
									<p style={{"margin-bottom": "20px"}} class="description">These sessions are currently signed in to your account. {/*<a onClick={(e)=> this.removeAllSessions({"type":"All"})} className="pull-right" style={{"cursor":"pointer","color":"blue"}}>Sign out all other sessions</a>*/}</p>
									<div class="dashTableWrap accountActivityTableSettings">
										<hr style={{"margin": "0","padding": "0"}} />
										<table class="dashTable">
										  	<tbody>
											  	<tr class="dashTabHeader">
											    	<th>S.no</th>
											    	<th>Signed in</th>
											    	<th>Browser</th>
											    	<th>IP Address</th>
											    	<th>Near</th>
											    	<th>Current</th>
											    	{/*<th>Action</th>*/}
											 	 </tr>
											  	 {
											  	 	this.state.webSessions.map(function(index,key){
											  	 		return (
											  	 				<tr key={key}>
																    <td>{key+1 + "."}</td>
																    <td>{index.get('createdAt').toString()}</td>
																    <td>{index.get('browser')}</td>
																    <td>{index.get('ipAddress')}</td>
																    <td>{index.get('near')}</td>
																     <td><i className="fa fa-check"></i></td>
																</tr>
															)
											  	 	},this)
											  	 }

												 {
													this.state.webSessionsTotal != 0 ?
													<tr style={{"paddingRight":"0px"}}>

														<td colspan="4">
															Showing {this.state.webSessionsPage + 1} of {this.state.webSessionsTotal} pages
														</td>
														<td className="bttmFooterPaginate" colspan="3">
															<ul>
																{
																	this.state.webSessionsPage > 0 ?
																	<li onClick={(e)=>this.loadWebSession(this.state.webSessionsPage - 1)} >Previous</li>
																	:
																	<li className="disabled">Previous</li>
																}
																{[...Array(this.state.webSessionsTotal)].map((e, i) => {
																    return <li onClick={(e)=>this.loadWebSession(i)} className={this.state.webSessionsPage == i ? "active" : ""} key={i}>{i + 1}</li>
																},this)}
																{
																	this.state.webSessionsPage >= 0 && this.state.webSessionsPage+1 != this.state.webSessionsTotal ?
																	<li onClick={(e)=>this.loadWebSession(this.state.webSessionsPage + 1)} >Next</li>
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
									<br /><br />
									<p style={{"border":"0"}} className="title">Account Activity</p>
									<p style={{"margin-bottom": "20px"}} class="description">Recent activity on your account.</p>
									<div class="dashTableWrap accountActivityTableSettings">
										<hr style={{"margin": "0","padding": "0"}} />
										<table class="dashTable">
										  	<tbody>
											  	<tr class="dashTabHeader">
											    	<th>Action</th>
											    	<th>Authenticator</th>
											    	<th>Browser</th>
											    	<th>Country</th>
											    	<th>IP Address</th>
											    	<th>When</th>

											 	 </tr>
											  	 {
											  	 	this.state.sessionData.map(function(index,key){
											  	 		return (
											  	 				<tr key={key}>
																    <td>{index.get('description')}</td>
																    <td>{index.get('type')}</td>
																    <td style={{"width":"100px"}}>{index.get('Browser')}</td>
																    <td>{index.get('Country')}</td>
																    <td>{index.get('ipAddress')}</td>
																    <td>{formatDate(index.get('createdAt').toString())}</td>
																    
																</tr>
															)
											  	 	})
											  	 }
											  	{
											  		this.state.accountActivityTotal != 0 ?
													<tr style={{"paddingRight":"0px"}}>
														<td colspan="2">
															Showing {this.state.accountActivityPage + 1} of {this.state.accountActivityTotal} pages
														</td>
														<td className="bttmFooterPaginate" colspan="4">
															<ul>
																{
																	this.state.accountActivityPage > 0 ?
																	<li onClick={(e)=>this.loadFSession(this.state.accountActivityPage - 1)} >Previous</li>
																	:
																	<li className="disabled">Previous</li>
																}
																{[...Array(this.state.accountActivityTotal)].map((e, i) => {
																    return <li onClick={(e)=>this.loadFSession(i)} className={this.state.accountActivityPage == i ? "active" : ""} key={i}>{i + 1}</li>
																},this)}
																{
																	this.state.accountActivityPage >= 0 && this.state.accountActivityPage+1 != this.state.accountActivityTotal ?
																	<li onClick={(e)=>this.loadFSession(this.state.accountActivityPage + 1)} >Next</li>
																	:
																	<li className="disabled">Next</li>
																}
															</ul>
														</td>
													</tr> : ""												  		
											  	}

											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
						<div className="dashModal seperator" style={{"width":"10%"}}></div>
						<br style={{"clear":"both"}} />
					</div>
				</div>
				<Footer />
			</div>
		)
	}
}


class SettingsHeader extends React.Component {
	render(){
		return (
			<div className="settingsHeader">
				<nav>
					<NavLink to="/settings/profile" activeClassName="active">Compliance</NavLink>
					{/*<NavLink to="/settings/verify" activeClassName="active">Verification</NavLink>*/}

					<NavLink to="/settings/preferences" activeClassName="active">Preferences</NavLink>
					<NavLink to="/settings/security" activeClassName="active">Security</NavLink>
					<NavLink to="/settings/limits" activeClassName="active">Limits</NavLink>
					<NavLink to="/settings/activity" activeClassName="active">Activity</NavLink>
					<Link to="/profile/aboutme" className="pull-right" activeClassName="active">My Profile</Link>
				</nav>
			</div>
		)
	}
}

function formatDate(dates) {
	var date = new Date(dates);
	var mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	return mS[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
}