import PropTypes from "prop-types";

const TagsList = ({ children }) => {
  return (
    <ul className="flex sm:flex-col flex-wrap sm:flex-nowrap gap-2 mt-4 max-h-0">
      {children}
    </ul>
  )
}

TagsList.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TagsList;