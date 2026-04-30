import styles from "./layout.module.scss";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
