import {
    sb,
    evaluateConnectionToSendbird,
    evaluateSendbirdInitialization,
    createConnectionHandler
} from "./sw_src/sendbirdConnectionManager.js";
import {
    broadcastMessage,
    handleErrorMessage
} from "./sw_src/utils.js";
import {
    handleTabVisibilityChange,
    removeClosedTab,
    upDateConnectedTabs,
    connectedTabs
} from "./sw_src/tabManagement.js";

let connections = 0;
//onconnect Comes with the ShardWorker API
onconnect = function(e) {
    const port = e.ports[0];
    connections++;
    upDateConnectedTabs(port);

    port.onmessage = async function (event) {
        let tabDetails = {type: event.data.type, tab_id: event.data.tabId};
        let replyMessage = { ...tabDetails };
        try {
            const instance = evaluateSendbirdInitialization();
            replyMessage.sendbird  = instance.message;
            if(instance.message === "NEW_INIT") {
                const connectionHandler = createConnectionHandler(connectedTabs);
                sb.addConnectionHandler('connectionHandler', connectionHandler)
            }
            switch (event.data.type) {
                case "new_tab_opened":
                    await handleTabVisibilityChange(tabDetails, true);
                    const connectionEvaluationResult =  await evaluateConnectionToSendbird()
                    replyMessage.connection =  { status: sb.connectionState, message: connectionEvaluationResult }
                    break;
                case "tab_closed":
                    removeClosedTab(tabDetails, port);
                    replyMessage.connection =  { status: sb.connectionState, message: 'AFTER TAB CLOSED' };
                    break;
                case "tab_hidden":
                    await handleTabVisibilityChange(tabDetails, false);
                    replyMessage.connection = { status: sb.connectionState, message: 'AFTER TAB VISIBILITY CHANGE' };
                    break;
                case "tab_visible":
                    await handleTabVisibilityChange(tabDetails, true);
                    replyMessage.connection = { status: sb.connectionState, message: 'AFTER TAB VISIBILITY CHANGE' };
                    break;
                default:
                    console.log("SW: Fallback", event.data);
                    return;
            }
            replyMessage.tabCount = connectedTabs.length
            broadcastMessage(connectedTabs, replyMessage);
        } catch (error) {
            handleErrorMessage(connectedTabs, error, event.data.type);
        }
    };
}
















