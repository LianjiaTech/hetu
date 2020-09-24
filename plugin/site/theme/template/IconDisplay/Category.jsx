import * as React from 'react'
import { message } from 'antd'
import CopyableIcon from './CopyableIcon'
import FormattedMessage from '../FormattedMessage'

class Category extends React.Component {
  state = {
    justCopied: null,
  }

  onCopied = (type, text) => {
    message.success(
      <span>
        <code className="copied-code">{text}</code> copied 🎉
      </span>,
    )
    this.setState({ justCopied: type }, () => {
      this.copyId = window.setTimeout(() => {
        this.setState({ justCopied: null })
      }, 2000)
    })
  }

  componentWillUnmount() {
    window.clearTimeout(this.copyId)
  }

  render() {
    const { icons, title, theme, newIcons } = this.props
    const items = icons.map((name) => {
      return (
        <CopyableIcon
          key={name}
          type={name}
          theme={theme}
          isNew={newIcons.indexOf(name) >= 0}
          justCopied={this.state.justCopied}
          onCopied={this.onCopied}
        />
      )
    })
    return (
      <div>
        <h3>
          <FormattedMessage id={`app.docs.components.icon.category.${title}`} />
        </h3>
        <ul className={'anticons-list'}>{items}</ul>
      </div>
    )
  }
}

export default Category
