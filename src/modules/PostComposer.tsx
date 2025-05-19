import React, { useState } from 'react';

const PostComposer = () => {
  const [input, setInput] = useState('');
  const [image, setImage] = useState<File | null>(null);

  return (
    <div className="chefs-corner-composer bg-weatheredWhite p-4 rounded shadow mb-6">
      <textarea
        className="w-full border rounded p-2 mb-2"
        placeholder="Share a tip, story, or recipe..."
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div className="flex gap-2 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            const files = e.target.files;
            if (files && files[0]) {
              setImage(files[0]);
            } else {
              setImage(null);
            }
          }}
        />
        <button className="bg-seafoam text-maineBlue px-4 py-2 rounded font-bold hover:bg-maineBlue hover:text-seafoam transition-colors">
          Post
        </button>
      </div>
    </div>
  );
};

export default PostComposer;
