const GEO_URL = 'http://freegeoip.net/json/';

class Client {
    constructor() {
        this.data = {
            geo: null,
            network: null
        }
    }

    load() {
        this.loadNetwork();
        return this.loadGeo();
    }

    loadGeo() {
        return fetch(GEO_URL)
        .then((response) => response.text())
        .then((data) => this.data.geo = data)
    }

    loadNetwork() {
        if (!navigator.connection) return;
        let networkInfo = () => {
            this.data.network = {
                type: navigator.connection.effectiveType,
                download: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            }
            console.log(this.data.network);
        }
        navigator.connection.addEventListener('change', networkInfo);
        networkInfo();

    }
}

module.exports = new Client();