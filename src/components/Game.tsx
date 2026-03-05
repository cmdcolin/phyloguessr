import { useCallback, useEffect, useState } from "react";

import Button from "./Button.tsx";
import OrganismCard from "./OrganismCard.tsx";
import ResultScreen from "./ResultScreen.tsx";
import TreeIcon from "./TreeIcon.tsx";
import { getOrganismImage } from "../api/wikipedia.ts";
import { pickThreeOrganisms } from "../data/organisms.ts";
import { surprisingScenarios } from "../data/surprisingFacts.ts";
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
import type {
  HardModeResult,
  SpeciesPoolEntry,
  TaxonomyData,
} from "../utils/taxonomy.ts";
import type { MrcaInfo } from "../utils/format.ts";

type GameState = "customizing" | "loading" | "selecting" | "result";
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

interface HistoryEntry {
  correct: boolean;
  organisms: string[];
  sister: string[];
  mode: GameMode;
  timestamp: number;
}

function loadHistory(): HistoryEntry[] {
  const saved = localStorage.getItem("phyloHistory");
  if (saved) {
    return JSON.parse(saved) as HistoryEntry[];
  }
  return [];
}

export default function Game({ mode }: { mode: GameMode }) {
  const hasQueryParams =
    typeof window !== "undefined" && window.location.search.includes("id=");
  const [state, setState] = useState<GameState>(
    mode === "custom" && !hasQueryParams ? "customizing" : "loading",
  );
  const [round, setRound] = useState<RoundData | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<ResultData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [showHistory, setShowHistory] = useState(false);

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
      const unshown = surprisingScenarios
        .map((s, i) => ({ s, i }))
        .filter(({ i }) => !shownScenarioIndices.has(i));
      let orgs;
      if (unshown.length > 0) {
        const pick = unshown[Math.floor(Math.random() * unshown.length)];
        setCurrentScenario(pick.s);
        const next = new Set(shownScenarioIndices);
        next.add(pick.i);
        setShownScenarioIndices(next);
        sessionStorage.setItem("shownScenarios", JSON.stringify([...next]));
        orgs = [...pick.s.organisms];
      } else {
        setCurrentScenario(null);
        orgs = pickThreeOrganisms();
      }
      const shuffled = orgs.sort(() => Math.random() - 0.5);
      const images = await Promise.all(
        shuffled.map((o) => getOrganismImage(o.wikiTitle, o.scientificName)),
      );
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
        if (pair.isPolytomy) {
          continue;
        }

        finalOrgs = orgs;
        finalImages = images;
        finalClade = attemptClade;

        if (images.every((img) => img !== null)) {
          break;
        }
      }

      if (finalClade) {
        setRandomClade(finalClade);
      }
      setRound({ organisms: finalOrgs, images: finalImages });
      setState("selecting");
    }
  }, [
    mode,
    taxonomyData,
    speciesPool,
    distanceMode,
    cladeFilter,
    shownScenarioIndices,
  ]);

  useEffect(() => {
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
    setHistory((prev) => {
      const next = [...prev, entry];
      localStorage.setItem("phyloHistory", JSON.stringify(next));
      return next;
    });

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
      <header className="game-header">
        <div className="header-left">
          <TreeIcon size={26} />
          <h1>
            <a className="home-btn" href={import.meta.env.BASE_URL}>
              PhyloGuessr
            </a>
          </h1>
        </div>
        <div className="header-animals" aria-hidden="true">
          <img
            className="header-animal animal-platypus"
            src="https://images.phylopic.org/images/61932f57-1fd2-49d9-bb86-042d6005581a/thumbnail/128x128.png"
            alt=""
          />
          <img
            className="header-animal animal-aardvark"
            src="https://images.phylopic.org/images/cfee2dca-3767-46b8-8d03-bd8f46e79e9e/thumbnail/128x128.png"
            alt=""
          />
          <img
            className="header-animal animal-octopus"
            src="https://images.phylopic.org/images/f400b519-3564-4183-b4bd-c3b922cc7c5e/thumbnail/128x128.png"
            alt=""
          />
          <img
            className="header-animal animal-hippo"
            src="https://images.phylopic.org/images/3769e205-b10c-4aab-affc-b4f0302f4eaa/thumbnail/128x128.png"
            alt=""
          />
          <img
            className="header-animal animal-axolotl"
            src="https://images.phylopic.org/images/575eaa51-6c9b-4d36-9881-b8463c68ebbc/thumbnail/128x128.png"
            alt=""
          />
          <img
            className="header-animal animal-horseshoecrab"
            src="https://images.phylopic.org/images/38c82deb-b187-4e85-a9f8-dba2794b42d0/thumbnail/128x128.png"
            alt=""
          />
        </div>
        <div className="header-right">
          <a
            href={`${import.meta.env.BASE_URL}about`}
            className="about-btn"
            title="About"
          >
            ?
          </a>
          {history.length > 0 &&
            (() => {
              const wins = history.filter((h) => h.correct).length;
              const losses = history.length - wins;
              let streak = 0;
              for (let i = history.length - 1; i >= 0; i--) {
                if (history[i].correct) {
                  streak++;
                } else {
                  break;
                }
              }
              return (
                <>
                  <button
                    className="score-btn"
                    onClick={() => setShowHistory((s) => !s)}
                  >
                    {wins} {wins === 1 ? "win" : "wins"}, {losses}{" "}
                    {losses === 1 ? "loss" : "losses"}
                  </button>
                  {streak > 1 && (
                    <span className="streak">{streak} streak</span>
                  )}
                </>
              );
            })()}
        </div>
      </header>

      {showHistory && (
        <div className="history-panel">
          <div className="history-header">
            <h3>Game History</h3>
            <div className="history-actions">
              <button
                className="reset-btn"
                onClick={() => {
                  setHistory([]);
                  localStorage.removeItem("phyloHistory");
                }}
              >
                Reset
              </button>
              <button
                className="close-btn"
                onClick={() => setShowHistory(false)}
              >
                Close
              </button>
            </div>
          </div>
          {history.length === 0 && (
            <p className="history-empty">No games played yet.</p>
          )}
          <ul className="history-list">
            {[...history].reverse().map((h, i) => (
              <li
                key={history.length - 1 - i}
                className={h.correct ? "history-win" : "history-loss"}
              >
                <span className="history-result">{h.correct ? "W" : "L"}</span>
                <span className="history-organisms">
                  {h.organisms.join(", ")}
                </span>
                <span className="history-sister">
                  Answer: {h.sister.join(" + ")}
                </span>
                <span className="history-mode">{h.mode}</span>
              </li>
            ))}
          </ul>
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
                    ["40674", "Mammalia", "mammals"],
                    ["8782", "Aves", "birds"],
                    ["8504", "Lepidosauria", "lizards & snakes"],
                    ["8292", "Amphibia", "frogs & salamanders"],
                    ["50557", "Insecta", "insects"],
                    ["6854", "Arachnida", "spiders & scorpions"],
                    ["7898", "Actinopterygii", "ray-finned fish"],
                    ["7777", "Chondrichthyes", "sharks & rays"],
                    ["3398", "Magnoliopsida", "flowering plants"],
                    ["58019", "Pinopsida", "conifers"],
                    ["4751", "Fungi", "mushrooms & yeasts"],
                    ["6447", "Mollusca", "snails & octopuses"],
                  ] as const
                ).map(([id, name, label]) => (
                  <li
                    key={id}
                    className={`clade-preset-item ${cladeFilter === id ? "active" : ""}`}
                    onClick={() => {
                      setCladeFilter((prev) => (prev === id ? "" : id));
                      setCladeError("");
                      setShowSuggestions(false);
                    }}
                  >
                    {name} ({label})
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
