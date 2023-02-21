import { useState, useEffect } from 'react';

/**
 *
 * This custom hook computes the width of an element (passed as a ref)
 * when the window fires a 'resize' event
 *
 * @param {*} containerRef - the reference of the container component
 */
function useContainerWidthOnWindowResize(containerRef) {
  const [containerWidth, setContainerWidth] = useState(document.body.offsetWidth * 0.75);

  useEffect(() => {
    function onResize() {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    window.addEventListener('resize', onResize);
    onResize();

    return () => window.removeEventListener('resize', onResize);
  }, []);

  return containerWidth;
}

export default useContainerWidthOnWindowResize;
