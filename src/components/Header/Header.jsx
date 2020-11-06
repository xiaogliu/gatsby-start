import PropTypes from "prop-types"
import React from "react"

import STYLES from "./Header.module.scss"

const Header = ({ children }) => (
  <header className={STYLES.Header}>
    <section className={STYLES.Header__main}>{children}</section>
  </header>
)

Header.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Header
