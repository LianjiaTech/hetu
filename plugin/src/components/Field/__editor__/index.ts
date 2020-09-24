// field
import Alert from '~/components/Field/components/Alert/__editor__'
import Checkbox from '~/components/Field/components/Checkbox/__editor__'
import Divider from '~/components/Field/components/Divider/__editor__'
import Input from '~/components/Field/components/Input/__editor__'
import InputNumber from '~/components/Field/components/InputNumber/__editor__'
import InputPassword from '~/components/Field/components/InputPassword/__editor__'
import InputTextarea from '~/components/Field/components/InputTextarea/__editor__'
import JsonEditor from '~/components/Field/components/JsonEditor/__editor__'
import DatePicker from '~/components/Field/components/PickerDate/__editor__'
import DateTimePicker from '~/components/Field/components/PickerDateTime/__editor__'
import MonthPicker from '~/components/Field/components/PickerMonth/__editor__'
import RangePicker from '~/components/Field/components/PickerRange/__editor__'
import TimePicker from '~/components/Field/components/PickerTime/__editor__'
import WeekPicker from '~/components/Field/components/PickerWeek/__editor__'
import Radio from '~/components/Field/components/Radio/__editor__'
import Select from '~/components/Field/components/Select/__editor__'
import SelectCascade from '~/components/Field/components/SelectCascade/__editor__'
import SelectMultiple from '~/components/Field/components/SelectMultiple/__editor__'
import SelectTree from '~/components/Field/components/SelectTree/__editor__'
import SelectTrees from '~/components/Field/components/SelectTrees/__editor__'
import Steps from '~/components/Field/components/Steps/__editor__'
import TableEditor from '~/components/Field/components/TableEditor/__editor__'
import Text from '~/components/Field/components/Text/__editor__'
import Upload from '~/components/Field/components/Upload/__editor__'
import { Editor } from '~/types'

const fieldEditorConfigMap: Editor.FieldEditConfigMap = {
  // field
  'HtField.Checkbox': Checkbox,
  'HtField.Divider': Divider,
  'HtField.Input': Input,
  'HtField.InputNumber': InputNumber,
  'HtField.Input.Password': InputPassword,
  'HtField.Input.TextArea': InputTextarea,
  'HtField.JsonEditor': JsonEditor,
  'HtField.DatePicker': DatePicker,
  'HtField.DateTimePicker': DateTimePicker,
  'HtField.MonthPicker': MonthPicker,
  'HtField.RangePicker': RangePicker,
  'HtField.TimePicker': TimePicker,
  'HtField.WeekPicker': WeekPicker,
  'HtField.Radio': Radio,
  'HtField.Select': Select,
  'HtField.SelectCascade': SelectCascade,
  'HtField.SelectMultiple': SelectMultiple,
  'HtField.SelectTree': SelectTree,
  'HtField.SelectTrees': SelectTrees,
  'HtField.Steps': Steps,
  'HtField.TableEditor': TableEditor,
  'HtField.Upload': Upload,
  'HtField.Text': Text,
  'HtField.Alert': Alert,
}

export default fieldEditorConfigMap
