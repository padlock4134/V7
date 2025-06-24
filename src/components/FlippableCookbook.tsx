import React, { useState } from 'react';
import './FlippableCookbook.css';

const PAGES = [
  // Cover
  {
    title: "",
    content: (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          {/* PorkChop Hero Logo */}
          <div 
            style={{ 
              marginBottom: '1rem',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'transparent'
            }}
          >
            <img 
              src="/logo.png" 
              alt="PorkChop Logo" 
              style={{ 
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} 
            />
          </div>
          <h1 className="cover-title" style={{ fontSize: '2.5rem', margin: 0, color: '#fff' }}>PorkChop</h1>
          <h2 className="cover-subtitle" style={{ margin: '0.5rem 0 1.5rem 0', color: '#fff' }}>Your Kitchen, Leveled Up</h2>
        </div>
        <p className="cover-body">
          More than a recipe app—your personal culinary ecosystem that grows with you.
        </p>
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <span style={{ fontSize: "1.5rem", color: "#fff" }}>Click to continue</span>
        </div>
      </>
    ),
    pageNumber: null,
    isCover: true
  },
  // Page 1
  {
    title: "Table of Contents",
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '45px' }}>
        <p style={{ marginBottom: '5px', fontSize: '0.9rem' }}>Your guide to PorkChop:</p>
        <div style={{ cursor: 'pointer' }}>
          <p style={{ fontSize: '0.85rem', margin: '3px 0' }}><strong>Page 1:</strong> Table of Contents</p>
        </div>
        <div style={{ cursor: 'pointer' }}>
          <p style={{ fontSize: '0.85rem', margin: '3px 0' }}><strong>Page 2:</strong> Inspiration</p>
        </div>
        <div style={{ cursor: 'pointer' }}>
          <p style={{ fontSize: '0.85rem', margin: '3px 0' }}><strong>Page 3:</strong> AI Chef</p>
        </div>
        <div style={{ cursor: 'pointer' }}>
          <p style={{ fontSize: '0.85rem', margin: '3px 0' }}><strong>Page 4:</strong> My Kitchen</p>
        </div>
        <div style={{ cursor: 'pointer' }}>
          <p style={{ fontSize: '0.85rem', margin: '3px 0' }}><strong>Page 5:</strong> Culinary School</p>
        </div>
        <div style={{ cursor: 'pointer' }}>
          <p style={{ fontSize: '0.85rem', margin: '3px 0' }}><strong>Page 6:</strong> Chefs Corner</p>
        </div>
        <div style={{ cursor: 'pointer' }}>
          <p style={{ fontSize: '0.85rem', margin: '3px 0' }}><strong>Page 7:</strong> Pricing</p>
        </div>
        <div style={{ cursor: 'pointer' }}>
          <p style={{ fontSize: '0.85rem', margin: '3px 0' }}><strong>Page 8:</strong> Objections</p>
        </div>
      </div>
    ),
    pageNumber: 1
  },
  // Page 2
  {
    title: "Inspiration",
    content: (
      <div style={{ textAlign: 'center' }}>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: '#e94e3c', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '2.5rem'
          }}>
            📖
          </div>
        </div>
        <p style={{ fontSize: '1.1rem', marginBottom: '15px', maxWidth: '90%' }}>
          PorkChop began with my grandfather Fred's handwritten recipe cards—treasures that connected generations through food.
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '15px', maxWidth: '90%' }}>
          His philosophy was simple: cooking should be intuitive, personal, and bring joy. When those cards started to fade, I realized the need to preserve not just recipes, but the wisdom behind them.
        </p>
        <p style={{ fontSize: '1.1rem', maxWidth: '90%' }}>
          PorkChop honors his legacy by making cooking accessible, adaptable, and deeply personal—just like he taught me.
        </p>
      </div>
    ),
    pageNumber: 2
  },
  // Page 3
  {
    title: "AI Chef",
    content: (
      <div style={{ textAlign: 'center' }}>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: '#63ace5', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '2.5rem'
          }}>
            🤖
          </div>
        </div>
        <p style={{ fontSize: '1.1rem', marginBottom: '15px', maxWidth: '90%' }}>
          Meet your personal AI Chef—trained on thousands of recipes and cooking techniques to help you create delicious meals with whatever ingredients you have on hand.
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '15px', maxWidth: '90%' }}>
          Unlike rigid recipe apps, our AI adapts to your preferences, dietary needs, and available ingredients. It suggests substitutions, scaling, and modifications in real-time.
        </p>
        <p style={{ fontSize: '1.1rem', maxWidth: '90%' }}>
          The more you use it, the more it learns your taste preferences—creating a truly personalized cooking experience.
        </p>
      </div>
    ),
    pageNumber: 3
  },
  // Page 4
  {
    title: "My Kitchen",
    content: (
      <div style={{ textAlign: 'center' }}>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: '#f5e9da', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '2.5rem'
          }}>
            🍳
          </div>
        </div>
        <p style={{ fontSize: '1.1rem', marginBottom: '15px', maxWidth: '90%' }}>
          Your digital pantry and recipe collection, organized your way. Track ingredients you have on hand and get notified when staples are running low.
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '15px', maxWidth: '90%' }}>
          Import recipes from anywhere on the web with a single click, or create your own with our intuitive editor. Add notes, variations, and photos to make them truly yours.
        </p>
        <p style={{ fontSize: '1.1rem', maxWidth: '90%' }}>
          Meal planning becomes effortless with smart suggestions based on your ingredients, preferences, and schedule.
        </p>
      </div>
    ),
    pageNumber: 4
  },
  // Page 5
  {
    title: "Culinary School",
    content: (
      <div style={{ textAlign: 'center' }}>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: '#e7c89e', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '2.5rem'
          }}>
            🎓
          </div>
        </div>
        <p style={{ fontSize: '1.1rem', marginBottom: '15px', maxWidth: '90%' }}>
          Learn essential cooking techniques through interactive lessons and bite-sized tutorials—designed for busy home cooks.
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '15px', maxWidth: '90%' }}>
          From knife skills to flavor pairing, our curriculum builds confidence in the kitchen one skill at a time. Each lesson includes practice recipes that reinforce what you've learned.
        </p>
        <p style={{ fontSize: '1.1rem', maxWidth: '90%' }}>
          Grandpa Fred believed anyone could cook with the right guidance. Our Culinary School brings that philosophy to life with personalized learning paths.
        </p>
      </div>
    ),
    pageNumber: 5
  },
  // Page 6
  {
    title: "Chefs Corner",
    content: (
      <div style={{ textAlign: 'center' }}>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: '#f5e9da', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '2.5rem'
          }}>
            👨‍🍳
          </div>
        </div>
        <p style={{ fontSize: '1.1rem', marginBottom: '15px', maxWidth: '90%' }}>
          Connect with a community of home cooks and professional chefs who share your passion for food. Exchange recipes, tips, and culinary adventures.
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '15px', maxWidth: '90%' }}>
          Participate in monthly cooking challenges, themed events, and live Q&A sessions with renowned chefs who bring fresh perspectives to your kitchen.
        </p>
        <p style={{ fontSize: '1.1rem', maxWidth: '90%' }}>
          Grandpa Fred always said cooking is better when shared. Chefs Corner creates a virtual table where everyone is welcome.
        </p>
      </div>
    ),
    pageNumber: 6
  },
  // Page 7
  {
    title: "Pricing",
    content: (
      <div style={{ textAlign: 'center' }}>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '30px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              padding: '15px 25px', 
              backgroundColor: '#63ace5', 
              borderRadius: '10px',
              marginBottom: '10px',
              color: '#fff',
              fontWeight: 'bold'
            }}>
              Monthly
            </div>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2a4d69' }}>$10.99<span style={{ fontSize: '1rem' }}>/mo</span></p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              padding: '15px 25px', 
              backgroundColor: '#e94e3c', 
              borderRadius: '10px',
              marginBottom: '10px',
              color: '#fff',
              fontWeight: 'bold'
            }}>
              Annual
            </div>
            <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2a4d69' }}>$99.00<span style={{ fontSize: '1rem' }}>/year</span></p>
            <p style={{ fontSize: '0.9rem', color: '#555', fontStyle: 'italic' }}>Save over 24%</p>
          </div>
        </div>
        <p style={{ fontSize: '1.1rem', marginBottom: '15px', maxWidth: '90%' }}>
          Unlock the full PorkChop experience with either of our flexible subscription options. Both plans include unlimited recipes, advanced AI features, and exclusive content.
        </p>
        <p style={{ fontSize: '1.1rem', maxWidth: '90%' }}>
          No contracts, cancel anytime. Grandpa Fred believed quality cooking tools were worth investing in—we think you'll agree.
        </p>
      </div>
    ),
    pageNumber: 7
  },
  // Page 8
  {
    title: "Common Questions",
    content: (
      <div style={{ textAlign: 'center' }}>

        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            borderRadius: '50%', 
            backgroundColor: '#e7c89e', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '2.5rem'
          }}>
            ❓
          </div>
        </div>
        <div style={{ textAlign: 'left', maxWidth: '90%', margin: '0 auto' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '10px', maxWidth: '90%' }}>
            <strong>"I already have recipe apps. Why switch?"</strong><br/>
            Unlike static recipe collections, PorkChop adapts to you—learning your preferences and working with what you have.
          </p>
          <p style={{ fontSize: '1.1rem', marginBottom: '10px', maxWidth: '90%' }}>
            <strong>"Is my data private?"</strong><br/>
            Absolutely. Your recipes and preferences are yours alone. We never sell your data or share it with third parties.
          </p>
          <p style={{ fontSize: '1.1rem', maxWidth: '90%' }}>
            <strong>"What if I'm a beginner?"</strong><br/>
            Grandpa Fred believed cooking should be accessible to everyone. Our app grows with you, from simple meals to advanced techniques.
          </p>
        </div>
      </div>
    ),
    pageNumber: 8
  }
];

const FlippableCookbook: React.FC = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [turnedPages, setTurnedPages] = useState<number[]>([]);
  const [currentTurningPage, setCurrentTurningPage] = useState<number | null>(null);
  const [turnDirection, setTurnDirection] = useState<'forward' | 'backward'>('forward');

  // Function to go to next page
  const goToNextPage = () => {
    if (isAnimating || pageNumber >= PAGES.length - 1) return;
    setIsAnimating(true);
    setCurrentTurningPage(pageNumber);
    setTurnDirection('forward');
    
    setTimeout(() => {
      // Add current page to turned pages
      setTurnedPages(prev => [...prev, pageNumber]);
      setPageNumber(pageNumber + 1);
      setIsAnimating(false);
      setCurrentTurningPage(null);
    }, 500);
  };

  // Function to go to previous page
  const goToPrevPage = () => {
    if (isAnimating || pageNumber <= 0) return;
    setIsAnimating(true);
    setCurrentTurningPage(pageNumber - 1);
    setTurnDirection('backward');
    
    setTimeout(() => {
      // Remove the page we're turning back from
      setTurnedPages(prev => prev.filter(p => p !== pageNumber - 1));
      setPageNumber(pageNumber - 1);
      setIsAnimating(false);
      setCurrentTurningPage(null);
    }, 500);
  };

  // When showing the cover or any page
  return (
    <div className={`cookbook-container ${pageNumber === 0 ? 'cover-only' : ''}`}>
      <div className="cookbook-spine" />
      
      {/* Turned pages - these are the pages that have been turned and stick */}
      {turnedPages.map((pageNum) => (
        <div key={pageNum} className={`turned-page ${pageNum === 0 ? 'cover-turned-page' : ''}`}>
          <div className={`page-content ${pageNum === 0 ? 'cover-content' : ''}`}>
            {pageNum === 0 ? (
              PAGES[0].content
            ) : (
              <>
                <h2>{PAGES[pageNum].title}</h2>
                <div>{PAGES[pageNum].content}</div>
                {PAGES[pageNum].pageNumber && (
                  <div className="page-number">
                    <span className="page-arrow left-arrow">←</span>
                    {PAGES[pageNum].pageNumber}
                    <span className="page-arrow right-arrow">→</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ))}
      
      {/* Current page */}
      <div className={pageNumber === 0 ? "cover-page" : "book-page"}>
        <div className="spiral-binding">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="spiral-hole"></div>
          ))}
        </div>
        <div className={pageNumber === 0 ? "" : "page"}>
          {pageNumber === 0 ? (
            PAGES[0].content
          ) : (
            <>
              <h2>{PAGES[pageNumber].title}</h2>
              <div>{PAGES[pageNumber].content}</div>
              {PAGES[pageNumber].pageNumber && (
                <div className="page-number">
                  <span className="page-arrow left-arrow">←</span>
                  {PAGES[pageNumber].pageNumber}
                  <span className="page-arrow right-arrow">→</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>


      
      {/* Navigation zones */}
      <div 
        className="nav-zone left-zone"
        onClick={(e) => {
          e.stopPropagation();
          goToPrevPage();
        }}
      />
      <div 
        className="nav-zone right-zone"
        onClick={(e) => {
          e.stopPropagation();
          goToNextPage();
        }}
      />
      
      {/* Page turn animation */}
      {isAnimating && currentTurningPage !== null && (
        <div className={`page-turn-animation ${turnDirection === 'backward' ? 'reverse' : ''}`}>
          <div className="turning-page">
            {turnDirection === 'forward' ? (
              <div className="page-content">
                <h2>{PAGES[currentTurningPage].title}</h2>
                <div>{PAGES[currentTurningPage].content}</div>
                {PAGES[currentTurningPage].pageNumber && (
                  <div className="page-number">
                    <span className="page-arrow left-arrow">←</span>
                    {PAGES[currentTurningPage].pageNumber}
                    <span className="page-arrow right-arrow">→</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="page-content">
                <h2>{PAGES[currentTurningPage].title}</h2>
                <div>{PAGES[currentTurningPage].content}</div>
                {PAGES[currentTurningPage].pageNumber && (
                  <div className="page-number">
                    <span className="page-arrow left-arrow">←</span>
                    {PAGES[currentTurningPage].pageNumber}
                    <span className="page-arrow right-arrow">→</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlippableCookbook;