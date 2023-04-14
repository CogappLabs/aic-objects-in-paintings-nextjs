import PropTypes from "prop-types";

const Tag = ({ children, onClick }) => {
  return (
    <li className="tag">
      <button type="button" onClick={onClick} className="bg-white p-2 shadow-sm rounded-lg hover:bg-blue-200 transition-colors duration-150">
        {children}
      </button>
    </li>
  );
};

Tag.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default Tag;