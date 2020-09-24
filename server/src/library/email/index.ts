import nodeMail, { SendMailOptions } from 'nodemailer'

import mailConfig from '~/src/config/email'

const { host, port, user, pass } = mailConfig
const transporter = nodeMail.createTransport({
  host,
  port,
  // 使用ssl
  secure: true,
  auth: {
    user: user,
    pass: pass,
  },
  tls: { rejectUnauthorized: false },
})

class Transporter {
  /**
   * 发送邮件
   * @param options
   */
  static async sendEmail(options: SendMailOptions) {
    return transporter.sendMail({
      from: mailConfig.from,
      ...options,
    })
  }
}

export default Transporter
