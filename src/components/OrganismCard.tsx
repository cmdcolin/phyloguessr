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
  const showLabels = difficulty === 'normal'
  const showInfo = showLabels || !imageUrl || !!mapColor

  return (
    <button
      className={`organism-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="organism-image">
        {imageUrl ? (
          <img src={imageUrl} alt={showLabels ? commonName : scientificName} draggable={false} />
        ) : (
          <div className="no-image">?</div>
        )}
      </div>
      {showInfo && (
        <div className="organism-info">
          {showLabels ? (
            <div className="common-name">
              {mapColor && (
                <span
                  className="map-color-dot"
                  style={{ backgroundColor: mapColor }}
                />
              )}
              {capitalize(commonName)}
            </div>
          ) : (
            mapColor && (
              <span
                className="map-color-dot"
                style={{ backgroundColor: mapColor }}
              />
            )
          )}
          {showLabels && (
            <div className="scientific-name">{scientificName}</div>
          )}
        </div>
      )}
    </button>
  )
}
