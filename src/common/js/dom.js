/* eslint-disable */

export function addClass(el,className){
  if(hasClass(el,className)){
    return
  }
  let allClassName=el.className.split(' ')
  allClassName.push(className)
  el.className=allClassName.join(' ')
}

export function hasClass(el,className){
  let reg=new RegExp('(^|\\s)'+className+'(\\s|$)')
  return reg.test(el.className)
}

export function getData(el,name,val){
  let prefix="data-"
  name=prefix+name
  if(val){
    el.setAttribute(name,val)
  }else{
    return el.getAttribute(name)
  }
}

// 浏览器的能力检测
let elementStyle=document.createElement('div').style
  // 立即执行函数
let vendor=(()=>{
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for(let item in transformNames){
    if(elementStyle[transformNames[item]]!=undefined){
      return item
    }
  }

  return false
})()
  //返回对应浏览器的属性名
export function prefixStyle(style){
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
