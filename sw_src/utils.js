export function broadcastMessage(connectedTabs, message) {
    console.log(message)
    connectedTabs.forEach(port => port.postMessage(message));
}

export function handleErrorMessage(connectedTabs, error, type) {
    const message = {
        error: true,
        message: error.message || "Unknown Error",
        is_connected_to_sendbird: false
    };
    console.log("SW: Error", message);
    broadcastMessage(connectedTabs,{ type: `${type}_error`, message });
}
