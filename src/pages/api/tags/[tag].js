import getDocumentsByTag from "../../../lib/esSearch";

const handler = async (req, res) => {
  let { tag } = req.query;

  if (tag === undefined) {
    res.status(400).json({ error: "Missing tag name" });
    return;
  }
  try {
    const searchResults = await getDocumentsByTag(tag);
    res.status(200).json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
export default handler;