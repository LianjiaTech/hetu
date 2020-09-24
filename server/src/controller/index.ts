import ApiDepartment from '~/src/controller/api/department'
import ApiUser from '~/src/controller/api/project_user'
import ApiHetu from '~/src/controller/api/hetu'
import ApiEmail from '~/src/controller/api/email'
import ApiLogviewer from '~/src/controller/api/logviewer'
import ApiPageConfigV2 from '~/src/controller/api/pageConfigV2'
import ApiProjectNew from '~/src/controller/api/project_new'
import ApiPageDraft from '~/src/controller/api/page/draft'
import ApiPagePublishHistory from '~/src/controller/api/page/publish_history'
import ApiPageRecord from '~/src/controller/api/page/record'
import ApiUpload from '~/src/controller/api/upload'
import ApiSubmodule from '~/src/controller/api/submodule'
import ApiLogin from '~/src/controller/api/login'
import ApiFeedback from '~/src/controller/api/feedback'

const ControllerList = [
  ApiLogin,
  ApiUser,
  ApiHetu,
  ApiEmail,
  ApiLogviewer,
  ApiPageConfigV2,
  ApiUpload,
  ApiSubmodule,
  ApiFeedback,

  // 二期接口
  ApiPageRecord,
  ApiPagePublishHistory,
  ApiPageDraft,
  ApiProjectNew,
  ApiDepartment,
]

export default ControllerList
