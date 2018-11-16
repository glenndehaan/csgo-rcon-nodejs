import Sockette from 'sockette';
import store from './store';
import systemNotification from './systemNotification';

export default new class Socket {
    /**
     * Function to setup the socket connection
     *
     * @param url
     * @param connectedCallback
     * @param disconnectedCallback
     * @param reconnectingCallback
     */
    initialize(url, connectedCallback, disconnectedCallback, reconnectingCallback) {
        this.config = {
            url: `ws://${url}/`
        };
        this.ws = null;
        this.id = "";
        this.initialConnect = true;
        this.connectedCallback = connectedCallback;
        this.disconnectedCallback = disconnectedCallback;
        this.reconnectingCallback = reconnectingCallback;

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
                if(this.initialConnect) {
                    this.initialConnect = false;
                } else {
                    this.send("general_wants_update", {})
                }

                console.log('[SOCKET] Connected!');
            },
            onmessage: (e) => this.message(e.data),
            onreconnect: () => {
                console.warn('[SOCKET] Reconnecting...');
                this.reconnectingCallback();
            },
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

            store.setState(message.data);

            this.connectedCallback();
        }

        if(message.instruction === "update") {
            console.log(`[SOCKET] Update: ${JSON.stringify(message.data)}`);

            store.setState(message.data);
        }

        if(message.instruction === "notification") {
            console.log(`[SOCKET] Notification: ${JSON.stringify(message.data)}`);

            if(message.data.system) {
                systemNotification.sendNotification(message.data.message);
            } else {
                window.events.emit("notification", {
                    title: message.data.message,
                    color: message.data.color
                });
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
