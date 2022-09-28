import type { GetStaticProps } from 'next'
import Link from "next/link";
import Image from "next/image";

import Layout from "../components/Layout";
import Footer from "../components/Footer";
import { fetchData } from "../components/utils/fetchData";

function Store({ products }) {
  return (
    <Layout>
      <article className="pt5 bg-black white ph3">
        <a className="link white tc">
          <p>
            <i className="material-icons md-48 v-top">store</i>
          </p>
          <h1 className="tc f3 mb4">Model Store</h1>
        </a>
        <div className="pa2 flex flex-wrap">
          {Array.isArray(products) &&
            products.map(product => (
              <div
                style={{ height: "350px" }}
                className="fl w-100 w-50-m w-33-l pa2"
                key={product.id}
              >
                <Link href={`/model/${product.id}`}>
                  <div className="db link dim tc white">
                    <Image
                      height={200}
                      width={300}
                      src={`/models/${product.id}/thumbnail@m.jpg`}
                      alt={product.name}
                      className="w-100 db outline black-10"
                    />
                    <dl className="mt2 f6 lh-copy">
                      <dt className="clip">Name</dt>
                      <dd className="ml0 white truncate w-100">
                        {product.name}
                      </dd>
                      <dt className="clip">Description</dt>
                      <dd className="ml0 gray truncate w-100">
                        {product.description}
                      </dd>
                    </dl>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </article>
      <Footer />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await fetchData();

  return {
    props: {
      products
    },
  };
}


export default Store;
