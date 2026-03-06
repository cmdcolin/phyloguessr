function n(){const e=localStorage.getItem("phyloHistory");return e?JSON.parse(e):[]}function o(e){const t=e.length>500?e.slice(e.length-500):e;return localStorage.setItem("phyloHistory",JSON.stringify(t)),t}function a(e){let t=0;for(let r=e.length-1;r>=0&&e[r].correct;r--)t++;return t}export{a as g,n as l,o as s};
//# sourceMappingURL=history.CYt9l2jZ.js.map
