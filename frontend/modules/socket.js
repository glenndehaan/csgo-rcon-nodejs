import Sockette from 'sockette';

export default new class Socket {
    /**
     * Function to setup the socket connection
     *
     * @param url
     * @param nickname
     * @param connectedCallback
     * @param disconnectedCallback
     */
    initialize(url, nickname, connectedCallback, disconnectedCallback) {
        this.config = {
            url: `ws://${url}/`,
            nickname
        };
        this.ws = null;
        this.id = "";
        this.connectedCallback = connectedCallback;
        this.disconnectedCallback = disconnectedCallback;

        this.callbacks = {
            init: [],
            update: []
        };

        this.setup();
    }

    /**
     * Create socket connection with ws
     */
    setup() {
        this.ws = new Sockette(this.config.url, {
            timeout: 5e3,
            maxAttempts: 10,
            onopen: () => {
                console.log('[SOCKET] Connected!');
                this.connectedCallback();
            },
            onmessage: (e) => this.message(e.data),
            onreconnect: () => console.warn('[SOCKET] Reconnecting...'),
            onclose: () => console.warn('[SOCKET] Closed!'),
            onerror: e => console.error('[SOCKET] Error:', e),
            onmaximum: () => {
                console.warn('[SOCKET] Failed to reconnect!');
                this.ws.close();
                this.disconnectedCallback();
            }
        });
    }

    /**
     * Function to handle all incoming messages
     *
     * @param data
     */
    message(data) {
        const decodedMessage = atob(data);
        const message = JSON.parse(decodedMessage);

        if(message.instruction === "init") {
            console.log(`[SOCKET] Init: ${JSON.stringify(message.data)}`);
            this.runBoundFunctions("init", message.data);
        }

        if(message.instruction === "update") {
            console.log(`[SOCKET] Update: ${JSON.stringify(message.data)}`);
            this.runBoundFunctions("update", message.data);
        }
    }

    /**
     * Function to bind a callback for incoming socket messages
     *
     * @param instruction
     * @param callback
     */
    on(instruction, callback) {
        this.callbacks[instruction].push(callback);
    }

    /**
     * Function to unbind a callback for incoming socket messages
     *
     * @param instruction
     * @param callback
     */
    off(instruction, callback) {
        const index = this.callbacks[instruction].indexOf(callback);
        if (index > -1) {
            this.callbacks[instruction].splice(index, 1);
        }
    }

    /**
     * Run all bound functions
     *
     * @param instruction
     * @param data
     */
    runBoundFunctions(instruction, data) {
        if(this.callbacks[instruction].length > 0) {
            for(let callback = 0; callback < this.callbacks[instruction].length; callback++) {
                this.callbacks[instruction][callback](data);
            }
        }
    }

    /**
     * Send a message to the server
     *
     * @param instruction
     * @param data
     */
    send(instruction, data) {
        this.ws.send(this.encrypt({
            instruction,
            data
        }));
    }

    /**
     * Encrypt a message
     *
     * @param data
     * @return {string}
     */
    encrypt(data) {
        const string = JSON.stringify(data);
        return btoa(string);
    }
}
