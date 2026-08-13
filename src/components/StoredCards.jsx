import "../styles/StoredCards.css"

const StoredCards = ({ cards, onLoadCard, onDeleteCard }) => {
  if (cards.length === 0) {
    return (
      <div className="no-cards">
        <p>No saved builder badges found.</p>
      </div>
    )
  }

  return (
    <div className="stored-cards">
      <h3>Saved Badges</h3>

      <div className="cards-list">
        {cards.map((card) => {
          const displayDomain = card.domain || card.classDiv || "N/A";
          const displayId = card.builderId || card.rollNumber || card.id;
          
          return (
            <div key={card.id} className="card-item">
              <div className="card-info">
                <p className="card-name">{card.name}</p>
                <p className="card-details">
                  {displayDomain} • ID: {displayId}
                </p>
                <p className="card-date">{new Date(card.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="card-actions">
                <button onClick={() => onLoadCard(card)} className="load-btn">
                  Load
                </button>

                <button onClick={() => onDeleteCard(card.id)} className="delete-btn">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default StoredCards
