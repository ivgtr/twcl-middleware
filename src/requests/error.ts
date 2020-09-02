import json from './configs/error.json'

const returnError = async (code: number): Promise<string> => {
  const result: {
    code: number
    text: string
  } = json.find((i) => {
    return i.code === code
  })
  if (result) {
    return result.text
  }
  return '不明なエラー...時間を空けてから再度試してみてしてみてください'
}

export default returnError
