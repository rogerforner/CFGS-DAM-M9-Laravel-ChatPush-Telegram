var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Redis = require('ioredis');

var redis = new Redis();

redis.psubscribe('*', function(err, count) {
    console.log('Subscribing to channels: number of channels ' + count);
    if(err){
        console.log('Error subscribing to channel ' + err)
    }
});

redis.on('pmessage', function(subscribed,channel, message) {
    console.log('Message Recieved at channel(' + channel + '): ' + message);
    message = JSON.parse(message);
    io.emit(channel + ':' + message.event, message.data);
});

http.listen(3000, function(){
    console.log('Listening at port 3000')
});