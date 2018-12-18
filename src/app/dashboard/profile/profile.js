import React from 'react';
import ReactDOM from 'react-dom';
import {MainHeader,Footer} from "../header";
import {NavLink,Link} from 'react-router-dom';
import "./profile.css";
import Parse from "parse";
import {startUrl} from "../../../index";
import $ from "jquery";
import ReactGA from 'react-ga';
import BlankImage from "../../../images/FanbaseHeader.jpg";
import {ModalWrapper} from "../modal";

ReactGA.initialize('UA-115007597-1');
export const as3url = "https://s3.amazonaws.com/larecoin/profileImages/";
var userID = "";



export class MainProfile extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"src":BlankImage,
			"page":0,
			"key":0,
			"limit":20,
			"data":[],
			"followers":[]
		}
	}
	componentDidMount(){
		ReactGA.pageview(window.location.pathname + window.location.search);
		document.title = "Posts - FNB";
		var key = this.props.match.params.key;
		if (key) {
			userID = key;
			this.handleLoadFollowers();
		} else {
			userID = Parse.User.current().id;
			this.handleLoadFollowers();
		}
	}	
	componentDidReceiveProps(prps) {
		var key = prps.match.params.key;
		if (key) {
			userID = key;
			this.handleLoadFollowers();
		} else {
			userID = Parse.User.current().id;
			this.handleLoadFollowers();
		}
	}



	handleLoadFollowers = () => {
		var r = this;
		var Followers = Parse.Object.extend("Followers");
		var FollowersQ = new Parse.Query(Followers);
		FollowersQ.equalTo("follower",{
			"__type":"Pointer",
			"className":"_User",
			"objectId":userID
		});
		FollowersQ.limit(10000);
		FollowersQ.select('following','objectId');
		FollowersQ.find({
		  success: function(results) {
		  	r.setState({"followers":results});
		  	r.handleLoadPosts(r.state.page);
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});
	}
	handleAddPost = (object) => {
		this.setState(previousState => ({
		    "data": [object, ...previousState.data]
		}));	
	}
	handleLoadPosts = (page) => {
		var r = this;
		var Posts = Parse.Object.extend("Posts");
		var query = new Parse.Query(Posts);
		var foll = r.state.followers;
		query.equalTo('user',{
			"__type":"Pointer",
			"className":"_User",
			"objectId":userID
		});
		var tempQuery = new Parse.Query(Posts);
		foll.map(function(follower){
			tempQuery.equalTo('user',{
				"__type":"Pointer",
				"className":"_User",
				"objectId":follower.get('following').id
			});
		    query = Parse.Query.or(query, tempQuery);
		})
		query.ascending('createdAt');
		query.equalTo('active',true);
		query.limit(this.state.limit);
		query.skip(this.state.limit * page);
		query.find({
		  success: function(results) {
		  		results.map(function(result) {
			  		var object = result;
			  		var post = object.get("user");
			  		var objectID = object.id;
			  		var postDescript = object.get('postDescript');
			  		var flagged = object.get('flagged');
			  		var createdAt = object.get('createdAt');
			  		var type = object.get('type');
			  		var sharedPost = object.get('sharedPost');
			  		var sharedFrom = "";

			  		if (type == "share") {
			  			sharedPost.fetch({
			  				success:function(sharePostData) {
			  					postDescript = sharePostData.get('postDescript');
			  					var sharedFrom = sharePostData.get('user');
			  					sharedFrom.fetch({
			  						success:function(sharedFromData){
			  							sharedFrom = sharedFromData.get("fname") + " " + sharedFromData.get('lname');
									    post.fetch({
									        success: function(data) {
									            var name = data.get("fname") + " " + data.get('lname');
									            var src = data.get('src') == undefined ? "https://i.stack.imgur.com/l60Hf.png" : as3url +  data.get('src').name();
												

												var Likes = Parse.Object.extend("Likes");
												var query2 = new Parse.Query(Likes);
												query2.equalTo("Post", {
													"__type":"Pointer",
													"className":"Posts",
													"objectId":objectID
												});
												query2.equalTo('active',true);
												query2.select('User','objectId');
												query2.find({
												  success: function(likes) {
												  var ls = likes.map(function(l){
												  	return l.get('User').id == Parse.User.current().id
												  });
													var Comments = Parse.Object.extend("Comments");
													var CommentsQ = new Parse.Query(Comments);
													CommentsQ.equalTo("Post", {
														"__type":"Pointer",
														"className":"Posts",
														"objectId":objectID
													});
													CommentsQ.equalTo('active',true);
													CommentsQ.find({
													  success: function(comments) {
													  	var allComments = [];
													 	comments.map(function(comment,i) {
													  		var commentID = comment.id;
													  		var commentUser = comment.get("User");
													  		var commentText = comment.get('comment');
													  		commentUser.fetch({
													  			success: function(commentDateUser) {
														            var cMName = commentDateUser.get("fname") + " " + commentDateUser.get('lname');
														            var cMSRC = commentDateUser.get('src') == undefined ? "https://i.stack.imgur.com/l60Hf.png" : as3url +  commentDateUser.get('src').name();
														            allComments.push({
														            	"id":commentID,
														            	"commentUserId":commentUser.id,
														            	"name":cMName,
														            	"src":cMSRC,
														            	"comment":commentText,
														            	"userCreatedBy":commentUser.id == Parse.User.current().id
														            });

														            if (comments.length - 1 == i) {
																		var f0 = {
																			"id":objectID,
																			"fname": Parse.User.current().get('fname'),
																			"name":name,
																			"src":src,
																			"postDescript":postDescript,
																			"flagged":flagged,
																			"createdAt":createdAt,
																			"likes":likes.length,
																			"liked":ls,
																			"userCreatedBy":post.id == Parse.User.current().id,
																			"comments":allComments,
																			"type":type,
																			"sharedFrom":sharedFrom
																		}
																		r.setState(previousState => ({
																		    "data": [...previousState.data, f0]
																		}));
														            }
													  			}
													  		});
													  	})	
													 	if (comments.length == 0) {
															var f0 = {
																"id":objectID,
																"fname": Parse.User.current().get('fname'),
																"name":name,
																"src":src,
																"postDescript":postDescript,
																"flagged":flagged,
																"createdAt":createdAt,
																"likes":likes.length,
																"liked":ls,
																"userCreatedBy":post.id == Parse.User.current().id,
																"comments":[],
																"type":type,
																"sharedFrom":sharedFrom
															}
															r.setState(previousState => ({
															    "data": [...previousState.data, f0]
															}));
													 	}
													  },
													  error: function(error) {
													    alert("Error: " + error.code + " " + error.message);
													  }
													});
												  }
												});				
									        }
									    });




			  						}
			  					})







			  				}
			  			})





			  			//alert(sharedPost.id)




			  		} else {
					    post.fetch({
					        success: function(data) {
					            var name = data.get("fname") + " " + data.get('lname');
					            var src = data.get('src') == undefined ? "https://i.stack.imgur.com/l60Hf.png" : as3url +  data.get('src').name();
								var Likes = Parse.Object.extend("Likes");
								var query2 = new Parse.Query(Likes);
								query2.equalTo("Post", {
									"__type":"Pointer",
									"className":"Posts",
									"objectId":objectID
								});
								query2.equalTo('active',true);
								query2.select('User','objectId');
								query2.find({
								  success: function(likes) {
								  var ls = likes.map(function(l){
								  	return l.get('User').id == Parse.User.current().id
								  });


								  
									var Comments = Parse.Object.extend("Comments");
									var CommentsQ = new Parse.Query(Comments);
									CommentsQ.equalTo("Post", {
										"__type":"Pointer",
										"className":"Posts",
										"objectId":objectID
									});
									CommentsQ.equalTo('active',true);
									CommentsQ.find({
									  success: function(comments) {
									  	var allComments = [];
									 	comments.map(function(comment,i) {
									  		var commentID = comment.id;
									  		var commentUser = comment.get("User");
									  		var commentText = comment.get('comment');
									  		commentUser.fetch({
									  			success: function(commentDateUser) {
										            var cMName = commentDateUser.get("fname") + " " + commentDateUser.get('lname');
										            var cMSRC = commentDateUser.get('src') == undefined ? "https://i.stack.imgur.com/l60Hf.png" : as3url +  commentDateUser.get('src').name();
										            allComments.push({
										            	"id":commentID,
										            	"commentUserId":commentUser.id,
										            	"name":cMName,
										            	"src":cMSRC,
										            	"comment":commentText,
										            	"userCreatedBy":commentUser.id == Parse.User.current().id
										            });

										            if (comments.length - 1 == i) {
														var f0 = {
															"id":objectID,
															"fname": Parse.User.current().get('fname'),
															"name":name,
															"src":src,
															"postDescript":postDescript,
															"flagged":flagged,
															"createdAt":createdAt,
															"likes":likes.length,
															"liked":ls,
															"userCreatedBy":post.id == Parse.User.current().id,
															"comments":allComments,
															"type":type,
															"sharedFrom":""
														}
														r.setState(previousState => ({
														    "data": [...previousState.data, f0]
														}));
										            }
									  			}
									  		});
									  	})	
									 	if (comments.length == 0) {
											var f0 = {
												"id":objectID,
												"fname": Parse.User.current().get('fname'),
												"name":name,
												"src":src,
												"postDescript":postDescript,
												"flagged":flagged,
												"createdAt":createdAt,
												"likes":likes.length,
												"liked":ls,
												"userCreatedBy":post.id == Parse.User.current().id,
												"comments":[],
												"type":type,
												"sharedFrom":""
											}
											r.setState(previousState => ({
											    "data": [...previousState.data, f0]
											}));
									 	}
									  },
									  error: function(error) {
									    alert("Error: " + error.code + " " + error.message);
									  }
									});
								  }
								});				
					        }
					    });
			  		}
		  		})
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
					<div className="profilePageWrapper">
						<ProfileSubHeader changeSrc={(e) => this.setState({"src":e})}>
						<div className="">
							<div className="leftSideProfile">
								<PostContainer addNewPost={(e) => this.handleAddPost(e)} src={this.state.src} />
								<div className="postWrapperContent">
									{
										this.state.data.map(function(o,i){
											return (<PostTypeText object={o} key={i} src={this.state.src} />)
										},this)
									}
								</div>
							</div>
							<div className="rightSideProfile">
								
							</div>
							<br style={{"clear":"both"}} />
						</div>
						</ProfileSubHeader>
						<br style={{"clear":"both"}} />
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}
























class PostContainer extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"fname":"",
			"posting":false,
			"anotherUser":false
		}
	}
	componentDidMount() {
		var r = this;
		setTimeout(function(){
			if (userID == Parse.User.current().id) {
				r.setState({"anotherUser":false});
			} else {
				r.setState({"anotherUser":true});
			}
		},0)
		this.setState({"fname":Parse.User.current().get('fname')})
		
	}
	handlePostClick = (e) => {
		var postDescript = $('#postTextArea').text();
		if (postDescript == "") {
		} else {
			var r = this;
			this.setState({"posting":true});
			var Posts = Parse.Object.extend("Posts");
			var posting = new Posts();
			posting.set("user", Parse.User.current());
			posting.set("postDescript", postDescript);
			posting.set("flagged", 0);
			posting.set("active", true);
			posting.set("type", "default");
			posting.save(null, {
			  success: function(data) {
			  	window.location.reload();
				// var f0 = {
				// 	"id":data.id,
				// 	"fname": Parse.User.current().get('fname'),
				// 	"name":Parse.User.current().get('fname') + " " + Parse.User.current().get('lname'),
				// 	"src":r.props.src,
				// 	"postDescript":postDescript,
				// 	"flagged":0,
				// 	"createdAt":data.get('createdAt'),
				// 	"likes":0,
				// 	"liked":false,
				// 	"userCreatedBy":true,
				// 	"comments":[]
				// };
				// $('#postTextArea').text('');
				// r.setState({"posting":false})
				// r.props.addNewPost(f0);
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
				<div className="postContent">
					<div className="postHeader">
						<ul>
							<li><a className="active"><i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;&nbsp;Create a Post</a></li>
						</ul>
					</div>
					<div className="upTrianglePost"></div>
					<div className="postContainer">
						<a><img className="postProfileImage" src={this.props.src} /></a>
						<div id="postTextArea" className="postTextArea" contenteditable="" id="postTextArea" data-placeholder={this.state.anotherUser == true ? "Write something to them" : "What's on your mind, "+this.state.fname+"?"} style={{"fontSize": "15px", "fontWeight": "300"}}></div>
						<p style={{"clear": "both","margin": "0","padding": "0"}}></p>
					</div>
					<div className="finalPostButtons">
						{
							this.state.posting == false ?
							<a onClick={this.handlePostClick} className="pull-right">Post</a>
							: 
							<a style={{"backgroundColor":"#28cd6a"}} className="pull-right">Posting</a>
						}
					</div>
				</div>
			</div>
		)
	}
}

class PostTypeText extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			"object":null,
			"hideCurrent":false,
			"commentInput":"",
		};
	}
	componentDidMount(){
		this.setState({"object":this.props.object});
	}
	handlePostLike = (e,postID,liked) => {
		var r = this;
		if (liked == "true") {

			r.setState(prevState => ({
			    object: {
			        ...prevState.object,
			        "liked": 'false',
			        "likes":r.state.object.likes - 1
			    }
			}))

			var GameScore = Parse.Object.extend("Likes");
			var query = new Parse.Query(GameScore);
			query.equalTo("User", {
				"__type":"Pointer",
				"className":"_User",
				"objectId":Parse.User.current().id
			});
			query.equalTo("Post", {
				"__type":"Pointer",
				"className":"Posts",
				"objectId":postID
			});
			query.first({
			  success: function(data) {
			  	data.set('active',false);
			  	data.save();
			  },
			  error: function(error) {
			    alert("Error: " + error.code + " " + error.message);
			  }
			});
		} else {
			var Likes = Parse.Object.extend("Likes");
			var lks = new Likes();
			r.setState(prevState => ({
			    object: {
			        ...prevState.object,
			        "liked": 'true',
			        "likes":r.state.object.likes + 1
			    }
			}))	
			lks.set("User", {
				"__type":"Pointer",
				"className":"_User",
				"objectId":Parse.User.current().id
			});
			lks.set("Post", {
				"__type":"Pointer",
				"className":"Posts",
				"objectId":postID
			});
			lks.set('active',true);
			lks.save(null, {
			  success: function(gameScore) {
		   
			  },
			  error: function(gameScore, error) {
			    alert(error.message);
			  }
			});

		}
	}
	handleComment = (e,postID) => {
		var r = this;
		var Comments = Parse.Object.extend("Comments");
		var comm = new Comments();
		comm.set("User", Parse.User.current());
		comm.set("Post", {
			"__type":"Pointer",
			"className":"Posts",
			"objectId":postID
		});
		comm.set("comment", r.state.commentInput);
		comm.set("active", true);
		comm.save(null, {
		  success: function(data) {
		  	var allComments = r.state.object.comments;
		  	var c = {
            	"id":data.id,
            	"commentUserId":Parse.User.current().id,
            	"name":Parse.User.current().get('fname') + " " +  Parse.User.current().get('lname'),
            	"src":Parse.User.current().get('src') == undefined ? "https://i.stack.imgur.com/l60Hf.png" : as3url +  Parse.User.current().get('src').name(),
            	"comment":r.state.commentInput,
            	"userCreatedBy":true
            }
           r.setState({"commentInput":""});
            allComments.push(c);
			r.setState(prevState => ({
			    "object": {
			        ...prevState.object,
			        "comments": allComments
			    }
			}))	
		  },
		  error: function(gameScore, error) {
		    alert(error.message);
		  }
		});		
	}
	handleHidePost(e) {
		var r = this;
		var Posts = Parse.Object.extend("Posts");
		var query = new Parse.Query(Posts);
		query.get(e, {
		  success: function(data) {
		   data.set('active',false);
		   data.save();
		   r.setState({"hideCurrent":true});
		  },
		  error: function(object, error) {
		  	alert(error.message)
		  }
		});
	}
	handleUnhidePost = (e) => {
		var r = this;
		var Posts = Parse.Object.extend("Posts");
		var query = new Parse.Query(Posts);
		query.get(e, {
		  success: function(data) {
		   data.set('active',true);
		   data.save();
		   r.setState({"hideCurrent":false});
		  },
		  error: function(object, error) {
		  	alert(error.message)
		  }
		});		
	}
	handleSharePost = (e,objectId) => {
		$(e.target).css('color',"#28cd6a");
		$(e.target).html('<i class="fa fa-share" aria-hidden="true"></i>&nbsp;&nbsp;Shared!');
		var Posts = Parse.Object.extend("Posts");
		var posting = new Posts();
		posting.set("user", {
			"__type":"Pointer",
			"className":"_User",
			"objectId":Parse.User.current().id
		});
		posting.set("sharedPost", {
			"__type":"Pointer",
			"className":"Posts",
			"objectId":objectId
		});
		posting.set("active", true);
		posting.set("flagged", 0);
		posting.set("type", "share");
		posting.save(null, {
		  success: function(gameScore) {
		   	
		  },
		  error: function(gameScore, error) {
		    alert('Failed to create new object, with error code: ' + error.message);
		  }
		});
	}
	render(){
		return (
			<div>
			{
				this.state.object != null ?
				<div className="socialPost">
					<p className="title">
						<img src={this.state.object.src} />
						<span className="" style={{"fontSize":"15px"}}>
							{
								this.state.object.sharedFrom != "" ?
								<span><b>{this.state.object.name}</b> shared <b>Ali Fardos's</b> post</span>
								:
								<b>{this.state.object.name}</b>
							}
						</span>
						<span className="time">{getTime(this.state.object.createdAt)}&nbsp;&nbsp;|&nbsp;&nbsp;<span className="date">{getDate(this.state.object.createdAt)}</span><br />
							<span className="socialPostButton">
									{
										this.state.object.userCreatedBy == true ?
										<span>
											{ this.state.hideCurrent == false ?
												<a style={{"cursor":"pointer"}} onClick={(e) => this.handleHidePost(this.state.object.id)}>Delete</a>
											: 
												<a style={{"cursor":"pointer"}} onClick={(e) => this.handleUnhidePost(this.state.object.id)}>Unhide</a>
											}
											&nbsp;&nbsp;|&nbsp;&nbsp;
										</span>
										: ""
									}
									<Link to={"/support/" + this.state.object.id}><span className="socialPostButton"><a>Report</a></span></Link>
								</span>
						</span>
					</p>
					<div style={{"paddingLeft": "15px","paddingRight": "15px","paddingBottom": "25px","marginTop":"10px"}}>
						<span className="comment" style={{"fontSize": "13px"}}>{this.state.object.postDescript}</span>
					</div>
					<div className="postButtons">
						<a onClick={(e) => this.handlePostLike(e,this.state.object.id,this.state.object.liked)} className={this.state.object.liked == "true" ? "activeLike" : "like"}><i className="fa fa-thumbs-up" aria-hidden="true"></i>&nbsp;&nbsp;{this.state.object.liked == "true" ? "Liked" : "Like"}</a>&emsp;
						<a onClick={(e) => this.handleSharePost(e,this.state.object.id)}><i className="fa fa-share" aria-hidden="true"></i>&nbsp;&nbsp;Share</a>
						<span className="likeCheers"><span className="totalCountLikes">{this.state.object.likes}</span>&emsp;&nbsp;&nbsp;<i className="fa fa-comments"></i><i className="fa fa-thumbs-up"></i></span>
					</div>
					<div className="recogPostComment">
						<div className="recoPostingSection">
							{
								this.state.object.comments.map(function(comment,i){
									return (
										<CommentRow comment={comment} key={i} />
									)
								})
							}
						</div>
						<div className="recoPostingComment">
							<img className="profileImage1" src={this.props.src} />
							<span>
								<input value={this.state.commentInput} onChange={(e) => this.setState({"commentInput":e.target.value})} type="text" placeholder={"What's on your mind, "+this.state.object.fname+"?"} />
								<a onClick={(e) => this.handleComment(e,this.state.object.id)} className="fBttnComment"><i className="fa fa-comments"></i></a>
							</span>
							<br style={{"clear": "both"}} />
						</div>
					</div>
				</div>
				: ""
			}
			</div>
		)
	}
}


















export class CommentRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"hideCurrent":false
		}
	}
	handleDeleteComment = (e) => {
		var r = this;
		var Comments = Parse.Object.extend("Comments");
		var query = new Parse.Query(Comments);
		r.setState({"hideCurrent":true});
		query.get(r.props.comment.id, {
		  success: function(data) {
		   data.set('active',false);
		   data.save();
		  },
		  error: function(object, error) {
		  	alert(error.message)
		  }
		});
	}
	handleUnhideComment = (e) => {
		var r = this;
		var Comments = Parse.Object.extend("Comments");
		var query = new Parse.Query(Comments);
		r.setState({"hideCurrent":false});
		query.get(r.props.comment.id, {
		  success: function(data) {
		   data.set('active',true);
		   data.save();
		  },
		  error: function(object, error) {
		  	alert(error.message)
		  }
		});
	}
	render(){
		return (
		<div>
				<div className="comment">
					<img className="profileImage1" src={this.props.comment.src} />
					<div style={{"paddingLeft": "40px"}}>
						<p>
							<span className="name">{this.props.comment.name}</span>
							{
								this.props.comment.userCreatedBy == true && this.state.hideCurrent == false ?
								<span onClick={this.handleDeleteComment} className="pull-right deleteBttn">Delete</span>
								: this.props.comment.userCreatedBy == true && this.state.hideCurrent == true ?
								<span onClick={this.handleUnhideComment} className="pull-right deleteBttn">Unhide</span>
								: ""
							}
							<br />
							<span className="comment">{this.props.comment.comment}</span>

						</p>
					</div>
				</div>
		</div>
		)
	}
}










export class AboutMeProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"currentState":0,
			"userId":"",
			"userEmail":"",
			"RegisteredDate":"",
			"lastUpdated":"",
			"monthDate":"",
			"dayDate":"",
			"yearDate":"",
			"accreditedStatus":"",
			"about":"",
			"gender":"",
			"anotherUser":false
		}
	}
	componentDidMount() {
		document.title = "About me - FNB";
		var cu = Parse.User.current();
		var r = this;
		if (cu) {
			var key = this.props.match.params.key;
			if (key) {
				userID = key;
				this.setState({"anotherUser":true});
			} else {
				userID = Parse.User.current().id;
				this.setState({"anotherUser":false});
			}
			var Users = Parse.Object.extend("_User");
			var query = new Parse.Query(Users);
			query.get(Parse.User.current().id, {
			success: function(results) {
				if (results.get('firstTimeLoggedIn')) {
					r.setState({"showFirstTimeUser":true})
				}
				r.setState({
						"userId":results.id,
						"RegisteredDate":results.get('createdAt').toString(),
						"lastUpdated":results.get('updatedAt').toString(),
						"monthDate":results.get('monthDate') == undefined ? "default" : results.get('monthDate'),
						"dayDate":results.get('dayDate') == undefined ? "default" : results.get('dayDate'),
						"yearDate":results.get('yearDate') == undefined ? "default" : results.get('yearDate'),
						"userEmail":results.get('username'),
						"accreditedStatus":results.get('accreditedStatus') == "Complete" ? true : false,
						"about":results.get('about') == undefined ? "" : results.get('about'),
						"gender":results.get('gender') == undefined ? "default" : results.get('gender')
					})
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
			window.location.href = startUrl + "login";
		}		
	}
	saveAbout = (e) => {
		var r = this;
		$(e.target).addClass('saved');
		$(e.target).html('Saved!');
		var _User = Parse.Object.extend("_User");
		var query = new Parse.Query(_User);
		query.get(Parse.User.current().id, {
		  success: function(data) {
		   	data.set('about',r.state.about);
		   	data.save();
		  },
		  error: function(error) {
		  	alert(error.message)
		  }
		});
	}
	saveGender = (e) => {
		var r = this;
		$(e.target).addClass('saved');
		$(e.target).html('Saved!');
		var _User = Parse.Object.extend("_User");
		var query = new Parse.Query(_User);
		query.get(Parse.User.current().id, {
		  success: function(data) {
		   	data.set('gender',r.state.gender);
		   	data.save();
		  },
		  error: function(error) {
		  	alert(error.message)
		  }
		});
	}
	saveDOB = (e) => {
		var r = this;
		$(e.target).addClass('saved');
		$(e.target).html('Saved!');
		var _User = Parse.Object.extend("_User");
		var query = new Parse.Query(_User);
		query.get(Parse.User.current().id, {
		  success: function(data) {
		   	data.set('monthDate',r.state.monthDate);
		   	data.set('dayDate',r.state.dayDate);
		   	data.set('yearDate',r.state.yearDate);
		   	data.save();
		  },
		  error: function(error) {
		  	alert(error.message)
		  }
		});
	}
	render(){
		return (
			<div>
				<div className="page ">
					<MainHeader />
					<div className="profilePageWrapper">
						<ProfileSubHeader>
						<div className="profileContentBox" style={{"width":"100%"}}>
							<div className="profileHeaderT">
								<p className="title">My Profile</p>
							</div>
							<div>
								<div className="aboutmeLeftSide">
									<ul>
										<li onClick={(e)=> this.setState({"currentState":0})} className={this.state.currentState == 0 ? "active" : ""}>Overview</li>
										<li onClick={(e)=> this.setState({"currentState":1})} className={this.state.currentState == 1 ? "active" : ""}>My Details</li>
										<li onClick={(e)=> this.setState({"currentState":2})} className={this.state.currentState == 2 ? "active" : ""}>Education</li>
										<li onClick={(e)=> this.setState({"currentState":3})} className={this.state.currentState == 3 ? "active" : ""}>Skills</li>
										<li onClick={(e)=> this.setState({"currentState":4})} className={this.state.currentState == 4 ? "active" : ""}>Projects</li>
										<li onClick={(e)=> this.setState({"currentState":5})} className={this.state.currentState == 5 ? "active" : ""}>Experience</li>
										<li onClick={(e)=> this.setState({"currentState":6})} className={this.state.currentState == 6 ? "active" : ""}>Social</li>
										<li onClick={(e)=> this.setState({"currentState":7})} className={this.state.currentState == 7 ? "active" : ""}>Resume</li>
									</ul>
								</div>
								<div className="aboutmeRightSide">
									{
										this.state.currentState == 1 ?
										<div className="mainContainer">
											<div className="textRow">
												<div className="textRowTitle">Introduction</div>
												<input value={this.state.introduction} disabled={this.state.anotherUser == true ? "true" : ""} onChange={(e) => this.setState({"introduction":e.target.value})} className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Write a one sentence introduction"} />
												{
													this.state.anotherUser == true ?
													""
													:
													<a onClick={this.saveAbout} className="saveBttn pull-right">Save</a>
												}
											</div>
											<div className="textRow">
												<div className="textRowTitle">About you</div>
												<textarea value={this.state.about} disabled={this.state.anotherUser == true ? "true" : ""} onChange={(e) => this.setState({"about":e.target.value})} className="finput" rows="5" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Write some details about yourself"}></textarea>
												{
													this.state.anotherUser == true ?
													""
													:
													<a onClick={this.saveAbout} className="saveBttn pull-right">Save</a>
												}
											</div>
											<div className="textRow">
												<div className="textRowTitle">Date of birth</div>
												<div className="inputGroups" style={{"paddingTop":"10px"}}>
													<p>
														<select disabled={this.state.anotherUser == true ? "true" : ""} ref="monthBRef" className="monthB" value={this.state.monthDate} onChange={(e) => this.setState({ "monthDate": e.target.value })} style={{"width": "40%","marginRight":"5px"}}>
															<option value="default">Month</option>
															<option value="January">January</option>
															<option value="February">February</option>
															<option value="March">March</option>
															<option value="April">April</option>
															<option value="May">May</option>
															<option value="June">June</option>
															<option value="July">July</option>
															<option value="August">August</option>
															<option value="September">September</option>
															<option value="October">October</option>
															<option value="November">November</option>
															<option value="December">December</option>
														</select>
														<select disabled={this.state.anotherUser == true ? "true" : ""} ref="dayDateRef" value={this.state.dayDate} className="dayB" onChange={(e) => this.setState({ "dayDate": e.target.value })} style={{"width": "28%","marginRight":"5px"}}>
														<option value="default">Day</option>
														<option value="1">1</option>
														<option value="2">2</option>
														<option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option><option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option></select>
														<select disabled={this.state.anotherUser == true ? "true" : ""} ref="yearDateRef" value={this.state.yearDate} className="yearB" onChange={(e) => this.setState({ "yearDate": e.target.value })} style={{"width": "30%","paddingRight":"0"}}>
														<option value="default">Year</option>
														<option value="1900">1900</option>
														<option value="1901">1901</option><option value="1902">1902</option><option value="1903">1903</option><option value="1904">1904</option><option value="1905">1905</option><option value="1906">1906</option><option value="1907">1907</option><option value="1908">1908</option><option value="1909">1909</option><option value="1910">1910</option><option value="1911">1911</option><option value="1912">1912</option><option value="1913">1913</option><option value="1914">1914</option><option value="1915">1915</option><option value="1916">1916</option><option value="1917">1917</option><option value="1918">1918</option><option value="1919">1919</option><option value="1920">1920</option><option value="1921">1921</option><option value="1922">1922</option><option value="1923">1923</option><option value="1924">1924</option><option value="1925">1925</option><option value="1926">1926</option><option value="1927">1927</option><option value="1928">1928</option><option value="1929">1929</option><option value="1930">1930</option><option value="1931">1931</option><option value="1932">1932</option><option value="1933">1933</option><option value="1934">1934</option><option value="1935">1935</option><option value="1936">1936</option><option value="1937">1937</option><option value="1938">1938</option><option value="1939">1939</option><option value="1940">1940</option><option value="1941">1941</option><option value="1942">1942</option><option value="1943">1943</option><option value="1944">1944</option><option value="1945">1945</option><option value="1946">1946</option><option value="1947">1947</option><option value="1948">1948</option><option value="1949">1949</option><option value="1950">1950</option><option value="1951">1951</option><option value="1952">1952</option><option value="1953">1953</option><option value="1954">1954</option><option value="1955">1955</option><option value="1956">1956</option><option value="1957">1957</option><option value="1958">1958</option><option value="1959">1959</option><option value="1960">1960</option><option value="1961">1961</option><option value="1962">1962</option><option value="1963">1963</option><option value="1964">1964</option><option value="1965">1965</option><option value="1966">1966</option><option value="1967">1967</option><option value="1968">1968</option><option value="1969">1969</option><option value="1970">1970</option><option value="1971">1971</option><option value="1972">1972</option><option value="1973">1973</option><option value="1974">1974</option><option value="1975">1975</option><option value="1976">1976</option><option value="1977">1977</option><option value="1978">1978</option><option value="1979">1979</option><option value="1980">1980</option><option value="1981">1981</option><option value="1982">1982</option><option value="1983">1983</option><option value="1984">1984</option><option value="1985">1985</option><option value="1986">1986</option><option value="1987">1987</option><option value="1988">1988</option><option value="1989">1989</option><option value="1990">1990</option><option value="1991">1991</option><option value="1992">1992</option><option value="1993">1993</option><option value="1994">1994</option><option value="1995">1995</option><option value="1996">1996</option><option value="1997">1997</option><option value="1998">1998</option><option value="1999">1999</option><option value="2000">2000</option><option value="2001">2001</option><option value="2002">2002</option><option value="2003">2003</option><option value="2004">2004</option><option value="2005">2005</option><option value="2006">2006</option><option value="2007">2007</option><option value="2008">2008</option><option value="2009">2009</option><option value="2010">2010</option><option value="2011">2011</option><option value="2012">2012</option><option value="2013">2013</option><option value="2014">2014</option><option value="2015">2015</option><option value="2016">2016</option><option value="2017">2017</option></select>							
													</p>
												</div>
												{
													this.state.monthDate != "default" || this.state.dayDate != "default" || this.state.yearDate != "default" ? 
													<a onClick={this.saveDOB} style={{"marginTop":"10px"}} className="saveBttn pull-right">Save</a>
													: ""

												}
											</div>
											<div className="textRow">
												<div className="textRowTitle">Gender</div>
													<div className="inputGroups" style={{"paddingTop":"10px"}}>
														<select disabled={this.state.anotherUser == true ? "true" : ""} ref="monthBRef" className="monthB" value={this.state.gender} onChange={(e) => this.setState({ "gender": e.target.value })} style={{"width": "40%","marginRight":"5px"}}>
															<option value="default">Choose a Gender</option>
															<option value="Male">Male</option>
															<option value="Female">Female</option>
														</select>
													</div>
													{
														this.state.gender != "default" && this.state.anotherUser == false ?
														<a onClick={this.saveGender} className="saveBttn pull-right">Save</a>
														: ""
													}
											</div>
										</div>
										: this.state.currentState == 0 ?
										<div className="mainContainer">
											<div className="textRow" style={{"marginBottom":"0"}}>
												<div className="textRowTitle">Contact Information</div>
												<br />
												<span className="contact30 pull-left">User ID:</span>
												<span className="contact70 pull-left">{this.state.userId}</span>
												<br style={{"clear":"both"}} />
											</div>
											<hr />
											<div className="textRow" style={{"marginBottom":"0"}}>
												<span className="contact30 pull-left">Registered Date:</span>
												<span className="contact70 pull-left">{this.state.RegisteredDate}</span>
												<br style={{"clear":"both"}} />
											</div>
											<hr />
											<div className="textRow" style={{"marginBottom":"0"}}>
												<span className="contact30 pull-left">Last Updated:</span>
												<span className="contact70 pull-left">{this.state.lastUpdated}</span>
												<br style={{"clear":"both"}} />
											</div>
											<hr />
											<div className="textRow" style={{"marginBottom":"0"}}>
												<span className="contact30 pull-left">Investor Status:</span>
												<span className="contact70 pull-left">{this.state.accreditedStatus == true ? "Accredited" : "Not Accredited"}</span>
												<br style={{"clear":"both"}} />
											</div>
											<hr />
										</div>
										: this.state.currentState == 2 ?
										<div className="mainContainer">
											<div className="textRow">
												<div className="textRowTitle">Degree</div>
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Enter Degree Name?"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Enter Institute Name"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Enter Year"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Other Information"} />
											</div>
											<a onClick={this.saveAbout} className="saveBttn pull-right">Save</a>
										</div>

										: this.state.currentState == 3 ?
										<div className="mainContainer">
											<div className="textRow">
												<div className="textRowTitle">Skills</div>
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Add a skill"} />
												<a onClick={this.saveAbout} className="saveBttn pull-right">Save</a>
											</div>
										</div>
										: this.state.currentState == 4 ?
										<div className="mainContainer">
											<div className="textRow">
												<div className="textRowTitle">Project</div>
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Enter Project Name"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Enter Project Link"} />
												<textarea disabled={this.state.anotherUser == true ? "true" : ""} className="finput" rows="5" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Enter Project Summary"}></textarea>
												<a onClick={this.saveAbout} className="saveBttn pull-right">Save</a>
											</div>
										</div>
										: this.state.currentState == 5 ?
										<div className="mainContainer">
											<div className="textRow">
												<div className="textRowTitle">Experience</div>
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Enter Company Name"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Enter Role"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "From When"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "To When"} />
												<textarea disabled={this.state.anotherUser == true ? "true" : ""} className="finput" rows="5" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Say something about your role"}></textarea>
												<a onClick={this.saveAbout} className="saveBttn pull-right">Save</a>
											</div>
										</div>
										: this.state.currentState == 6 ?
										<div className="mainContainer">
											<div className="textRow">
												<div className="textRowTitle">Social</div>
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Website Link"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "LinkedIn"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Behance"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Dribbble"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Skype"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Github"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Instagram"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Twitter"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Facebook"} />
												<input disabled={this.state.anotherUser == true ? "true" : ""}  className="finput" placeholder={this.state.anotherUser == true ? "User has not yet completed this information" : "Youtube"} />
												<a onClick={this.saveAbout} className="saveBttn pull-right">Save</a>
											</div>
										</div>
										: ""
									}
								</div>
								<br style={{"clear":"both"}} />
							</div>
						</div>
						</ProfileSubHeader>
						<br style={{"clear":"both"}} />
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}






















export class FriendsPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"limit":400,
			"page":0,
			"data":[],
			"data2":[]
		}
	}
	componentDidMount(){
		document.title = "Friends - FNB";
		var key = this.props.match.params.key;
		if (key) {
			userID = key;
			this.loadFollowers(this.state.page);
			this.loadFollowing(this.state.page);
			this.setState({"anotherUser":true});
		} else {
			userID = Parse.User.current().id;
			this.loadFollowing(this.state.page);
			this.loadFollowers(this.state.page);
			this.setState({"anotherUser":false});
		}
	}
	loadFollowing = (page) => {
		var r = this;
		var Followers = Parse.Object.extend("Followers");
		var query = new Parse.Query(Followers);
		query.equalTo('active',true);
		query.equalTo('follower',{
			"__type":"Pointer",
			"objectId":userID,
			"className":"_User"
		});
		query.select('follower','following','followed','objectId','createdAt');
		query.limit(this.state.limit);
		query.skip(this.state.limit * page);
		query.find({
		  success: function(results) {
		  		results.map(function(result) {
			  		var object = result;
			  		var post = object.get("following");
			  		var objectID = object.id;
				    post.fetch({
				        success: function(data) {
				            var name = data.get("fname") + " " + data.get('lname');
				            var src = data.get('src') == undefined ? "https://i.stack.imgur.com/l60Hf.png" : as3url +  data.get('src').name();
							var f0 = {
								"id":objectID,
								"userID":post.id,
								"name":name,
								"src":src
							}
							r.setState(previousState => ({
							    "data": [...previousState.data, f0]
							}));
				        }
				    });
		  		});
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});
	}
	loadFollowers = (page) => {
		var r = this;
		var Followers = Parse.Object.extend("Followers");
		var query = new Parse.Query(Followers);
		query.equalTo('active',true);
		query.equalTo('following',{
			"__type":"Pointer",
			"objectId":userID,
			"className":"_User"
		});
		query.select('follower','following','followed','objectId','createdAt');
		query.limit(this.state.limit);
		query.skip(this.state.limit * page);
		query.find({
		  success: function(results) {
		  		results.map(function(result) {
			  		var object = result;
			  		var post = object.get("follower");
			  		var objectID = object.id;
				    post.fetch({
				        success: function(data) {
				            var name = data.get("fname") + " " + data.get('lname');
				            var src = data.get('src') == undefined ? "https://i.stack.imgur.com/l60Hf.png" : as3url +  data.get('src').name();
							var f0 = {
								"id":objectID,
								"userID":post.id,
								"name":name,
								"src":src
							}
							r.setState(previousState => ({
							    "data2": [...previousState.data2, f0]
							}));
				        }
				    });
		  		});
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});
	}
	unFollow = (e) => {
		var changeable = e;
		$(e.target).html('Unfollowed!');
		$(e.target).css({"backgroundColor":"#fc3466","color":"white"});
		var id = e.target.attributes.deleteID.value;
		var Followers = Parse.Object.extend("Followers");
		var query = new Parse.Query(Followers);
		query.get(id, {
		  success: function(data) {
		  	data.set('active',false);
		  	data.save();
		  },
		  error: function(object, error) {
		 	 alert(error.message)
		  }
		});
	}
	render(){
		return (
			<div>
				<div className="page">
					<MainHeader />
					<div className="profilePageWrapper">
						<ProfileSubHeader>
						<div className="profileContentBox">
							<div className="profileHeaderT">
								<p className="title">Following</p>
							</div>
							<div className="profileContent friendsBoxWrapper">
								<ul>
									{
										this.state.data.map(function(o,i) {
											return (
												<Link to={o.userID != Parse.User.current().id ? "/profile/" + o.userID : "/profile"}>
													<li>
													<img src={o.src} />
														<p className="name">{o.name}</p>
														{
															this.state.anotherUser == false ?
															<a onClick={this.unFollow} deleteID={o.id} className="actionFriendBttn">Unfollow</a>
															: ""
														}
													</li>
												</Link>
											)
										},this)
									}
								</ul>
							</div>
						</div>
						<div className="profileContentBox">
							<div className="profileHeaderT">
								<p className="title">Followers</p>
							</div>
							<div className="profileContent friendsBoxWrapper">
								<ul>
									{
										this.state.data2.map(function(o,i) {
											return (
												<Link to={o.userID != Parse.User.current().id ? "/profile/" + o.userID : "/profile"}>
													<li>
													<img src={o.src} />
														<p className="name">{o.name}</p>
														{
															this.state.anotherUser == false ?
															<a onClick={this.unFollow} deleteID={o.id} className="actionFriendBttn">Unfollow</a>
															: ""
														}
													</li>
												</Link>
											)
										},this)
									}
								</ul>
							</div>
						</div>



						</ProfileSubHeader>
						<br style={{"clear":"both"}} />
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}







class ProfileSubHeader extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			"src":BlankImage,
			"coverImage":BlankImage,
			"fullname":"",
			"username":"",
			"anotherUser":false,
			"followingUser":false,
			"removeFollow":true,
			"followingDropDown":false,
			"activeMessagePopup":false
		}
	}
	componentDidMount(){
		var cu = Parse.User.current();
		var r = this;
		if (cu) {
			setTimeout(function() {
				if (userID == Parse.User.current().id) {
					r.setState({"anotherUser":false,"removeFollow":true});
				} else {
					r.setState({"anotherUser":true});
					var _User = Parse.Object.extend("Followers");
					var query = new Parse.Query(_User);  
					query.equalTo("following", {
						"__type":"Pointer",
						"className":"_User",
						"objectId":userID
					});
					query.equalTo("follower", {
						"__type":"Pointer",
						"className":"_User",
						"objectId":Parse.User.current().id
					});
					query.equalTo('active',true);
					query.count({
					  success: function(results) {
					   	if (results == 0) {
					   		r.setState({"followingUser":false,"removeFollow":false});
					   	} else {

					   		r.setState({"followingUser":true,"removeFollow":false});
					   	}
					  },
					  error: function(error) {
					    alert("Error: " + error.code + " " + error.message);
					  }
					});					
				}
				var Users = Parse.Object.extend("_User");
				var query = new Parse.Query(Users);
				query.get(Parse.User.current().id, {
				success: function(results) {
					if (results.get('firstTimeLoggedIn')) {
						r.setState({"showFirstTimeUser":true})
					}
					var src = results.get('src') == undefined ? "https://i.stack.imgur.com/l60Hf.png" : as3url +  results.get('src').name();
					r.setState({
						"src":src,
						"coverImage":results.get('coverImage') == undefined ? BlankImage : as3url +  results.get('coverImage').name(),
						"fullname":results.get('fname') + " " + results.get('lname'),
						"username":results.get('username')
					})
					r.props.changeSrc(src)

				}, error:function(err){
					if (err.code == 209) {
						Parse.User.logOut().then(() => {
						 	window.location.href = startUrl + "login";
						});
					} else {
						console.log(err)
					}
				}});
			},0)
		} else {
			window.location.href = startUrl + "login";
		}		
	}
	uploadImage(e) {
		var fileUploadControl = e.target;
		if (fileUploadControl.files.length > 0) {
		  var file = fileUploadControl.files[0];
		  if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg") {
			  	var name = "profileImage" + file.type.split('/').pop();
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
		  }
		}}
	uploadCoverImage = (e) => {
		var fileUploadControl = e.target;
		if (fileUploadControl.files.length > 0) {
		  var file = fileUploadControl.files[0];
		  if (file.type == "image/png" || file.type == "image/jpeg" || file.type == "image/jpg") {
			  	var name = "coverImage" + file.type.split('/').pop();
				var parseFile = new Parse.File(name, file);
				parseFile.save().then(function(object) {
				var GameScore = Parse.Object.extend("_User");
				var query = new Parse.Query(GameScore);
				query.equalTo("objectId", Parse.User.current().id);
				query.first({
				  success: function(data) {
						data.set("coverImage", parseFile);
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
		  }
		}}
	handleUnfollow = (e) => {
		this.setState({"followingUser":false,"followingDropDown":false});
		var _User = Parse.Object.extend("Followers");
		var query = new Parse.Query(_User);  
		query.equalTo("following", {
			"__type":"Pointer",
			"className":"_User",
			"objectId":userID
		});
		query.equalTo("follower", {
			"__type":"Pointer",
			"className":"_User",
			"objectId":Parse.User.current().id
		});
		query.equalTo('active',true);
		query.first({
		  success: function(data) {
		  	data.set('active',false);
		  	data.save();
		  },
		  error: function(error) {
		    alert("Error: " + error.code + " " + error.message);
		  }
		});	
	}
	handleProfileFollow = (e) => {
		var Followers = Parse.Object.extend("Followers");
		var follow = new Followers();
		this.setState({"followingUser":true,"followingDropDown":false});

		follow.set("following", {
			"__type":"Pointer",
			"className":"_User",
			"objectId":userID
		});
		follow.set("follower", {
			"__type":"Pointer",
			"className":"_User",
			"objectId":Parse.User.current().id
		});
		follow.set("active", true);
		follow.save(null, {
		  success: function(gameScore) {
		  },
		  error: function(gameScore, error) {
		    alert(error.message);
		  }
		});		
	}
	render(){
		return (
			<div>
				<div className="backgroundCoverImage">
					<img src={this.state.coverImage} />
					{
						this.state.anotherUser == false ?
						<div className="sideBttn">
							<a onClick={(e) => $(this.refs.fileImageUpload2).click()}>Change Cover</a>
						</div>
						: ""						
					}
					{
						this.state.anotherUser == false ?
						<Link className="pull-right changeCoverBttn" style={{"display":"block","color":"black","textDecoration":"none"}} to="/settings/profile">Account Settings</Link>
						: ""
					}
					{
						this.state.removeFollow == false ?
						<span className="pull-right changeCoverBttn" style={{"right":"10px"}}>
							{
								this.state.followingUser == true ?
								<span>
									<a onClick={(e) => this.setState({"followingDropDown":!this.state.followingDropDown})}>{this.state.followingUser == true ? "Following" : "Follow"} </a>
									<i onClick={(e) => this.setState({"followingDropDown":!this.state.followingDropDown})} style={{"fontSize":"8px"}} className="fa fa-chevron-down"></i>
								</span>
								:
								<a onClick={this.handleProfileFollow}>Follow</a>
							}
								<div style={{"display":this.state.followingDropDown == true ? "block":"none"}} className="followingBttnDropdown">
									<ul>
										<li onClick={(e) => this.handleUnfollow()}>Unfollow</li>
									</ul>
								</div>
						</span>
						: ""
					}
				</div>
				<div className="profileImageCover">
					<div className="profileImage">
						<img src={this.state.src} />
						<div onClick={(e) => $(this.refs.fileImageUpload).click()} className="onHoverProfileSettings">
							<a><i className="fa fa-upload"></i></a>
						</div>
						<input ref="fileImageUpload" onChange={this.uploadImage} type="file" accept="images/*" id="hUpload" name="newUserPicture" hidden />
						<input ref="fileImageUpload2" onChange={this.uploadCoverImage} type="file" accept="images/*" id="hUpload" name="newUserPicture2" hidden />
					</div>
					<div className="profileDetails">
						<p className="fullname">{this.state.fullname}</p>
						{
							this.state.anotherUser == false ?
							<p className="username">{this.state.username.toLowerCase()}</p>
							: 
							<span onClick={(e) => this.setState({"activeMessagePopup":true})} className="pull-left messageThem" style={{"bottom":"-5px"}}>
								Message
							</span>
						}
					</div>
				</div>
				<div className="dashWrapperB" style={{"marginTop":"-100px","padding":"0"}}>
					<div className="profileSubHed">
						<ul>
							<NavLink exact to={this.state.removeFollow == false ? "/profile/"+userID + "/aboutme" : "/profile/aboutme"} activeClassName="active"><li>Profile</li></NavLink>
{/*							<NavLink exact to={this.state.removeFollow == false ? "/profile/"+userID + "/friends" : "/profile/friends"} activeClassName="active"><li>Connections</li></NavLink>
							<NavLink exact to={this.state.removeFollow == false ? "/profile/"+userID : "/profile"} activeClassName="active"><li>Posts</li></NavLink>
*/}						</ul>
					</div>
					{this.props.children}
				</div>
				<ModalWrapper active={this.state.activeMessagePopup} hide={(e) => this.setState({"activeMessagePopup":false})}>
					<div className="messageComingSoon">
						<i className="fa fa-check"></i>
						<p className="title">Coming Soon</p>
						<p className="description">Messaging other users on this platform is coming soon. Stay tuned!</p>
					</div>
				</ModalWrapper>
			</div>
		)
	}
}


function getTime(dates){
	var date = new Date(dates);
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}

function getDate(dates) {
	var month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var date = new Date(dates);


	return month[date.getMonth()] + " " + date.getDate()
}


