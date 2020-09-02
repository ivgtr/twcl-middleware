import Twitter from 'twitter'
import dotenv from 'dotenv'
import errorText from './error'

dotenv.config()

interface ResponseError extends Error {
  status?: number
}

const getParms = (
  options: {
    userid?: string
    listid?: string
  },
  num: number
): {
  list_id?: string // eslint-disable-line camelcase
  count: number
} => {
  if (options.listid) {
    const n = num > 100 ? 100 : num
    return {
      list_id: options.listid,
      count: n
    }
  }
  const error: ResponseError = new Error('不正なリクエストです')
  error.status = 401
  throw error
}

const getList = async (
  accessToken: string,
  accessTokenSecret: string,
  options: {
    userid?: string
    listid?: string
  },
  num: number
): Promise<{ id: string; neme: string; text: string }[]> => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET_KEY,
    access_token_key: accessToken,
    access_token_secret: accessTokenSecret
  })

  if (options.userid) {
    return new Promise((resolve, reject) => {
      const parms = {
        user_id: options.userid
      }
      client
        .get('lists/list', parms)
        .then((result) => {
          const shap: {
            id: string
            neme: string
            text: string
          }[] = result.map((data) => {
            return {
              id: data.id_str,
              name: data.name,
              description: data.description
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
  const parms = getParms(options, num)
  return new Promise((resolve, reject) => {
    client
      .get('lists/statuses', parms)
      .then((result) => {
        const shap: { id: string; neme: string; text: string }[] = result.map(
          (data) => {
            return {
              id: `@${data.user.screen_name}`,
              name: data.user.name,
              text: data.text
            }
          }
        )
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

export default getList
