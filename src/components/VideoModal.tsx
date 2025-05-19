import React from 'react';

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  videoUrl: string; // YouTube/Vimeo embed URL
}

const VideoModal: React.FC<VideoModalProps> = ({ open, onClose, title, videoUrl }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-4 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-maineBlue text-2xl"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-lg font-bold mb-4 text-maineBlue">{title}</h2>
        <div className="aspect-w-16 aspect-h-9 w-full">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-72 rounded"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-72 bg-gray-100 rounded text-gray-500 text-lg">
              No video found for this step.
            </div>
          )}
        </div>
        {/* Debug: show the raw videoUrl value */}
        <div className="mt-2 text-xs text-gray-400 break-all">
          <span className="font-semibold">Debug videoUrl:</span> {videoUrl ? videoUrl : '(empty)'}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
