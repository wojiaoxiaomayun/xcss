import XCss from '@xcss/core'

export default class Runtime{
  target
  xcss
  #observer
  #cache = []
  #styleElement

  constructor(target,xcssOptions){
    this.target = target || document.body
    this.xcss = new XCss(xcssOptions)
    this.#styleElement = document.createElement('style')
    document.head.append(this.#styleElement)
    this.init()
  }

  init(){
    this.#observer = new MutationObserver((records) => {
      let results = [];
      records.forEach(e => {
        let newResults = [];
        if(e.type == 'childList'){
          newResults = this.xcss.parseHtml(e.target.outerHTML).filter(result => {
            if(!this.#cache.includes(result.name)){
              this.#cache.push(result.name);
              return true;
            }
            return false;
          });
        }else if(e.type == 'attributes'){
          let clas = e.target.attributes.class.value?.split(' ')?.filter(cla => !this.#cache.includes(cla)) || []
          if(clas.length){
            newResults = this.xcss.parseAllClass(clas).filter(result => {
              if(!this.#cache.includes(result.name)){
                this.#cache.push(result.name);
                return true;
              }
              return false;
            });
          }
        }
        if(newResults.length){
          results.push(...newResults)
        }
      })
      if(results.length){
        this.#styleElement.append(this.xcss.genStyleStr(results))
      }
    });
    this.#observer.observe(this.target,{
      attributes:true,
      childList:true,
      subtree:true,
      attributeFilter:['class']
    })
  }

  destory(){
    this.#observer?.disconnect()
  }

}

export {XCss}