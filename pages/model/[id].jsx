import { GetStaticProps, GetStaticPaths } from 'next'
import Layout from "../../components/Layout";
import Editor from "../../components/Editor";
import { fetchData } from "../../components/utils/fetchData";

function Model({ details }) {
  return (
    <Layout>
      <Editor details={details} />;
    </Layout>
  );
}

export const getStaticProps=async (props) => {
  const details = await fetchData(props.params.id);

  return {
    props: {
      details
    },
  };
};

export const getStaticPaths = async () => {
  const docs = await fetchData();

  return {
    paths: docs.map(doc => ({
      params: { id: `${doc.id}` }
    })),
    fallback: false
  }
}

export default Model;
