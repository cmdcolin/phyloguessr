import { capitalize } from '../utils/format.ts'
import type { Difficulty } from './gameUtils.ts'

interface OrganismCardProps {
  commonName: string
  scientificName: string
  imageUrl: string | null
  selected: boolean
  disabled: boolean
  onClick: () => void
  mapColor?: string
  difficulty?: Difficulty
}

export default function OrganismCard({
  commonName,
  scientificName,
  imageUrl,
  selected,
  disabled,
  onClick,
  mapColor,
  difficulty = 'normal',
}: OrganismCardProps) {
  const showCommonName = difficulty === 'normal'
  const showScientificName = difficulty !== 'expert'
  const showInfo = showCommonName || showScientificName || (!imageUrl)

  return (
    <button
      className={`organism-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="organism-image">
        {imageUrl ? (
          <img src={imageUrl} alt={showCommonName ? commonName : scientificName} draggable={false} />
        ) : (
          <div className="no-image">?</div>
        )}
      </div>
      {showInfo && (
        <div className="organism-info">
          {showCommonName && (
            <div className="common-name">
              {mapColor && (
                <span
                  className="map-color-dot"
                  style={{ backgroundColor: mapColor }}
                />
              )}
              {capitalize(commonName)}
            </div>
          )}
          {showScientificName && (
            <div className="scientific-name">{scientificName}</div>
          )}
        </div>
      )}
    </button>
  )
}
