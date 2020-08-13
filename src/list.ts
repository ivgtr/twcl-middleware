import Twitter from 'twitter'
import dotenv from 'dotenv'

dotenv.config()

interface ResponseError extends Error {
  status?: number
}

const getParms = (options: {
  userid?: string
  listid?: string
}): {
  list_id?: string // eslint-disable-line camelcase
  count: number
} => {
  if (options.listid) {
    return {
      list_id: options.listid,
      count: 10
    }
  }
  const error: ResponseError = new Error('Error: 不明なエラー')
  error.status = 501
  throw error
}

const getList = async (
  accessToken: string,
  accessTokenSecret: string,
  options: {
    userid?: string
    listid?: string
  }
): Promise<{ id: string; neme: string; text: string }[]> => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET_KEY,
    access_token_key: accessToken,
    access_token_secret: accessTokenSecret
  })
  try {
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
          .catch((err) => {
            console.error(err)
            const error: ResponseError = new Error(err[0])
            error.status = 501
            reject(error)
          })
      })
    }
    const parms = getParms(options)
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
        .catch((err) => {
          console.log(err)

          const error: ResponseError = new Error(err[0])
          error.status = 501
          reject(error)
        })
    })
  } catch (err) {
    throw new Error(err)
  }
}

export default getList
