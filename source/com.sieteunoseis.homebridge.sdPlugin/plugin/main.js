let websocket = null,
  pluginUUID = null,
  settingsCache = {};

const switchAction = {
  type: "com.sieteunoseis.homebridge.switch.action",

  onKeyDown: function (context, settings, coordinates, userDesiredState) {},

  onKeyUp: function (context, settings, coordinates, userDesiredState, state) {
    settingsCache[context] = settings;
    let serverurl = "";
    if (settings != null && settings.hasOwnProperty("serverurl")) {
      serverurl = settings["serverurl"];
    }
    let serverport = "";
    if (settings != null && settings.hasOwnProperty("serverport")) {
      serverport = settings["serverport"];
    }
    let authorization = "";
    if (settings != null && settings.hasOwnProperty("authorization")) {
      authorization = settings["authorization"];
    }
    let aid = "";
    if (settings != null && settings.hasOwnProperty("aid")) {
      aid = settings["aid"];
    }
    let iid = "";
    if (settings != null && settings.hasOwnProperty("iid")) {
      iid = settings["iid"];
    }
    if (
      serverurl == "" ||
      serverport == "" ||
      authorization == "" ||
      aid == "" ||
      iid == ""
    ) {
      this.ShowReaction(context, "Alert");
    } else {
      console.log('button pressed')
      const url = `http://${serverurl}:${serverport}/characteristics`
      fetch(url, {
        method: "PUT",
        headers: new Headers({
          "Authorization": authorization,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({"characteristics":[{"aid":parseInt(aid),"iid":parseInt(iid),"value":state}]})
      }).then(function(response) {
        if (response.status === 204) return response.ok;
        return response.json();
      }).then(function(data) {
        // `data` is the parsed version of the JSON returned from the above endpoint.
        console.log(data);
      });
    }
  },

  onWillAppear: function (context, settings, coordinates) {
    settingsCache[context] = settings;
    let serverurl = "";
    if (settings != null && settings.hasOwnProperty("serverurl")) {
      serverurl = settings["serverurl"];
    }
    let serverport = "";
    if (settings != null && settings.hasOwnProperty("serverport")) {
      serverport = settings["serverport"];
    }
    let authorization = "";
    if (settings != null && settings.hasOwnProperty("authorization")) {
      authorization = settings["authorization"];
    }
    let aid = "";
    if (settings != null && settings.hasOwnProperty("aid")) {
      aid = settings["aid"];
    }
    let iid = "";
    if (settings != null && settings.hasOwnProperty("iid")) {
      iid = settings["iid"];
    }
    if (
      serverurl == "" ||
      serverport == "" ||
      authorization == "" ||
      aid == "" ||
      iid == ""
    ) {
      this.ShowReaction(context, "Alert");
    }
  },

  ShowReaction: function (context, type) {
    const json = {
      event: "show" + type,
      context: context,
    };
    websocket.send(JSON.stringify(json));
  },

  SetSettings: function (context, settings) {
    const json = {
      event: "setSettings",
      context: context,
      payload: settings,
    };

    websocket.send(JSON.stringify(json));
  },

  SendSettings: function (action, context) {
    const json = {
      action: action,
      event: "sendToPropertyInspector",
      context: context,
      payload: settingsCache[context],
    };

    websocket.send(JSON.stringify(json));
  },
};

function connectElgatoStreamDeckSocket(
  inPort,
  inPluginUUID,
  inRegisterEvent,
  inInfo
) {
  pluginUUID = inPluginUUID;

  // Open the web socket
  websocket = new WebSocket("ws://localhost:" + inPort);

  function registerPlugin(inPluginUUID) {
    const json = {
      event: inRegisterEvent,
      uuid: inPluginUUID,
    };

    websocket.send(JSON.stringify(json));
  }

  websocket.onopen = function () {
    // WebSocket is connected, send message
    registerPlugin(pluginUUID);
  };

  websocket.onmessage = function (evt) {
    // Received message from Stream Deck
    const jsonObj = JSON.parse(evt.data);
    const event = jsonObj["event"];
    const action = jsonObj["action"];
    const context = jsonObj["context"];
    const jsonPayload = jsonObj["payload"];

    if (event == "keyDown") {
      const settings = jsonPayload["settings"];
      const coordinates = jsonPayload["coordinates"];
      const userDesiredState = jsonPayload["userDesiredState"];
      switchAction.onKeyDown(context, settings, coordinates, userDesiredState);
    } else if (event == "keyUp") {
      const settings = jsonPayload["settings"];
      const coordinates = jsonPayload["coordinates"];
      const userDesiredState = jsonPayload["userDesiredState"];
      const state = jsonPayload["state"];
      switchAction.onKeyUp(
        context,
        settings,
        coordinates,
        userDesiredState,
        state
      );
    } else if (event == "willAppear") {
      const settings = jsonPayload["settings"];
      const coordinates = jsonPayload["coordinates"];
      switchAction.onWillAppear(context, settings, coordinates);
    } else if (event == "sendToPlugin") {
      if (jsonPayload["type"] == "updateSettings") {
        switchAction.SetSettings(context, jsonPayload);
        settingsCache[context] = jsonPayload;
      } else if (jsonPayload["type"] == "requestSettings") {
        switchAction.SendSettings(action, context);
      }
    }
  };
}
