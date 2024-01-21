import { useState, useEffect } from 'react';
import { getRandomS8 } from '../utils/number';
const useId = () => {
  const [id, setData] = useState('');
  useEffect(() => {
    if (!id) {
      setData(getRandomS8());
    }
  }, []);
  return id;
};

export default useId;
