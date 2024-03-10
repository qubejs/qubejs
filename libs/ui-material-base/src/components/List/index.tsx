import PropTypes from 'prop-types';

const createList = (tag, values) => {
  const Tag = tag;

  return <Tag>
    {values.map((item) => {
      return <li className={`${item.className}`}>
        <div className={`sq-list__item-text`}>{item.text}</div>
        {item.value && createList(item.type || tag, item.value)}
      </li>
    })}
  </Tag>
}

const List = ({
  value = [],
  type: ListTag = 'ul',
}: any) => {

  return (
    <div className="sq-list">
      {createList(ListTag, value)}
    </div>
  );
};
List.propTypes = {
  className: PropTypes.string
};

export default List;
