import { Client as ElasticsearchClient } from "@elastic/elasticsearch";

const search = async (query) => {
  const esClient = new ElasticsearchClient({
    node: process.env.ES_NODE,
    auth: {
      username: process.env.ES_USERNAME,
      password: process.env.ES_PASSWORD
    },
  });
  const [esResults] = await Promise.all([searchElasticsearch(esClient, query)]);
  const results = transformElasticsearchResults(esResults);
  console.log(results);
  return results;
};

const searchElasticsearch = async (client, query) => {
  const request = {
    index: process.env.ES_INDEX,
    query: {
      query_string: {
        query: query,
      },
    },
  };
  const results = await client.search(request);
  return results;
};

const transformElasticsearchResults = (results) => {
  return results.hits.hits.map(({ _id: id, _source: source }) => {
    return {
      id,
      source,
    };
  });
};

async function getDocumentById(id) {
  const { body } = await client.get({
    index: process.env.ES_INDEX,
    id: id
  });
  return body;
}

export default search;