const config = require('config')
const fs = require('fs')
const path = require('path')

const configDir = path.join(__dirname, config.build.dir)
const configFile = path.join(configDir, 'config.json')
fs.mkdirSync(configDir, { recursive: true })
fs.writeFileSync(configFile, JSON.stringify(config))

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/scheduler/dist/'
    : '/',
  devServer: {
    https: true
  },
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    resolve: {
      alias: {
        config: configFile
      }
    }
  }
}
