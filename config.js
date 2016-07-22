'use strict';

const WIT_TOKEN = process.env.WIT_TOKEN || 'G7RTNJCCFCW7PIUUNW3L6S66IOF4ASJD'
if (!WIT_TOKEN) {
  throw new Error('Missing WIT_TOKEN. Go to https://wit.ai/docs/quickstart to get one.')
}


var FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'EAAO1mrRcEYUBAEXxjYA2f1yftju7ZAatyAXhpw2ttaKYcajavMPGMNz2ZCUR2STRW2VlJWF12mBr7dZCppne9TZBxZAv4fcVP5KucYC5DydnS2mN76JvmeQWA9lDFN89aM0L7fWVEZBSdMzCdnjQa303UrZBbtV39676W8snMsevQZDZD';
if (!FB_PAGE_TOKEN) {
	throw new Error('Missing FB_PAGE_TOKEN. Go to https://developers.facebook.com/docs/pages/access-tokens to get one.')
}

var FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'my_voice_is_my_password_verify_me'

module.exports = {
  WIT_TOKEN: WIT_TOKEN,
  FB_PAGE_TOKEN: FB_PAGE_TOKEN,
  FB_VERIFY_TOKEN: FB_VERIFY_TOKEN,
}
