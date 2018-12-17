import React from "react";
import './news.css';
import {MainHeader,Footer} from "../header";
import {NavLink,Link} from 'react-router-dom';
import Parse from "parse";
import {startUrl} from "../../../index";
import $ from "jquery";
import ReactGA from 'react-ga';
import BlankImage from "../../../images/blank.jpg";
import {ModalWrapper} from "../modal";

ReactGA.initialize('UA-115007597-1');
export const as3url = "https://s3.amazonaws.com/larecoin/profileImages/";
var userID = "";



export class NewsPage extends React.Component {
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
		document.title = "Storyboard - FNB";
		var key = this.props.match.params.key;
		if (key) {
			userID = key;
			this.handleLoadFollowers();
		} else {
			userID = Parse.User.current().id;
			this.handleLoadFollowers();
		}
		if (Parse.User.current()) {
			this.setState({"src":as3url + Parse.User.current().get('src').name()})
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
						<div className="">
							<br style={{"clear":"both"}} />
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
							<li><a className="active"><i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;&nbsp;Post</a></li>
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




class NewsFeedPost extends React.Component {
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
				this.state.object == null ?
				<div className="socialPost">
					<p className="title">
						<img src="" />
						<span className="" style={{"fontSize":"15px"}}>
							<b>Ali Fardos</b>
						</span>
						<span className="time">4:10 pm&nbsp;&nbsp;|&nbsp;&nbsp;<span className="date">May 29</span><br />
							<span className="socialPostButton">
									
								</span>
						</span>
					</p>
					<div style={{"paddingLeft": "15px","paddingRight": "15px","paddingBottom": "25px","marginTop":"10px"}}>
						<span className="comment" style={{"fontSize": "13px"}}>123123123123123</span>
					</div>
					<div className="postButtons">
						<a onClick={(e) => this.handlePostLike(e,this.state.object.id,this.state.object.liked)} className={this.state.object.liked == "true" ? "activeLike" : "like"}><i className="fa fa-thumbs-up" aria-hidden="true"></i>&nbsp;&nbsp;{this.state.object.liked == "true" ? "Liked" : "Like"}</a>&emsp;
						<a onClick={(e) => this.handleSharePost(e,this.state.object.id)}><i className="fa fa-share" aria-hidden="true"></i>&nbsp;&nbsp;Share</a>
						<span className="likeCheers"><span className="totalCountLikes">1</span>&emsp;&nbsp;&nbsp;<i className="fa fa-comments"></i><i className="fa fa-thumbs-up"></i></span>
					</div>
					<div className="recogPostComment">
						<div className="recoPostingSection">
							
						</div>
						<div className="recoPostingComment">
							<img className="profileImage1" src="" />
							<span>
								<input value={this.state.commentInput} onChange={(e) => this.setState({"commentInput":e.target.value})} type="text" placeholder={"What's on your mind, ?"} />
								<a onClick={(e) => this.handleComment(e,"1")} className="fBttnComment"><i className="fa fa-comments"></i></a>
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


