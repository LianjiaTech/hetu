import child_process from 'child_process'
import IS_WSL from 'is-wsl'

const IS_WIN = process.platform.indexOf('win') === 0

class Tool {
  /**
   * shell命令编码转义
   * @param  {String}  命令
   * @memberOf fis.util
   * @name escapeShellCmd
   * @function
   */
  static escapeShellCmd(str: string) {
    return str.replace(/ /g, '"$&"')
  }

  /**
   * shell编码转义
   * @param  {String} 命令
   * @memberOf fis.util
   * @name escapeShellArg
   * @function
   */
  static escapeShellArg(cmd: string) {
    return '"' + cmd + '"'
  }

  /**
   * 是否为windows系统
   * @return {Boolean}
   * @name isWin
   * @function
   */
  static isWin() {
    return IS_WIN
  }

  /**
   * 是否为WSL子系统模式
   * @return {Boolean}
   * @name isWSL
   * @function
   */
  static isWSL() {
    return IS_WSL
  }

  static open(path: string, callback?: (error: child_process.ExecException | null, stdout: string, stderr: string) => void) {
    var cmd = Tool.escapeShellArg(path)
    if (Tool.isWin()) {
      cmd = 'start "" ' + cmd
    } else {
      if (Tool.isWSL() || process.env['XDG_SESSION_COOKIE'] || process.env['XDG_CONFIG_DIRS'] || process.env['XDG_CURRENT_DESKTOP']) {
        cmd = 'xdg-open ' + cmd
      } else if (process.env['GNOME_DESKTOP_SESSION_ID']) {
        cmd = 'gnome-open ' + cmd
      } else {
        cmd = 'open ' + cmd
      }
    }
    child_process.exec(cmd, callback)
  }
}

export default Tool
