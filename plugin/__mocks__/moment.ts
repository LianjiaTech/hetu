const moment = jest.requireActual('moment')

moment.prototype.valueOf = jest.fn().mockImplementation(() => 1578278494065)

export default moment
