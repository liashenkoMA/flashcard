import styles from "./linkButton.module.scss";
import Link from "next/link";

interface ILinkButton {
  href: string;
  text: string;
}

export default function LinkButton({ href, text }: ILinkButton) {
  return (
    <Link href={href} className={styles.link_button} target="_blank" rel="noopener noreferrer">
      {text}
    </Link>
  );
}
