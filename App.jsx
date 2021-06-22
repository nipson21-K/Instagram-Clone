import React, { useState, useEffect } from 'react'

import insta_logo from "./images/insta_logo.png";
import Post from "./Post";

import { db, auth } from "./firebase";

import Modal from "@material-ui/core/Modal";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from "@material-ui/core";

import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


//Modal styling
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  //for styling of Modal
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  //useState with object array for post connected with database
  const [posts, setPosts] = useState([]);

  //useState for Modal to set true and false
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  //useState for username, password and email 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  //useState for user authentication i.e. to know if user has logged in or logged out
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {   //it keeps user logged in but not state as state is not persistant
        //user has logged in 
        console.log(authUser);
        setUser(authUser);
      }
      else {
        //user has logged out
        setUser(null);
      }
    })
    return () => {
      //if usereffect fires again, perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  //Firebase database section
  //useEffect
  useEffect(() => {
    db.collection("posts").orderBy("timestamp", "desc").onSnapshot((snapshot) => {   //database->collection called posts->onSnapshot records changes and assigns change to variable called snapshot and runs the function which will assign the updated value to useState called setPosts.
      setPosts(snapshot.docs.map((doc) => ({   //here we are creating object
        id: doc.id,
        posts: doc.data()
      }))
      );
    })
  }, []);


  //sign up function
  const signUp = (object) => {
    object.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));

    setOpen(false);

  };

  //log in function
  const signIn = (obj) => {
    obj.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  }



  return (
    <>
      <div className="app">



        {/*Modal for sign up*/}
        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>

            <form className="app__signup">
              <center>
                <img className="app__headerImage" src={insta_logo} alt="insta_logo" />
              </center>
              <Input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {/*Button for sign up*/}
              <Button type="submit" onClick={signUp}>Sign up</Button>
            </form>

          </div>
        </Modal>

        {/*Modal for log in*/}
        <Modal open={openSignIn} onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>

            <form className="app__signup">
              <center>
                <img className="app__headerImage" src={insta_logo} alt="insta_logo" />
              </center>
              <Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              {/*Button for sign up*/}
              <Button type="submit" onClick={signIn}>Log in</Button>
            </form>

          </div>
        </Modal>

        {/*Header*/}
        <div className="app__header">
          <img className="app__headerImage" src={insta_logo} alt="logo" />

          {/*Button for Modal*/}
          {user ?
            ( 
              <Button onClick={() => auth.signOut()}> Logout</Button>)   /*Button for Log Out*/
            :
            (
              <div className="app__loginContainer">
                <Button onClick={() => setOpenSignIn(true)}>Log in</Button> {/*Button for Log in*/}
                <Button onClick={() => setOpen(true)}>Sign Up</Button>    {/*Button for Sign up*/}
              </div>
            )
          }
        </div>



        {/*Posts*/}

        <div className="app__posts">
        
            {posts.map(({ id, posts }) => (   //destructre: this will just the content of the id which is new not every post unlike the normal map method or normal way
              <Post key={id} postId={id} user={user} username={posts.username} caption={posts.caption} imgUrl={posts.imageUrl} />   //whenever we upload new image, the image goes to database and get and from there it comes to useState and then here and gets displayed
            ))
            }

        </div>



        {/* imageUpload*/}
       
        {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
           <h3 className="app__imguploadmsg">Sorry you need to login</h3>  
        )}


      </div>
    </>
  );
}

export default App;
