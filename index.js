'use strict'

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')

var Config = require('./config')
var FB = require('./connectors/facebook')
var Bot = require('./bot')


// LETS MAKE A SERVER!
var app = express()
app.set('port', (process.env.PORT) || 5000)
// SPIN UP SERVER
app.listen(app.get('port'), function () {
  console.log('Running on port', app.get('port'))
})
// PARSE THE BODY
app.use(bodyParser.json())


// index page
app.get('/', function (req, res) {
  res.send('안녕하세요! 인공지능 챗봇고입니다. 무엇을 도와 드릴까요?')
})

// for facebook to verify
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === Config.FB_VERIFY_TOKEN) {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong FB_VERIFY_TOKEN')
})

// to send messages to facebook
app.post('/webhook', function (req, res) {
  var entry = FB.getMessageEntry(req.body)
  // IS THE ENTRY A VALID MESSAGE?
  if (entry && entry.message) {
    if (entry.message.attachments) {
      // NOT SMART ENOUGH FOR ATTACHMENTS YET
      FB.newMessage(entry.sender.id, '멋지군요!! 첨부기능을 사용하셨습니다.')
    } else {
      // SEND TO BOT FOR PROCESSING
      Bot.read(entry.sender.id, entry.message.text, function (sender, reply) {
        FB.newMessage(sender, reply)
      })
    }
  }

  res.sendStatus(200)
})


// to post data without wit.ai
//app.post('/webhook/', function (req, res) {
//	let messaging_events = req.body.entry[0].messaging
//	for (let i = 0; i < messaging_events.length; i++) {
//		let event = req.body.entry[0].messaging[i]
//		let sender = event.sender.id
//		if (event.message && event.message.text) {
//			let text = event.message.text
//			if (text === '앱') {
//				sendGenericMessage(sender)
//				continue
//			}
//			sendTextMessage(sender, "챗봇고, echo: " + text.substring(0, 200))
//		}
//		if (event.postback) {
//			let text = JSON.stringify(event.postback)
//			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
//			continue
//		}
//	}
//	res.sendStatus(200)
//})



// recommended to inject access tokens as environmental variables, e.g. 
const token = process.env.FB_PAGE_ACCESS_TOKEN

function sendTextMessage(sender, text) {
	let messageData = { text:text }
	
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}

function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "추천1번",
					"subtitle": "",
					"image_url": "https://lh3.googleusercontent.com/IUXjjTWXRWFzOecPdpPWG0PjAxNybw4Mu4Hc7z_KbwebfpeDtS9_5-g-VHxXXd7uyA=w300-rw",
					"buttons": [{
						"type": "web_url",
						"url": "https://play.google.com/store/apps/details?id=kr.co.winko.webus",
						"title": "앱다운로드"
					}, {
						"type": "postback",
						"title": "설명",
						"payload": "현재 절찬리 판매중입니다.",
					}],
				}, {
					"title": "추천2번",
					"subtitle": "삐비중고차",
					"image_url": "http://bbibi.co.kr/images/auto_1800.jpg",
					"buttons": [{
						"type": "postback",
						"title": "설명",
						"payload": "오픈준비중입니다.",
					}],
				}]
			}
		}
	}
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log('Error sending messages: ', error)
		} else if (response.body.error) {
			console.log('Error: ', response.body.error)
		}
	})
}