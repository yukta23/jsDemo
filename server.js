const express=require('express')
const app=express();

const http=require('http')

const socketio=require('socket.io')
var SerialPort = require("serialport")
var serialPort = new SerialPort('COM6',
{   
  baudRate: 9600,
  dataBits: 8,
  parity: 'none',
  stopBits: 1, 
  parser: new SerialPort.parsers.Readline("\n"),
  flowControl: false
});

const server=http.createServer(app)
const io=socketio(server)

app.use('/',express.static(__dirname+"/frontend"))

var receivedData="";
let sendData="";
let obj={};

serialPort.on("open", function () {
  console.log('comm open');
  serialPort.on('data', function(data) {
    // console.log(data);
    receivedData += data.toString();
    // let startIndex=receivedData .indexOf('$');
    // let endIndex=receivedData .indexOf('#');
    // setTimeout(()=>{
    //   receivedData="";
    //   console.log("Received Data "+receivedData);
    // },2000);
    // console.log("receivedData "+ receivedData);
    if(receivedData.indexOf('$')>0)
    {
      if(receivedData[0]!='#')
      receivedData='#'+receivedData;
      // console.log(receivedData);
      sendData=receivedData.split('$')[0];
      // console.log(sendData);
      
      obj.one=sendData.split('#')[2];
      obj.two=sendData.split('#')[3];
      obj.three=sendData.split('#')[4];
      obj.four=sendData.split('#')[5];
      receivedData="";
      console.log("Send Data "+obj.one+" "+obj.two+" "+obj.three+" "+obj.four);
    }

    // if ( startIndex>= 0 &&  endIndex>= 0 ) {

      // arr=receivedData.split('#');
      // for(let i=0;i<arr.length;i++)
      // console.log(`${i}`+" "+arr[i]);


    //    if(endIndex> startIndex)
    //  {
    //    if(receivedData[startIndex+1]=='$')
    //    sendData = receivedData.substring(startIndex + 2,endIndex);
    //    else
    //    sendData = receivedData.substring(startIndex + 1, endIndex);
    //  console.log(sendData);
    // }
       // send the incoming data to browser with websockets.
  // }
  });
});

serialPort.on('error', function(err) {
  console.log('Error: ', err.message);
  // console.error(err);
})

io.on('connection',(socket)=>{
  console.log('New socket formed from '+socket.id+" client");
  socket.emit('connected');
  setInterval(()=>{
    socket.emit('update', obj);
  },100)
   
})

server.listen(4000,()=>{
    console.log("server started")
})