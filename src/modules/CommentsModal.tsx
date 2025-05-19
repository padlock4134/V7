import React, { useState } from 'react';

const mockComments = [
  { id: 1, user: 'Captain Haddock', content: 'Try pan-searing it!', time: '45m ago' },
  { id: 2, user: 'Chef Sally', content: 'Chowder is always a hit.', time: '30m ago' },
];

const CommentsModal = ({ open, onClose, postId }) => {
  const [input, setInput] = useState('');

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 max-w-md w-full relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h3 className="font-bold text-lg mb-2">Comments</h3>
        <ul className="mb-4 space-y-2">
          {mockComments.map(c => (
            <li key={c.id} className="border-b pb-2">
              <span className="font-bold text-maineBlue">{c.user}</span>: {c.content}
              <span className="ml-2 text-xs text-gray-400">{c.time}</span>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="border rounded p-2 flex-1"
            placeholder="Add a comment..."
          />
          <button className="bg-seafoam text-maineBlue px-3 py-2 rounded font-bold hover:bg-maineBlue hover:text-seafoam transition-colors">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
