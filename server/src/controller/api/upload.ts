import BaseController from '~/src/controller/api/base'
import { Request, Response } from 'express'
import { JsonController, Param, Body, Req, Res, Get, Post, UseBefore, UploadedFile } from 'routing-controllers'
import LoginMiddleware from '~/src/middleware/login'
import _ from 'lodash'
import path from 'path'
import fs from 'fs'
import moment from 'moment'

@JsonController()
@UseBefore(LoginMiddleware)
class UploadController extends BaseController {
  @Post('/api/upload')
  async index(@UploadedFile('file') file: any, @Req() request: Request, @Res() response: Response) {
    try {
      const now = moment().unix()
      const file = request.file
      const { projectCode } = request.body
      if (!projectCode) {
        return this.showError(`缺少参数projectCode`)
      }
      const extname = path.extname(file.originalname)
      let filename = path.basename(file.originalname, extname)
      filename = `${filename.slice(0, 20)}-${now}` + extname

      const fileDir = path.resolve(__dirname, `../../hetu-cdn/${projectCode}`)
      const filePath = `${fileDir}/${filename}`

      fs.mkdirSync(fileDir, { recursive: true })
      fs.writeFileSync(filePath, file.buffer)

      return {
        Location: `/hetu-cdn/${projectCode}/${filename}`,
      }
    } catch (e) {
      console.error(e)
      return this.showError(`${e.message}`)
    }
  }
}

export default UploadController
