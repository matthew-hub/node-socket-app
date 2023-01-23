const socket = io();
const pc = new RTCPeerConnection();

const remoteVideo = document.getElementById('remoteVideo');
const callButton = document.getElementsByClassName('call-button');

console.log('[callbutton]:', callButton);

let dataChannel = null;
let localStream = null;
let remoteStream = null;
// client-side
socket.on('connect', () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on('offer', offer => {
  handleOffer(offer);
});

socket.on('candidate', candidate => {
  handeCandidate(candidate);
});

const getUserMedia = async () => {
  // const constraints = {
  //   "video": {
  //     "width": 320,
  //     "height": 240
  //   },
  //   "audio": false
  // }

  // localStream = await navigator.mediaDevices.getUserMedia(constraints)
  remoteStream = new MediaStream();
  // Push tracks from local stream to peer connection
  // localStream.getTracks().forEach((track) => {
  //   pc.addTrack(track, localStream);
  // });

  // Pull tracks from remote stream, add to video stream
  pc.ontrack = event => {
    event.streams[0].getTracks().forEach(track => {
      remoteStream.addTrack(track);
    });
  };

  // webcamVideo.srcObject = localStream;
  remoteVideo.srcObject = remoteStream;
};

getUserMedia();

const call = () => {
  socket.emit('call');
};

pc.onicecandidate = event => {
  console.log('[event]:', event.candidate);
};

const handleOffer = async offer => {
  pc.setRemoteDescription(new RTCSessionDescription(offer));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  socket.emit('answer', answer);
};

const handeCandidate = async candidate => {
  await pc.addIceCandidate(candidate);
};

pc.ondatachannel = event => {
  console.log('[event]:');
  dataChannel = event.channel;
  dataChannel.onopen = ev => {
    console.log('[datachannnelopen]:');
  };

  dataChannel.onmessage = ev => {
    console.log('[Data]:', ev.data);
  };
};

pc.onconnectionstatechange = ev => {
  switch (pc.connectionState) {
    case 'new':
    case 'checking':
      console.log('[PEER CONNECTING]:');
      break;
    case 'connected':
      console.log('[PEER CONECTED!]');
      break;
    case 'disconnected':
      console.log('[PEER DISCONNECTING!]');
      break;
    case 'closed':
      console.log('[PEER OFFLINE]:');
      break;
    case 'failed':
      console.log('[PEER ERROR]:');
      break;
    default:
      break;
  }
};

callButton[0].addEventListener('click', function (e) {
  console.log('[Click event]]:', e.target);

  call();
});
