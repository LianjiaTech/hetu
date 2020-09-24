import { BaseProps } from '~/types'

export type HtStepValue = undefined | number

export interface Props extends BaseProps {
  current: HtStepValue
  value: HtStepValue
  initial: number
  direction: 'horizontal' | 'vertical'
  steps: {
    title: string
    description?: string | React.ReactNode
  }[]
  onChange: (current: HtStepValue) => void
}
