
const serverUrl = '/';
let room;
let serverinit = 0


function stopPull(){
    streamid =   document.getElementById("streamid").value
    stream = room.remoteStreams.get(streamid);
    room.unsubscribe(stream,function(result,res){
        if(result == true){
            printText("取消订阅成功");

            var dev =  document.getElementById(`test${streamid}`);
            document.getElementById('videoContainer').removeChild(dev);
        }
    })
}

function startPull(){
    if(serverinit  != 1){
        printText("服务器未初始化");
        return
    }
    roomid =   document.getElementById("roomid").value
    createToken("test","presenter",roomid,function(response){
        const token = response;
        printText("get token succes");
        printText(window.atob(token));
        room = Erizo.Room({ token });

        const subscribeToStreams = (streams) => {
            streams.forEach((stream) => {
              room.subscribe(stream);
            });
          };
    
        room.addEventListener('room-connected', (streamEvent) => {
            printText('Connected to the room OK');
            subscribeToStreams(streamEvent.streams)
        });
    
        room.addEventListener('stream-subscribed', (streamEvent) => {
            printText('stream-subscribed');
            const stream = streamEvent.stream;
            const div = document.createElement('div');
            div.setAttribute('style', 'width: 320px; height: 240px;float:left;');
            div.setAttribute('id', `test${stream.getID()}`);
            div.setAttribute('title', `${stream.getID()}`);
            var  p = document.createElement("p")
            p.innerText = stream.getID()
            div.appendChild(p);  
      
            document.getElementById('videoContainer').appendChild(div);
            stream.show(`test${stream.getID()}`);
            document.getElementById('recordButton').disabled = false;
        });

        room.addEventListener('stream-added', (streamEvent) => {
            printText('stream-added,streamEvent:',streamEvent);
            printText('stream-added,streamEvent:',streamEvent.stream.getID());
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
            var dev =  document.getElementById(`test${stream.getID()}`);
            document.getElementById('videoContainer').removeChild(dev);
        });
    
        room.addEventListener('stream-failed', () => {
            printText('STREAM FAILED, DISCONNECTION');
        });

        room.connect();
    })
}


let  record = 0
let  recordingid = 0
function  Record(){
    streamid =   document.getElementById("streamid").value
    stream = room.remoteStreams.get(streamid);

    if(record ==0){
        room.startRecording(stream,function(id,msg){
            if(id !=  undefined){
                recordingid =   id
                printText("开始录制 id:"+recordingid);
                record = 1
                document.getElementById("Record").value="停止录制"
            }
        })
        
    }else{
        room.stopRecording(recordingid,function(result){
            if(result  == true){
                printText("录制结束");
                record = 0
                document.getElementById("Record").value="开始录制"
            }

        })

    }

}