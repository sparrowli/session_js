
var stream;
function hasUserMedia() { 
  //checks if the browser supports WebRTC 
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia 
    || navigator.mozGetUserMedia || navigator.msGetUserMedia; 
  return !!navigator.getUserMedia; 
}
 
if (hasUserMedia()) { 
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedi  
      || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		
  //get both video and audio streams from user's camera 
 
	  // MediaStream APIs
		navigator.getUserMedia({ video: true, audio: true }, function (s) { 
			stream = s;
			// This tag 'video' is located on html, document object
      var video = document.querySelector('video'); 

    //insert stream into the video tag 
    video.src = window.URL.createObjectURL(stream); 
  }, function (err) {}); 

}else {
   alert("Error. WebRTC is not supported!"); 
}

btnGetAudioTracks.addEventListener("click", function() {
	console.log("getAudioTracks");
	console.log(stream.getAudioTracks());
});

btnGetTrackById.addEventListener("click", function() {
	console.log("getTrackById");
	console.log(stream.getTrackById(stream.getAudioTracks()[0].id));
});

btnGetTracks.addEventListener("click", function() {
	console.log("getTracks");
	console.log(stream.getTracks());
});

btnGetVideoTracks.addEventListener("click", function() {
	console.log("getVideoTracks");
	console.log(stream.getVideoTracks());
});

btnRemoveAudioTrack.addEventListener("click", function() {
	console.log("RemoveAudioTrack");
	console.log(stream.removeTrack(stream.getAudioTracks()[0]));
});
btnRemoveVideoTrack.addEventListener("click", function() {
	console.log("RemoveVideoTrack");
	console.log(stream.removeTrack(stream.getVideoTracks()[0]));
});

