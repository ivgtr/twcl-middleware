import Twitter from 'twitter'
import dotenv from 'dotenv'

dotenv.config()

interface ResponseError extends Error {
  status?: number
}

const getParms = (options: {
  userid?: string
  listid?: number
  userName?: string
  listName?: string
}): {
  list_id?: number // eslint-disable-line camelcase
  slug?: string
  owner_screen_name?: string // eslint-disable-line camelcase
  count: number
} => {
  if (options.listid) {
    return {
      list_id: options.listid,
      count: 10
    }
  }
  if (options.userName && options.listName) {
    return {
      slug: options.listName,
      owner_screen_name: options.userName,
      count: 10
    }
  }
  const error: ResponseError = new Error('Error: 引数がおかしい')
  error.status = 501
  throw error
}

const getList = async (
  accessToken: string,
  accessTokenSecret: string,
  options: {
    userid?: string
    listid?: number
    userName?: string
    listName?: string
  }
): Promise<any> => {
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
          console.log(result)
          const shap = result.map((data) => {
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
        const shap = result.map((data) => {
          return {
            id: `@${data.user.screen_name}`,
            name: data.user.name,
            text: data.text
          }
        })
        console.log(shap)

        return resolve(shap)
      })
      .catch((err) => {
        console.log(err)

        const error: ResponseError = new Error(err[0])
        error.status = 501
        reject(error)
      })
  })
}

export default getList
