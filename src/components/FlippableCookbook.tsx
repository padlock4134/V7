import React, { useState } from "react";
import "./FlippableCookbook.css";

const PAGES = [
  {
    left: {
      title: "Prep Your Pantry",
      icon: "🥞",
      content: (
        <>
          <ul>
            <li><strong>Ingredients:</strong> Inventory, resourcefulness, a dash of curiosity</li>
            <li><strong>Instructions:</strong> Take stock of what you have—just like Grandpa Fred did every Saturday morning before pancakes. Resourcefulness starts here.</li>
          </ul>
        </>
      ),
    },
    right: {
      title: "Find What You Need",
      icon: "🛍️",
      content: (
        <>
          <ul>
            <li><strong>Ingredients:</strong> Local markets, specialty shops, community</li>
            <li><strong>Instructions:</strong> Discover where to shop to fill in the gaps, prioritizing local and specialty shops. Support your community while filling your plate.</li>
          </ul>
        </>
      ),
    },
  },
  {
    left: {
      title: "Plan & Plate",
      icon: "🍽️",
      content: (
        <>
          <ul>
            <li><strong>Ingredients:</strong> Meal planning, recipes, sharing</li>
            <li><strong>Instructions:</strong> Use professional tools to plan meals, organize recipes, and bring it all together at your own table—honoring Grandpa Fred’s legacy of mentorship and good food.</li>
          </ul>
        </>
      ),
    },
    right: {
      title: "Grow & Learn",
      icon: "📚",
      content: (
        <>
          <ul>
            <li><strong>Ingredients:</strong> Badges, achievements, tips, mentorship</li>
            <li><strong>Instructions:</strong> Track your progress, learn new techniques, and earn badges as you grow your kitchen skills. Grandpa Fred believed everyone could learn something new.</li>
          </ul>
        </>
      ),
    },
  },
  {
    left: {
      title: "About Freddie",
      icon: "👨‍🍳",
      content: (
        <>
          <p>
            Every Saturday morning, Grandpa Fred would gather all the grandkids for a big pancake breakfast. The kitchen was always alive with laughter, the smell of fresh pancakes, and the feeling that everyone belonged.
          </p>
          <p>
            Those mornings weren’t just about food—they were about mentorship, family, and the simple joy of sharing a meal together. Porkchop is our way of honoring Grandpa Fred, letting everyone experience a piece of his kitchen, no matter where they are.
          </p>
        </>
      ),
    },
    right: {
      title: "Kitchen Tips (FAQ)",
      icon: "📝",
      content: (
        <>
          <ul>
            <li><strong>Isn’t this just another recipe app?</strong><br />
              Nope! Porkchop is a digitized commissary kitchen inspired by Grandpa Fred. It’s about making the most of what you have, discovering where to shop locally, and connecting with a food-loving community.
            </li>
            <li className="mt-2"><strong>Will this work for me if I don’t live near lots of markets?</strong><br />
              Absolutely. Porkchop helps you find the best options wherever you are, and guides you to use what’s already in your fridge or pantry.
            </li>
            <li className="mt-2"><strong>Do I have to be a chef?</strong><br />
              Porkchop is for everyone, from beginners to pros. Grandpa Fred believed good food is for all, and our platform guides you every step of the way.
            </li>
            <li className="mt-2"><strong>Is this expensive?</strong><br />
              Not at all. Porkchop is about resourcefulness and creativity. Start with what you have, fill in the gaps locally, and enjoy real, affordable meals.
            </li>
          </ul>
        </>
      ),
    },
  },
];

const FlippableCookbook: React.FC = () => {
  const [page, setPage] = useState(0);
  const canPrev = page > 0;
  const canNext = page < PAGES.length - 1;

  // Click/tap anywhere on the book to turn the page
  const handleBookClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (canNext) {
      setPage(page + 1);
    } else if (!canNext && canPrev) {
      setPage(0); // Loop back to start for fun, or setPage(page - 1) to go back
    }
  };

  return (
    <div
      className="cookbook-container"
      onClick={handleBookClick}
      onTouchEnd={handleBookClick}
      tabIndex={0}
      role="button"
      aria-label="Flip cookbook page"
      style={{ cursor: canNext || canPrev ? 'pointer' : 'default' }}
    >
      <div className="cookbook-spine" />
      <div className={`cookbook-pages`}>
        <div className="cookbook-page left-page">
          <h2><span>{PAGES[page].left.icon}</span> {PAGES[page].left.title}</h2>
          <div>{PAGES[page].left.content}</div>
        </div>
        <div className="cookbook-page right-page">
          <h2><span>{PAGES[page].right.icon}</span> {PAGES[page].right.title}</h2>
          <div>{PAGES[page].right.content}</div>
        </div>
      </div>
    </div>
  );
};

export default FlippableCookbook;
