import * as cheerio  from 'cheerio';
export type XCssOptions = {
  presets?:Array<PresetObj>
} & PresetObj;
export type PresetObj = {
  rules?:Array<[RegExp,Function]>,
  theme?:{[key:string]:string},
  pseudoClassDefine?:{[key:string]:string}
  responsiveDefine?:{[key:string]:string}
  shortDefine?:{[key:string]:string}
}
export type ParseResult = {
  responsive:string,
  pseudoClass:string,
  style:string,
  name:string
}
export default class XCss{
  presets:Array<PresetObj> = []
  rules:Array<[RegExp,Function]> = []
  theme:{[key:string]:string} = {}
  pseudoClassDefine:{[key:string]:string} = {}
  responsiveDefine:{[key:string]:string} = {}
  shortDefine:{[key:string]:string} = {}

  constructor(options:XCssOptions){
    this.presets = options?.presets || []
    this.rules = options?.rules || []
    this.theme = options?.theme || {}
    this.shortDefine = options?.shortDefine || {}
    this.pseudoClassDefine = options?.pseudoClassDefine || {}
    this.responsiveDefine = options?.responsiveDefine || {}
    this.presets.forEach(preset => {
      this.rules.push(...(preset.rules || []))
      this.theme = Object.assign({},preset.theme || {},this.theme)
      this.pseudoClassDefine = Object.assign({},preset.pseudoClassDefine || {},this.pseudoClassDefine)
      this.responsiveDefine = Object.assign({},preset.responsiveDefine || {},this.responsiveDefine)
      this.shortDefine = Object.assign({},preset.shortDefine || {},this.shortDefine)
    })
  }

  /**
   * 解析html，提取style
   * @param html
   * @returns 
   */
  parseHtml(html:string):Array<ParseResult>{
    let allClass:Array<string> = this.#getAllClass(html);
    return this.parseAllClass(allClass);
  }
  #getAllClass(html:string):Array<string>{
    const $ = cheerio.load(html,{},false);
    let allClass = Array.from(new Set(Array.from($.root().children()).map(dom => {
      return this.#getClass(dom);
    }).flat(1)));
    return allClass;
  }
  #getClass(dom:cheerio.Node):Array<string>{
    let classArr:Array<string> = [];
    if(dom.type == 'tag'){
      let el = dom as cheerio.Element;
      classArr.push(...(el.attribs?.class?.split(' ') || []))
      Array.from(el.children).forEach(child => {
        classArr.push(...this.#getClass(child))
      })
    }
    return classArr;
  }
  parseAllClass(clas:Array<string>):Array<ParseResult>{
    return clas.map(cla => {
      return this.parseClass(cla);
    }).flat(1)
  }
  parseShortClass(name:string,clas:Array<string>):Array<ParseResult>{
    return clas.map(cla => this.parseClass(cla,name)).flat(1)
  }

  parseClass(cla:string,name?:string):Array<ParseResult>{
    let shortKey = Object.keys(this.shortDefine).find(key => key == cla);
    if(shortKey){
      return this.parseShortClass(shortKey,this.shortDefine[shortKey].split(' '))
    }
    let responsiveKey = Object.keys(this.responsiveDefine).find(key => cla.startsWith(key))
    let tempCla = responsiveKey?cla.replace(responsiveKey,''):cla;
    let pseudoKey = Object.keys(this.pseudoClassDefine).find(key => tempCla.startsWith(key));
    tempCla = pseudoKey?tempCla.replace(pseudoKey,''):tempCla;
    return [{
      name:name || cla,
      responsive:this.parseResponsiveStyle(responsiveKey),
      pseudoClass:this.parsePseudoClassStyle(pseudoKey),
      style:this.parseStyle(tempCla)
    }].filter(e => e.style)
  }
  parseStyle(cla:string){
    let rule = this.rules.find(rule => rule[0].test(cla))
    if(rule){
      return rule[1].call(this,rule[0].exec(cla), cla,this.theme);
    }
    return '';
  }
  parsePseudoClassStyle(pseudoKey:string | undefined){
    if(pseudoKey){
      return this.pseudoClassDefine[pseudoKey]
    }
    return '';
  } 
  parseResponsiveStyle(responsiveKey:string | undefined){
    if(responsiveKey){
      return this.responsiveDefine[responsiveKey]
    }
    return '';
  }
  genStyleStr(result:Array<ParseResult>){
    let style = '';
    if(result && result.length){
      style = this.#genResponsiveStyle(result);
    }
    return style;
  }
  #genResponsiveStyle(result:Array<ParseResult>){
    let style = '';
    let map:Map<string,Array<ParseResult>> = Map.groupBy(result,e => e.responsive)
    console.log(map)
    Array.from(map.keys()).forEach(key => {
      if(key){
        style += `
          ${key}{
            ${this.#genNameStyle(map.get(key)!)}
          }
        `
      }else{
        style += `
          ${this.#genNameStyle(map.get(key)!)}
        `
      }
    })
    return style;
  }

  #genNameStyle(result:Array<ParseResult>){
    let map:Map<string,Array<ParseResult>> = Map.groupBy(result,e => e.name)
    return Array.from(map.keys()).map(key => {
      return this.#genPseudoStyle(key,map.get(key)!)
    }).join('\n')
  }

  #genPseudoStyle(name:string,result:Array<ParseResult>){
    let map:Map<string,Array<ParseResult>> = Map.groupBy(result,e => e.pseudoClass)
    return Array.from(map.keys()).map(key => {
      return `
        .${CSS.escape(name)}${key || ''}{
          ${map.get(key)?.map(e => e.style).join('')}
        }
      `
    }).join('\n')
  }

}
