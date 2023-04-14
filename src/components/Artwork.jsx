import PropTypes from "prop-types";

const Artwork = ({ artwork }) => {
  const thumbnailUrl = `${artwork.iiif}/full/!250,250/0/default.jpg`
  return (
    <li className="flex items-center">
      <a href={artwork.url} target="_blank">
        <div className="aspect-square w-60 h-60 flex items-center justify-center bg-gray-200">
          <img src={thumbnailUrl} alt="" className="max-h-full hover:opacity-80 transition-opacity duration-150" />
        </div>
        <h3 className="font-medium text-lg underline mt-2">{artwork.title}</h3>
        <p className="italic">{artwork.artist}</p>
      </a>
      {!!artwork.chosenTag && (
        <div className="flex flex-col items-center p-4">
          <p>{artwork.chosenTag}</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      )}
    </li>
  );
};

Artwork.propTypes = {
  artwork: PropTypes.shape({
    id : PropTypes.number,
    title : PropTypes.string,
    artist : PropTypes.string,
    url : PropTypes.string,
    iiif : PropTypes.string,
    tags : PropTypes.arrayOf(PropTypes.string),
    chosenTag: PropTypes.string,
  })
};

export default Artwork;