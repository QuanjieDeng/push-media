const serverUrl = '/';
let room;
let localStream


function pushlocal(){
    const config = { audio: true, video: true, data: true, videoSize: [640, 480, 640, 480] };
    recording =   document.getElementById("recording").value
    if(recording != ""){
        config.recording = recording;
    }

    localStream = Erizo.Stream(config);
    roomid =   document.getElementById("roomid").value
    createToken('user', 'presenter', roomid,(response) => {
      const token = response;
      room = Erizo.Room({ token });
  
      localStream.addEventListener('access-accepted', () => {
        printText('Mic and Cam OK');
        const subscribeToStreams = (streams) => {
          streams.forEach((stream) => {
            room.subscribe(stream);
          });
        };
  
        room.addEventListener('room-connected', () => {
          printText('Connected to the room OK');
          room.publish(localStream, { maxVideoBW: 300 });
        });
  
        room.addEventListener('stream-subscribed', (streamEvent) => {
          printText('Subscribed to your local stream OK');
          const stream = streamEvent.stream;
          stream.show('my_subscribed_video');
        });
  
        room.addEventListener('stream-added', (streamEvent) => {
          printText('Local stream published OK');
          const streams = [];
          streams.push(streamEvent.stream);
          subscribeToStreams(streams);
        });
  
        room.addEventListener('stream-removed', (streamEvent) => {
          // Remove stream from DOM
          const stream = streamEvent.stream;
          if (stream.elementID !== undefined) {
            const element = document.getElementById(stream.elementID);
            document.body.removeChild(element);
          }
        });
  
        room.addEventListener('stream-failed', () => {
          console.log('STREAM FAILED, DISCONNECTION');
          printText('STREAM FAILED, DISCONNECTION');
          room.disconnect();
        });
  
        room.connect();
  
        //--------------
        const div = document.createElement('div');
        div.setAttribute('style', 'width: 320px; height: 240px;float:left;');
        div.setAttribute('id', `test${localStream.getID()}`);
        div.setAttribute('title', `${localStream.getID()}`);
        var  p = document.createElement("p")
        p.innerText = localStream.getID()
        div.appendChild(p);  
  
        document.getElementById('my_local_video').appendChild(div);
        localStream.show(`test${localStream.getID()}`);
        //--------------
      });
      localStream.init();
    });
}



function pushExtern(){
  recording =   document.getElementById("recording").value
  const config = { audio: true, video: true, data: true,recording: recording};

  localStream = Erizo.Stream(config);
  roomid =   document.getElementById("roomid").value
  createToken('user', 'presenter', roomid,(response) => {
    const token = response;
    room = Erizo.Room({ token });


    const subscribeToStreams = (streams) => {
      streams.forEach((stream) => {
        room.subscribe(stream);
      });
    };

    room.addEventListener('room-connected', () => {
      printText('Connected to the room OK');
      room.publish(localStream, { maxVideoBW: 300 });
    });

    room.addEventListener('stream-subscribed', (streamEvent) => {
      printText('Subscribed to your local stream OK');
      const stream = streamEvent.stream;
      stream.show('my_subscribed_video');
    });

    room.addEventListener('stream-added', (streamEvent) => {
      printText('Local stream published OK');
      const streams = [];
      streams.push(streamEvent.stream);
      subscribeToStreams(streams);
    });

    room.addEventListener('stream-removed', (streamEvent) => {
      // Remove stream from DOM
      const stream = streamEvent.stream;
      if (stream.elementID !== undefined) {
        const element = document.getElementById(stream.elementID);
        document.body.removeChild(element);
      }
    });

    room.addEventListener('stream-failed', () => {
      console.log('STREAM FAILED, DISCONNECTION');
      printText('STREAM FAILED, DISCONNECTION');
      room.disconnect();
    });

    room.connect();

    localStream.init();
  });
}



function unpushlocal(){
    
    room.unpublish(localStream,function(){
        localStream.close();
    })

}