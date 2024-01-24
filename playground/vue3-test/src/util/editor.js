
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
            var sqlStr = tips || [];
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
let decoration = null;
export async function validate(editor,xcss,className = 'red') {
  let model = editor.getModel();
  if(!decoration){
    decoration = editor.createDecorationsCollection([]);
  }
  decoration.clear();
	const markers = [];
	// lines start at 1
	for (let i = 1; i < model.getLineCount() + 1; i++) {
		const range = {
			startLineNumber: i,
			startColumn: 1,
			endLineNumber: i,
			endColumn: model.getLineLength(i) + 1,
		};
		const content = model.getValueInRange(range);
    let tempStr = ''
    let tempStrNumbers = [];
    let isSpace = false;
    async function handleErrorAndBackground(){
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
		for(let i = 0; i < content.length; i++){
      if(content[i] == ' '){
        isSpace = true;
      }else{
        await handleErrorAndBackground();
        tempStr += content[i]
        tempStrNumbers.push(i)
      }
      if(i == content.length - 1 && !isSpace){
        isSpace = true;
        tempStrNumbers.push(i)
      }
    }
		await handleErrorAndBackground();
	}
	monaco.editor.setModelMarkers(model, "owner", markers);
}