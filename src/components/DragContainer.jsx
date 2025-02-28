import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import './DragContainer.css';

const DragContainer = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const pages = Array.isArray(children) ? children : [children];

  const handleDragStart = (event, info) => {
    setDragStart(info.point.x);
  };

  const handleDragEnd = (event, info) => {
    const dragDistance = info.point.x - dragStart;
    const dragThreshold = window.innerWidth * 0.3; // 30% of screen width

    if (Math.abs(dragDistance) > dragThreshold) {
      if (dragDistance > 0 && currentPage > 0) {
        // Drag right -> go to previous page
        setCurrentPage(currentPage - 1);
      } else if (dragDistance < 0 && currentPage < pages.length - 1) {
        // Drag left -> go to next page
        setCurrentPage(currentPage + 1);
      }
    }
  };

  return (
    <div className="drag-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          className="drag-page"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.7}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {pages[currentPage]}
        </motion.div>
      </AnimatePresence>
      
      <div className="page-indicators">
        {pages.map((_, index) => (
          <div
            key={index}
            className={`page-dot ${index === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default DragContainer;
