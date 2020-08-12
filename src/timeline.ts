import Twitter from 'twitter'
import dotenv from 'dotenv'

dotenv.config()

interface ResponseError extends Error {
  status?: number
}

const getTimeline = async (
  accessToken: string,
  accessTokenSecret: string,
  user: string
): Promise<any> => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET_KEY,
    access_token_key: accessToken,
    access_token_secret: accessTokenSecret
  })

  if (user) {
    return new Promise((resolve, reject) => {
      const params = { user_id: user, count: 10 }
      client
        .get('statuses/user_timeline', params)
        .then((result) => {
          console.log('get userTimeline')
          const shap = result.map((data) => {
            return {
              id: `@${data.user.screen_name}`,
              name: data.user.name,
              text: data.text
            }
          })

          return resolve(shap)
        })
        .catch((err) => {
          const error: ResponseError = new Error(err[0])
          error.status = 501
          reject(error)
        })
    })
  }
  return new Promise((resolve, reject) => {
    const params = { count: 10 }
    client
      .get('statuses/home_timeline', params)
      .then((result) => {
        console.log('get homeTimeline')
        const shap = result.map((data) => {
          return {
            id: `@${data.user.screen_name}`,
            name: data.user.name,
            text: data.text
          }
        })

        return resolve(shap)
      })
      .catch((err) => {
        const error: ResponseError = new Error(err[0])
        error.status = 501
        reject(error)
      })
  })
}

export default getTimeline