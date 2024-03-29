
import * as monaco from 'monaco-editor'
import { formatCode } from './format';
export function loadTips(tips){
  monaco.languages.registerCompletionItemProvider('sql', {
    provideCompletionItems: function(model, position) {
        // 获取当前行数
        const line = position.lineNumber;

        // 获取当前列数
        const column = position.column;
        // 获取当前输入行的所有内容
        const content = model.getLineContent(line)
        // 通过下标来获取当前光标后一个内容，即为刚输入的内容
        const sym = content[column - 2];
        var textUntilPosition = model.getValueInRange({startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column});
        var word = model.getWordUntilPosition(position);
        var range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
        };
        //---------------------------------------------------
        //上面的代码仅仅是为了获取sym，即提示符
        //---------------------------------------------------
        var suggestions = [];
        if(sym == "$"){
            //...
            //拦截到用户输入$，开始设置提示内容，同else中代码一致，自行拓展
        }else{
            //直接提示，以下为sql语句关键词提示
            var sqlStr = tips.value || [];
            for(var i in sqlStr){
                suggestions.push({
                    label: sqlStr[i], // 显示的提示内容
                    kind: monaco.languages.CompletionItemKind['Function'], // 用来显示提示内容后的不同的图标
                    insertText: sqlStr[i], // 选择后粘贴到编辑器中的文字
                    detail: '', // 提示内容后的说明
                    range:range
                });
            }
        }
        return {
            suggestions: suggestions
        };
    },
    triggerCharacters: ["$",""]
});
}
export async function validate(editor,xcss,className = 'test') {
  let model = editor.getModel();
	const markers = [];
	// lines start at 1
  let tempStr = ''
  let tempStrNumbers = [];
  let isSpace = false;
  async function handleErrorAndBackground(range){
    if(isSpace && tempStr != ''){
      let result = xcss.parseClass(tempStr,className).map(e => {
        e.style = e.style.replace(/\s/g,'')
        return e;
      })
      let newRange = {
        startLineNumber: range.startLineNumber,
        startColumn: range.startColumn + tempStrNumbers[0],
        endLineNumber: range.endLineNumber,
        endColumn: range.startColumn + tempStrNumbers[tempStrNumbers.length - 1] + 1
      }
      if(!result.length){
        markers.push({
          message: "不支持的class",
          severity: monaco.MarkerSeverity.Error,
          ...newRange
        });
      }else{
        markers.push({
          message: await formatCode(xcss.genStyleStr(result)),
          severity: monaco.MarkerSeverity.Info,
          ...newRange
        });
      }
      isSpace = false;
      tempStr = '';
      tempStrNumbers = [];
    }
  }
	for (let i = 1; i < model.getLineCount() + 1; i++) {
		const range = {
			startLineNumber: i,
			startColumn: 1,
			endLineNumber: i,
			endColumn: model.getLineLength(i) + 1,
		};
		const content = model.getValueInRange(range);
		for(let i = 0; i < content.length; i++){
      if(content[i] == ' '){
        isSpace = true;
      }else{
        await handleErrorAndBackground(range);
        tempStr += content[i]
        tempStrNumbers.push(i)
      }
      if(i == content.length - 1 && !isSpace){
        isSpace = true;
        tempStrNumbers.push(i)
      }
    }
		await handleErrorAndBackground(range);
	}
	monaco.editor.setModelMarkers(model, "owner1", markers);
}
export function defineXCssLanguage(xcss){
  let responsiveKeys = Object.keys(xcss.responsiveDefine).map(key => {
    return [new RegExp(`${key}`),"custom-responsive"]
  });
  let pesudoKeys = Object.keys(xcss.pseudoClassDefine).map(key => {
    return [new RegExp(`${key}`),"custom-pesudo"]
  });
  let rulesKeys = xcss.rules.map(e => {
    return [e[0],"custom-date"]
  })
  console.log(responsiveKeys)
  monaco.languages.register({ id: "xcss" });
  // Register a tokens provider for the language
  monaco.languages.setMonarchTokensProvider("xcss", {
    tokenizer: {
      root: [
        ...responsiveKeys,...pesudoKeys,...rulesKeys
      ],
    },
  });

  // Define a new theme that contains only rules that match this language
  monaco.editor.defineTheme("xcssTheme", {
    base: "vs",
    inherit: false,
    rules: [
      { token: "custom-info", foreground: "808080" },
      { token: "custom-responsive", foreground: "ff0000", fontStyle: "bold" },
      { token: "custom-pesudo", foreground: "FFA500" },
      { token: "custom-date", foreground: "008800" },
    ],
    colors: {
      "editor.foreground": "#000000",
    },
  });
}