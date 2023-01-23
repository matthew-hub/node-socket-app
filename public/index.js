navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

const socket = io();
const pc = new RTCPeerConnection();
const dataChannel = pc.createDataChannel('channel');

// client-side
socket.on('connect', () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on('call', () => {
  // pc.close();

  getUserMedia();
});

socket.on('answer', answer => {
  console.log('[answer]:', answer);
  handleAnswer(answer);
});

let localStream = null;
let remoteStream = null;

const localVideo = document.getElementById('webcamVideo');
const remoteVideo = document.getElementById('remoteVideo');

const getUserMedia = async () => {
  const constraints = {
    video: {
      width: 320,
      height: 240,
    },
    audio: false,
  };

  localStream = await navigator.mediaDevices.getUserMedia(constraints);
  remoteStream = new MediaStream();

  // Push tracks from local stream to peer connection
  localStream.getTracks().forEach(track => {
    pc.addTrack(track, localStream);
  });

  // Pull tracks from remote stream, add to video stream
  // pc.ontrack = (event) => {
  //   console.log('[event]:',event.streams);

  //   event.streams[0].getTracks().forEach((track) => {
  //     remoteStream.addTrack(track);
  //   });
  // };

  // webcamVideo.srcObject = localStream;
  // remoteVideo.srcObject = remoteStream;
  createOffer();
};

const createOffer = async () => {
  pc.onicecandidate = event => {
    // event.candidate
    socket.emit('candidate', event.candidate);
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  socket.emit('offer', offer);
};

const handleAnswer = async answer => {
  const remoteDesc = new RTCSessionDescription(answer);
  await pc.setRemoteDescription(remoteDesc);
};

dataChannel.onopen = ev => {
  console.log('[datachannnelopen]:');
};

dataChannel.onmessage = ev => {
  console.log('[Data]:', ev.data);
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
