import { BaseProps } from '~/types'

export type HtStepValue = undefined | number

export interface Props extends BaseProps {
  alias: string
  current: HtStepValue
  direction: 'horizontal' | 'vertical'
  steps: {
    title: string
    description?: string | React.ReactNode
  }[]
  showButton: boolean
  onChange: (current: HtStepValue) => void
}
