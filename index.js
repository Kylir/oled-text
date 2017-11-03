/* jshint undef: true, node: true, esnext: true, asi: true */

'use strict'

const {send, json} = require('micro'),
    Oled = require('oled-i2c-bus'),
    i2c = require('i2c-bus'),
    font = require('oled-font-5x7'),
    c = require('../config/constants')

let i2cBus = i2c.openSync(1)

let opts = {
    width: c.WIDTH,
    height: c.HEIGHT,
    address: c.I2C_ADDR
}

let oled = new Oled(i2cBus, opts)
oled.clearDisplay()
oled.turnOnDisplay()

module.exports = async (req, res) => {
    const body = await json(req)

    let text = body.text,
        status = 200,
        data = {}

    if (!text) {
        status = 400
        data.msg = 'Bad Request. No text property specified in the query.'
    } else {
        oled.setCursor(1, 1);
        oled.writeString(font, 1, text, 1, true);
        data.msg = 'Ok. Text sent to the screen.'
    }

    send(res, status, data)

}
