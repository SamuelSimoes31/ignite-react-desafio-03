/* eslint-disable prettier/prettier */
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const getNextPage = async (next_page: string) => {
    try {
      await fetch(next_page)
        .then(response => response.json())
        .then(data => {
          const newPosts: Post[] = data.results.map(post => ({
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: {
              author: post.data.author,
              title: post.data.title,
              subtitle: post.data.subtitle,
            },
          }));
          setPosts(p => [...p, ...newPosts]);
          setNextPage(data.next_page);
        });
    } catch (error) { }
  };
  return (
    <main className={styles.Container}>
      <Image src="/images/logo.svg" alt="logo" width={240} height={25} />
      <section>
        {posts.map(post => (
          <Link href={`post/${post.uid}`} key={post.uid}>
            <div className={styles.Post} >
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <span>
                <FiCalendar />
                <time>
                  {format(new Date(post.first_publication_date), 'PP', {
                    locale: ptBR,
                  })}
                </time>
                <FiUser />
                <p>{post.data.author}</p>
              </span>
            </div>
          </Link>
        ))}
      </section>
      {
        nextPage && (
          <button
            className={styles.MorePosts}
            type="button"
            onClick={() => getNextPage(nextPage)}
          >
            Carregar mais posts
          </button>
        )
      }
    </main>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 1
  });

  const props: HomeProps = {
    postsPagination: {
      next_page: postsResponse.next_page,
      results: postsResponse.results.map(post => ({
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          author: post.data.author,
          title: post.data.title,
          subtitle: post.data.subtitle,
        },
      })),
    },
  };
  return {
    props,
  };
};
