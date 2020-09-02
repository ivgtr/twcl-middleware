import Twitter from 'twitter'
import dotenv from 'dotenv'
import errorText from './error'

dotenv.config()

interface ResponseError extends Error {
  status?: number
}

const getTimeline = async (
  accessToken: string,
  accessTokenSecret: string,
  user: string,
  num: number
): Promise<any> => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET_KEY,
    access_token_key: accessToken,
    access_token_secret: accessTokenSecret
  })
  const n = num > 100 ? 100 : num

  if (user) {
    const success = await new Promise((resolve, reject) => {
      const params = { screen_name: user, count: n }
      client
        .get('statuses/user_timeline', params)
        .then((result) => {
          console.log('get userTimeline')
          const shap = result.map((data) => {
            return {
              time: data.created_at,
              id: `@${data.user.screen_name}`,
              name: data.user.name,
              text: data.text,
              retweet: data.retweet_count,
              favorite: data.favorite_count
            }
          })

          return resolve(shap)
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
    return success
  }
  return new Promise((resolve, reject) => {
    const params = { count: n }
    client
      .get('statuses/home_timeline', params)
      .then((result) => {
        console.log('get homeTimeline')

        const shap = result.map((data) => {
          return {
            time: data.created_at,
            id: `@${data.user.screen_name}`,
            name: data.user.name,
            text: data.text,
            retweet: data.retweet_count,
            favorite: data.favorite_count
          }
        })

        return resolve(shap)
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

export default getTimeline
