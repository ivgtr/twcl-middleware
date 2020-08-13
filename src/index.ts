import express from 'express'
import bodyParser from 'body-parser'
import { getOauthToken, getAccessToken } from './oauth'
import postTweet from './tweet'
import getTimeline from './timeline'
import getList from './list'

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
    const data = await getOauthToken()
    if (data.oauthToken && data.oauthTokenSecret) {
      res.send(data)
    } else {
      const err = new Error(
        'Twitter APIに問題があるようです・・・時間を空けてからもう一度試してみてください。'
      )
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

    const data = await getAccessToken(
      oauthToken,
      oauthTokenSecret,
      oauthVerifier
    )
    if (data.accessToken && data.accessTokenSecret && data.id) {
      res.send(data)
    } else {
      const err = new Error(
        '入力されたトークンに問題があるようです...もう一度最初から入力してください。'
      )
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
        console.log('ok')
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
      user
    } = req.body
    try {
      const result = await getTimeline(accessToken, accessTokenSecret, user)
      if (result) {
        console.log('ok')
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
      options
    } = req.body
    try {
      const result = await getList(accessToken, accessTokenSecret, options)
      if (result) {
        console.log('ok')
        res.send(result)
      }
    } catch (err) {
      next(err)
    }
  })
)

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

export default app
