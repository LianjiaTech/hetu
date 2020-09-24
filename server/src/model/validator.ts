export default class MValidator {
  static checkRequiredFields(requiredFields: string[], target: {[key:string]:any}) {
    for (let fieldKey of requiredFields) {
      if (target[fieldKey] === undefined) {
        throw new Error(`缺少参数${fieldKey}`)
      }
    }
  }
}
