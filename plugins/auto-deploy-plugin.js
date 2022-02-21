const fs = require('fs');
const path = require('path');
const compressing = require('compressing');
const { execSync } = require('child_process');
const inquirer = require('inquirer');

const prompt = inquirer.prompt;

class AutoDeployPlugin {
    constructor(options) {
        this.options = options;
        this.zipId = '';
        this.zipDir = '';
        this.zipPath = path.resolve(__dirname, `../../${this.options.zipGit.split('/').reverse()[0].split('.')[0]}`);
    }
    apply(compiler) {
        let {
            filePath,
            zipName = 'target',
            zipGit
        } = this.options;

        // 生成资源到output目录完成
        compiler.hooks.afterEmit.tapAsync('afterEmit', (compilation, cb) => {
            console.log('生成资源到output目录完成');
            cb();
        });
        compiler.hooks.done.tap('AutoDeploy', () => {
            console.log('编译完成');
            let exist =  fs.existsSync(filePath);
            let time = new Date().getTime();

            this.zipId = time;
            this.zipDir = this.zipPath;

            if (exist) {
                if (!fs.existsSync(this.zipPath)) {
                    console.log('拉取远程目录...')
                    execSync(`git clone ${zipGit}`, { cwd: path.resolve(__dirname, '../../') });
                    console.log('拉取成功🚀')
                }
                // 执行git命令拉取压缩包
                console.log('开始执行git命令拉取...');
                console.log('zipDir:', this.zipDir);
                execSync('git pull origin master', { cwd: this.zipDir });

                compressing.zip.compressDir(filePath, `${this.zipPath}/${zipName}.${time}.zip`)
                .then(()=>{
                    console.log('打包文件压缩写入完成');
                    console.log('开始执行git上传...');
                    execSync('git add .', { cwd:  this.zipDir});
                    execSync(`git commit -m "update ${this.zipId}"`, { cwd: this.zipDir });
                    execSync('git push --progress "origin" master:master', { cwd: this.zipDir });
                    console.log(`上传id为 ${this.zipId} 的zip包成功`);

                    prompt([{
                        type: 'confirm',
                        name: 'deploy',
                        message: '是否发布到测试环境',
                        default: true
                    }]).then((value) => {
                        console.log('选择结果：', value);
                    })
                }).catch(err=>{
                    console.error(err);
                });
            }
        });
    }
}

module.exports = AutoDeployPlugin;