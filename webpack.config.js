const path = require('path');
const AutoDeployPlugin = require('./plugins/auto-deploy-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use:["style-loader", "css-loader"]
            }
        ]
    },
    plugins: [
        new AutoDeployPlugin({
            filePath: path.resolve(__dirname,"dist"), // 打包文件的目录
            zipName: 'view', // 压缩文件名称
            zipGit: 'https://github.com/fywlyy/auto-deploy-zip.git', // 压缩文件存放的git地址
        })
    ]
}