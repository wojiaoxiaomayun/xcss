import * as prettier from 'prettier'
import postcssPlugin from 'prettier/plugins/postcss.mjs'
export async function formatCode(code){
  if(!code) return ''
  const formatted = await prettier.format(code, {
    parser: "css",
    plugins:[postcssPlugin],
  });
  return formatted;
}