import React, { useEffect } from 'react'
import { useState } from 'react';
import Avatar from "../node_modules/@material-ui/core/Avatar";
import {db, auth, storage} from './firebase';
import firebase from "firebase";



function Post({ username, imgUrl, caption, postId, user }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    //useEffect for setComments / listener for specific post to which comment is added (nested listener)
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot(snapshot => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);

    //function to add comment inside collection of database
    const postComment = (event) => {
        event.preventDefault();

        db.collection("posts")
          .doc(postId)
          .collection('comments')
          .add({
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
          });
        setComment("");

    };

    return (
        <div className="post">

            {/*header -> avatar + username*/}
            <div className="post__header">
                <Avatar className="post__avatar" alt="nipson_image" src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>

            {/* image */}
            <img className="post__image" src={imgUrl} alt="user's post unavailable" />

            {/* username + caption */}
            <h4 className="post__text"> <strong> {username}</strong> {caption}</h4>

            {/* comments */}
            <div className="post__comments">
            
                 {comments.map((comment) => {
                    <p className="comment_style">
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                })}
            </div>

            {/* comments box */}
            {user && (
                <form className="post__commentBox">
                    <input className="post__input" type="text" placeholder="add a comment" value={comment} onChange={(e) => { setComment(e.target.value) }} />
                    <button className="post__button" disabled={!comment} type="submit" onClick={postComment}> Post </button>
                </form>
            )}






        </div>
    )
}

export default Post;
