import { TwitterApi } from 'twitter-api-v2';

export default async function handler(req, res) {
    const clientId = process.env.TWITTER_CLIENT_ID
    const clientSecret = process.env.TWITTER_CLIENT_SECRET

    let callbackURL
    if (process.env.NODE_ENV === 'development') {
      callbackURL = process.env.TWITTER_CALLBACK_URL_LOCAL
    } else {
      if (process.env.TWITTER_CALLBACK_URL_DEV) {
        callbackURL = process.env.TWITTER_CALLBACK_URL_DEV
      } else {
        callbackURL = process.env.TWITTER_CALLBACK_URL_PROD
      }
    }    
    console.log(clientId)
    console.log(clientSecret)
    console.log(callbackURL)
    
    const twitterClient = new TwitterApi({
        clientId: clientId,
        clientSecret: clientSecret,
    });

    const { state, code, codeVerifier } = req.query;

    console.log(code)
    console.log(codeVerifier)

    const { client: loggedClient, accessToken, refreshToken, } = await twitterClient.loginWithOAuth2({
        code,
        codeVerifier,
        redirectUri: callbackURL,
    });

    res.status(200).json({ accessToken: accessToken })
}


