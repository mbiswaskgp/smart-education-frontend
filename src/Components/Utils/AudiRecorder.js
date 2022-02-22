import MicRecorder from "mic-recorder-to-mp3";
import React from "react";

import CommonService from "../../services/CommonService";
import { toast } from 'react-toastify';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class AudiRecorder extends React.Component {
    constructor(props) {
        super(props);
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
    
        this.state = {
            isRecording: false,
            isPaused: false,
            isUploadOn: false,
            blobURL: "",
            isBlocked: false,
            blobData: {}
        };
    }
  
    startRecording = () => {

      if (this.state.isBlocked) {
        console.log("Please give permission for the microphone to record audio.");
      } else {
        Mp3Recorder.start()
          .then(() => {
            this.setState({ isRecording: true, isUploadOn: false });
          })
          .catch(e => console.error(e));
      }
    };

    uploadRecording = () => {
        // var 
      console.log(this.props.questionId);
      //console.log(this.state.blobData.result);
      let formData = new FormData();
      this.setState({ isUploadOn: false });

      

      formData.append("file", this.state.blobData.result);
      formData.append("questionId", this.props.questionId);
      console.log(this.props.questionAxiosUrl);
      CommonService.updatePostImage(this.props.questionAxiosUrl,'', formData)
      .then(response => {
          //setSubmitted(false);
          console.log(response.data.data);
          if(response.data.success){
            toast.success("File upload successfully");
            this.setState({ isUploadOn: true });
            this.props.parentCallback(response.data.data.retData);
          }else{
            toast.error("No file found");
          }
      })
      .catch(e => {
          console.log(e);
      });
    }
  
    stopRecording = () => {
      this.setState({ isRecording: false, isUploadOn: true });
      Mp3Recorder.stop()
        .getMp3()
        .then(async ([buffer, blob]) => {
          
          const blobURL = URL.createObjectURL(blob)
          // const file = new File(buffer, 'music.mp3', {
          //   type: blob.type,
          //   lastModified: Date.now()
          // });
          var reader = new FileReader();
          reader.readAsDataURL(blob); 
          reader.onloadend = function() {
              var base64data = reader.result;                
              //console.log(base64data);
          }
          this.setState({ 
            blobURL: blobURL,
            isRecording: false,
            isUploadOn: true,
            blobData: reader
          });
          console.log(reader)
          
        })
        .catch(e => console.log(e));
    };
  
    checkPermissionForAudio = () => {
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
      }
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // First get ahold of the legacy getUserMedia, if present
          var getUserMedia =
            // navigator.getUserMedia ||
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  
          // Some browsers just don't implement it - return a rejected promise with an error
          // to keep a consistent interface
          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented in this browser")
            );
          }
  
          // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
          });
        };
      }
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(stream => {
          this.setState({ isBlocked: false });
        })
        .catch(err => {
          this.setState({ isBlocked: true });
          console.log("Please give permission for the microphone to record audio.");      
          console.log(err.name + ": " + err.message);
          toast.error("Please give permission for the microphone to record audio.");
        });
    };
  

    componentDidMount() {
      this.checkPermissionForAudio();
    }
  
    render() {
      const { isRecording, isUploadOn } = this.state;
      return (
        <React.Fragment>
          <button
            onClick={this.startRecording}
            className="mr-3 add-collec-btn"
            disabled={isRecording}
          >
            Record
          </button>
          <button
            onClick={this.stopRecording}
            className="mr-3 delete-btn"
            disabled={!isRecording}
          >
            Stop
          </button>
          <button
            onClick={this.uploadRecording}
            className="mr-3 delete-btn"
            disabled={!isUploadOn}
          >
            Upload
          </button>
          <audio
            ref="audioSource"
            controls="controls"
            src={this.state.blobURL || ""}
          />
        </React.Fragment>
      );
    }
  }

  export default AudiRecorder;