
class Container {

    constructor() {
        this.broadcasts = {};
    }

    /**
     * Creates a new broadcast object
     * @param {object} user
     */
    startBroadcast(user) {
        const broadcastId = user.broadcastid;
        this.broadcasts[broadcastId] = {
            broadcaster: user,
            clients: {},
            streams: user.typeOfStreams // object-booleans: audio, video, screen
        }

        user.broadcaster = true;
        return this.broadcasts[broadcastId];
    }

    /**
     * Client enters a live broadcast
     * @param {string} broadcastId
     * @param {object} user
     */
    joinBroadcast(broadcastId, user) {
        this.broadcasts[broadcastId].clients[user.userid] = user;
    }

    /**
     * Broadcaster stops broadcast
     * @param {string} broadcastId
     */
    stopBroadcast(broadcastId) {
        if (!this.broadcasts[broadcastId]) return;
        delete this.broadcasts[broadcastId];
    }

    /**
     * Client leaves a live broadcast
     * @param {string} broadcastId
     * @param {string} userId
     */
    leaveBroadcast(broadcastId, userId) {
        if (!this.broadcasts[broadcastId]) return;
        delete this.broadcasts[broadcastId].clients[userId];
    }

    /**
     * Get broadcast by id
     * @param {string} id Broadcast id
     */
    get(id) {
        return this.broadcasts[id];
    }

}

module.exports = Container;