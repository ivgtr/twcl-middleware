import express from 'express'
import bodyParser from 'body-parser'
import { getOauthToken, getAccessToken } from './oauth'

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
  wrap(async (req, res) => {
    const data = await getOauthToken()
    res.send(data)
    if (data.oauthToken && data.oauthTokenSecret) {
      res.send(data)
    } else {
      const err = new Error(
        'Error: Twitter APIに問題があるようです・・・時間を空けてからもう一度試してみてください。'
      )
      res.status(400).send({ error: err })
    }
  })
)

app.post(
  '/getAccessToken',
  wrap(async (req, res) => {
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
    if (data.accessToken && data.accessTokenSecret) {
      res.send(data)
    } else {
      const err = new Error(
        'Error: 入力されたトークンに問題があるようです...もう一度最初から入力してください。'
      )
      res.status(400).send({ error: err })
    }
  })
)

app.use('/', (req, res) => {
  res.send('start')
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Internal Server Error')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

export default app
