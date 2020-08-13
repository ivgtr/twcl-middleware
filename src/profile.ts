import Twitter from 'twitter'
import dotenv from 'dotenv'

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
      .catch((err) => {
        const error: ResponseError = new Error(err[0])
        error.status = 501
        reject(error)
      })
  })
  return id
}

export default getTweet
