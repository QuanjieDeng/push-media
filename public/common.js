function printText(text) {
    document.getElementById('messages').value += `- ${text}\n`;
}



const createToken = (userName, role,roomid, callback) => {
    const req = new XMLHttpRequest();
    const url = `${serverUrl}createToken/`;
    const body = { username: userName, role:role, roomId: roomid};

    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        callback(req.responseText);
      }
    };

    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(body));
};

function getRoomListButton(){
    const req = new XMLHttpRequest();
    const url = `${serverUrl}getRooms/`;

    req.onreadystatechange = () => {
        if (req.readyState === 4) {
            printText(req.responseText)
        }
    };

    req.open('GET', url, true);
    req.send();
}
function Init(){
    svckey =   document.getElementById("svckey").value
    svcid =   document.getElementById("svcid").value
    surl =   document.getElementById("url").value

    const req = new XMLHttpRequest();
    const url = `${serverUrl}licode/`;
    const body = { svckey: svckey, svcid:svcid, url: surl};

    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        printText("服务器初始化完成")
        serverinit = 1
        document.getElementById('getRoomButton').disabled = false;
      }
    };

    req.open('POST', url, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(body));

}