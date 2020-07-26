import PropTypes from "prop-types"
import React from "react"

import STYLES from "./Header.module.scss"

const Header = ({ children }) => (
  <header className={STYLES.Header}>{children}</header>
)

Header.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Header
