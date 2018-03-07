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
  return _list
}

// 节流函数，函数柯里化，执行一个函数，获取另一个函数
// 通过定义一个定时器，来达到每次都会有一个请求，不会频繁派发多余请求
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
