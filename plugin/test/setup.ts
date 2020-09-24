import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'mobx-react/batchingForReactDom'

jest.useFakeTimers()
jest.setTimeout(10000)

// @ts-ignore
delete global.window.location
// @ts-ignore
global.window.location = {
  reload: jest.fn(),
  replace: jest.fn(),
  assign: jest.fn(),
}

global.Promise = jest.requireActual('promise')

Enzyme.configure({ adapter: new Adapter() })

export default Enzyme
