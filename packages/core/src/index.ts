import * as cheerio  from 'cheerio';
export type XCssOptions = {
  rules:Array<[RegExp,Function]>,
  theme:{[key:string]:string}
}
export type ParseResult = {
  responsive:string,
  pseudoClass:string,
  style:string,
  name:string
}
export default class XCss{
  rules:Array<[RegExp,Function]> = []
  theme:{[key:string]:string} = {}
  pseudoClassDefine:{[key:string]:string} = {
    'hover:':':hover'
  }
  responsiveDefine:{[key:string]:string} = {
    'md:':'@media screen and (max-width:500px)'
  }

  constructor(options:XCssOptions){
    this.rules = options?.rules || [[/^(inline-)?(?:flex)-?(r|c|cr|rr)?-?(wrap)?-?(gap)?-?(.*)$/,(arr,text,themes) => {
      let str = `
          display:${arr[1] || ''}flex;
      `;
      if(arr[2]){
          let direcMap = {
              c:'column',
              r:'row',
              cr:'column-resever',
              rr:'row-resever',
          }
          str += `
              flex-direction:${direcMap[arr[2]]};
          `
      }
      if(arr[3]){
          str +=  `
              flex-wrap:wrap;
          `
      }
      return str;
  }],
  [/^(align|justify|alignc)-(start|end|center|between|around|stretch|evenly)$/,(arr,text,themes) => {
      let map = {
          align:'align-items',
          alignc:'align-content',
          justify:'justify-content',
          start:'flex-start',
          end:'flex-end',
          center:'center',
          between:'space-between',
          around:'space-around',
          evenly:'space-evenly',
          stretch:'stretch',
      }
      let str = `${map[arr[1]]}:${map[arr[2]]};`;
      return str;
  }]]
    this.theme = options?.theme || {}
  }

  /**
   * 解析html，提取style
   * @param html
   * @returns 
   */
  parseHtml(html:string){
    let allClass:Array<string> = this.#getAllClass(html);
    return this.#parseAllClass(allClass);
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
  #parseAllClass(clas:Array<string>){
    return clas.map(cla => {
      return this.parseClass(cla);
    })
  }
  // parseShortClass(name:string,clas:Array<string>){
  //   return clas.map(cla => this.parseClass(cla,name))
  // }
  parseClass(cla:string,name?:string):ParseResult{
    let responsiveKey = Object.keys(this.responsiveDefine).find(key => cla.startsWith(key))
    let tempCla = responsiveKey?cla.replace(responsiveKey,''):cla;
    let pseudoKey = Object.keys(this.pseudoClassDefine).find(key => tempCla.startsWith(key));
    tempCla = pseudoKey?tempCla.replace(pseudoKey,''):tempCla;
    return {
      name:name || cla,
      responsive:this.parseResponsiveStyle(responsiveKey),
      pseudoClass:this.parsePseudoClassStyle(pseudoKey),
      style:this.parseStyle(tempCla)
    }
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
        .${name}${key || ''}{
          ${map.get(key)?.map(e => e.style).join('')}
        }
      `
    }).join('\n')
  }

}
