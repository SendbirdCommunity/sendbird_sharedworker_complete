import {sb} from "./sendbirdConnectionManager.js";

export const connectedTabs = [];
const tabVisibility = {};

function countVisibleTabs() {
    return Object.keys(tabVisibility).filter(tabId => tabVisibility[tabId]).length;
}

export const upDateConnectedTabs = (port) => connectedTabs.push(port)

export async function handleTabVisibilityChange(tabDetails, isVisible) {
    tabVisibility[tabDetails.tab_id] = isVisible
    if(!isVisible) await new Promise(r => setTimeout(r, 2000));
    if (!isVisible && !countVisibleTabs()) {
        sb.setBackgroundState();
    } else {
        sb.setForegroundState();
    }
}

export function removeClosedTab(tabDetails) {
    if (connectedTabs.length === 1) {
        console.log("SW: Closing last tab. Disconnecting from Sendbird.");
        sb.disconnect();
    }
    delete tabVisibility[tabDetails.tab_id];
    const i = connectedTabs.indexOf(port);
    if (i > -1) connectedTabs.splice(i, 1);
}
