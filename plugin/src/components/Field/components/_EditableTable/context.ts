import React from 'react'
import { FormComponentProps } from 'antd/es/form'

type Context = FormComponentProps

const defaultContext: any = {}

const context = React.createContext<Context>(defaultContext)

export default context
