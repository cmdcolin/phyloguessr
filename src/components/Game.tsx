import { useCallback, useEffect, useRef, useState } from "react";

import Button from "./Button.tsx";
import Header from "./Header.tsx";
import OrganismCard from "./OrganismCard.tsx";
import ResultScreen from "./ResultScreen.tsx";
import { getOrganismImage } from "../api/wikipedia.ts";
import { pickThreeOrganisms } from "../data/organisms.ts";
import { surprisingScenarios } from "../data/surprisingFacts.ts";
import { recordRound, startPresence } from "../firebase.ts";
import { saveHistory, loadHistory } from "../utils/history.ts";
import type { HistoryEntry } from "../utils/history.ts";
import {
  findClosestPairFromData,
  findTaxId,
  loadSpeciesPool,
  loadTaxonomyData,
  pickThreeFromClade,
  pickThreeHardMode,
  pickThreeHardModeDistance,
  searchTaxonNames,
} from "../utils/taxonomy.ts";

import type { Organism } from "../data/organisms.ts";
import type { SurprisingScenario } from "../data/surprisingFacts.ts";
import type { SpeciesPoolEntry, TaxonomyData } from "../utils/taxonomy.ts";
import type { MrcaInfo } from "../utils/format.ts";

type GameState =
  | "needs-nickname"
  | "customizing"
  | "loading"
  | "selecting"
  | "result";
type GameMode = "easy" | "random" | "custom";

interface RoundData {
  organisms: Organism[];
  images: (string | null)[];
}

interface ResultData {
  correct: boolean;
  sister1: Organism;
  sister2: Organism;
  outgroup: Organism;
  cladeLabel?: string;
  sisterMrca?: MrcaInfo;
  overallMrca?: MrcaInfo;
  isPolytomy: boolean;
}

function comboKey(orgs: { ncbiTaxId: number }[]) {
  return orgs
    .map((o) => o.ncbiTaxId)
    .sort((a, b) => a - b)
    .join(",");
}

export default function Game({ mode }: { mode: GameMode }) {
  const hasQueryParams =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("id");
  const hasNickname =
    typeof window !== "undefined" &&
    !!localStorage.getItem("phyloLeaderboardName");
  const [state, setState] = useState<GameState>(() => {
    if (!hasNickname) {
      return "needs-nickname";
    }
    if (mode === "custom" && !hasQueryParams) {
      return "customizing";
    }
    return "loading";
  });
  const [round, setRound] = useState<RoundData | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<ResultData | null>(null);
  const [nicknameInput, setNicknameInput] = useState("");

  const [taxonomyData, setTaxonomyData] = useState<TaxonomyData | null>(null);
  const [speciesPool, setSpeciesPool] = useState<SpeciesPoolEntry[] | null>(
    null,
  );
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentScenario, setCurrentScenario] =
    useState<SurprisingScenario | null>(null);
  const [shownScenarioIndices, setShownScenarioIndices] = useState<Set<number>>(
    () => {
      const saved = sessionStorage.getItem("shownScenarios");
      if (saved) {
        return new Set(JSON.parse(saved) as number[]);
      }
      return new Set();
    },
  );
  const [randomClade, setRandomClade] = useState<{
    taxId: number;
    name: string;
    rank: string;
  } | null>(null);
  const [distanceMode, setDistanceMode] = useState(
    () => new URLSearchParams(window.location.search).get("clade") === "true",
  );
  const [cladeFilter, setCladeFilter] = useState(
    () => new URLSearchParams(window.location.search).get("id") ?? "",
  );
  const [cladeError, setCladeError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [seenCombos, setSeenCombos] = useState<Set<string>>(() => {
    const saved = sessionStorage.getItem("phyloSeenCombos");
    if (saved) {
      return new Set(JSON.parse(saved) as string[]);
    }
    return new Set();
  });

  const shownScenarioIndicesRef = useRef(shownScenarioIndices);
  shownScenarioIndicesRef.current = shownScenarioIndices;

  const seenCombosRef = useRef(seenCombos);
  seenCombosRef.current = seenCombos;

  const recordCombo = (orgs: { ncbiTaxId: number }[]) => {
    const key = comboKey(orgs);
    setSeenCombos((prev) => {
      const next = new Set(prev);
      next.add(key);
      sessionStorage.setItem("phyloSeenCombos", JSON.stringify([...next]));
      return next;
    });
  };

  const startRound = useCallback(async () => {
    setState("loading");
    setSelected([]);
    setResult(null);

    let data = taxonomyData;
    if (!data) {
      setLoadingMessage("Downloading taxonomy data (~5 MB)...");
      data = await loadTaxonomyData();
      setTaxonomyData(data);
    }

    if (mode === "easy") {
      setLoadingMessage("Loading organisms...");
      const shownIndices = shownScenarioIndicesRef.current;
      const unshown = surprisingScenarios
        .map((s, i) => ({ s, i }))
        .filter(
          ({ s, i }) =>
            !shownIndices.has(i) &&
            !seenCombosRef.current.has(comboKey(s.organisms)),
        );
      let orgs;
      if (unshown.length > 0) {
        const pick = unshown[Math.floor(Math.random() * unshown.length)];
        setCurrentScenario(pick.s);
        const next = new Set(shownIndices);
        next.add(pick.i);
        setShownScenarioIndices(next);
        sessionStorage.setItem("shownScenarios", JSON.stringify([...next]));
        orgs = [...pick.s.organisms];
      } else {
        setCurrentScenario(null);
        let picked = pickThreeOrganisms();
        for (let i = 0; i < 20 && seenCombosRef.current.has(comboKey(picked)); i++) {
          picked = pickThreeOrganisms();
        }
        orgs = picked;
      }
      const shuffled = orgs.sort(() => Math.random() - 0.5);
      const images = await Promise.all(
        shuffled.map((o) => getOrganismImage(o.wikiTitle, o.scientificName)),
      );
      recordCombo(shuffled);
      setRound({ organisms: shuffled, images });
      setState("selecting");
    } else {
      let pool = speciesPool;

      if (!pool) {
        setLoadingMessage("Downloading species pool...");
        pool = await loadSpeciesPool();
        setSpeciesPool(pool);
      }

      setLoadingMessage("Picking species...");
      setCladeError("");
      setRandomClade(null);

      let cladeTaxId: number | undefined;
      if (mode !== "random" && cladeFilter.trim()) {
        cladeTaxId = findTaxId(cladeFilter.trim(), data);
        if (cladeTaxId === undefined) {
          setCladeError(`"${cladeFilter.trim()}" not found in taxonomy`);
          setState("customizing");
          return;
        }
      }

      let finalOrgs: Organism[] = [];
      let finalImages: (string | null)[] = [];
      let finalClade: { taxId: number; name: string; rank: string } | undefined;

      for (let attempt = 0; attempt < 5; attempt++) {
        let picks: SpeciesPoolEntry[];
        let attemptClade:
          | { taxId: number; name: string; rank: string }
          | undefined;

        if (mode === "random") {
          const result = pickThreeHardModeDistance(pool, data);
          picks = result.picks;
          attemptClade = result.clade;
        } else if (cladeTaxId !== undefined) {
          const result = pickThreeFromClade(cladeTaxId, pool, data);
          if (!result) {
            setCladeError(
              `Not enough species found in "${cladeFilter.trim()}" — try a broader group`,
            );
            setState("customizing");
            return;
          }
          picks = result;
        } else if (distanceMode) {
          const result = pickThreeHardModeDistance(pool, data);
          picks = result.picks;
          attemptClade = result.clade;
        } else {
          picks = pickThreeHardMode(pool, data);
        }

        const orgs: Organism[] = picks.map(
          ([taxId, commonName, scientificName]) => ({
            commonName,
            scientificName,
            ncbiTaxId: taxId,
            wikiTitle: scientificName.replace(/ /g, "_"),
            group: mode,
          }),
        );

        const images = await Promise.all(
          orgs.map((o) => getOrganismImage(o.wikiTitle, o.scientificName)),
        );

        const taxIds: [number, number, number] = [
          orgs[0].ncbiTaxId,
          orgs[1].ncbiTaxId,
          orgs[2].ncbiTaxId,
        ];
        const pair = findClosestPairFromData(taxIds, data);
        if (pair.isPolytomy || seenCombosRef.current.has(comboKey(orgs))) {
          continue;
        }

        finalOrgs = orgs;
        finalImages = images;
        finalClade = attemptClade;

        if (images.every((img) => img !== null)) {
          break;
        }
      }

      if (finalOrgs.length === 0) {
        if (mode === "custom") {
          setCladeError("Couldn't find a valid set of species — try again");
          setState("customizing");
        } else {
          setLoadingMessage("Retrying...");
          startRound();
        }
        return;
      }
      if (finalClade) {
        setRandomClade(finalClade);
      }
      recordCombo(finalOrgs);
      setRound({ organisms: finalOrgs, images: finalImages });
      setState("selecting");
    }
  }, [
    mode,
    taxonomyData,
    speciesPool,
    distanceMode,
    cladeFilter,
  ]);

  useEffect(() => {
    startPresence();
    if (!hasNickname) {
      return;
    }
    if (mode !== "custom" || hasQueryParams) {
      startRound();
    } else {
      loadTaxonomyData().then((data) => setTaxonomyData(data));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSelect = (idx: number) => {
    setSelected((prev) => {
      if (prev.includes(idx)) {
        return prev.filter((i) => i !== idx);
      }
      if (prev.length < 2) {
        return [...prev, idx];
      }
      return [prev[1], idx];
    });
  };

  const handleSubmit = () => {
    if (!round || selected.length !== 2) {
      return;
    }

    const orgs = round.organisms;
    const taxIds: [number, number, number] = [
      orgs[0].ncbiTaxId,
      orgs[1].ncbiTaxId,
      orgs[2].ncbiTaxId,
    ];

    const pair = findClosestPairFromData(taxIds, taxonomyData!);

    const sister1 = orgs.find((o) => o.ncbiTaxId === pair.sister1TaxId)!;
    const sister2 = orgs.find((o) => o.ncbiTaxId === pair.sister2TaxId)!;
    const outgroup = orgs.find((o) => o.ncbiTaxId === pair.outgroupTaxId)!;

    const sisterMrca: MrcaInfo = {
      taxId: pair.sisterLca.taxId,
      name: pair.sisterLca.name,
      rank: pair.sisterLca.rank,
    };
    const overallMrca: MrcaInfo = {
      taxId: pair.overallLca.taxId,
      name: pair.overallLca.name,
      rank: pair.overallLca.rank,
    };

    const selectedOrgs = selected.map((i) => orgs[i]);
    const userPickedTaxIds = new Set(selectedOrgs.map((o) => o.ncbiTaxId));
    const correct =
      pair.isPolytomy ||
      (userPickedTaxIds.has(pair.sister1TaxId) &&
        userPickedTaxIds.has(pair.sister2TaxId));

    const entry: HistoryEntry = {
      correct,
      organisms: orgs.map((o) => o.commonName),
      sister: [sister1.commonName, sister2.commonName],
      mode,
      timestamp: Date.now(),
    };
    saveHistory([...loadHistory(), entry]);

    const leaderboardName = localStorage.getItem("phyloLeaderboardName");
    if (leaderboardName) {
      recordRound(leaderboardName, correct).catch(console.error);
    }

    setResult({
      correct,
      sister1,
      sister2,
      outgroup,
      cladeLabel: sisterMrca.name,
      sisterMrca,
      overallMrca,
      isPolytomy: pair.isPolytomy,
    });
    setState("result");
  };

  return (
    <div className="game">
      <Header />

      {state === "needs-nickname" && (
        <div className="nickname-screen">
          <h2>Choose a nickname</h2>
          <p>Pick a name for the leaderboard before you start playing.</p>
          <div className="nickname-form">
            <input
              type="text"
              className="leaderboard-name-input"
              placeholder="Nickname (max 20 chars)"
              maxLength={20}
              value={nicknameInput}
              onChange={(e) => setNicknameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && nicknameInput.trim()) {
                  localStorage.setItem(
                    "phyloLeaderboardName",
                    nicknameInput.trim(),
                  );
                  if (mode === "custom" && !hasQueryParams) {
                    setState("customizing");
                    loadTaxonomyData().then((data) => setTaxonomyData(data));
                  } else {
                    startRound();
                  }
                }
              }}
            />
            <Button
              disabled={!nicknameInput.trim()}
              onClick={() => {
                localStorage.setItem(
                  "phyloLeaderboardName",
                  nicknameInput.trim(),
                );
                if (mode === "custom" && !hasQueryParams) {
                  setState("customizing");
                  loadTaxonomyData().then((data) => setTaxonomyData(data));
                } else {
                  startRound();
                }
              }}
            >
              Start playing
            </Button>
          </div>
        </div>
      )}

      {state === "customizing" && (
        <div className="custom-screen">
          <h2>Custom Mode</h2>
          <div className="custom-form">
            <fieldset className="custom-fieldset">
              <legend>Taxon quiz</legend>
              <ul className="clade-presets-list">
                {(
                  [
                    ["40674", "mammals", "Mammalia"],
                    ["8782", "birds", "Aves"],
                    ["8504", "lizards & snakes", "Lepidosauria"],
                    ["8292", "frogs & salamanders", "Amphibia"],
                    ["50557", "insects", "Insecta"],
                    ["6854", "spiders & scorpions", "Arachnida"],
                    ["7898", "ray-finned fish", "Actinopterygii"],
                    ["7777", "sharks & rays", "Chondrichthyes"],
                    ["32523", "bony vertebrates", "Tetrapoda"],
                    ["6656", "crustaceans", "Arthropoda"],
                    ["6447", "snails & octopuses", "Mollusca"],
                    ["3398", "flowering plants", "Magnoliopsida"],
                    ["58019", "conifers", "Pinopsida"],
                    ["4751", "mushrooms & yeasts", "Fungi"],
                    ["7742", "vertebrates", "Vertebrata"],
                    ["33208", "animals", "Metazoa"],
                    ["9443", "primates", "Primates"],
                    ["33554", "songbirds", "Passeriformes"],
                    ["7088", "butterflies & moths", "Lepidoptera"],
                    ["4890", "yeasts & sac fungi", "Ascomycota"],
                  ] as const
                ).map(([id, label, name]) => (
                  <li
                    key={id}
                    className={`clade-preset-item ${cladeFilter === id ? "active" : ""}`}
                    onClick={() => {
                      setCladeFilter((prev) => (prev === id ? "" : id));
                      setCladeError("");
                      setShowSuggestions(false);
                    }}
                  >
                    {label} <span className="clade-preset-scientific">({name})</span>
                  </li>
                ))}
                <li className="clade-preset-item clade-custom-item">
                  or, enter custom taxon name/id:{" "}
                  <div className="clade-autocomplete-inline">
                    <input
                      type="text"
                      className="clade-input-inline"
                      placeholder="taxon name or ID..."
                      value={cladeFilter}
                      onChange={(e) => {
                        setCladeFilter(e.target.value);
                        setCladeError("");
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 150);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                    />
                    {showSuggestions &&
                      taxonomyData &&
                      (() => {
                        const suggestions = searchTaxonNames(
                          cladeFilter,
                          taxonomyData,
                        );
                        if (suggestions.length === 0) {
                          return null;
                        }
                        return (
                          <ul className="clade-suggestions">
                            {suggestions.map((s) => (
                              <li key={s.id}>
                                <button
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setCladeFilter(s.name);
                                    setCladeError("");
                                    setShowSuggestions(false);
                                  }}
                                >
                                  <span className="suggestion-name">
                                    {s.name}
                                  </span>
                                  {s.rank && (
                                    <span className="suggestion-rank">
                                      {s.rank}
                                    </span>
                                  )}
                                </button>
                              </li>
                            ))}
                          </ul>
                        );
                      })()}
                  </div>
                </li>
              </ul>
              {cladeError && <p className="clade-error">{cladeError}</p>}
              {taxonomyData &&
                cladeFilter.trim().length >= 2 &&
                (() => {
                  const trimmed = cladeFilter.trim();
                  const isNumeric = /^\d+$/.test(trimmed);
                  if (isNumeric) {
                    const name = taxonomyData.names[trimmed];
                    const hasParent =
                      taxonomyData.parents[trimmed] !== undefined;
                    if (name || hasParent) {
                      const rank = taxonomyData.ranks[trimmed];
                      return (
                        <p className="clade-resolved">
                          <span className="clade-check">✓</span>{" "}
                          {name ?? `Taxon ${trimmed}`}
                          {rank ? ` (${rank})` : ""}
                        </p>
                      );
                    }
                    return (
                      <p className="clade-error">
                        <span className="clade-x">✕</span> No taxon found for ID{" "}
                        {trimmed}
                      </p>
                    );
                  }
                  const match = findTaxId(trimmed, taxonomyData);
                  if (match !== undefined) {
                    const name = taxonomyData.names[String(match)];
                    const rank = taxonomyData.ranks[String(match)];
                    return (
                      <p className="clade-resolved">
                        <span className="clade-check">✓</span> {name ?? trimmed}
                        {rank ? ` (${rank})` : ""}
                      </p>
                    );
                  }
                  return (
                    <p className="clade-error">
                      <span className="clade-x">✕</span> No taxon found for "
                      {trimmed}"
                    </p>
                  );
                })()}
            </fieldset>
            <fieldset className="custom-fieldset">
              <legend>Difficulty</legend>
              <label className="difficulty-option">
                <input
                  type="radio"
                  name="difficulty"
                  checked={!distanceMode}
                  onChange={() => setDistanceMode(false)}
                />
                <div>
                  <strong>Easy</strong>
                  <p className="option-hint">
                    Species picked from across the tree of life
                  </p>
                </div>
              </label>
              <label className="difficulty-option">
                <input
                  type="radio"
                  name="difficulty"
                  checked={distanceMode}
                  onChange={() => setDistanceMode(true)}
                />
                <div>
                  <strong>Hard</strong>
                  <p className="option-hint">
                    All 3 species from the same random clade — trickier because
                    they're closely related
                  </p>
                </div>
              </label>
            </fieldset>
          </div>
          <div className="custom-actions">
            <Button
              disabled={
                !cladeFilter.trim() ||
                (!!taxonomyData &&
                  findTaxId(cladeFilter.trim(), taxonomyData) === undefined)
              }
              href={(() => {
                const params = new URLSearchParams();
                const trimmed = cladeFilter.trim();
                if (trimmed) {
                  if (/^\d+$/.test(trimmed)) {
                    params.set("id", trimmed);
                  } else if (taxonomyData) {
                    const taxId = findTaxId(trimmed, taxonomyData);
                    if (taxId !== undefined) {
                      params.set("id", String(taxId));
                    }
                  }
                }
                if (distanceMode) {
                  params.set("clade", "true");
                }
                const qs = params.toString();
                return `${import.meta.env.BASE_URL}custom${qs ? `?${qs}` : ""}`;
              })()}
            >
              Play
            </Button>
            <Button variant="secondary" href={import.meta.env.BASE_URL}>
              Back
            </Button>
          </div>
        </div>
      )}

      {state === "loading" && <div className="loading">{loadingMessage}</div>}

      {state === "selecting" && round && (
        <div className="selecting">
          {mode === "easy" && (
            <p className="easy-disclaimer">
              Easy mode. Just kidding — these are hand curated tricky and
              surprising examples!
            </p>
          )}
          {mode === "random" && randomClade && (
            <p className="clade-label">
              Group:{" "}
              <a
                href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${randomClade.taxId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {randomClade.name}
              </a>
              {randomClade.rank ? ` (${randomClade.rank})` : ""}
            </p>
          )}
          {distanceMode && randomClade && (
            <p className="clade-label" style={{ color: "var(--error)" }}>
              Clade:{" "}
              <a
                href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${randomClade.taxId}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--error)" }}
              >
                {randomClade.name}
              </a>
              {randomClade.rank ? ` (${randomClade.rank})` : ""}
            </p>
          )}
          {mode === "custom" &&
            cladeFilter.trim() &&
            taxonomyData &&
            (() => {
              const trimmed = cladeFilter.trim();
              const taxId = findTaxId(trimmed, taxonomyData);
              if (taxId === undefined) {
                return null;
              }
              const name = taxonomyData.names[String(taxId)] ?? trimmed;
              const rank = taxonomyData.ranks[String(taxId)];
              return (
                <p className="clade-label">
                  Group:{" "}
                  <a
                    href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${taxId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {name}
                  </a>
                  {rank ? ` (${rank})` : ""}
                </p>
              );
            })()}
          <div className="cards">
            {round.organisms.map((org, i) => (
              <OrganismCard
                key={org.ncbiTaxId}
                commonName={org.commonName}
                scientificName={org.scientificName}
                imageUrl={round.images[i]}
                selected={selected.includes(i)}
                disabled={false}
                onClick={() => toggleSelect(i)}
              />
            ))}
          </div>
          <Button onClick={handleSubmit} disabled={selected.length !== 2}>
            Submit
          </Button>
        </div>
      )}

      {state === "result" && result && taxonomyData && round && (
        <ResultScreen
          correct={result.correct}
          sister1={result.sister1}
          sister2={result.sister2}
          outgroup={result.outgroup}
          cladeLabel={result.cladeLabel}
          sisterMrca={result.sisterMrca}
          overallMrca={result.overallMrca}
          isPolytomy={result.isPolytomy}
          taxonomyData={taxonomyData}
          images={Object.fromEntries(
            round.organisms.map((o, i) => [o.ncbiTaxId, round.images[i]]),
          )}
          userSelectedTaxIds={
            new Set(selected.map((i) => round.organisms[i].ncbiTaxId))
          }
          funFact={currentScenario?.funFact}
          onPlayAgain={startRound}
        />
      )}
    </div>
  );
}
