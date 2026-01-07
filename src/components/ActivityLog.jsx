import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

function ActivityLog({ title, content, date, onDelete, onEdit }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="m-2 p-4 flex flex-wrap justify-evenly">
      <div className="relative drop-shadow-xl md:w-64 w-[100%] min-h-[300px] overflow-hidden rounded-xl bg-[#3d3c3d] my-4">
        <div className="absolute flex flex-col text-white z-[1] opacity-90 rounded-xl inset-0.5 bg-[#323132] p-4">
          <div className="text-lg font-bold capitalize mb-2">{title}</div>
          
          <div className={`text-sm mb-2 ${isExpanded ? 'h-[200px] overflow-y-auto pr-2' : 'line-clamp-6'} mb-auto`}>
            {content}
          </div>

          
          

      <div className="mt-auto">
      <button
            onClick={toggleContent}
            className="text-blue-400 hover:text-blue-500 text-sm mb-2 text-right"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>

<div className="text-gray-400 font-light mb-4">{date || "No Date Provided"}</div>
      
          <div className="flex justify-between w-full gap-2 mt-auto">
            <button
              className="flex-1 px-4 py-2 bg-red-900 text-white rounded-md hover:bg-red-700 transition duration-300"
              onClick={onDelete}
              aria-label="Delete Post"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2"/>Delete
            </button>
            <button
              className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 transition duration-300"
              onClick={onEdit}
              aria-label="Edit Post"
            >
              <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />Edit 
            </button>
          </div>

          </div>
        </div>

        <div className="absolute w-56 h-48 bg-white blur-[50px] -left-1/2 -top-1/2"></div>
      </div>
    </div>
  );
}

export default ActivityLog;
