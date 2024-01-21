import { useEffect, useState, useRef } from 'react';
let timer;
function useSticky() {
  const [isSticky, setSticky] = useState(false);
  const element = useRef(null);

  const handleScroll = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      timer = null;
      if (element.current) {
        const val =
          element.current.getBoundingClientRect().top +
          element.current.getBoundingClientRect().height;
        window.scrollY > val ? setSticky(true) : setSticky(false);
      }
    }, 300);
  };

  const deboundScroll = handleScroll;

  useEffect(() => {
    window.addEventListener('scroll', deboundScroll);
    return () => {
      window.removeEventListener('scroll', deboundScroll);
    };
  }, [handleScroll]);

  return { isSticky, element };
}

export default useSticky;
