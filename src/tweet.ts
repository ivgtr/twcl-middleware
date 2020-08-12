import Twitter from 'twitter'
import dotenv from 'dotenv'

dotenv.config()

interface ResponseError extends Error {
  status?: number
}

const postTweet = async (
  accessToken: string,
  accessTokenSecret: string,
  tweet: string
): Promise<any> => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET_KEY,
    access_token_key: accessToken,
    access_token_secret: accessTokenSecret
  })

  return new Promise((resolve, reject) => {
    client
      .post('statuses/update', { status: tweet })
      .then((data) => {
        console.log(`tweet success: ${tweet}`)
        return resolve(data)
      })
      .catch((err) => {
        const error: ResponseError = new Error(err[0])
        error.status = 501
        reject(error)
      })
  })
}

export default postTweet
