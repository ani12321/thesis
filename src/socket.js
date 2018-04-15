let Container = require("./container");

function Socket(app) {
    var io = require('socket.io').listen(app, {
        log: false,
        origins: '*:*'
    });

    io.set('transports', [
        'websocket', // 'disconnect' EVENT will work only with 'websocket'
        'xhr-polling',
        'jsonp-polling'
    ]);

    let container = new Container();

    io.on('connection', function(socket) {
        var currentUser;

        socket.on('create-broadcast', (user) => {
            currentUser = user;
            container.startBroadcast(user);
            socket.emit('start-broadcasting', user.typeOfStreams);
            console.log('User <', user.userid, '> created a broadcast.');
        })

        socket.on('join-broadcast', function(user) {
            currentUser = user;
            const broadcastId = user.broadcastid;
            const broadcast = container.get(broadcastId);
            if (!broadcast) return;
            let streamHost  = container.joinBroadcast(broadcastId, user);

            socket.emit('join-broadcaster', streamHost, broadcast.streams);
            console.log('User <', user.userid, '> is trying to get stream from user <', streamHost.userid, '>');
        });

        socket.on('message', function(message) {
            socket.broadcast.emit('message', message);
        });

        socket.on('disconnect', function() {
            if (!currentUser) return;
            if (currentUser.broadcaster) {
                container.stopBroadcast(currentUser.broadcastid);
                console.log(`Broadcast <${currentUser.broadcastid}> ended`);
            }
            else {
                container.leaveBroadcast(currentUser.broadcastid, currentUser.userid);
                console.log(`User <${currentUser.userid}> left broadcast <${currentUser.broadcastid}>`);
            }
        });
    });
}


module.exports = Socket;