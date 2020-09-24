const ENV_DEV = 'dev'
const ENV_TEST = 'test'
const ENV_PROD = 'prod'

// 从页面配置中获取当前环境变量
let env = window.ENV

class ENV {
  static current = env
  static envList = [ENV_DEV, ENV_TEST, ENV_PROD]
}

export default ENV
