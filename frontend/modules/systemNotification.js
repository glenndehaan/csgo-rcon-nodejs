import storage from './storage';

export default new class systemNotification {
    /**
     * Constructor
     */
    constructor() {
        this.enabled = false;
    }

    /**
     * Requests the user for notification permissions
     *
     * @param callback
     */
    requestPermission(callback) {
        if (window.Notification && Notification.permission !== "granted") {
            Notification.requestPermission((status) => {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }

                callback(Notification.permission);
            });
        }
    }

    /**
     * Toggles the notifications on and off
     *
     * @param callback
     */
    toggleNotifications(callback) {
        if(Notification.permission !== "granted") {
            this.requestPermission((status) => {
                if(status === "granted") {
                    storage.set("notificationsEnabled", true);
                    callback(true);
                } else {
                    storage.set("notificationsEnabled", false);
                    callback(false);
                }
            });
        } else {
            if(storage.get("notificationsEnabled")) {
                storage.set("notificationsEnabled", false);
                callback(false);
            } else {
                storage.set("notificationsEnabled", true);
                callback(true);
            }
        }
    }

    /**
     * Sends a notification
     *
     * @param text
     */
    sendNotification(text) {
        if (window.Notification && Notification.permission === "granted" && storage.get("notificationsEnabled")) {
            new Notification("CSGO Remote", {body: text});
        }
    }

    /**
     * Returns the current permission status
     *
     * @return {*}
     */
    currentPermissionStatus() {
        if(storage.get("notificationsEnabled") && Notification.permission === "granted") return true;
        return false;
    }
}
