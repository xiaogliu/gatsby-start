import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import STYLES from "./Header.module.scss"

const Header = ({ siteTitle, children }) => (
  <header className={STYLES.Header}>
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      {children}
    </div>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
