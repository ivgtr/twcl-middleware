import Twitter from 'twitter'
import dotenv from 'dotenv'
import errorText from './error'

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
      .catch(async (err) => {
        if (typeof err[0].code === 'number') {
          const error: ResponseError = new Error(await errorText(err[0].code))
          reject(error)
        } else {
          const error: ResponseError = new Error(
            '不明なエラー...時間を空けてから再度試してみてしてみてください'
          )
          error.status = 403
          reject(error)
        }
      })
  })
}

export default postTweet
