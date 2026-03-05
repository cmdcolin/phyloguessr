import { capitalize } from "../utils/format.ts";

interface OrganismCardProps {
  commonName: string;
  scientificName: string;
  imageUrl: string | null;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}

export default function OrganismCard({
  commonName,
  scientificName,
  imageUrl,
  selected,
  disabled,
  onClick,
}: OrganismCardProps) {
  return (
    <button
      className={`organism-card ${selected ? "selected" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="organism-image">
        {imageUrl ? (
          <img src={imageUrl} alt={commonName} draggable={false} />
        ) : (
          <div className="no-image">?</div>
        )}
      </div>
      <div className="organism-info">
        <div className="common-name">{capitalize(commonName)}</div>
        <div className="scientific-name">{scientificName}</div>
      </div>
    </button>
  );
}
