//[['border','b'],['red','green','']]
const createTips = (arr) => {
    return arr.reduce((prev,current) => {
        let result = []
        current.forEach(e => {
            if(prev.length){
                prev.forEach(f => {
                    result.push([...f,e])
                })
            }else{
                result.push([e])
            }
        })
        return result;
    },[]).map(e => {
        return e.filter(f => f).join('-')
    })
}
const rules = [
    //width
    [/^(min-|max-)?([wh])-?(.*?)(!)?$/,(arr,text,theme) => {
        let str = `${arr[1] || ''}${arr[2] == 'w'?'width':'height'}:${handleSize(arr[3])}${arr[4]?' !important':''};`
        return str 
    },createTips([['min','max',''],['w','h'],['10','10px','10rem','10%']])],
    [/^(?:border-|b-)([ltrb]+)?-?(\d+)?-?(solid|dashed|double|none)?-?(.*)$/,(arr,text,theme) => {
        let positionMap = {
            l:'left',
            t:'top',
            r:'right',
            b:'bottom',
        }
        let str = '';
        if(arr[1]){
            arr[1].split('').forEach(p => {
                str += `border-${positionMap[p] || ''}:${handleSize(arr[2] || 1)} ${arr[3] || 'solid'} ${handleColor(theme,arr[4])};`
            })
        }else{
            str += `border:${handleSize(arr[2] || 1)} ${arr[3] || 'solid'} ${handleColor(theme,arr[4])};`
        }
        return str
    },createTips([['border','b'],['l','t','r','b','lt','lr','lb','ltr','ltb','ltrb','tr','tb','trb','rb',''],['solid','dashed','double','none',''],['10','10px','10rem','10%']])],
    [/^(inline-)?(?:flex)-?(r|c|cr|rr)?-?(wrap)?$/,(arr,text,theme) => {
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
    },createTips([['inline',''],['flex'],['r','c','cr','rr',''],['wrap','']])],
    [/^(?:gap-)(.*)$/,(arr,text,theme) => {
        return `
            gap:${handleSize(arr[1])};
        `;
    },createTips([['gap'],['8','8px','8rem']])],
    [/^(inline-)?(block)$/,(arr,text,theme) => {
        return `
            display:${arr[1] || ''}block;
        `;
    },['inline-block','block']],
    [/^(align|justify|alignc)-(start|end|center|between|around|stretch|evenly)$/,(arr,text,theme) => {
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
    },createTips([['align','alignc','justify'],['start','end','center','between','around','stretch','evenly']])],
    [/^(?:overflow|over|flow)-(h|a|v|hidden|auto|visible)$/,(arr,text,theme) => {
        let map = {
            h:'hidden',
            a:'auto',
            v:'visible'
        }
        let str = `overflow:${map[arr[1]] || arr[1]};`;
        return str;
    },createTips([['overflow','over','flow'],['h','a','v','hidden','auto','visible']])],
    [/^(?:font-)?(size|weight|color)-(.*)$/,(arr,text,theme) => {
        let str = ''
        if(arr[1]){
            if(arr[1] == 'color'){
                str += `color:${handleColor(theme,arr[2])};`
            }else{
                str += `font-${arr[1]}:${arr[1] == 'size'?handleSize(arr[2]):arr[2]};`;
            }
        }else{
            str += `font-size:${handleSize(arr[2])};`
        }
        return str;
    },[...createTips([['font',''],['size'],['10','10px']]),...createTips([['font',''],['color'],['red','primary']]),...createTips([['font',''],['weight'],['100','bold']])]],
    [/^(margin|padding)-([ltrb]+)?-?(.*?)(!)?$/,(arr,text,theme) => {
        let str = ''
        let positionMap = {
            l:'left',
            t:'top',
            r:'right',
            b:'bottom',
        }
        if(arr[2]){
            arr[2].split('').forEach(e => {
                str += `${arr[1]}-${positionMap[e]}:${handleSize(arr[3])}${arr[4]?' !important':''};`
            });
        }else{
            str += `${arr[1]}:${handleSize(arr[3])}${arr[4]?' !important':''};`
        }
        return str;
    },createTips([['margin','padding'],['l','t','r','b','lt','lr','lb','ltr','ltb','ltrb','tr','tb','trb','rb',''],['10','10px','10rem','10%']])],
    [/^(?:bg)-(.*)$/,(arr,text,theme) => {
        let str = `background:${handleColor(theme,arr[1])};`
        return str;
    },createTips([['bg'],['red','primary']])],
    [/^(?:radius)-(tl|tr|bl|br)?-?(.*)$/,(arr,text,theme) => {
        let positionMap = {
            tl:'top-left',
            tr:'top-right',
            bl:'bottom-left',
            br:'bottom-right',
        }
        let str = '';
        if(arr[1]){
            str += `border-${positionMap[arr[1]]}-radius:${handleSize(arr[2])};`
        }else{
            str += `border-radius:${handleSize(arr[2])};`
        }
        return str;
    },createTips([['radius'],['tl','tr','bl','br',''],['10','10px','10%']])],
    [/^(?:cursor|cur)-(.*)$/,(arr,text,theme) => {
        let str = `cursor:${arr[1]};`;
        return str;
    },createTips([['cursor','cur'],['point','move']])],
    [/^(absolute|relative|fixed)$/,(arr,text,theme) => {
        let str = `position:${arr[1]};`;
        return str;
    },['absolute','relative','fixed']],
    [/^(left|right|top|bottom)-(.*)$/,(arr,text,theme) => {
        let str = `${arr[1]}:${handleSize(arr[2])};`;
        return str;
    },createTips([['left','right','top','bottom'],['10','10px','10rem','10%']])],
    [/^shadow-?(basic|light|dark)?$/,(arr,text,theme) => {
        let type = arr[1]
        if(type == 'light'){
            return `box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);`;
        }else if(type == 'dark'){
            return `box-shadow: 0 2px 12px 0 rgba(255, 255, 255, 0.1);`;
        }
        return `box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);`;
    },createTips([['shadow'],['','basic','light']])],
    [/^zindex-(\d+)$/,(arr,text,theme) => {
        return `z-index:${arr[1]};`
    },['zindex-10']],
    [/^float-(.+)$/,(arr,text,theme) => {
        return `float:${arr[1]};`
    },createTips([['float'],['left','right','none','inline-start','inline-end']])]
]

const theme = {
    primary:'#936ee6',
    success:'#6cad24',
    warning:'#d3a52c',
    danger:'#d86669',
    info:'#5aa7de',
    'text-primary':'#121212',
    'text-regular':'#646464',
    'text-secondary':'#8590a6',
    'text-placeholder':'#8590a6',
    'border-base':'#DCDFE6',
    'border-light':'#E4E7ED'
}

const pseudoClassDefine = {
    'hover:':':hover'
}

const responsiveDefine = {
    'md:':'@media screen and (max-width:576px)'
}

const handleColor = (theme,str) => {
    return theme[str] || str || 'white'
}

const handleSize = (str) =>{
    str += ''
    if(!str){
        return '14px'
    }
    try{
        if(!isNaN(Number.parseInt(str[str.length - 1]))){
            return str + 'px'
        }
    }catch(ex){

    }
    return str;
}


const preset = () => {
    return {
        rules,
        theme,
        pseudoClassDefine,
        responsiveDefine
    }
}

export default preset;