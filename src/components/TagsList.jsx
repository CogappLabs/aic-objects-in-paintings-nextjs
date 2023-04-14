import PropTypes from "prop-types";

const TagsList = ({ children }) => {
  return (
    <ul className="flex flex-col gap-2 mt-4 max-h-0">
      {children}
    </ul>
  )
}

TagsList.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TagsList;