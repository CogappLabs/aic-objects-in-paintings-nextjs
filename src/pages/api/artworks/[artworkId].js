import getDocumentById from "../../../lib/esSearch";

const handler = async (req, res) => {
  let { artworkId } = req.query;

  artworkId = parseInt(artworkId)

  // res.status(200).json({ name: Number.isInteger(artworkId) })

  if (artworkId === undefined || !Number.isInteger(artworkId)) {
    res.status(400).json({ error: "A valid artwork ID is required." });
    return;
  }
  try {
    const searchResults = await getDocumentById(artworkId);
    if (searchResults.length == 1) {
      res.status(200).json(searchResults[0]);
    }
    else {
      res.status(400).json({ error: "No artwork found for this ID" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
export default handler;