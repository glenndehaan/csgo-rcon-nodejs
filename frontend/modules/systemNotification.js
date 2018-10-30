export default new class systemNotification {
    /**
     * Requests the user for notification permissions
     *
     * @return string
     */
    requestPermission() {
        if (window.Notification && Notification.permission !== "granted") {
            Notification.requestPermission((status) => {
                if (Notification.permission !== status) {
                    Notification.permission = status;
                }
            });
        }

        return Notification.permission;
    }

    /**
     * Sends a notification
     *
     * @param text
     */
    sendNotification(text) {
        if (window.Notification && Notification.permission === "granted") {
            new Notification("CSGO Remote", {body: text});
        }
    }
}
