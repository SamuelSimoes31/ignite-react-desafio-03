import Image from 'next/image';
import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={styles.Container}>
      <Image src="/images/logo.svg" alt="logo" width={240} height={25} />
    </div>
  );
}
