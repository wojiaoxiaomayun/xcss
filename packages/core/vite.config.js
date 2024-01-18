import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  //vite.conf.ts 文件中的解析配置
	resolve: {
		//别名解析，把@与src目录做映射处理
		alias: {
			'@': resolve(__dirname, './src')
		},
		//导入时想要省略的扩展名列表
		extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json','.vue']
	},
  build: {
    target:'ES2015',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'Business',
      // the proper extensions will be added
      fileName: 'index',
    }
  }
})
