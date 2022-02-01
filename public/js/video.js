document.addEventListener("DOMContentLoaded", function(){

	let video = document.getElementById('live'),
		vendorUrl = window.URL || window.webkitURL;
	let videoStream = document.getElementById('client');
	navigator.getMedia = navigator.getUserMedia ||
			    		 navigator.wabkitGetUserMedia ||
			             navigator.mozGetUserMedia ||
			             navigator.msGetUserMedia;

	let myPeerId = document.getElementById("myPeerId");
	let remotePeerId = document.getElementById("remotePeerId");
	let callBtn = document.getElementById("call");
	let endcallBtn = document.getElementById("endcall");

	let peer = new Peer({
      		host: 'localhost',
      		port: 9000,
	      	path: '/myapp'
	    });

	let peerId = null;

	peer.on('open', id => {
		peerId = id;
		myPeerId.innerHTML = peerId;
	});


	let call_tmp = null;
	callBtn.addEventListener('click', function () {
		let id = remotePeerId.value;
  	  	console.log(id);

			navigator.getMedia({video: true, audio: true}, 	      //change this line if you want to make it voice only
			function(stream) {
	    	let call = peer.call(id, stream);
	    	call_tmp = call;
	    	call.on('stream', function(remoteStream) {
	    		videoStream.srcObject = remoteStream;
					videoStream.play();
	  		});

		}, function(err) {
	  		console.log('Failed to get remote stream' ,err);
		});
  	});

  	endcallBtn.addEventListener('click', function() {
		call_tmp.close();
	})

  
		            
	peer.on('call', function(call) {
		call_tmp = call;
	    navigator.getMedia({video: true, audio: true}, function(stream) { //change this line if you want to make it voice only
	    call.answer(stream); // Answer the call with an A/V stream.
	    call.on('stream', function(remoteStream) {
			videoStream.srcObject = remoteStream;
			videoStream.play();
	    });
	  }, function(err) {
	 	console.log('Failed to get remote stream' ,err);
	  });
	});


	// setup local camera view
	navigator.getMedia({
		video: true,
		audio: false
		// audio false to not hear your voice
		}, function(stream) {
			if ("srcObject" in video) {
	    		video.srcObject = stream;
	  		} else {
	    		// Avoid using this in new browsers, as it is going away.
	    		video.src = window.URL.createObjectURL(stream);
	  		}
			video.play();
		}, function(error) {
			alert(error);
		});
	});
