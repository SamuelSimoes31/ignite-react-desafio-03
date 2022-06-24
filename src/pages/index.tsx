import { GetStaticProps } from 'next';
import Image from 'next/image';

import { FiCalendar, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home() {
  return (
    <main className={styles.Container}>
      <Image src="/images/logo.svg" alt="logo" width={240} height={25} />
      <section>
        <div className={styles.Post}>
          <strong>Como utilizar Hooks</strong>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <span>
            <FiCalendar />
            <time>15 mar 2021</time>
            <FiUser />
            <p>Nome do autor</p>
          </span>
        </div>
        <div className={styles.Post}>
          <strong>Como utilizar Hooks</strong>
          <p>Pensando em sincronização em vez de ciclos de vida.</p>
          <span>
            <FiCalendar />
            <time>15 mar 2021</time>
            <FiUser />
            <p>Nome do autor</p>
          </span>
        </div>
      </section>
      <button className={styles.MorePosts} type="button">
        Carregar mais posts
      </button>
    </main>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient({});
//   // const postsResponse = await prismic.getByType(TODO);

//   // TODO
// };
