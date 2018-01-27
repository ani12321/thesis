module.exports = exports = Socket;

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

    var listOfBroadcasts = {};

    io.on('connection', function(socket) {
        var currentUser;

        socket.on('create-broadcast', (user) => {
            currentUser = user;

            user.numberOfViewers = 0;
            listOfBroadcasts[user.broadcastid] = {
                broadcast: null,
                users: {},
                typeOfStreams: user.typeOfStreams // object-booleans: audio, video, screen
            };

            currentUser.isInitiator = true;
            socket.emit('start-broadcasting', user.typeOfStreams);

            listOfBroadcasts[user.broadcastid].broadcaster = user;
            listOfBroadcasts[user.broadcastid].users[user.userid] = user;
            console.log('User <', user.userid, '> created a broadcast.');
        })

        socket.on('join-broadcast', function(user) {
            currentUser = user;
            user.numberOfViewers = 0;

            listOfBroadcasts[user.broadcastid].broadcaster.numberOfViewers++;
            socket.emit('join-broadcaster', listOfBroadcasts[user.broadcastid].broadcaster, listOfBroadcasts[user.broadcastid].typeOfStreams);

            console.log('User <', user.userid, '> is trying to get stream from user <', listOfBroadcasts[user.broadcastid].broadcaster.userid, '>');

            listOfBroadcasts[user.broadcastid].users[user.userid] = user;
        });

        socket.on('message', function(message) {
            socket.broadcast.emit('message', message);
        });

        socket.on('disconnect', function() {
            if (!currentUser) return;
            if (!listOfBroadcasts[currentUser.broadcastid]) return;
            if (!listOfBroadcasts[currentUser.broadcastid].broadcaster) return;

            listOfBroadcasts[currentUser.broadcastid].broadcaster = null;
            if (currentUser.isInitiator) {
                delete listOfBroadcasts[currentUser.broadcastid];
            }
        });
    });
}
