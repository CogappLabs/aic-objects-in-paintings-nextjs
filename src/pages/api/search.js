import search from "../../lib/esSearch";

const handler = async (req, res) => {
  let { q } = req.query;

  if (q === undefined) {
    res.status(400).json({ error: "A search query is required." });
    return;
  }
  try {
    const searchString = q;
    const searchResults = await search(searchString);
    const searchResponse = {
      searchTerm: searchString,
      hits: searchResults.map(({ id: id, source: data }) => ({
        id,
        data,
      })),
    };
    res.status(200).json(searchResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
export default handler;