import styles from "./linkButton.module.scss";
import Link from "next/link";

interface ILinkButton {
  href: string;
  text: string;
}

export default function LinkButton({ href, text }: ILinkButton) {
  return (
    <>
      <Link
        href={href}
        className={styles.link__button}
        rel="noopener noreferrer"
      >
        {text}
      </Link>
    </>
  );
}
