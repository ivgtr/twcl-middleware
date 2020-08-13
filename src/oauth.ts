import axios from 'axios'
import crypto from 'crypto'
import OAuth, { RequestOptions, Options } from 'oauth-1.0a'
import dotenv from 'dotenv'
import getProfile from './profile'

dotenv.config()

interface ResponseError extends Error {
  status?: number
}

const oauthUrl = 'https://api.twitter.com/oauth'
const callbackUrl = 'https://oauth.ivgtr.me/oauthTwitterRedirect'

const options: Options = {
  consumer: {
    key: process.env.TWITTER_CONSUMER_KEY,
    secret: process.env.TWITTER_CONSUMER_SECRET_KEY
  },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString, key) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64')
  }
}

const oauthInstance = (): OAuth => {
  return new OAuth(options)
}

export const getOauthToken = async (): Promise<{
  oauthToken: string
  oauthTokenSecret: string
}> => {
  const requestData: RequestOptions = {
    url: `${oauthUrl}/request_token`,
    method: 'POST',
    data: { oauth_verifier: callbackUrl }
  }

  try {
    const responce = await axios.post(
      `${oauthUrl}/request_token`,
      {},
      {
        headers: oauthInstance().toHeader(
          oauthInstance().authorize(requestData)
        )
      }
    )

    const oauthToken: string = responce.data.split('&')[0].split('=')[1]
    const oauthTokenSecret: string = responce.data.split('&')[1].split('=')[1]
    return {
      oauthToken,
      oauthTokenSecret
    }
  } catch (err) {
    return {
      oauthToken: '',
      oauthTokenSecret: ''
    }
  }
}

export const getAccessToken = async (
  oauthToken: string,
  oauthTokenSecret: string,
  oauthVerifier: string
): Promise<{
  accessToken: string
  accessTokenSecret: string
  id: number
}> => {
  const requestData: RequestOptions = {
    url: `${oauthUrl}/access_token`,
    method: 'POST',
    data: {
      oauth_token: oauthToken,
      oauth_token_secret: oauthTokenSecret,
      oauth_verifier: oauthVerifier
    }
  }

  try {
    const responce = await axios.post(
      `${oauthUrl}/access_token`,
      {},
      {
        headers: oauthInstance().toHeader(
          oauthInstance().authorize(requestData)
        )
      }
    )
    const accessToken: string = responce.data.split('&')[0].split('=')[1]
    const accessTokenSecret: string = responce.data.split('&')[1].split('=')[1]

    const id: number = await getProfile(accessToken, accessTokenSecret)
    return { accessToken, accessTokenSecret, id }
  } catch (err) {
    const error: ResponseError = new Error(err[0])
    error.status = 501
    throw error
  }
}
