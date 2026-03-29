import{u as n}from"./jsxRuntime.module.CajXUuez.js";import{d as te,l as ae,u as ce}from"./taxonomy.BOTHL20Y.js";import{d as l,A as re,y as ie,T as y,q as h}from"./hooks.module.Dfwk9oED.js";const M="phylo-flagged-species",O=60;function le(){try{const c=localStorage.getItem(M);if(c)return new Set(JSON.parse(c))}catch{}return new Set}function P(c){localStorage.setItem(M,JSON.stringify([...c]))}function U(c,b,d){const x=ce(c,d.parents);for(const a of x)if(d.ranks[String(a)]===b)return{taxId:a,name:d.names[String(a)]??`${a}`}}const se={wikipedia:"WP",ncbi:"NCBI","scientific-only":"sci"},de={wikipedia:"#1565c0",ncbi:"#2e7d32","scientific-only":"#777"};function ge({entry:c,isFlagged:b,onToggle:d,onBrokenImg:x,taxonomy:a,nameSource:v}){const[m,I,g,k]=c,[q,S]=l(!1),f=h(()=>{S(!0),x?.(m)},[m,x]);return n("div",{class:`qc-card ${b?"qc-card-flagged":""}`,onClick:d,children:[n("div",{class:"qc-card-img",children:k&&!q?n("img",{src:k,alt:g,loading:"lazy",onError:f}):n("div",{class:"qc-card-noimg",children:"No image"})}),n("div",{class:"qc-card-info",children:[n("div",{class:"qc-card-common",children:I||g}),n("div",{class:"qc-card-sci",children:n("em",{children:g})}),n("div",{class:"qc-card-tax",children:[a.kingdom," > ",a.phylum," > ",a.family]}),n("div",{class:"qc-card-meta",children:[n("span",{class:"qc-card-id",children:["NCBI: ",m]}),n("span",{class:"qc-card-source",style:{background:de[v]},children:se[v]})]})]}),b&&n("div",{class:"qc-card-flag-badge",children:"FLAGGED"})]})}function ue(){const[c,b]=l([]),[d,x]=l(null),[a,v]=l(le),[m,I]=l(""),[g,k]=l("all"),[q,S]=l("all"),[f,J]=l("all"),[C,u]=l(0),[$,G]=l(!0),[N,_]=l("name"),[F,D]=l(new Set),[A,j]=l(""),z=re(null),[R,K]=l({});ie(()=>{Promise.all([te(),ae(),fetch("/taxonomy/wikipedia-names.json").then(e=>e.ok?e.json():{}).catch(()=>({}))]).then(([e,t,o])=>{b(e),x(t),K(o),G(!1)})},[]);const s=y(()=>{if(!d||c.length===0)return new Map;const e=new Map;for(const t of c){const o=t[0],r=U(o,"kingdom",d),i=U(o,"phylum",d),p=U(o,"family",d);e.set(o,{kingdom:r?.name??"Unknown",phylum:i?.name??"Unknown",family:p?.name??"Unknown"})}return e},[d,c]),Q=y(()=>{const e=new Map;for(const t of c){const[o,r,i]=t;if(r===i||r.toLowerCase()===i.toLowerCase()||!r)e.set(o,"scientific-only");else{const p=R[String(o)];if(p){const w=p.wpTitle.replace(/ \(.*\)$/,"").trim();r===w||r===p.wdLabel?e.set(o,"wikipedia"):e.set(o,"ncbi")}else e.set(o,"ncbi")}}return e},[c,R]),W=y(()=>{const e=new Set;for(const t of s.values())e.add(t.kingdom);return[...e].sort()},[s]),Y=y(()=>{const e=new Set;for(const t of s.values())(g==="all"||t.kingdom===g)&&e.add(t.phylum);return[...e].sort()},[s,g]),T=y(()=>{const e=m.toLowerCase();return c.filter(t=>{const[o,r,i]=t,p=s.get(o);return!(f==="flagged"&&!a.has(o)||f==="unflagged"&&a.has(o)||f==="broken-img"&&!F.has(o)||g!=="all"&&p?.kingdom!==g||q!=="all"&&p?.phylum!==q||e&&!(r.toLowerCase().includes(e)||i.toLowerCase().includes(e)||String(o).includes(e)))})},[c,m,g,q,f,a,F,s]),E=y(()=>{const e=[...T];return N==="kingdom"?e.sort((t,o)=>{const r=s.get(t[0]),i=s.get(o[0]);return(r?.kingdom??"").localeCompare(i?.kingdom??"")}):N==="phylum"?e.sort((t,o)=>{const r=s.get(t[0]),i=s.get(o[0]);return(r?.phylum??"").localeCompare(i?.phylum??"")}):e.sort((t,o)=>(t[1]||t[2]).localeCompare(o[1]||o[2])),e},[T,N,s]),L=Math.ceil(E.length/O),B=Math.min(C,Math.max(0,L-1)),Z=E.slice(B*O,(B+1)*O),H=h(e=>{v(t=>{const o=new Set(t);return o.has(e)?o.delete(e):o.add(e),P(o),o})},[]),V=h(()=>{const e=c.filter(i=>a.has(i[0])).map(i=>({taxId:i[0],commonName:i[1],scientificName:i[2]})),t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),o=URL.createObjectURL(t),r=document.createElement("a");r.href=o,r.download="flagged-species.json",r.click(),URL.revokeObjectURL(o)},[c,a]),X=h(()=>{const e=document.createElement("input");e.type="file",e.accept=".json",e.onchange=()=>{const t=e.files?.[0];if(t){const o=new FileReader;o.onload=()=>{try{const r=JSON.parse(o.result),i=Array.isArray(r)?r.map(w=>typeof w=="number"?w:w.taxId):[],p=new Set([...a,...i]);v(p),P(p)}catch{alert("Invalid JSON file")}},o.readAsText(t)}},e.click()},[a]),ee=h(e=>{D(t=>{const o=new Set(t);return o.add(e),o})},[]),ne=h(()=>{if(confirm(`Clear all ${a.size} flagged species?`)){const e=new Set;v(e),P(e)}},[a]),oe=h(()=>{const e=c.filter(t=>a.has(t[0])).map(t=>({taxId:t[0],commonName:t[1],scientificName:t[2]}));fetch("/api/qc-save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e,null,2)}).then(t=>{t.ok?j(`Saved ${e.length} flagged species`):j("Save failed — only works in dev server")}).catch(()=>j("Save failed — only works in dev server"))},[c,a]);return $?n("div",{class:"qc-container",children:n("h2",{children:"Loading species data..."})}):n("div",{class:"qc-container",ref:z,children:[n("div",{class:"qc-header",children:[n("h2",{children:"Species Quality Control"}),n("div",{class:"qc-stats",children:[c.length," total | ",a.size," flagged | ",E.length," shown"]})]}),n("div",{class:"qc-toolbar",children:[n("input",{type:"text",placeholder:"Search by name or taxId...",value:m,onInput:e=>{I(e.target.value),u(0)},class:"qc-search"}),n("select",{value:g,onChange:e=>{k(e.target.value),S("all"),u(0)},class:"qc-select",children:[n("option",{value:"all",children:"All kingdoms"}),W.map(e=>n("option",{value:e,children:e},e))]}),n("select",{value:q,onChange:e=>{S(e.target.value),u(0)},class:"qc-select",children:[n("option",{value:"all",children:"All phyla"}),Y.map(e=>n("option",{value:e,children:e},e))]}),n("select",{value:N,onChange:e=>{_(e.target.value),u(0)},class:"qc-select",children:[n("option",{value:"name",children:"Sort: Name"}),n("option",{value:"kingdom",children:"Sort: Kingdom"}),n("option",{value:"phylum",children:"Sort: Phylum"})]}),n("div",{class:"qc-filter-btns",children:["all","flagged","unflagged","broken-img"].map(e=>{const t={all:"All",flagged:"Flagged",unflagged:"Unflagged","broken-img":`Broken img (${F.size})`};return n("button",{class:`qc-filter-btn ${f===e?"active":""}`,onClick:()=>{J(e),u(0)},children:t[e]},e)})})]}),n("div",{class:"qc-actions",children:[n("button",{onClick:oe,class:"qc-btn qc-btn-save",children:["Save to project (",a.size,")"]}),n("button",{onClick:V,class:"qc-btn",children:"Export JSON"}),n("button",{onClick:X,class:"qc-btn",children:"Import"}),n("button",{onClick:ne,class:"qc-btn qc-btn-danger",children:"Clear all"}),A&&n("span",{class:"qc-save-status",children:A})]}),n("div",{class:"qc-grid",children:Z.map(e=>n(ge,{entry:e,isFlagged:a.has(e[0]),onToggle:()=>H(e[0]),onBrokenImg:ee,taxonomy:s.get(e[0])??{kingdom:"Unknown",phylum:"Unknown",family:"Unknown"},nameSource:Q.get(e[0])??"scientific-only"},e[0]))}),L>1&&n("div",{class:"qc-pagination",children:[n("button",{disabled:C===0,onClick:()=>{u(e=>e-1),z.current?.scrollTo(0,0)},children:"Prev"}),n("span",{children:["Page ",C+1," of ",L]}),n("button",{disabled:C>=L-1,onClick:()=>{u(e=>e+1),z.current?.scrollTo(0,0)},children:"Next"})]}),n("style",{children:`
        .qc-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 16px;
          height: 100vh;
          overflow-y: auto;
        }
        .qc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .qc-header h2 { margin: 0; }
        .qc-stats {
          font-size: 0.9rem;
          color: #888;
        }
        .qc-toolbar {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }
        .qc-search {
          flex: 1;
          min-width: 200px;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #555;
          background: #222;
          color: #eee;
          font-size: 0.95rem;
        }
        .qc-select {
          padding: 8px;
          border-radius: 6px;
          border: 1px solid #555;
          background: #222;
          color: #eee;
        }
        .qc-filter-btns {
          display: flex;
          gap: 4px;
        }
        .qc-filter-btn {
          padding: 6px 14px;
          border-radius: 16px;
          border: 1px solid #555;
          background: transparent;
          color: #ccc;
          cursor: pointer;
        }
        .qc-filter-btn.active {
          background: #2e7d32;
          color: white;
          border-color: #2e7d32;
        }
        .qc-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .qc-btn {
          padding: 6px 14px;
          border-radius: 6px;
          border: 1px solid #555;
          background: #333;
          color: #eee;
          cursor: pointer;
          font-size: 0.85rem;
        }
        .qc-btn:hover { background: #444; }
        .qc-btn-save { border-color: #1565c0; color: #42a5f5; }
        .qc-btn-save:hover { background: #1565c0; color: white; }
        .qc-btn-danger { border-color: #c62828; color: #ef5350; }
        .qc-btn-danger:hover { background: #c62828; color: white; }
        .qc-save-status {
          font-size: 0.85rem;
          color: #aaa;
          align-self: center;
        }
        .qc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 10px;
        }
        .qc-card {
          border: 2px solid #444;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.15s, opacity 0.15s;
          position: relative;
          background: #1a1a1a;
        }
        .qc-card:hover { border-color: #888; }
        .qc-card-flagged {
          border-color: #c62828;
          opacity: 0.6;
        }
        .qc-card-flagged:hover { opacity: 0.8; }
        .qc-card-img {
          width: 100%;
          height: 180px;
          overflow: hidden;
          background: #111;
        }
        .qc-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .qc-card-noimg {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
        }
        .qc-card-info {
          padding: 8px 10px;
        }
        .qc-card-common {
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .qc-card-sci {
          font-size: 0.8rem;
          color: #aaa;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .qc-card-tax {
          font-size: 0.75rem;
          color: #777;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .qc-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2px;
        }
        .qc-card-id {
          font-size: 0.7rem;
          color: #555;
        }
        .qc-card-source {
          font-size: 0.65rem;
          font-weight: 700;
          color: white;
          padding: 1px 6px;
          border-radius: 3px;
        }
        .qc-card-flag-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #c62828;
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .qc-pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
        }
        .qc-pagination button {
          padding: 6px 16px;
          border-radius: 6px;
          border: 1px solid #555;
          background: #333;
          color: #eee;
          cursor: pointer;
        }
        .qc-pagination button:disabled {
          opacity: 0.4;
          cursor: default;
        }
      `})]})}export{ue as default};
