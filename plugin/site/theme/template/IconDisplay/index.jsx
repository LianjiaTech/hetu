import * as React from 'react'
import manifest from '@ant-design/icons/lib/manifest'
import { Radio, Icon, Input } from 'antd'
import debounce from 'lodash/debounce'
import Category from './Category'
import { FilledIcon, OutlinedIcon, TwoToneIcon } from './themeIcons'
import { categories } from './fields'

class IconDisplay extends React.Component {
  static CategoriesKeys = categories

  static newIconNames = []

  static themeTypeMapper = {
    filled: 'fill',
    outlined: 'outline',
    twoTone: 'twotone',
  }

  state = {
    theme: 'outlined',
    searchKey: '',
  }

  constructor(props) {
    super(props)
    this.handleSearchIcon = debounce(this.handleSearchIcon, 300)
  }

  getComputedDisplayList() {
    return Object.keys(IconDisplay.categories)
      .map((category) => ({
        category,
        icons: (IconDisplay.categories[category] || []).filter(
          (name) => manifest[IconDisplay.themeTypeMapper[this.state.theme]].indexOf(name) !== -1,
        ),
      }))
      .filter(({ icons }) => Boolean(icons.length))
  }

  handleChangeTheme = (e) => {
    this.setState({
      theme: e.target.value,
    })
  }

  handleSearchIcon = (searchKey) => {
    this.setState((prevState) => ({
      ...prevState,
      searchKey,
    }))
  }

  renderCategories(list) {
    const { searchKey } = this.state
    const otherIcons = categories.all.filter((icon) => {
      return list
        .filter(({ category }) => category !== 'all')
        .every((item) => !item.icons.includes(icon))
    })

    return list
      .filter(({ category }) => category !== 'all')
      .concat({ category: 'other', icons: otherIcons })
      .map(({ category, icons }) => ({
        category,
        icons: icons.filter((name) => name.includes(searchKey)),
      }))
      .filter(({ icons }) => !!icons.length)
      .map(({ category, icons }) => (
        <Category
          key={category}
          title={category}
          icons={icons}
          theme={this.state.theme}
          newIcons={IconDisplay.newIconNames}
        />
      ))
  }

  render() {
    const list = this.getComputedDisplayList()
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Radio.Group value={this.state.theme} onChange={this.handleChangeTheme} size="large">
            <Radio.Button value="outlined">
              <Icon component={OutlinedIcon} /> 线框风格
            </Radio.Button>
            <Radio.Button value="filled">
              <Icon component={FilledIcon} /> 实底风格
            </Radio.Button>
            <Radio.Button value="twoTone">
              <Icon component={TwoToneIcon} /> 双色风格
            </Radio.Button>
          </Radio.Group>
          <Input.Search
            placeholder="在此搜索图标，点击图标可复制代码"
            style={{ marginLeft: 10, flex: 1 }}
            allowClear
            onChange={(e) => this.handleSearchIcon(e.currentTarget.value)}
            size="large"
            autoFocus
          />
        </div>
        {this.renderCategories(list)}
      </>
    )
  }
}

export default IconDisplay
