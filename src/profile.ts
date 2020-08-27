import Twitter from 'twitter'
import dotenv from 'dotenv'
import errorText from './error'

dotenv.config()

interface ResponseError extends Error {
  status?: number
}

const getTweet = async (
  accessToken: string,
  accessTokenSecret: string
): Promise<any> => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET_KEY,
    access_token_key: accessToken,
    access_token_secret: accessTokenSecret
  })

  const { id } = await new Promise((resolve, reject) => {
    const parm = { include_entities: false }
    client
      .get('account/verify_credentials', parm)
      .then((result) => {
        return resolve(result)
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
  return id
}

export default getTweet
