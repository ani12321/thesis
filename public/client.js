const GEO_URL = 'http://freegeoip.net/json/';

class Client {
    constructor() {
        this.data = {
            geo: null,
            network: null,
            capabilities: 1
        }
    }

    load() {
        this.loadNetwork();
        return this.loadGeo();
    }

    loadGeo() {
        return fetch(GEO_URL)
        .then((response) => response.json())
        .then((data) => {
            this.updateData({
                geo: data
            });
        })
    }

    loadNetwork() {
        if (!navigator.connection) return;
        let networkInfo = () => {
            this.updateData({
                network: {
                    type: navigator.connection.effectiveType,
                    download: navigator.connection.downlink,
                    rtt: navigator.connection.rtt
                }
            });
        }
        navigator.connection.addEventListener('change', networkInfo);
        networkInfo();

    }

    updateData(newData) {
        Object.assign(this.data, newData);

        if (!this.data.network) return;
        this.data.capabilities = this.data.network.download/2 - this.data.network.rtt / 100
        console.log(this.data);
    }
}

module.exports = new Client();