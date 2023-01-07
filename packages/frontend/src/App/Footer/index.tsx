import React from 'react'

import { discordLogo, githubLogo, patreonLogo } from '../../common/images'
import styles from './styles.module.scss'

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.left}>
      <div className={styles.patreon}>
        <a
          href="https://www.patreon.com/portaler/membership"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={patreonLogo} className={styles.patreonLogo} alt="patreon" />
        </a>
        <strong className={styles.patreonText}>
          You can get private portaler for your guild from here
        </strong>
      </div>
    </div>
    <div className={styles.middle}></div>
    <div className={styles.right}>
      <div className={styles.twitter}></div>
      <div className={styles.github}>
        <a
          href="https://github.com/aut1sto/portaler-modern"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={githubLogo} className={styles.githubLogo} alt="github" />
        </a>
      </div>
      <div className={styles.discord}>
        <a
          href="https://discord.gg/SRJKjaVPxj"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={discordLogo} className={styles.discordLogo} alt="discord" />
        </a>
      </div>
    </div>
  </footer>
)

export default Footer
