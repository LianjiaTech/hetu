import React from 'react'
import DocumentTitle from 'react-document-title'
import PropTypes from 'prop-types'

// To store style which is only for Home and has conflicts with others.
function getStyle() {
  return `
    .main-wrapper {
      padding: 0;
    }
    #header {
      box-shadow: none;
      max-width: 1200px;
      width: 100%;
      margin: 20px auto 0;
      padding: 0 24px;
    }
    #header,
    #header .ht-select-selection,
    #header .ht-menu {
      background: transparent;
    }
    #header #logo {
      padding: 0;
    }
    #header #nav .ht-menu-item {
      border-color: transparent;
    }
    #header #nav .ht-menu-submenu {
      border-color: transparent;
    }
    #header #nav .ht-menu-item.hide-in-home-page {
      display: none;
    }
    #header .ht-row > div:last-child .header-lang-button {
      margin-right: 0;
    }
    footer .footer-wrap {
      width: 100%;
      max-width: 1200px;
      padding: 86px 24px 93px 24px;
      margin: auto;
    }
    @media only screen and (max-width: 767.99px) {
      #footer .footer-wrap {
        padding: 40px 24px;
      }
      footer .footer-wrap .ht-row {
        padding: 0;
      }
    }
  `
}

/* eslint-disable react/prefer-stateless-function */
class Home extends React.Component {
  static contextTypes = {
    isMobile: PropTypes.bool.isRequired,
  }

  componentDidMount() {}

  render() {
    const { isMobile } = this.context
    const childProps = { ...this.props, isMobile }
    return (
      <DocumentTitle title={`河图 - 通用CMS系统`}>
        <>
          <style dangerouslySetInnerHTML={{ __html: getStyle() }} /> {/* eslint-disable-line */}
        </>
      </DocumentTitle>
    )
  }
}

export default Home
