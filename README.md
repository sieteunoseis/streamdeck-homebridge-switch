# Homebridge plugin for Elgato Stream Deck

> Use the Elgato Stream Deck to toggle a Homebridge accessory.

This plugin should work on both Windows 10 and macOS.

Based on the [streamdeck-homeassistant-webhook plugin](https://github.com/hendricksond/streamdeck-homeassistant-webhook) by hendricksond.

## How to use

You will need get AID and IID of the device that you want to control. You can browse to [http://localhost:port/accessories](http://localhost:port/accessories) for a list of device.

Or try to pull them via curl:

```
curl -X PUT http://192.168.1.1:51896/accessories --header "Content-Type:Application/json" --header "authorization: 123-45-678"
```

### Installation

Download the [latest release](https://github.com/sieteunoseis/streamdeck-homebridge-switch/tree/master/release), then execute the file. You will be asked if you want to install the file. Click yes, and the plugin will be installed.

### Configuring a button

Drag and drop the Switch action from the Homebridge category in the action list to an open button. Click the button to configure it. Fill out the fields.

Note: Switch default state is ON. You may need to press the button twice to get the desired result.

#### Server IP

The IP address of your server.

Example: `192.168.1.2`

#### Server Port

The port that your Homebridge instance is running on.

Example: `51896`

#### Authorization

Homebridge pin used to pair with Homekit

Example: `123-45-678`

#### AID

Accessory ID

Example: `1`

#### IID

Service/Characteristic ID

Example: `50`

## Giving Back

If you would like to support my work and the time I put in creating the code, you can click the image below to get me a coffee. I would really appreciate it (but is not required).

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/black_img.png)](https://www.buymeacoffee.com/automatebldrs)

-Jeremy Worden
