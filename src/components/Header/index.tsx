import Image from 'next/image';
import Link from 'next/link';
import styles from './header.module.scss';

export default function Header() {
  return (
    <Link href="/">
      <div className={styles.Container}>
        <Image src="/images/logo.svg" alt="logo" width={240} height={25} />
      </div>
    </Link>
  );
}
