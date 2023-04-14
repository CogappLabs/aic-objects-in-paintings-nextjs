import PropTypes from "prop-types";

const Tag = ({ children, onClick }) => {
  return (
    <li className="tag">
      <button type="button" onClick={onClick} className="bg-white p-2 shadow-sm rounded-lg hover:bg-blue-200 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
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