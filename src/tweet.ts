import Twitter from 'twitter'

const postTweet = async (
  accessToken: string,
  accessTokenSecret: string,
  tweet: string
): Promise<boolean> => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET_KEY,
    access_token_key: accessToken,
    access_token_secret: accessTokenSecret
  })

  const result = await client.post(
    'statuses/update',
    { status: tweet },
    (error) => {
      if (!error) {
        console.log(`tweet success: ${tweet}`)
        return true
      }
      console.log(error)
      return false
    }
  )
  if (result) {
    return true
  }
  return false
}

export default postTweet
