import { TwitterApi } from 'twitter-api-v2';

export default async function handler(req, res) {
    const clientId = process.env.TWITTER_CLIENT_ID
    const clientSecret = process.env.TWITTER_CLIENT_SECRET
    const callbackURL = process.env.TWITTER_CALLBACK_URL_DEV
    const twitterClient = new TwitterApi({
        clientId: clientId,
        clientSecret: clientSecret,
    });

    const { state, code, codeVerifier } = req.query;
    const { client: loggedClient, accessToken, refreshToken, } = await twitterClient.loginWithOAuth2({
        code,
        codeVerifier,
        redirectUri: callbackURL,
    });

    res.status(200).json({ accessToken: accessToken })
}


