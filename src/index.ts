import express from 'express'
import bodyParser from 'body-parser'
import {
  getOauthToken,
  getAccessToken,
  postTweet,
  getTimeline,
  getSearch,
  getList
} from './requests'

const port = process.env.PORT || 5000

const app = express()
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

const wrap = (fn) => (...args) => fn(...args).catch(args[2])

app.post(
  '/getOauthToken',
  wrap(async (req, res, next) => {
    try {
      const data = await getOauthToken()
      res.send(data)
    } catch (err) {
      next(err)
    }
  })
)

app.post(
  '/getAccessToken',
  wrap(async (req, res, next) => {
    const {
      oauth_token: oauthToken,
      oauth_token_secret: oauthTokenSecret,
      oauth_verifier: oauthVerifier
    } = req.body

    try {
      const data = await getAccessToken(
        oauthToken,
        oauthTokenSecret,
        oauthVerifier
      )
      res.send(data)
    } catch (err) {
      next(err)
    }
  })
)

app.post(
  '/postTweet',
  wrap(async (req, res, next) => {
    const {
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
      tweet
    } = req.body
    try {
      const result = await postTweet(accessToken, accessTokenSecret, tweet)
      if (result) {
        res.send(result)
      }
    } catch (err) {
      next(err)
    }
  })
)

app.post(
  '/getTimeline',
  wrap(async (req, res, next) => {
    const {
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
      user,
      num
    } = req.body
    try {
      const result = await getTimeline(
        accessToken,
        accessTokenSecret,
        user,
        num
      )
      if (result) {
        res.send(result)
      }
    } catch (err) {
      next(err)
    }
  })
)

app.post(
  '/getSearch',
  wrap(async (req, res, next) => {
    const {
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
      q,
      num
    } = req.body
    try {
      const result = await getSearch(accessToken, accessTokenSecret, q, num)
      if (result) {
        res.send(result)
      }
    } catch (err) {
      next(err)
    }
  })
)

app.post(
  '/getList',
  wrap(async (req, res, next) => {
    const {
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
      options,
      num
    } = req.body
    try {
      const result = await getList(accessToken, accessTokenSecret, options, num)
      if (result) {
        res.send(result)
      }
    } catch (err) {
      next(err)
    }
  })
)

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ msg: err.message })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

export default app
