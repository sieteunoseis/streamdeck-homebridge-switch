let websocket = null,
    uuid = null,
    actionInfo = {};

function connectElgatoStreamDeckSocket(inPort, inUUID, inRegisterEvent, inInfo, inActionInfo) {
    uuid = inUUID;

    actionInfo = JSON.parse(inActionInfo);
    websocket = new WebSocket('ws://localhost:' + inPort);

    websocket.onopen = function () {
        const json = {
            event:  inRegisterEvent,
            uuid:   inUUID
        };

        websocket.send(JSON.stringify(json));
        requestSettings();
    }

    websocket.onmessage = function (evt) {
        // Received message from Stream Deck
        const jsonObj = JSON.parse(evt.data);
        if (jsonObj.event === 'sendToPropertyInspector') {
            const payload = jsonObj.payload;
            if (payload.error) {
                return;
            }

            const serverurl = document.getElementById('serverurl');
            serverurl.value = payload.serverurl;

            const serverport = document.getElementById('serverport');
            serverport.value = payload.serverport;

            const authorization = document.getElementById('authorization');
            authorization.value = payload.authorization;

            const aid = document.getElementById('aid');
            aid.value = payload.aid;

            const iid = document.getElementById('iid');
            iid.value = payload.iid;

            if(serverurl.value == "undefined") {
                serverurl.value = "";
            }

            if(serverport.value == "undefined") {
                serverport.value = "";
            }

            if(authorization.value == "undefined") {
                authorization.value = "";
            }

            if(aid.value == "undefined") {
                aid.value = "";
            }

            if(iid.value == "undefined") {
                iid.value = "";
            }

            revealPropertyInspector()
        }
    };

}

function revealPropertyInspector() {
    const el = document.querySelector('.sdpi-wrapper');
    el && el.classList.remove('hidden');
}

function requestSettings() {
    if (websocket) {
        let payload = {};
        payload.type = "requestSettings";
        const json = {
            "action": actionInfo['action'],
            "event": "sendToPlugin",
            "context": uuid,
            "payload": payload,
        };
        websocket.send(JSON.stringify(json));
    }
}

function updateSettings() {
    if (websocket) {
        const serverurl = document.getElementById('serverurl');
        const serverport = document.getElementById('serverport');
        const authorization = document.getElementById('authorization');
        const aid = document.getElementById('aid');
        const iid = document.getElementById('iid');

        let payload = {};
        payload.type = "updateSettings";
        payload.serverurl = serverurl.value;
        payload.serverport = serverport.value;
        payload.authorization = authorization.value;
        payload.aid = aid.value;
        payload.iid = iid.value;
        const json = {
            "action": actionInfo['action'],
            "event": "sendToPlugin",
            "context": uuid,
            "payload": payload,
        };
        websocket.send(JSON.stringify(json));
    }
}
