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
