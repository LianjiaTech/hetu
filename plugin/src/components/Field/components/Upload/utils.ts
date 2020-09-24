import _ from 'lodash'
import { HtUploadFile, HtUploadValue } from './interface'

export const formatFileList = (value: HtUploadValue): HtUploadFile[] => {
  if (_.isArray(value)) {
    return value
      .filter(v => v)
      .map((item, index) => {
        return {
          uid: Math.random() + '-' + index,
          status: 'done',
          name: item,
          url: item,
          thumbUrl: item,
        }
      })
  }

  return []
}

export const formatFileList2 = (urls: object[]): HtUploadFile[] => {
  if (_.isArray(urls)) {
    return urls
      .filter(v => v)
      .map((item, index) => {
        return {
          ...item,
          // @ts-ignore
          name: item.url,
          uid: Math.random() + '-' + index,
          status: 'done',
        }
      })
  }

  return []
}
