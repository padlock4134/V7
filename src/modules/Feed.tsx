import React from 'react';
import Post from './Post';

const mockPosts = [
  {
    id: 1,
    user: {
      name: 'Captain Haddock',
      avatar: '/avatars/captain.png',
    },
    content: 'Just landed a fresh catch of cod! What should I make?',
    image: '/images/cod.jpg',
    timestamp: '1h ago',
    likes: 8,
    comments: 2,
  },
  {
    id: 2,
    user: {
      name: 'Chef Sally',
      avatar: '/avatars/sally.png',
    },
    content: 'Try my chowder recipe! #chowder #maine',
    image: '',
    timestamp: '2h ago',
    likes: 12,
    comments: 4,
  },
];

const Feed = () => (
  <div className="chefs-corner-feed space-y-4">
    {mockPosts.map(post => (
      <Post key={post.id} {...post} />
    ))}
  </div>
);

export default Feed;
