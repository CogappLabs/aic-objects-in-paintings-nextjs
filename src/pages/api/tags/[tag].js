
// Get a random artwork for a tag
const handler = async (req, res) => {
  const { tag } = req.query;
  const response = await fetch(`https://api.example.com/tags/${tag}`);
  const data = await response.json();
  res.status(200).json(data);

  // Now call the /artworks/:artworkId route to get iiif url, list of tags, name, hyperlink
};

export default handler;