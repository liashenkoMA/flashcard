import LandingNav from "../LandingNav/LandingNav";
import Navigation from "../Navigation/Navigation";
import styles from "./header.module.scss";
import Logo from "@_components/Logo/Logo";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__content}>
        <Logo />
        <LandingNav />
        <Navigation />
      </div>
    </header>
  );
}
