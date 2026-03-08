import { capitalize, cn } from '../utils/format.ts'
import type { Difficulty } from './gameUtils.ts'
import styles from './OrganismCard.module.css'

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
      className={cn(styles.card, selected && styles.selected)}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={styles.image}>
        {imageUrl ? (
          <img src={imageUrl} alt={showLabels ? commonName : scientificName} draggable={false} />
        ) : (
          <div className={styles.noImage}>?</div>
        )}
      </div>
      {showInfo && (
        <div className={styles.info}>
          {showLabels ? (
            <div className={styles.commonName}>
              {mapColor && (
                <span
                  className={styles.mapColorDot}
                  style={{ backgroundColor: mapColor }}
                />
              )}
              {capitalize(commonName)}
            </div>
          ) : (
            mapColor && (
              <span
                className={styles.mapColorDot}
                style={{ backgroundColor: mapColor }}
              />
            )
          )}
          {showLabels && (
            <div className={styles.scientificName}>{scientificName}</div>
          )}
        </div>
      )}
    </button>
  )
}
