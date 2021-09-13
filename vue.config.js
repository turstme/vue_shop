module.exports = {
    lintOnSave: false,//禁用ESlint
    devServer: {
        open: true,//启用项目自动打开浏览器
        proxy: "http://localhost:8080"
    }
}
