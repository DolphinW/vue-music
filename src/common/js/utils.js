function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(list) {
  let _list = list.slice()
  for (let i = 0; i < _list.length; i++) {
    const t = getRandomInt(0, i)
    let tmp = _list[i]
    _list[i] = _list[t]
    _list[t] = tmp
  }
  console.log(_list)
  return _list
}
