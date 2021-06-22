import React, {useState} from "react";
import firebase from "firebase";
import {Button} from "@material-ui/core";
import "./ImageUpload.css";

import { storage,db } from "./firebase";


const ImageUpload = ({username}) => {
    const[caption, setCaption] =useState("");
    const[image, setImage] =useState(null);
    const[progress, setProgress] =useState(0);

    //function of file picker
    const handleChange = (e) => {
        //This picks up the first image/file selected and sets that as image using setImage useState
        if(e.target.files[0])
        {
            setImage(e.target.files[0]);
        }
    };

    //function of Upload Button
    const handleUpload = () => {
        //putting an image on database storage by creating new folder.
        const uploadTask = storage.ref(`images/${image.name}`).put(image); 

        //PROGRESS BAR CODE: function of changing state of image upload(optional) and here snapshot is an object of uploadTask which has all the records regarding how much percentage of image has been transferred in the storage
        uploadTask.on("state_changed", (snapshot) => {
                //progress function
                const progress=Math.round( 
                          (snapshot.bytesTransferred/snapshot.totalBytes)*100   //calculating the percentage of the file transfer process.
                );
                setProgress(progress);  //assigning the calcualted percentage of progress of file transfer, to useState can setProgress
        },(error) => {
            //Error function
            console.log(error);
            alert(error.message);
        },()=>{
            //UPLOAD ON  Storage complete, after the progress has been completed we get the download URL of that image and other inputted field like caption along with it and  add everything to the database to display it in the screen.
            storage.ref("images")
                   .child(image.name)
                   .getDownloadURL()
                   .then(url=>{
                       //post image inside database
                       db.collection("posts").add({
                           timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                           caption:caption,
                           imageUrl:url,
                           username:username
                       });
                       setProgress(0);
                       setCaption("");
                       setImage(null);
                   })

        })
    }
   
    return (
        <>
            <div className="imageUpload">
                {/*progress bar*/}
                <progress className="imageUpload__progress" value={progress} max="100"/>

                 {/*file picker*/}
                 <input type="file"  style={{padding:"10px"}} onChange={handleChange}/>


                {/*input field for caption*/}
                <input type="text" placeholder="enter a caption.."  style={{background:"grey",color:"white", padding:"10px"}} onChange={ (object)=> {setCaption(object.target.value)}} value={caption}/>


                {/*button*/}
                <Button onClick={handleUpload} style={{background:"skyblue"}}> <h3> Upload </h3></Button>

            </div>
        </>
    )
}

export default ImageUpload;