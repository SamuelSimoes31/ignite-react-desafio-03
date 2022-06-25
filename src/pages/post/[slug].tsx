import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  const timeToRead =
    post.data.content.reduce((acc, section) => {
      const wordsOnHeading = section.heading.split(' ').length;
      const wordsOnBody = RichText.asText(section.body).split(' ').length;
      return (acc += wordsOnHeading + wordsOnBody);
    }, 0) / 200;

  return (
    <>
      <Head>POST</Head>
      <div className={styles.Container}>
        <Header />
        {!router.isFallback ? (
          <>
            <img src={post.data.banner.url} alt="" className={styles.Banner} />
            <article className={styles.Post}>
              <h1>{post.data.title}</h1>
              <span>
                <FiCalendar />
                <time>
                  {format(new Date(post.first_publication_date), 'PP', {
                    locale: ptBR,
                  })}
                </time>
                <FiUser />
                <p>{post.data.author}</p>
                <FiClock />
                <p>{Math.ceil(timeToRead)} min</p>
              </span>
              {post.data.content.map(section => (
                <Fragment key={section.heading}>
                  <h4 className={styles.HeadingContent}>{section.heading}</h4>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(section.body),
                    }}
                    className={styles.PostContent}
                  />
                </Fragment>
              ))}
            </article>
          </>
        ) : (
          <p>Carregando...</p>
        )}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  return {
    paths: posts.results.map(post => ({
      params: {
        slug: post.uid,
      },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(params.slug));

  return {
    props: {
      post: response,
    },
    revalidate: 60 * 30,
  };
};
