import React from 'react'

export default (props: any) => {
  const { children, ...rest } = props
  return <div {...rest}>{children}</div>
}
