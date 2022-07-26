import { TwitterApi } from 'twitter-api-v2';

export default async function handler(req, res) {

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

    const { accessToken } = req.query;
    const client = new TwitterApi(accessToken);
    const { data } = await client.v2.me();
    const id = data.id
    
    const likedTweets = await client.v2.userLikedTweets(id.toString());

    res.status(200).json({ likedTweets: likedTweets })
}