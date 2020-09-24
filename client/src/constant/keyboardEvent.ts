/**
 * 编辑器自定义快捷键
 */
import _ from 'lodash'

// 参考 => https://keycode.info/
export const eventKeyCode = {
  // tab
  tab: 9,
  enter: 13,
  command: 91,
  // option/alt
  option: 18,
  ctrl: 17,
  shift: 16,
  // 空格
  space: 32,
  // 中英文切
  capslock: 20,
  // 左
  left: 37,
  // 上
  up: 38,
  // 右
  right: 39,
  // 下
  down: 40,
  // 按键s
  s: 83,
  // 按键k
  k: 75,
}

export const eventCommand = {}

type CommonKey = keyof typeof eventKeyCode

interface CommnonDetail {
  keyAlias?: CommonKey
  keyCode?: number
  // 按下ctrl键
  ctrlKey?: boolean
  // 按下shift键
  shiftKey?: boolean
  // 按下option键
  altKey?: boolean
  // 按下command键盘
  metaKey?: boolean
  // 快捷键说明
  desc: string
}

type CommandType = 'save' | 'shift' | 'enter'

type CommandMap = {
  [key in CommandType]: CommnonDetail
}

interface Command {
  window: CommandMap
  mac: CommandMap
}

const isMac =
  navigator.platform == 'Mac68K' ||
  navigator.platform == 'MacPPC' ||
  navigator.platform == 'Macintosh'

const commandAll: Command = {
  window: {
    // 保存
    save: {
      keyAlias: 's',
      metaKey: true,
      desc: 'command + s',
    },
    // 切换
    shift: {
      keyAlias: 'k',
      shiftKey: true,
      metaKey: true,
      desc: 'command + shift + k',
    },
    // 按下enter
    enter: {
      keyAlias: 'enter',
      desc: 'enter',
    },
  },
  mac: {
    save: {
      keyAlias: 's',
      ctrlKey: true,
      desc: 'ctrl + s',
    },
    shift: {
      ctrlKey: true,
      shiftKey: true,
      desc: 'ctrl + shift',
    },
    // 按下enter
    enter: {
      keyAlias: 'enter',
      desc: 'enter',
    },
  },
}

export let command = isMac ? commandAll.mac : commandAll.window

export function isKeyboardEvent(e: KeyboardEvent | React.KeyboardEvent, type: CommandType) {
  let _command = _.get(command, type)

  if (!_.isPlainObject(_command)) {
    throw new Error(`${type} is not exist`)
  }

  const { keyAlias } = _command
  if (keyAlias) {
    let keyCode = getKeyCode(keyAlias)

    if (keyCode !== e.keyCode) {
      return false
    }
  }

  for (let k of ['ctrlKey', 'shiftKey', 'altKey', 'metaKey']) {
    if (_.get(e, k) !== !!_.get(_command, k)) {
      return false
    }
  }

  return true
}

function getKeyCode(v: CommonKey) {
  return _.get(eventKeyCode, v)
}
