import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  url += url.indexOf('?') < 0 ? '?' : '&' + parse(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, function (err, data) {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function parse(data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
