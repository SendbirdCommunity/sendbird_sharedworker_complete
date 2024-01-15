import {Sendbird} from "../sendbirdchat.min.js";
import { broadcastMessage } from "./utils.js";
const appId = "73B15A69-B61D-4159-99E0-B2BE8C6CEBA6";
const userId = "user1";
const userToken = "";

export let sb = null;

let { SendbirdChat, GroupChannelModule, GroupChannelHandler, ConnectionHandler } = Sendbird

export async function evaluateConnectionToSendbird() {
    if (sb.connectionState !== 'OPEN' && !sb.currentUser) {
        await sb.connect(userId, userToken);
        return 'CONNECTED JUST NOW';
    }
    return 'ALREADY';
}
//Initialization
export function evaluateSendbirdInitialization() {
    if (!sb) {
        sb = SendbirdChat.init({
            appId,
            modules: [new GroupChannelModule()],
            localCacheEnabled: true,
            appStateToggleEnabled: false
        });
        return {sb, message: "NEW_INIT"}
    }
    return { sb, message: "ALREADY_INITIALIZED." };
}

export const createConnectionHandler = (connectedTabs) => {
    const handlerActions = {
        onConnected: 'CONNECTED',
        onDisconnected: 'DISCONNECTED',
        onReconnectStarted: 'RECONNECT STARTED',
        onReconnectSucceeded: 'RECONNECT SUCCEEDED',
        onReconnectFailed: 'RECONNECT FAILED'
    };
    return new ConnectionHandler(
        Object.fromEntries(
            Object.entries(handlerActions).map(([event, message]) => [
                event, () => {
                  console.log("SW: ConnectionHandler", message);
                  broadcastMessage(connectedTabs, { type: "connection_handler", message: { error: false, status: sb.connectionState, message } });
                }
            ])
        )
    );

}



