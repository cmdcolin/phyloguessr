const Xs=()=>{};var yr={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yi=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let i=n.charCodeAt(r);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},Zs=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const i=n[t++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=n[t++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=n[t++],o=n[t++],a=n[t++],h=((i&7)<<18|(s&63)<<12|(o&63)<<6|a&63)-65536;e[r++]=String.fromCharCode(55296+(h>>10)),e[r++]=String.fromCharCode(56320+(h&1023))}else{const s=n[t++],o=n[t++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},Ii={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<n.length;i+=3){const s=n[i],o=i+1<n.length,a=o?n[i+1]:0,h=i+2<n.length,m=h?n[i+2]:0,_=s>>2,E=(s&3)<<4|a>>4;let I=(a&15)<<2|m>>6,b=m&63;h||(b=64,o||(I=64)),r.push(t[_],t[E],t[I],t[b])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(yi(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):Zs(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<n.length;){const s=t[n.charAt(i++)],a=i<n.length?t[n.charAt(i)]:0;++i;const m=i<n.length?t[n.charAt(i)]:64;++i;const E=i<n.length?t[n.charAt(i)]:64;if(++i,s==null||a==null||m==null||E==null)throw new eo;const I=s<<2|a>>4;if(r.push(I),m!==64){const b=a<<4&240|m>>2;if(r.push(b),E!==64){const A=m<<6&192|E;r.push(A)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class eo extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const to=function(n){const e=yi(n);return Ii.encodeByteArray(e,!0)},Ct=function(n){return to(n).replace(/\./g,"")},Ei=function(n){try{return Ii.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function no(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ro=()=>no().__FIREBASE_DEFAULTS__,io=()=>{if(typeof process>"u"||typeof yr>"u")return;const n=yr.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},so=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Ei(n[1]);return e&&JSON.parse(e)},Cn=()=>{try{return Xs()||ro()||io()||so()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},wi=n=>Cn()?.emulatorHosts?.[n],oo=n=>{const e=wi(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Ti=()=>Cn()?.config,Ai=n=>Cn()?.[`_${n}`];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ao{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ze(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function vi(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function co(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",i=n.iat||0,s=n.sub||n.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}},...n};return[Ct(JSON.stringify(t)),Ct(JSON.stringify(o)),""].join(".")}const Ye={};function uo(){const n={prod:[],emulator:[]};for(const e of Object.keys(Ye))Ye[e]?n.emulator.push(e):n.prod.push(e);return n}function lo(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let Ir=!1;function bi(n,e){if(typeof window>"u"||typeof document>"u"||!ze(window.location.host)||Ye[n]===e||Ye[n]||Ir)return;Ye[n]=e;function t(I){return`__firebase__banner__${I}`}const r="__firebase__banner",s=uo().prod.length>0;function o(){const I=document.getElementById(r);I&&I.remove()}function a(I){I.style.display="flex",I.style.background="#7faaf0",I.style.position="fixed",I.style.bottom="5px",I.style.left="5px",I.style.padding=".5em",I.style.borderRadius="5px",I.style.alignItems="center"}function h(I,b){I.setAttribute("width","24"),I.setAttribute("id",b),I.setAttribute("height","24"),I.setAttribute("viewBox","0 0 24 24"),I.setAttribute("fill","none"),I.style.marginLeft="-6px"}function m(){const I=document.createElement("span");return I.style.cursor="pointer",I.style.marginLeft="16px",I.style.fontSize="24px",I.innerHTML=" &times;",I.onclick=()=>{Ir=!0,o()},I}function _(I,b){I.setAttribute("id",b),I.innerText="Learn more",I.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",I.setAttribute("target","__blank"),I.style.paddingLeft="5px",I.style.textDecoration="underline"}function E(){const I=lo(r),b=t("text"),A=document.getElementById(b)||document.createElement("span"),N=t("learnmore"),R=document.getElementById(N)||document.createElement("a"),x=t("preprendIcon"),z=document.getElementById(x)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(I.created){const $=I.element;a($),_(R,N);const J=m();h(z,x),$.append(z,A,R,J),document.body.appendChild($)}s?(A.innerText="Preview backend disconnected.",z.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(z.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,A.innerText="Preview backend running in this workspace."),A.setAttribute("id",b)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",E):E()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function ho(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(B())}function fo(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function po(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function mo(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function go(){const n=B();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function _o(){try{return typeof indexedDB=="object"}catch{return!1}}function yo(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{e(i.error?.message||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Io="FirebaseError";class pe extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Io,Object.setPrototypeOf(this,pe.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ht.prototype.create)}}class ht{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?Eo(s,r):"Error",a=`${this.serviceName}: ${o} (${i}).`;return new pe(i,a,r)}}function Eo(n,e){return n.replace(wo,(t,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const wo=/\{\$([^}]+)}/g;function To(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function Ne(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const i of t){if(!r.includes(i))return!1;const s=n[i],o=e[i];if(Er(s)&&Er(o)){if(!Ne(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!t.includes(i))return!1;return!0}function Er(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dt(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Ao(n,e){const t=new vo(n,e);return t.subscribe.bind(t)}class vo{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let i;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");bo(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:r},i.next===void 0&&(i.next=rn),i.error===void 0&&(i.error=rn),i.complete===void 0&&(i.complete=rn);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function bo(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function rn(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F(n){return n&&n._delegate?n._delegate:n}class ke{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Se="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class So{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new ao;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e?.identifier),r=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Po(e))try{this.getOrInitializeService({instanceIdentifier:Se})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=Se){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Se){return this.instances.has(e)}getOptions(e=Se){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[s,o]of this.instancesDeferred.entries()){const a=this.normalizeInstanceIdentifier(s);r===a&&o.resolve(i)}return i}onInit(e,t){const r=this.normalizeInstanceIdentifier(t),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const i of r)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Ro(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Se){return this.component?this.component.multipleInstances?e:Se:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Ro(n){return n===Se?void 0:n}function Po(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class No{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new So(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var S;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(S||(S={}));const ko={debug:S.DEBUG,verbose:S.VERBOSE,info:S.INFO,warn:S.WARN,error:S.ERROR,silent:S.SILENT},Co=S.INFO,Do={[S.DEBUG]:"log",[S.VERBOSE]:"log",[S.INFO]:"info",[S.WARN]:"warn",[S.ERROR]:"error"},Vo=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),i=Do[e];if(i)console[i](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Dn{constructor(e){this.name=e,this._logLevel=Co,this._logHandler=Vo,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in S))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?ko[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,S.DEBUG,...e),this._logHandler(this,S.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,S.VERBOSE,...e),this._logHandler(this,S.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,S.INFO,...e),this._logHandler(this,S.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,S.WARN,...e),this._logHandler(this,S.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,S.ERROR,...e),this._logHandler(this,S.ERROR,...e)}}const Oo=(n,e)=>e.some(t=>n instanceof t);let wr,Tr;function Lo(){return wr||(wr=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Mo(){return Tr||(Tr=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Si=new WeakMap,gn=new WeakMap,Ri=new WeakMap,sn=new WeakMap,Vn=new WeakMap;function Uo(n){const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("success",s),n.removeEventListener("error",o)},s=()=>{t(Ee(n.result)),i()},o=()=>{r(n.error),i()};n.addEventListener("success",s),n.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&Si.set(t,n)}).catch(()=>{}),Vn.set(e,n),e}function Fo(n){if(gn.has(n))return;const e=new Promise((t,r)=>{const i=()=>{n.removeEventListener("complete",s),n.removeEventListener("error",o),n.removeEventListener("abort",o)},s=()=>{t(),i()},o=()=>{r(n.error||new DOMException("AbortError","AbortError")),i()};n.addEventListener("complete",s),n.addEventListener("error",o),n.addEventListener("abort",o)});gn.set(n,e)}let _n={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return gn.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Ri.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Ee(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function xo(n){_n=n(_n)}function $o(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(on(this),e,...t);return Ri.set(r,e.sort?e.sort():[e]),Ee(r)}:Mo().includes(n)?function(...e){return n.apply(on(this),e),Ee(Si.get(this))}:function(...e){return Ee(n.apply(on(this),e))}}function Bo(n){return typeof n=="function"?$o(n):(n instanceof IDBTransaction&&Fo(n),Oo(n,Lo())?new Proxy(n,_n):n)}function Ee(n){if(n instanceof IDBRequest)return Uo(n);if(sn.has(n))return sn.get(n);const e=Bo(n);return e!==n&&(sn.set(n,e),Vn.set(e,n)),e}const on=n=>Vn.get(n);function jo(n,e,{blocked:t,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(n,e),a=Ee(o);return r&&o.addEventListener("upgradeneeded",h=>{r(Ee(o.result),h.oldVersion,h.newVersion,Ee(o.transaction),h)}),t&&o.addEventListener("blocked",h=>t(h.oldVersion,h.newVersion,h)),a.then(h=>{s&&h.addEventListener("close",()=>s()),i&&h.addEventListener("versionchange",m=>i(m.oldVersion,m.newVersion,m))}).catch(()=>{}),a}const qo=["get","getKey","getAll","getAllKeys","count"],Ho=["put","add","delete","clear"],an=new Map;function Ar(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(an.get(e))return an.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,i=Ho.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(i||qo.includes(t)))return;const s=async function(o,...a){const h=this.transaction(o,i?"readwrite":"readonly");let m=h.store;return r&&(m=m.index(a.shift())),(await Promise.all([m[t](...a),i&&h.done]))[0]};return an.set(e,s),s}xo(n=>({...n,get:(e,t,r)=>Ar(e,t)||n.get(e,t,r),has:(e,t)=>!!Ar(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zo{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Go(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Go(n){return n.getComponent()?.type==="VERSION"}const yn="@firebase/app",vr="0.14.9";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const he=new Dn("@firebase/app"),Wo="@firebase/app-compat",Ko="@firebase/analytics-compat",Jo="@firebase/analytics",Qo="@firebase/app-check-compat",Yo="@firebase/app-check",Xo="@firebase/auth",Zo="@firebase/auth-compat",ea="@firebase/database",ta="@firebase/data-connect",na="@firebase/database-compat",ra="@firebase/functions",ia="@firebase/functions-compat",sa="@firebase/installations",oa="@firebase/installations-compat",aa="@firebase/messaging",ca="@firebase/messaging-compat",ua="@firebase/performance",la="@firebase/performance-compat",ha="@firebase/remote-config",da="@firebase/remote-config-compat",fa="@firebase/storage",pa="@firebase/storage-compat",ma="@firebase/firestore",ga="@firebase/ai",_a="@firebase/firestore-compat",ya="firebase",Ia="12.10.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const In="[DEFAULT]",Ea={[yn]:"fire-core",[Wo]:"fire-core-compat",[Jo]:"fire-analytics",[Ko]:"fire-analytics-compat",[Yo]:"fire-app-check",[Qo]:"fire-app-check-compat",[Xo]:"fire-auth",[Zo]:"fire-auth-compat",[ea]:"fire-rtdb",[ta]:"fire-data-connect",[na]:"fire-rtdb-compat",[ra]:"fire-fn",[ia]:"fire-fn-compat",[sa]:"fire-iid",[oa]:"fire-iid-compat",[aa]:"fire-fcm",[ca]:"fire-fcm-compat",[ua]:"fire-perf",[la]:"fire-perf-compat",[ha]:"fire-rc",[da]:"fire-rc-compat",[fa]:"fire-gcs",[pa]:"fire-gcs-compat",[ma]:"fire-fst",[_a]:"fire-fst-compat",[ga]:"fire-vertex","fire-js":"fire-js",[ya]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dt=new Map,wa=new Map,En=new Map;function br(n,e){try{n.container.addComponent(e)}catch(t){he.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function Be(n){const e=n.name;if(En.has(e))return he.debug(`There were multiple attempts to register component ${e}.`),!1;En.set(e,n);for(const t of Dt.values())br(t,n);for(const t of wa.values())br(t,n);return!0}function On(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function Q(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ta={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},we=new ht("app","Firebase",Ta);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Aa{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new ke("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw we.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ge=Ia;function Pi(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r={name:In,automaticDataCollectionEnabled:!0,...e},i=r.name;if(typeof i!="string"||!i)throw we.create("bad-app-name",{appName:String(i)});if(t||(t=Ti()),!t)throw we.create("no-options");const s=Dt.get(i);if(s){if(Ne(t,s.options)&&Ne(r,s.config))return s;throw we.create("duplicate-app",{appName:i})}const o=new No(i);for(const h of En.values())o.addComponent(h);const a=new Aa(t,r,o);return Dt.set(i,a),a}function Ni(n=In){const e=Dt.get(n);if(!e&&n===In&&Ti())return Pi();if(!e)throw we.create("no-app",{appName:n});return e}function Te(n,e,t){let r=Ea[n]??n;t&&(r+=`-${t}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const o=[`Unable to register library "${r}" with version "${e}":`];i&&o.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&o.push("and"),s&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),he.warn(o.join(" "));return}Be(new ke(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const va="firebase-heartbeat-database",ba=1,it="firebase-heartbeat-store";let cn=null;function ki(){return cn||(cn=jo(va,ba,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(it)}catch(t){console.warn(t)}}}}).catch(n=>{throw we.create("idb-open",{originalErrorMessage:n.message})})),cn}async function Sa(n){try{const t=(await ki()).transaction(it),r=await t.objectStore(it).get(Ci(n));return await t.done,r}catch(e){if(e instanceof pe)he.warn(e.message);else{const t=we.create("idb-get",{originalErrorMessage:e?.message});he.warn(t.message)}}}async function Sr(n,e){try{const r=(await ki()).transaction(it,"readwrite");await r.objectStore(it).put(e,Ci(n)),await r.done}catch(t){if(t instanceof pe)he.warn(t.message);else{const r=we.create("idb-set",{originalErrorMessage:t?.message});he.warn(r.message)}}}function Ci(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ra=1024,Pa=30;class Na{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Ca(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{const t=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Rr();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(i=>i.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:t}),this._heartbeatsCache.heartbeats.length>Pa){const i=Da(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(i,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){he.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=Rr(),{heartbeatsToSend:t,unsentEntries:r}=ka(this._heartbeatsCache.heartbeats),i=Ct(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return he.warn(e),""}}}function Rr(){return new Date().toISOString().substring(0,10)}function ka(n,e=Ra){const t=[];let r=n.slice();for(const i of n){const s=t.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),Pr(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),Pr(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class Ca{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return _o()?yo().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Sa(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Sr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Sr(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function Pr(n){return Ct(JSON.stringify({version:2,heartbeats:n})).length}function Da(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Va(n){Be(new ke("platform-logger",e=>new zo(e),"PRIVATE")),Be(new ke("heartbeat",e=>new Na(e),"PRIVATE")),Te(yn,vr,n),Te(yn,vr,"esm2020"),Te("fire-js","")}Va("");var Oa="firebase",La="12.10.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Te(Oa,La,"app");function Di(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Ma=Di,Vi=new ht("auth","Firebase",Di());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vt=new Dn("@firebase/auth");function Ua(n,...e){Vt.logLevel<=S.WARN&&Vt.warn(`Auth (${Ge}): ${n}`,...e)}function Rt(n,...e){Vt.logLevel<=S.ERROR&&Vt.error(`Auth (${Ge}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ae(n,...e){throw Mn(n,...e)}function Z(n,...e){return Mn(n,...e)}function Ln(n,e,t){const r={...Ma(),[e]:t};return new ht("auth","Firebase",r).create(e,{appName:n.name})}function Pe(n){return Ln(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Fa(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&ae(n,"argument-error"),Ln(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Mn(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return Vi.create(n,...e)}function T(n,e,...t){if(!n)throw Mn(e,...t)}function ue(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Rt(e),new Error(e)}function de(n,e){n||ue(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wn(){return typeof self<"u"&&self.location?.href||""}function xa(){return Nr()==="http:"||Nr()==="https:"}function Nr(){return typeof self<"u"&&self.location?.protocol||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $a(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(xa()||po()||"connection"in navigator)?navigator.onLine:!0}function Ba(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ft{constructor(e,t){this.shortDelay=e,this.longDelay=t,de(t>e,"Short delay should be less than long delay!"),this.isMobile=ho()||mo()}get(){return $a()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Un(n,e){de(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oi{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;ue("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;ue("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;ue("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ja={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qa=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Ha=new ft(3e4,6e4);function Fn(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function We(n,e,t,r,i={}){return Li(n,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const a=dt({key:n.config.apiKey,...o}).slice(1),h=await n._getAdditionalHeaders();h["Content-Type"]="application/json",n.languageCode&&(h["X-Firebase-Locale"]=n.languageCode);const m={method:e,headers:h,...s};return fo()||(m.referrerPolicy="no-referrer"),n.emulatorConfig&&ze(n.emulatorConfig.host)&&(m.credentials="include"),Oi.fetch()(await Mi(n,n.config.apiHost,t,a),m)})}async function Li(n,e,t){n._canInitEmulator=!1;const r={...ja,...e};try{const i=new Ga(n),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw Tt(n,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const a=s.ok?o.errorMessage:o.error.message,[h,m]=a.split(" : ");if(h==="FEDERATED_USER_ID_ALREADY_LINKED")throw Tt(n,"credential-already-in-use",o);if(h==="EMAIL_EXISTS")throw Tt(n,"email-already-in-use",o);if(h==="USER_DISABLED")throw Tt(n,"user-disabled",o);const _=r[h]||h.toLowerCase().replace(/[_\s]+/g,"-");if(m)throw Ln(n,_,m);ae(n,_)}}catch(i){if(i instanceof pe)throw i;ae(n,"network-request-failed",{message:String(i)})}}async function za(n,e,t,r,i={}){const s=await We(n,e,t,r,i);return"mfaPendingCredential"in s&&ae(n,"multi-factor-auth-required",{_serverResponse:s}),s}async function Mi(n,e,t,r){const i=`${e}${t}?${r}`,s=n,o=s.config.emulator?Un(n.config,i):`${n.config.apiScheme}://${i}`;return qa.includes(t)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(o).toString():o}class Ga{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Z(this.auth,"network-request-failed")),Ha.get())})}}function Tt(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const i=Z(n,e,r);return i.customData._tokenResponse=t,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Wa(n,e){return We(n,"POST","/v1/accounts:delete",e)}async function Ot(n,e){return We(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xe(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Ka(n,e=!1){const t=F(n),r=await t.getIdToken(e),i=xn(r);T(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s?.sign_in_provider;return{claims:i,token:r,authTime:Xe(un(i.auth_time)),issuedAtTime:Xe(un(i.iat)),expirationTime:Xe(un(i.exp)),signInProvider:o||null,signInSecondFactor:s?.sign_in_second_factor||null}}function un(n){return Number(n)*1e3}function xn(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Rt("JWT malformed, contained fewer than 3 sections"),null;try{const i=Ei(t);return i?JSON.parse(i):(Rt("Failed to decode base64 JWT payload"),null)}catch(i){return Rt("Caught error parsing JWT payload as JSON",i?.toString()),null}}function kr(n){const e=xn(n);return T(e,"internal-error"),T(typeof e.exp<"u","internal-error"),T(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function st(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof pe&&Ja(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Ja({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qa{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tn{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Xe(this.lastLoginAt),this.creationTime=Xe(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Lt(n){const e=n.auth,t=await n.getIdToken(),r=await st(n,Ot(e,{idToken:t}));T(r?.users.length,e,"internal-error");const i=r.users[0];n._notifyReloadListener(i);const s=i.providerUserInfo?.length?Ui(i.providerUserInfo):[],o=Xa(n.providerData,s),a=n.isAnonymous,h=!(n.email&&i.passwordHash)&&!o?.length,m=a?h:!1,_={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:o,metadata:new Tn(i.createdAt,i.lastLoginAt),isAnonymous:m};Object.assign(n,_)}async function Ya(n){const e=F(n);await Lt(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function Xa(n,e){return[...n.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function Ui(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Za(n,e){const t=await Li(n,{},async()=>{const r=dt({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=n.config,o=await Mi(n,i,"/v1/token",`key=${s}`),a=await n._getAdditionalHeaders();a["Content-Type"]="application/x-www-form-urlencoded";const h={method:"POST",headers:a,body:r};return n.emulatorConfig&&ze(n.emulatorConfig.host)&&(h.credentials="include"),Oi.fetch()(o,h)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function ec(n,e){return We(n,"POST","/v2/accounts:revokeToken",Fn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){T(e.idToken,"internal-error"),T(typeof e.idToken<"u","internal-error"),T(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):kr(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){T(e.length!==0,"internal-error");const t=kr(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(T(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:i,expiresIn:s}=await Za(e,t);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:i,expirationTime:s}=t,o=new Fe;return r&&(T(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(T(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(T(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Fe,this.toJSON())}_performRefresh(){return ue("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function me(n,e){T(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class X{constructor({uid:e,auth:t,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new Qa(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Tn(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await st(this,this.stsTokenManager.getToken(this.auth,e));return T(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Ka(this,e)}reload(){return Ya(this)}_assign(e){this!==e&&(T(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new X({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){T(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Lt(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Q(this.auth.app))return Promise.reject(Pe(this.auth));const e=await this.getIdToken();return await st(this,Wa(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const r=t.displayName??void 0,i=t.email??void 0,s=t.phoneNumber??void 0,o=t.photoURL??void 0,a=t.tenantId??void 0,h=t._redirectEventId??void 0,m=t.createdAt??void 0,_=t.lastLoginAt??void 0,{uid:E,emailVerified:I,isAnonymous:b,providerData:A,stsTokenManager:N}=t;T(E&&N,e,"internal-error");const R=Fe.fromJSON(this.name,N);T(typeof E=="string",e,"internal-error"),me(r,e.name),me(i,e.name),T(typeof I=="boolean",e,"internal-error"),T(typeof b=="boolean",e,"internal-error"),me(s,e.name),me(o,e.name),me(a,e.name),me(h,e.name),me(m,e.name),me(_,e.name);const x=new X({uid:E,auth:e,email:i,emailVerified:I,displayName:r,isAnonymous:b,photoURL:o,phoneNumber:s,tenantId:a,stsTokenManager:R,createdAt:m,lastLoginAt:_});return A&&Array.isArray(A)&&(x.providerData=A.map(z=>({...z}))),h&&(x._redirectEventId=h),x}static async _fromIdTokenResponse(e,t,r=!1){const i=new Fe;i.updateFromServerResponse(t);const s=new X({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await Lt(s),s}static async _fromGetAccountInfoResponse(e,t,r){const i=t.users[0];T(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?Ui(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!s?.length,a=new Fe;a.updateFromIdToken(r);const h=new X({uid:i.localId,auth:e,stsTokenManager:a,isAnonymous:o}),m={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Tn(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!s?.length};return Object.assign(h,m),h}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cr=new Map;function le(n){de(n instanceof Function,"Expected a class definition");let e=Cr.get(n);return e?(de(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Cr.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fi{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Fi.type="NONE";const Dr=Fi;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pt(n,e,t){return`firebase:${n}:${e}:${t}`}class xe{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=Pt(this.userKey,i.apiKey,s),this.fullPersistenceKey=Pt("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Ot(this.auth,{idToken:e}).catch(()=>{});return t?X._fromGetAccountInfoResponse(this.auth,t,e):null}return X._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new xe(le(Dr),e,r);const i=(await Promise.all(t.map(async m=>{if(await m._isAvailable())return m}))).filter(m=>m);let s=i[0]||le(Dr);const o=Pt(r,e.config.apiKey,e.name);let a=null;for(const m of t)try{const _=await m._get(o);if(_){let E;if(typeof _=="string"){const I=await Ot(e,{idToken:_}).catch(()=>{});if(!I)break;E=await X._fromGetAccountInfoResponse(e,I,_)}else E=X._fromJSON(e,_);m!==s&&(a=E),s=m;break}}catch{}const h=i.filter(m=>m._shouldAllowMigration);return!s._shouldAllowMigration||!h.length?new xe(s,e,r):(s=h[0],a&&await s._set(o,a.toJSON()),await Promise.all(t.map(async m=>{if(m!==s)try{await m._remove(o)}catch{}})),new xe(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vr(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(ji(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(xi(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Hi(e))return"Blackberry";if(zi(e))return"Webos";if($i(e))return"Safari";if((e.includes("chrome/")||Bi(e))&&!e.includes("edge/"))return"Chrome";if(qi(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if(r?.length===2)return r[1]}return"Other"}function xi(n=B()){return/firefox\//i.test(n)}function $i(n=B()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function Bi(n=B()){return/crios\//i.test(n)}function ji(n=B()){return/iemobile/i.test(n)}function qi(n=B()){return/android/i.test(n)}function Hi(n=B()){return/blackberry/i.test(n)}function zi(n=B()){return/webos/i.test(n)}function $n(n=B()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function tc(n=B()){return $n(n)&&!!window.navigator?.standalone}function nc(){return go()&&document.documentMode===10}function Gi(n=B()){return $n(n)||qi(n)||zi(n)||Hi(n)||/windows phone/i.test(n)||ji(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wi(n,e=[]){let t;switch(n){case"Browser":t=Vr(B());break;case"Worker":t=`${Vr(B())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Ge}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rc{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=s=>new Promise((o,a)=>{try{const h=e(s);o(h)}catch(h){a(h)}});r.onAbort=t,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ic(n,e={}){return We(n,"GET","/v2/passwordPolicy",Fn(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sc=6;class oc{constructor(e){const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??sc,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ac{constructor(e,t,r,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Or(this),this.idTokenSubscription=new Or(this),this.beforeStateQueue=new rc(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Vi,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=le(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await xe.create(this,e),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Ot(this,{idToken:e}),r=await X._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(Q(this.app)){const s=this.app.settings.authIdToken;return s?new Promise(o=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(s).then(o,o))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let r=t,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const s=this.redirectUser?._redirectEventId,o=r?._redirectEventId,a=await this.tryRedirectSignIn(e);(!s||s===o)&&a?.user&&(r=a.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(s){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(s))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return T(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Lt(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Ba()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Q(this.app))return Promise.reject(Pe(this));const t=e?F(e):null;return t&&T(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&T(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return Q(this.app)?Promise.reject(Pe(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Q(this.app)?Promise.reject(Pe(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(le(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await ic(this),t=new oc(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ht("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await ec(this,r)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&le(e)||this._popupRedirectResolver;T(t,this,"argument-error"),this.redirectPersistenceManager=await xe.create(this,[le(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let o=!1;const a=this._isInitialized?Promise.resolve():this._initializationPromise;if(T(a,this,"internal-error"),a.then(()=>{o||s(this.currentUser)}),typeof t=="function"){const h=e.addObserver(t,r,i);return()=>{o=!0,h()}}else{const h=e.addObserver(t);return()=>{o=!0,h()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return T(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Wi(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){if(Q(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&Ua(`Error while retrieving App Check token: ${e.error}`),e?.token}}function Wt(n){return F(n)}class Or{constructor(e){this.auth=e,this.observer=null,this.addObserver=Ao(t=>this.observer=t)}get next(){return T(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Bn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function cc(n){Bn=n}function uc(n){return Bn.loadJS(n)}function lc(){return Bn.gapiScript}function hc(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dc(n,e){const t=On(n,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(Ne(s,e??{}))return i;ae(i,"already-initialized")}return t.initialize({options:e})}function fc(n,e){const t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(le);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e?.popupRedirectResolver)}function pc(n,e,t){const r=Wt(n);T(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!1,s=Ki(e),{host:o,port:a}=mc(e),h=a===null?"":`:${a}`,m={url:`${s}//${o}${h}/`},_=Object.freeze({host:o,port:a,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){T(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),T(Ne(m,r.config.emulator)&&Ne(_,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=m,r.emulatorConfig=_,r.settings.appVerificationDisabledForTesting=!0,ze(o)?(vi(`${s}//${o}${h}`),bi("Auth",!0)):gc()}function Ki(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function mc(n){const e=Ki(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Lr(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:Lr(o)}}}function Lr(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function gc(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ji{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return ue("not implemented")}_getIdTokenResponse(e){return ue("not implemented")}_linkToIdToken(e,t){return ue("not implemented")}_getReauthenticationResolver(e){return ue("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $e(n,e){return za(n,"POST","/v1/accounts:signInWithIdp",Fn(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _c="http://localhost";class Ce extends Ji{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Ce(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):ae("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i,...s}=t;if(!r||!i)return null;const o=new Ce(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return $e(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,$e(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,$e(e,t)}buildRequest(){const e={requestUri:_c,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=dt(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt extends jn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge extends pt{constructor(){super("facebook.com")}static credential(e){return Ce._fromParams({providerId:ge.PROVIDER_ID,signInMethod:ge.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return ge.credentialFromTaggedObject(e)}static credentialFromError(e){return ge.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return ge.credential(e.oauthAccessToken)}catch{return null}}}ge.FACEBOOK_SIGN_IN_METHOD="facebook.com";ge.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce extends pt{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Ce._fromParams({providerId:ce.PROVIDER_ID,signInMethod:ce.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return ce.credentialFromTaggedObject(e)}static credentialFromError(e){return ce.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return ce.credential(t,r)}catch{return null}}}ce.GOOGLE_SIGN_IN_METHOD="google.com";ce.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e extends pt{constructor(){super("github.com")}static credential(e){return Ce._fromParams({providerId:_e.PROVIDER_ID,signInMethod:_e.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return _e.credentialFromTaggedObject(e)}static credentialFromError(e){return _e.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return _e.credential(e.oauthAccessToken)}catch{return null}}}_e.GITHUB_SIGN_IN_METHOD="github.com";_e.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ye extends pt{constructor(){super("twitter.com")}static credential(e,t){return Ce._fromParams({providerId:ye.PROVIDER_ID,signInMethod:ye.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return ye.credentialFromTaggedObject(e)}static credentialFromError(e){return ye.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return ye.credential(t,r)}catch{return null}}}ye.TWITTER_SIGN_IN_METHOD="twitter.com";ye.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class je{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,i=!1){const s=await X._fromIdTokenResponse(e,r,i),o=Mr(r);return new je({user:s,providerId:o,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const i=Mr(r);return new je({user:e,providerId:i,_tokenResponse:r,operationType:t})}}function Mr(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt extends pe{constructor(e,t,r,i){super(t.code,t.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,Mt.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,i){return new Mt(e,t,r,i)}}function Qi(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?Mt._fromErrorAndOperation(n,s,e,r):s})}async function yc(n,e,t=!1){const r=await st(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return je._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ic(n,e,t=!1){const{auth:r}=n;if(Q(r.app))return Promise.reject(Pe(r));const i="reauthenticate";try{const s=await st(n,Qi(r,i,e,n),t);T(s.idToken,r,"internal-error");const o=xn(s.idToken);T(o,r,"internal-error");const{sub:a}=o;return T(n.uid===a,r,"user-mismatch"),je._forOperation(n,i,s)}catch(s){throw s?.code==="auth/user-not-found"&&ae(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ec(n,e,t=!1){if(Q(n.app))return Promise.reject(Pe(n));const r="signIn",i=await Qi(n,r,e),s=await je._fromIdTokenResponse(n,r,i);return t||await n._updateCurrentUser(s.user),s}function wc(n,e,t,r){return F(n).onIdTokenChanged(e,t,r)}function Tc(n,e,t){return F(n).beforeAuthStateChanged(e,t)}function Ac(n,e,t,r){return F(n).onAuthStateChanged(e,t,r)}const Ut="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yi{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ut,"1"),this.storage.removeItem(Ut),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vc=1e3,bc=10;class Xi extends Yi{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Gi(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),i=this.localCache[t];r!==i&&e(t,i,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,a,h)=>{this.notifyListeners(o,h)});return}const r=e.key;t?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!t&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);nc()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,bc):i()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},vc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Xi.type="LOCAL";const Sc=Xi;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zi extends Yi{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Zi.type="SESSION";const es=Zi;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rc(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kt{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const r=new Kt(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:i,data:s}=t.data,o=this.handlersMap[i];if(!o?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const a=Array.from(o).map(async m=>m(t.origin,s)),h=await Rc(a);t.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:h})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Kt.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qn(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pc{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((a,h)=>{const m=qn("",20);i.port1.start();const _=setTimeout(()=>{h(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(E){const I=E;if(I.data.eventId===m)switch(I.data.status){case"ack":clearTimeout(_),s=setTimeout(()=>{h(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),a(I.data.response);break;default:clearTimeout(_),clearTimeout(s),h(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:m,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function se(){return window}function Nc(n){se().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ts(){return typeof se().WorkerGlobalScope<"u"&&typeof se().importScripts=="function"}async function kc(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Cc(){return navigator?.serviceWorker?.controller||null}function Dc(){return ts()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ns="firebaseLocalStorageDb",Vc=1,Ft="firebaseLocalStorage",rs="fbase_key";class mt{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Jt(n,e){return n.transaction([Ft],e?"readwrite":"readonly").objectStore(Ft)}function Oc(){const n=indexedDB.deleteDatabase(ns);return new mt(n).toPromise()}function An(){const n=indexedDB.open(ns,Vc);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(Ft,{keyPath:rs})}catch(i){t(i)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(Ft)?e(r):(r.close(),await Oc(),e(await An()))})})}async function Ur(n,e,t){const r=Jt(n,!0).put({[rs]:e,value:t});return new mt(r).toPromise()}async function Lc(n,e){const t=Jt(n,!1).get(e),r=await new mt(t).toPromise();return r===void 0?null:r.value}function Fr(n,e){const t=Jt(n,!0).delete(e);return new mt(t).toPromise()}const Mc=800,Uc=3;class is{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await An(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>Uc)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return ts()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Kt._getInstance(Dc()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await kc(),!this.activeServiceWorker)return;this.sender=new Pc(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Cc()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await An();return await Ur(e,Ut,"1"),await Fr(e,Ut),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Ur(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>Lc(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Fr(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Jt(i,!1).getAll();return new mt(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Mc)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}is.type="LOCAL";const Fc=is;new ft(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ss(n,e){return e?le(e):(T(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hn extends Ji{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return $e(e,this._buildIdpRequest())}_linkToIdToken(e,t){return $e(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return $e(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function xc(n){return Ec(n.auth,new Hn(n),n.bypassAuthState)}function $c(n){const{auth:e,user:t}=n;return T(t,e,"internal-error"),Ic(t,new Hn(n),n.bypassAuthState)}async function Bc(n){const{auth:e,user:t}=n;return T(t,e,"internal-error"),yc(t,new Hn(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class os{constructor(e,t,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:i,tenantId:s,error:o,type:a}=e;if(o){this.reject(o);return}const h={auth:this.auth,requestUri:t,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(h))}catch(m){this.reject(m)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return xc;case"linkViaPopup":case"linkViaRedirect":return Bc;case"reauthViaPopup":case"reauthViaRedirect":return $c;default:ae(this.auth,"internal-error")}}resolve(e){de(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){de(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jc=new ft(2e3,1e4);async function qc(n,e,t){if(Q(n.app))return Promise.reject(Z(n,"operation-not-supported-in-this-environment"));const r=Wt(n);Fa(n,e,jn);const i=ss(r,t);return new Re(r,"signInViaPopup",e,i).executeNotNull()}class Re extends os{constructor(e,t,r,i,s){super(e,t,i,s),this.provider=r,this.authWindow=null,this.pollId=null,Re.currentPopupAction&&Re.currentPopupAction.cancel(),Re.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return T(e,this.auth,"internal-error"),e}async onExecution(){de(this.filter.length===1,"Popup operations only handle one event");const e=qn();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Z(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(Z(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Re.currentPopupAction=null}pollUserCancellation(){const e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Z(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,jc.get())};e()}}Re.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hc="pendingRedirect",Nt=new Map;class zc extends os{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=Nt.get(this.auth._key());if(!e){try{const r=await Gc(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}Nt.set(this.auth._key(),e)}return this.bypassAuthState||Nt.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Gc(n,e){const t=Jc(e),r=Kc(n);if(!await r._isAvailable())return!1;const i=await r._get(t)==="true";return await r._remove(t),i}function Wc(n,e){Nt.set(n._key(),e)}function Kc(n){return le(n._redirectPersistence)}function Jc(n){return Pt(Hc,n.config.apiKey,n.name)}async function Qc(n,e,t=!1){if(Q(n.app))return Promise.reject(Pe(n));const r=Wt(n),i=ss(r,e),o=await new zc(r,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yc=600*1e3;class Xc{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!Zc(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!as(e)){const r=e.error.code?.split("auth/")[1]||"internal-error";t.onError(Z(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=Yc&&this.cachedEventUids.clear(),this.cachedEventUids.has(xr(e))}saveEventToCache(e){this.cachedEventUids.add(xr(e)),this.lastProcessedEventTime=Date.now()}}function xr(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function as({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function Zc(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return as(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eu(n,e={}){return We(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tu=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,nu=/^https?/;async function ru(n){if(n.config.emulator)return;const{authorizedDomains:e}=await eu(n);for(const t of e)try{if(iu(t))return}catch{}ae(n,"unauthorized-domain")}function iu(n){const e=wn(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===r}if(!nu.test(t))return!1;if(tu.test(n))return r===n;const i=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const su=new ft(3e4,6e4);function $r(){const n=se().___jsl;if(n?.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function ou(n){return new Promise((e,t)=>{function r(){$r(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{$r(),t(Z(n,"network-request-failed"))},timeout:su.get()})}if(se().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(se().gapi?.load)r();else{const i=hc("iframefcb");return se()[i]=()=>{gapi.load?r():t(Z(n,"network-request-failed"))},uc(`${lc()}?onload=${i}`).catch(s=>t(s))}}).catch(e=>{throw kt=null,e})}let kt=null;function au(n){return kt=kt||ou(n),kt}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cu=new ft(5e3,15e3),uu="__/auth/iframe",lu="emulator/auth/iframe",hu={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},du=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function fu(n){const e=n.config;T(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?Un(e,lu):`https://${n.config.authDomain}/${uu}`,r={apiKey:e.apiKey,appName:n.name,v:Ge},i=du.get(n.config.apiHost);i&&(r.eid=i);const s=n._getFrameworks();return s.length&&(r.fw=s.join(",")),`${t}?${dt(r).slice(1)}`}async function pu(n){const e=await au(n),t=se().gapi;return T(t,n,"internal-error"),e.open({where:document.body,url:fu(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:hu,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=Z(n,"network-request-failed"),a=se().setTimeout(()=>{s(o)},cu.get());function h(){se().clearTimeout(a),i(r)}r.ping(h).then(h,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mu={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},gu=500,_u=600,yu="_blank",Iu="http://localhost";class Br{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Eu(n,e,t,r=gu,i=_u){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const h={...mu,width:r.toString(),height:i.toString(),top:s,left:o},m=B().toLowerCase();t&&(a=Bi(m)?yu:t),xi(m)&&(e=e||Iu,h.scrollbars="yes");const _=Object.entries(h).reduce((I,[b,A])=>`${I}${b}=${A},`,"");if(tc(m)&&a!=="_self")return wu(e||"",a),new Br(null);const E=window.open(e||"",a,_);T(E,n,"popup-blocked");try{E.focus()}catch{}return new Br(E)}function wu(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tu="__/auth/handler",Au="emulator/auth/handler",vu=encodeURIComponent("fac");async function jr(n,e,t,r,i,s){T(n.config.authDomain,n,"auth-domain-config-required"),T(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Ge,eventId:i};if(e instanceof jn){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",To(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[_,E]of Object.entries({}))o[_]=E}if(e instanceof pt){const _=e.getScopes().filter(E=>E!=="");_.length>0&&(o.scopes=_.join(","))}n.tenantId&&(o.tid=n.tenantId);const a=o;for(const _ of Object.keys(a))a[_]===void 0&&delete a[_];const h=await n._getAppCheckToken(),m=h?`#${vu}=${encodeURIComponent(h)}`:"";return`${bu(n)}?${dt(a).slice(1)}${m}`}function bu({config:n}){return n.emulator?Un(n,Au):`https://${n.authDomain}/${Tu}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ln="webStorageSupport";class Su{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=es,this._completeRedirectFn=Qc,this._overrideRedirectResult=Wc}async _openPopup(e,t,r,i){de(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");const s=await jr(e,t,r,wn(),i);return Eu(e,s,qn())}async _openRedirect(e,t,r,i){await this._originValidation(e);const s=await jr(e,t,r,wn(),i);return Nc(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(de(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await pu(e),r=new Xc(e);return t.register("authEvent",i=>(T(i?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(ln,{type:ln},i=>{const s=i?.[0]?.[ln];s!==void 0&&t(!!s),ae(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=ru(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Gi()||$i()||$n()}}const Ru=Su;var qr="@firebase/auth",Hr="1.12.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pu{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){T(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nu(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function ku(n){Be(new ke("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:a}=r.options;T(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const h={apiKey:o,authDomain:a,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Wi(n)},m=new ac(r,i,s,h);return fc(m,t),m},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),Be(new ke("auth-internal",e=>{const t=Wt(e.getProvider("auth").getImmediate());return(r=>new Pu(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),Te(qr,Hr,Nu(n)),Te(qr,Hr,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cu=300,Du=Ai("authIdTokenMaxAge")||Cu;let zr=null;const Vu=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>Du)return;const i=t?.token;zr!==i&&(zr=i,await fetch(n,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Ou(n=Ni()){const e=On(n,"auth");if(e.isInitialized())return e.getImmediate();const t=dc(n,{popupRedirectResolver:Ru,persistence:[Fc,Sc,es]}),r=Ai("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=Vu(s.toString());Tc(t,o,()=>o(t.currentUser)),wc(t,a=>o(a))}}const i=wi("auth");return i&&pc(t,`http://${i}`),t}function Lu(){return document.getElementsByTagName("head")?.[0]??document}cc({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=i=>{const s=Z("internal-error");s.customData=i,t(s)},r.type="text/javascript",r.charset="UTF-8",Lu().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});ku("Browser");var Gr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var cs;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(d,c){function l(){}l.prototype=c.prototype,d.F=c.prototype,d.prototype=new l,d.prototype.constructor=d,d.D=function(p,f,g){for(var u=Array(arguments.length-2),be=2;be<arguments.length;be++)u[be-2]=arguments[be];return c.prototype[f].apply(p,u)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(d,c,l){l||(l=0);const p=Array(16);if(typeof c=="string")for(var f=0;f<16;++f)p[f]=c.charCodeAt(l++)|c.charCodeAt(l++)<<8|c.charCodeAt(l++)<<16|c.charCodeAt(l++)<<24;else for(f=0;f<16;++f)p[f]=c[l++]|c[l++]<<8|c[l++]<<16|c[l++]<<24;c=d.g[0],l=d.g[1],f=d.g[2];let g=d.g[3],u;u=c+(g^l&(f^g))+p[0]+3614090360&4294967295,c=l+(u<<7&4294967295|u>>>25),u=g+(f^c&(l^f))+p[1]+3905402710&4294967295,g=c+(u<<12&4294967295|u>>>20),u=f+(l^g&(c^l))+p[2]+606105819&4294967295,f=g+(u<<17&4294967295|u>>>15),u=l+(c^f&(g^c))+p[3]+3250441966&4294967295,l=f+(u<<22&4294967295|u>>>10),u=c+(g^l&(f^g))+p[4]+4118548399&4294967295,c=l+(u<<7&4294967295|u>>>25),u=g+(f^c&(l^f))+p[5]+1200080426&4294967295,g=c+(u<<12&4294967295|u>>>20),u=f+(l^g&(c^l))+p[6]+2821735955&4294967295,f=g+(u<<17&4294967295|u>>>15),u=l+(c^f&(g^c))+p[7]+4249261313&4294967295,l=f+(u<<22&4294967295|u>>>10),u=c+(g^l&(f^g))+p[8]+1770035416&4294967295,c=l+(u<<7&4294967295|u>>>25),u=g+(f^c&(l^f))+p[9]+2336552879&4294967295,g=c+(u<<12&4294967295|u>>>20),u=f+(l^g&(c^l))+p[10]+4294925233&4294967295,f=g+(u<<17&4294967295|u>>>15),u=l+(c^f&(g^c))+p[11]+2304563134&4294967295,l=f+(u<<22&4294967295|u>>>10),u=c+(g^l&(f^g))+p[12]+1804603682&4294967295,c=l+(u<<7&4294967295|u>>>25),u=g+(f^c&(l^f))+p[13]+4254626195&4294967295,g=c+(u<<12&4294967295|u>>>20),u=f+(l^g&(c^l))+p[14]+2792965006&4294967295,f=g+(u<<17&4294967295|u>>>15),u=l+(c^f&(g^c))+p[15]+1236535329&4294967295,l=f+(u<<22&4294967295|u>>>10),u=c+(f^g&(l^f))+p[1]+4129170786&4294967295,c=l+(u<<5&4294967295|u>>>27),u=g+(l^f&(c^l))+p[6]+3225465664&4294967295,g=c+(u<<9&4294967295|u>>>23),u=f+(c^l&(g^c))+p[11]+643717713&4294967295,f=g+(u<<14&4294967295|u>>>18),u=l+(g^c&(f^g))+p[0]+3921069994&4294967295,l=f+(u<<20&4294967295|u>>>12),u=c+(f^g&(l^f))+p[5]+3593408605&4294967295,c=l+(u<<5&4294967295|u>>>27),u=g+(l^f&(c^l))+p[10]+38016083&4294967295,g=c+(u<<9&4294967295|u>>>23),u=f+(c^l&(g^c))+p[15]+3634488961&4294967295,f=g+(u<<14&4294967295|u>>>18),u=l+(g^c&(f^g))+p[4]+3889429448&4294967295,l=f+(u<<20&4294967295|u>>>12),u=c+(f^g&(l^f))+p[9]+568446438&4294967295,c=l+(u<<5&4294967295|u>>>27),u=g+(l^f&(c^l))+p[14]+3275163606&4294967295,g=c+(u<<9&4294967295|u>>>23),u=f+(c^l&(g^c))+p[3]+4107603335&4294967295,f=g+(u<<14&4294967295|u>>>18),u=l+(g^c&(f^g))+p[8]+1163531501&4294967295,l=f+(u<<20&4294967295|u>>>12),u=c+(f^g&(l^f))+p[13]+2850285829&4294967295,c=l+(u<<5&4294967295|u>>>27),u=g+(l^f&(c^l))+p[2]+4243563512&4294967295,g=c+(u<<9&4294967295|u>>>23),u=f+(c^l&(g^c))+p[7]+1735328473&4294967295,f=g+(u<<14&4294967295|u>>>18),u=l+(g^c&(f^g))+p[12]+2368359562&4294967295,l=f+(u<<20&4294967295|u>>>12),u=c+(l^f^g)+p[5]+4294588738&4294967295,c=l+(u<<4&4294967295|u>>>28),u=g+(c^l^f)+p[8]+2272392833&4294967295,g=c+(u<<11&4294967295|u>>>21),u=f+(g^c^l)+p[11]+1839030562&4294967295,f=g+(u<<16&4294967295|u>>>16),u=l+(f^g^c)+p[14]+4259657740&4294967295,l=f+(u<<23&4294967295|u>>>9),u=c+(l^f^g)+p[1]+2763975236&4294967295,c=l+(u<<4&4294967295|u>>>28),u=g+(c^l^f)+p[4]+1272893353&4294967295,g=c+(u<<11&4294967295|u>>>21),u=f+(g^c^l)+p[7]+4139469664&4294967295,f=g+(u<<16&4294967295|u>>>16),u=l+(f^g^c)+p[10]+3200236656&4294967295,l=f+(u<<23&4294967295|u>>>9),u=c+(l^f^g)+p[13]+681279174&4294967295,c=l+(u<<4&4294967295|u>>>28),u=g+(c^l^f)+p[0]+3936430074&4294967295,g=c+(u<<11&4294967295|u>>>21),u=f+(g^c^l)+p[3]+3572445317&4294967295,f=g+(u<<16&4294967295|u>>>16),u=l+(f^g^c)+p[6]+76029189&4294967295,l=f+(u<<23&4294967295|u>>>9),u=c+(l^f^g)+p[9]+3654602809&4294967295,c=l+(u<<4&4294967295|u>>>28),u=g+(c^l^f)+p[12]+3873151461&4294967295,g=c+(u<<11&4294967295|u>>>21),u=f+(g^c^l)+p[15]+530742520&4294967295,f=g+(u<<16&4294967295|u>>>16),u=l+(f^g^c)+p[2]+3299628645&4294967295,l=f+(u<<23&4294967295|u>>>9),u=c+(f^(l|~g))+p[0]+4096336452&4294967295,c=l+(u<<6&4294967295|u>>>26),u=g+(l^(c|~f))+p[7]+1126891415&4294967295,g=c+(u<<10&4294967295|u>>>22),u=f+(c^(g|~l))+p[14]+2878612391&4294967295,f=g+(u<<15&4294967295|u>>>17),u=l+(g^(f|~c))+p[5]+4237533241&4294967295,l=f+(u<<21&4294967295|u>>>11),u=c+(f^(l|~g))+p[12]+1700485571&4294967295,c=l+(u<<6&4294967295|u>>>26),u=g+(l^(c|~f))+p[3]+2399980690&4294967295,g=c+(u<<10&4294967295|u>>>22),u=f+(c^(g|~l))+p[10]+4293915773&4294967295,f=g+(u<<15&4294967295|u>>>17),u=l+(g^(f|~c))+p[1]+2240044497&4294967295,l=f+(u<<21&4294967295|u>>>11),u=c+(f^(l|~g))+p[8]+1873313359&4294967295,c=l+(u<<6&4294967295|u>>>26),u=g+(l^(c|~f))+p[15]+4264355552&4294967295,g=c+(u<<10&4294967295|u>>>22),u=f+(c^(g|~l))+p[6]+2734768916&4294967295,f=g+(u<<15&4294967295|u>>>17),u=l+(g^(f|~c))+p[13]+1309151649&4294967295,l=f+(u<<21&4294967295|u>>>11),u=c+(f^(l|~g))+p[4]+4149444226&4294967295,c=l+(u<<6&4294967295|u>>>26),u=g+(l^(c|~f))+p[11]+3174756917&4294967295,g=c+(u<<10&4294967295|u>>>22),u=f+(c^(g|~l))+p[2]+718787259&4294967295,f=g+(u<<15&4294967295|u>>>17),u=l+(g^(f|~c))+p[9]+3951481745&4294967295,d.g[0]=d.g[0]+c&4294967295,d.g[1]=d.g[1]+(f+(u<<21&4294967295|u>>>11))&4294967295,d.g[2]=d.g[2]+f&4294967295,d.g[3]=d.g[3]+g&4294967295}r.prototype.v=function(d,c){c===void 0&&(c=d.length);const l=c-this.blockSize,p=this.C;let f=this.h,g=0;for(;g<c;){if(f==0)for(;g<=l;)i(this,d,g),g+=this.blockSize;if(typeof d=="string"){for(;g<c;)if(p[f++]=d.charCodeAt(g++),f==this.blockSize){i(this,p),f=0;break}}else for(;g<c;)if(p[f++]=d[g++],f==this.blockSize){i(this,p),f=0;break}}this.h=f,this.o+=c},r.prototype.A=function(){var d=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);d[0]=128;for(var c=1;c<d.length-8;++c)d[c]=0;c=this.o*8;for(var l=d.length-8;l<d.length;++l)d[l]=c&255,c/=256;for(this.v(d),d=Array(16),c=0,l=0;l<4;++l)for(let p=0;p<32;p+=8)d[c++]=this.g[l]>>>p&255;return d};function s(d,c){var l=a;return Object.prototype.hasOwnProperty.call(l,d)?l[d]:l[d]=c(d)}function o(d,c){this.h=c;const l=[];let p=!0;for(let f=d.length-1;f>=0;f--){const g=d[f]|0;p&&g==c||(l[f]=g,p=!1)}this.g=l}var a={};function h(d){return-128<=d&&d<128?s(d,function(c){return new o([c|0],c<0?-1:0)}):new o([d|0],d<0?-1:0)}function m(d){if(isNaN(d)||!isFinite(d))return E;if(d<0)return R(m(-d));const c=[];let l=1;for(let p=0;d>=l;p++)c[p]=d/l|0,l*=4294967296;return new o(c,0)}function _(d,c){if(d.length==0)throw Error("number format error: empty string");if(c=c||10,c<2||36<c)throw Error("radix out of range: "+c);if(d.charAt(0)=="-")return R(_(d.substring(1),c));if(d.indexOf("-")>=0)throw Error('number format error: interior "-" character');const l=m(Math.pow(c,8));let p=E;for(let g=0;g<d.length;g+=8){var f=Math.min(8,d.length-g);const u=parseInt(d.substring(g,g+f),c);f<8?(f=m(Math.pow(c,f)),p=p.j(f).add(m(u))):(p=p.j(l),p=p.add(m(u)))}return p}var E=h(0),I=h(1),b=h(16777216);n=o.prototype,n.m=function(){if(N(this))return-R(this).m();let d=0,c=1;for(let l=0;l<this.g.length;l++){const p=this.i(l);d+=(p>=0?p:4294967296+p)*c,c*=4294967296}return d},n.toString=function(d){if(d=d||10,d<2||36<d)throw Error("radix out of range: "+d);if(A(this))return"0";if(N(this))return"-"+R(this).toString(d);const c=m(Math.pow(d,6));var l=this;let p="";for(;;){const f=J(l,c).g;l=x(l,f.j(c));let g=((l.g.length>0?l.g[0]:l.h)>>>0).toString(d);if(l=f,A(l))return g+p;for(;g.length<6;)g="0"+g;p=g+p}},n.i=function(d){return d<0?0:d<this.g.length?this.g[d]:this.h};function A(d){if(d.h!=0)return!1;for(let c=0;c<d.g.length;c++)if(d.g[c]!=0)return!1;return!0}function N(d){return d.h==-1}n.l=function(d){return d=x(this,d),N(d)?-1:A(d)?0:1};function R(d){const c=d.g.length,l=[];for(let p=0;p<c;p++)l[p]=~d.g[p];return new o(l,~d.h).add(I)}n.abs=function(){return N(this)?R(this):this},n.add=function(d){const c=Math.max(this.g.length,d.g.length),l=[];let p=0;for(let f=0;f<=c;f++){let g=p+(this.i(f)&65535)+(d.i(f)&65535),u=(g>>>16)+(this.i(f)>>>16)+(d.i(f)>>>16);p=u>>>16,g&=65535,u&=65535,l[f]=u<<16|g}return new o(l,l[l.length-1]&-2147483648?-1:0)};function x(d,c){return d.add(R(c))}n.j=function(d){if(A(this)||A(d))return E;if(N(this))return N(d)?R(this).j(R(d)):R(R(this).j(d));if(N(d))return R(this.j(R(d)));if(this.l(b)<0&&d.l(b)<0)return m(this.m()*d.m());const c=this.g.length+d.g.length,l=[];for(var p=0;p<2*c;p++)l[p]=0;for(p=0;p<this.g.length;p++)for(let f=0;f<d.g.length;f++){const g=this.i(p)>>>16,u=this.i(p)&65535,be=d.i(f)>>>16,_r=d.i(f)&65535;l[2*p+2*f]+=u*_r,z(l,2*p+2*f),l[2*p+2*f+1]+=g*_r,z(l,2*p+2*f+1),l[2*p+2*f+1]+=u*be,z(l,2*p+2*f+1),l[2*p+2*f+2]+=g*be,z(l,2*p+2*f+2)}for(d=0;d<c;d++)l[d]=l[2*d+1]<<16|l[2*d];for(d=c;d<2*c;d++)l[d]=0;return new o(l,0)};function z(d,c){for(;(d[c]&65535)!=d[c];)d[c+1]+=d[c]>>>16,d[c]&=65535,c++}function $(d,c){this.g=d,this.h=c}function J(d,c){if(A(c))throw Error("division by zero");if(A(d))return new $(E,E);if(N(d))return c=J(R(d),c),new $(R(c.g),R(c.h));if(N(c))return c=J(d,R(c)),new $(R(c.g),c.h);if(d.g.length>30){if(N(d)||N(c))throw Error("slowDivide_ only works with positive integers.");for(var l=I,p=c;p.l(d)<=0;)l=gr(l),p=gr(p);var f=Ue(l,1),g=Ue(p,1);for(p=Ue(p,2),l=Ue(l,2);!A(p);){var u=g.add(p);u.l(d)<=0&&(f=f.add(l),g=u),p=Ue(p,1),l=Ue(l,1)}return c=x(d,f.j(c)),new $(f,c)}for(f=E;d.l(c)>=0;){for(l=Math.max(1,Math.floor(d.m()/c.m())),p=Math.ceil(Math.log(l)/Math.LN2),p=p<=48?1:Math.pow(2,p-48),g=m(l),u=g.j(c);N(u)||u.l(d)>0;)l-=p,g=m(l),u=g.j(c);A(g)&&(g=I),f=f.add(g),d=x(d,u)}return new $(f,d)}n.B=function(d){return J(this,d).h},n.and=function(d){const c=Math.max(this.g.length,d.g.length),l=[];for(let p=0;p<c;p++)l[p]=this.i(p)&d.i(p);return new o(l,this.h&d.h)},n.or=function(d){const c=Math.max(this.g.length,d.g.length),l=[];for(let p=0;p<c;p++)l[p]=this.i(p)|d.i(p);return new o(l,this.h|d.h)},n.xor=function(d){const c=Math.max(this.g.length,d.g.length),l=[];for(let p=0;p<c;p++)l[p]=this.i(p)^d.i(p);return new o(l,this.h^d.h)};function gr(d){const c=d.g.length+1,l=[];for(let p=0;p<c;p++)l[p]=d.i(p)<<1|d.i(p-1)>>>31;return new o(l,d.h)}function Ue(d,c){const l=c>>5;c%=32;const p=d.g.length-l,f=[];for(let g=0;g<p;g++)f[g]=c>0?d.i(g+l)>>>c|d.i(g+l+1)<<32-c:d.i(g+l);return new o(f,d.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=m,o.fromString=_,cs=o}).apply(typeof Gr<"u"?Gr:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}j.UNAUTHENTICATED=new j(null),j.GOOGLE_CREDENTIALS=new j("google-credentials-uid"),j.FIRST_PARTY=new j("first-party-uid"),j.MOCK_USER=new j("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ke="12.10.0";function Mu(n){Ke=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qe=new Dn("@firebase/firestore");function De(n,...e){if(qe.logLevel<=S.DEBUG){const t=e.map(zn);qe.debug(`Firestore (${Ke}): ${n}`,...t)}}function Qt(n,...e){if(qe.logLevel<=S.ERROR){const t=e.map(zn);qe.error(`Firestore (${Ke}): ${n}`,...t)}}function us(n,...e){if(qe.logLevel<=S.WARN){const t=e.map(zn);qe.warn(`Firestore (${Ke}): ${n}`,...t)}}function zn(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function P(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,ls(n,r,t)}function ls(n,e,t){let r=`FIRESTORE (${Ke}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw Qt(r),new Error(r)}function G(n,e,t,r){let i="Unexpected state";typeof t=="string"?i=t:r=t,n||ls(e,i,r)}function Ve(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const y={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class w extends pe{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hs{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Uu{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(j.UNAUTHENTICATED)))}shutdown(){}}class Fu{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class xu{constructor(e){this.auth=null,e.onInit((t=>{this.auth=t}))}getToken(){return this.auth?this.auth.getToken().then((e=>e?(G(typeof e.accessToken=="string",42297,{t:e}),new hs(e.accessToken,new j(this.auth.getUid()))):null)):Promise.resolve(null)}invalidateToken(){}start(e,t){}shutdown(){}}class $u{constructor(e,t,r){this.i=e,this.o=t,this.u=r,this.type="FirstParty",this.user=j.FIRST_PARTY,this.l=new Map}h(){return this.u?this.u():null}get headers(){this.l.set("X-Goog-AuthUser",this.i);const e=this.h();return e&&this.l.set("Authorization",e),this.o&&this.l.set("X-Goog-Iam-Authorization-Token",this.o),this.l}}class Bu{constructor(e,t,r){this.i=e,this.o=t,this.u=r}getToken(){return Promise.resolve(new $u(this.i,this.o,this.u))}start(e,t){e.enqueueRetryable((()=>t(j.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Wr{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class ju{constructor(e,t){this.m=t,this.appCheck=null,this.P=null,Q(e)&&e.settings.appCheckToken&&(this.P=e.settings.appCheckToken),t.onInit((r=>{this.appCheck=r}))}getToken(){return this.P?Promise.resolve(new Wr(this.P)):this.appCheck?this.appCheck.getToken().then((e=>e?(G(typeof e.token=="string",3470,{tokenResult:e}),new Wr(e.token)):null)):Promise.resolve(null)}invalidateToken(){}start(e,t){}shutdown(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qu{constructor(e,t,r,i,s,o,a,h,m,_,E){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=a,this.longPollingOptions=h,this.useFetchStreams=m,this.isUsingEmulator=_,this.apiKey=E}}const vn="(default)";class ot{constructor(e,t){this.projectId=e,this.database=t||vn}static empty(){return new ot("","")}get isDefaultDatabase(){return this.database===vn}isEqual(e){return e instanceof ot&&e.projectId===this.projectId&&e.database===this.database}}function Hu(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new w(y.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ot(n.options.projectId,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zu(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gu{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const i=zu(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<t&&(r+=e.charAt(i[s]%62))}return r}}function D(n,e){return n<e?-1:n>e?1:0}function bn(n,e){const t=Math.min(n.length,e.length);for(let r=0;r<t;r++){const i=n.charAt(r),s=e.charAt(r);if(i!==s)return hn(i)===hn(s)?D(i,s):hn(i)?1:-1}return D(n.length,e.length)}const Wu=55296,Ku=57343;function hn(n){const e=n.charCodeAt(0);return e>=Wu&&e<=Ku}function ds(n,e,t){return n.length===e.length&&n.every(((r,i)=>t(r,e[i])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kr="__name__";class re{constructor(e,t,r){t===void 0?t=0:t>e.length&&P(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&P(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return re.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof re?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let i=0;i<r;i++){const s=re.compareSegments(e.get(i),t.get(i));if(s!==0)return s}return D(e.length,t.length)}static compareSegments(e,t){const r=re.isNumericId(e),i=re.isNumericId(t);return r&&!i?-1:!r&&i?1:r&&i?re.extractNumericId(e).compare(re.extractNumericId(t)):bn(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return cs.fromString(e.substring(4,e.length-2))}}class k extends re{construct(e,t,r){return new k(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new w(y.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((i=>i.length>0)))}return new k(t)}static emptyPath(){return new k([])}}const Ju=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class q extends re{construct(e,t,r){return new q(e,t,r)}static isValidIdentifier(e){return Ju.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),q.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Kr}static keyField(){return new q([Kr])}static fromServerFormat(e){const t=[];let r="",i=0;const s=()=>{if(r.length===0)throw new w(y.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let o=!1;for(;i<e.length;){const a=e[i];if(a==="\\"){if(i+1===e.length)throw new w(y.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const h=e[i+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new w(y.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=h,i+=2}else a==="`"?(o=!o,i++):a!=="."||o?(r+=a,i++):(s(),i++)}if(s(),o)throw new w(y.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new q(t)}static emptyPath(){return new q([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(e){this.path=e}static fromPath(e){return new M(k.fromString(e))}static fromName(e){return new M(k.fromString(e).popFirst(5))}static empty(){return new M(k.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&k.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return k.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new M(new k(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fs(n,e,t){if(!t)throw new w(y.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Jr(n){if(!M.isDocumentKey(n))throw new w(y.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Qr(n){if(M.isDocumentKey(n))throw new w(y.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function ps(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Yt(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":P(12329,{type:typeof n})}function Je(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new w(y.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Yt(n);throw new w(y.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function Qu(n,e){if(e<=0)throw new w(y.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ms(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let At=null;function Yu(){return At===null?At=(function(){return 268435456+Math.round(2147483648*Math.random())})():At++,"0x"+At.toString(16)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gs(n){return n==null}function xt(n){return n===0&&1/n==-1/0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dn="RestConnection",Xu={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class Zu{get T(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.R=t+"://"+e.host,this.V=`projects/${r}/databases/${i}`,this.A=this.databaseId.database===vn?`project_id=${r}`:`project_id=${r}&database_id=${i}`}I(e,t,r,i,s){const o=Yu(),a=this.p(e,t.toUriEncodedString());De(dn,`Sending RPC '${e}' ${o}:`,a,r);const h={"google-cloud-resource-prefix":this.V,"x-goog-request-params":this.A};this.F(h,i,s);const{host:m}=new URL(a),_=ze(m);return this.v(e,a,h,r,_).then((E=>(De(dn,`Received RPC '${e}' ${o}: `,E),E)),(E=>{throw us(dn,`RPC '${e}' ${o} failed with error: `,E,"url: ",a,"request:",r),E}))}D(e,t,r,i,s,o){return this.I(e,t,r,i,s)}F(e,t,r){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Ke})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((i,s)=>e[s]=i)),r&&r.headers.forEach(((i,s)=>e[s]=i))}p(e,t){const r=Xu[e];let i=`${this.R}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(i=`${i}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),i}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Yr,v;function el(n){switch(n){case y.OK:return P(64938);case y.CANCELLED:case y.UNKNOWN:case y.DEADLINE_EXCEEDED:case y.RESOURCE_EXHAUSTED:case y.INTERNAL:case y.UNAVAILABLE:case y.UNAUTHENTICATED:return!1;case y.INVALID_ARGUMENT:case y.NOT_FOUND:case y.ALREADY_EXISTS:case y.PERMISSION_DENIED:case y.FAILED_PRECONDITION:case y.ABORTED:case y.OUT_OF_RANGE:case y.UNIMPLEMENTED:case y.DATA_LOSS:return!0;default:return P(15467,{code:n})}}function Xr(n){if(n===void 0)return Qt("RPC_ERROR","HTTP error has no status"),y.UNKNOWN;switch(n){case 200:return y.OK;case 400:return y.FAILED_PRECONDITION;case 401:return y.UNAUTHENTICATED;case 403:return y.PERMISSION_DENIED;case 404:return y.NOT_FOUND;case 409:return y.ABORTED;case 416:return y.OUT_OF_RANGE;case 429:return y.RESOURCE_EXHAUSTED;case 499:return y.CANCELLED;case 500:return y.UNKNOWN;case 501:return y.UNIMPLEMENTED;case 503:return y.UNAVAILABLE;case 504:return y.DEADLINE_EXCEEDED;default:return n>=200&&n<300?y.OK:n>=400&&n<500?y.FAILED_PRECONDITION:n>=500&&n<600?y.INTERNAL:y.UNKNOWN}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(v=Yr||(Yr={}))[v.OK=0]="OK",v[v.CANCELLED=1]="CANCELLED",v[v.UNKNOWN=2]="UNKNOWN",v[v.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",v[v.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",v[v.NOT_FOUND=5]="NOT_FOUND",v[v.ALREADY_EXISTS=6]="ALREADY_EXISTS",v[v.PERMISSION_DENIED=7]="PERMISSION_DENIED",v[v.UNAUTHENTICATED=16]="UNAUTHENTICATED",v[v.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",v[v.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",v[v.ABORTED=10]="ABORTED",v[v.OUT_OF_RANGE=11]="OUT_OF_RANGE",v[v.UNIMPLEMENTED=12]="UNIMPLEMENTED",v[v.INTERNAL=13]="INTERNAL",v[v.UNAVAILABLE=14]="UNAVAILABLE",v[v.DATA_LOSS=15]="DATA_LOSS";class tl extends Zu{S(e,t){throw new Error("Not supported by FetchConnection")}async v(e,t,r,i,s){const o=JSON.stringify(i);let a;try{const h={method:"POST",headers:r,body:o};s&&(h.credentials="include"),a=await fetch(t,h)}catch(h){const m=h;throw new w(Xr(m.status),"Request failed with error: "+m.statusText)}if(!a.ok){let h=await a.json();Array.isArray(h)&&(h=h[0]);const m=h?.error?.message;throw new w(Xr(a.status),`Request failed with error: ${m??a.statusText}`)}return a.json()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zr(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function gt(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function nl(n,e){const t=[];for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.push(e(n[r],r,n));return t}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new rl("Invalid base64 string: "+s):s}})(e);return new fe(t)}static fromUint8Array(e){const t=(function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s})(e);return new fe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let i=0;i<t.length;i++)r[i]=t.charCodeAt(i);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return D(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}fe.EMPTY_BYTE_STRING=new fe("");const il=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function Oe(n){if(G(!!n,39018),typeof n=="string"){let e=0;const t=il.exec(n);if(G(!!t,46558,{timestamp:n}),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:V(n.seconds),nanos:V(n.nanos)}}function V(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function at(n){return typeof n=="string"?fe.fromBase64String(n):fe.fromUint8Array(n)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function K(n,e){const t={typeString:n};return e&&(t.value=e),t}function _t(n,e){if(!ps(n))throw new w(y.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const i=e[r].typeString,s="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const o=n[r];if(i&&typeof o!==i){t=`JSON field '${r}' must be a ${i}.`;break}if(s!==void 0&&o!==s.value){t=`Expected '${r}' field to equal '${s.value}'`;break}}if(t)throw new w(y.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ei=-62135596800,ti=1e6;class L{static now(){return L.fromMillis(Date.now())}static fromDate(e){return L.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*ti);return new L(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new w(y.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new w(y.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<ei)throw new w(y.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new w(y.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/ti}_compareTo(e){return this.seconds===e.seconds?D(this.nanoseconds,e.nanoseconds):D(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:L._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(_t(e,L._jsonSchema))return new L(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-ei;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}L._jsonSchemaVersion="firestore/timestamp/1.0",L._jsonSchema={type:K("string",L._jsonSchemaVersion),seconds:K("number"),nanoseconds:K("number")};function _s(n){return(n?.mapValue?.fields||{}).__type__?.stringValue==="server_timestamp"}function ys(n){const e=n.mapValue.fields.__previous_value__;return _s(e)?ys(e):e}function ct(n){const e=Oe(n.mapValue.fields.__local_write_time__.timestampValue);return new L(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Is="__type__",sl="__max__",vt={},Es="__vector__",$t="value";function Le(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?_s(n)?4:(function(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue===sl})(n)?9007199254740991:(function(t){return(t?.mapValue?.fields||{})[Is]?.stringValue===Es})(n)?10:11:P(28295,{value:n})}function Bt(n,e){if(n===e)return!0;const t=Le(n);if(t!==Le(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return ct(n).isEqual(ct(e));case 3:return(function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=Oe(i.timestampValue),a=Oe(s.timestampValue);return o.seconds===a.seconds&&o.nanos===a.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(i,s){return at(i.bytesValue).isEqual(at(s.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(i,s){return V(i.geoPointValue.latitude)===V(s.geoPointValue.latitude)&&V(i.geoPointValue.longitude)===V(s.geoPointValue.longitude)})(n,e);case 2:return(function(i,s){if("integerValue"in i&&"integerValue"in s)return V(i.integerValue)===V(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=V(i.doubleValue),a=V(s.doubleValue);return o===a?xt(o)===xt(a):isNaN(o)&&isNaN(a)}return!1})(n,e);case 9:return ds(n.arrayValue.values||[],e.arrayValue.values||[],Bt);case 10:case 11:return(function(i,s){const o=i.mapValue.fields||{},a=s.mapValue.fields||{};if(Zr(o)!==Zr(a))return!1;for(const h in o)if(o.hasOwnProperty(h)&&(a[h]===void 0||!Bt(o[h],a[h])))return!1;return!0})(n,e);default:return P(52216,{left:n})}}function ut(n,e){return(n.values||[]).find((t=>Bt(t,e)))!==void 0}function jt(n,e){if(n===e)return 0;const t=Le(n),r=Le(e);if(t!==r)return D(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return D(n.booleanValue,e.booleanValue);case 2:return(function(s,o){const a=V(s.integerValue||s.doubleValue),h=V(o.integerValue||o.doubleValue);return a<h?-1:a>h?1:a===h?0:isNaN(a)?isNaN(h)?0:-1:1})(n,e);case 3:return ni(n.timestampValue,e.timestampValue);case 4:return ni(ct(n),ct(e));case 5:return bn(n.stringValue,e.stringValue);case 6:return(function(s,o){const a=at(s),h=at(o);return a.compareTo(h)})(n.bytesValue,e.bytesValue);case 7:return(function(s,o){const a=s.split("/"),h=o.split("/");for(let m=0;m<a.length&&m<h.length;m++){const _=D(a[m],h[m]);if(_!==0)return _}return D(a.length,h.length)})(n.referenceValue,e.referenceValue);case 8:return(function(s,o){const a=D(V(s.latitude),V(o.latitude));return a!==0?a:D(V(s.longitude),V(o.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return ri(n.arrayValue,e.arrayValue);case 10:return(function(s,o){const a=s.fields||{},h=o.fields||{},m=a[$t]?.arrayValue,_=h[$t]?.arrayValue,E=D(m?.values?.length||0,_?.values?.length||0);return E!==0?E:ri(m,_)})(n.mapValue,e.mapValue);case 11:return(function(s,o){if(s===vt&&o===vt)return 0;if(s===vt)return 1;if(o===vt)return-1;const a=s.fields||{},h=Object.keys(a),m=o.fields||{},_=Object.keys(m);h.sort(),_.sort();for(let E=0;E<h.length&&E<_.length;++E){const I=bn(h[E],_[E]);if(I!==0)return I;const b=jt(a[h[E]],m[_[E]]);if(b!==0)return b}return D(h.length,_.length)})(n.mapValue,e.mapValue);default:throw P(23264,{C:t})}}function ni(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return D(n,e);const t=Oe(n),r=Oe(e),i=D(t.seconds,r.seconds);return i!==0?i:D(t.nanos,r.nanos)}function ri(n,e){const t=n.values||[],r=e.values||[];for(let i=0;i<t.length&&i<r.length;++i){const s=jt(t[i],r[i]);if(s)return s}return D(t.length,r.length)}function ii(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function ws(n){return!!n&&"arrayValue"in n}function si(n){return!!n&&"nullValue"in n}function oi(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function fn(n){return!!n&&"mapValue"in n}function Ze(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const e={mapValue:{fields:{}}};return gt(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=Ze(r))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ze(n.arrayValue.values[t]);return e}return{...n}}class ai{constructor(e,t){this.position=e,this.inclusive=t}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts{}class ne extends Ts{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new ol(e,t,r):t==="array-contains"?new ul(e,r):t==="in"?new ll(e,r):t==="not-in"?new hl(e,r):t==="array-contains-any"?new dl(e,r):new ne(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new al(e,r):new cl(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(jt(t,this.value)):t!==null&&Le(this.value)===Le(t)&&this.matchesComparison(jt(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return P(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class yt extends Ts{constructor(e,t){super(),this.filters=e,this.op=t,this.N=null}static create(e,t){return new yt(e,t)}matches(e){return(function(r){return r.op==="and"})(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.N!==null||(this.N=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.N}getFilters(){return Object.assign([],this.filters)}}class ol extends ne{constructor(e,t,r){super(e,t,r),this.key=M.fromName(r.referenceValue)}matches(e){const t=M.comparator(e.key,this.key);return this.matchesComparison(t)}}class al extends ne{constructor(e,t){super(e,"in",t),this.keys=As("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class cl extends ne{constructor(e,t){super(e,"not-in",t),this.keys=As("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function As(n,e){return(e.arrayValue?.values||[]).map((t=>M.fromName(t.referenceValue)))}class ul extends ne{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return ws(t)&&ut(t.arrayValue,this.value)}}class ll extends ne{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&ut(this.value.arrayValue,t)}}class hl extends ne{constructor(e,t){super(e,"not-in",t)}matches(e){if(ut(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!ut(this.value.arrayValue,t)}}class dl extends ne{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!ws(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>ut(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qt{constructor(e,t="asc"){this.field=e,this.dir=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C{static fromTimestamp(e){return new C(e)}static min(){return new C(new L(0,0))}static max(){return new C(new L(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ht{constructor(e,t){this.comparator=e,this.root=t||U.EMPTY}insert(e,t){return new Ht(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,U.BLACK,null,null))}remove(e){return new Ht(this.comparator,this.root.remove(e,this.comparator).copy(null,null,U.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return t+r.left.size;i<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){const e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new bt(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new bt(this.root,e,this.comparator,!1)}getReverseIterator(){return new bt(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new bt(this.root,e,this.comparator,!0)}}class bt{constructor(e,t,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?r(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class U{constructor(e,t,r,i,s){this.key=e,this.value=t,this.color=r??U.RED,this.left=i??U.EMPTY,this.right=s??U.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,i,s){return new U(e??this.key,t??this.value,r??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,r),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return U.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return U.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,U.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,U.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw P(43730,{key:this.key,value:this.value});if(this.right.isRed())throw P(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw P(27949);return e+(this.isRed()?0:1)}}U.EMPTY=null,U.RED=!0,U.BLACK=!1;U.EMPTY=new class{constructor(){this.size=0}get key(){throw P(57766)}get value(){throw P(16141)}get color(){throw P(16727)}get left(){throw P(29726)}get right(){throw P(36894)}copy(e,t,r,i,s){return this}insert(e,t,r){return new U(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lt{constructor(e){this.comparator=e,this.data=new Ht(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new ci(this.data.getIterator())}getIteratorFrom(e){return new ci(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof lt)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new lt(this.comparator);return t.data=e,t}}class ci{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Me{constructor(e){this.fields=e,e.sort(q.comparator)}static empty(){return new Me([])}unionWith(e){let t=new lt(q.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new Me(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return ds(this.fields,e.fields,((t,r)=>t.isEqual(r)))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H{constructor(e){this.value=e}static empty(){return new H({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!fn(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ze(t)}setAll(e){let t=q.emptyPath(),r={},i=[];e.forEach(((o,a)=>{if(!t.isImmediateParentOf(a)){const h=this.getFieldsMap(t);this.applyChanges(h,r,i),r={},i=[],t=a.popLast()}o?r[a.lastSegment()]=Ze(o):i.push(a.lastSegment())}));const s=this.getFieldsMap(t);this.applyChanges(s,r,i)}delete(e){const t=this.field(e.popLast());fn(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Bt(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=t.mapValue.fields[e.get(r)];fn(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,r){gt(t,((i,s)=>e[i]=s));for(const i of r)delete e[i]}clone(){return new H(Ze(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ie{constructor(e,t,r,i,s,o,a){this.key=e,this.documentType=t,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=a}static newInvalidDocument(e){return new ie(e,0,C.min(),C.min(),C.min(),H.empty(),0)}static newFoundDocument(e,t,r,i){return new ie(e,1,t,C.min(),r,i,0)}static newNoDocument(e,t){return new ie(e,2,t,C.min(),C.min(),H.empty(),0)}static newUnknownDocument(e,t){return new ie(e,3,t,C.min(),C.min(),H.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(C.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=H.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=H.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=C.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof ie&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ie(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fl{constructor(e,t=null,r=[],i=[],s=null,o=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=a,this.O=null}}function ui(n,e=null,t=[],r=[],i=null,s=null,o=null){return new fl(n,e,t,r,i,s,o)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xt{constructor(e,t=null,r=[],i=[],s=null,o="F",a=null,h=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=a,this.endAt=h,this.q=null,this.L=null,this.B=null,this.startAt,this.endAt}}function pl(n){return n.collectionGroup!==null}function ml(n){const e=Ve(n);if(e.q===null){e.q=[];const t=new Set;for(const s of e.explicitOrderBy)e.q.push(s),t.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let a=new lt(q.comparator);return o.filters.forEach((h=>{h.getFlattenedFilters().forEach((m=>{m.isInequality()&&(a=a.add(m.field))}))})),a})(e).forEach((s=>{t.has(s.canonicalString())||s.isKeyField()||e.q.push(new qt(s,r))})),t.has(q.keyField().canonicalString())||e.q.push(new qt(q.keyField(),r))}return e.q}function gl(n){const e=Ve(n);return e.L||(e.L=vs(e,ml(n))),e.L}function vs(n,e){if(n.limitType==="F")return ui(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((i=>{const s=i.dir==="desc"?"asc":"desc";return new qt(i.field,s)}));const t=n.endAt?new ai(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new ai(n.startAt.position,n.startAt.inclusive):null;return ui(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Sn(n,e){const t=n.filters.concat([e]);return new Xt(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bs(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:xt(e)?"-0":e}}function _l(n,e){return(function(r){return typeof r=="number"&&Number.isInteger(r)&&!xt(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER})(e)?(function(r){return{integerValue:""+r}})(e):bs(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zt{constructor(){this._=void 0}}class yl extends Zt{}class Il extends Zt{constructor(e){super(),this.elements=e}}class El extends Zt{constructor(e){super(),this.elements=e}}class wl extends Zt{constructor(e,t){super(),this.serializer=e,this.$=t}}class Y{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new Y}static exists(e){return new Y(void 0,e)}static updateTime(e){return new Y(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}class en{}class Ss extends en{constructor(e,t,r,i=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Gn extends en{constructor(e,t,r,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}class Wn extends en{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Rs extends en{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tl={asc:"ASCENDING",desc:"DESCENDING"},Al={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},vl={and:"AND",or:"OR"};class bl{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Rn(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Sl(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function Rl(n,e){return Rn(n,e.toTimestamp())}function et(n){return G(!!n,49232),C.fromTimestamp((function(t){const r=Oe(t);return new L(r.seconds,r.nanos)})(n))}function Kn(n,e){return Pn(n,e).canonicalString()}function Pn(n,e){const t=(function(i){return new k(["projects",i.projectId,"databases",i.database])})(n).child("documents");return e===void 0?t:t.child(e)}function zt(n,e){return Kn(n.databaseId,e.path)}function Nn(n,e){const t=(function(i){const s=k.fromString(i);return G(ks(s),10190,{key:s.toString()}),s})(e);if(t.get(1)!==n.databaseId.projectId)throw new w(y.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new w(y.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new M((function(i){return G(i.length>4&&i.get(4)==="documents",29091,{key:i.toString()}),i.popFirst(5)})(t))}function li(n,e,t){return{name:zt(n,e),fields:t.value.mapValue.fields}}function Pl(n,e){return"found"in e?(function(r,i){G(!!i.found,43571),i.found.name,i.found.updateTime;const s=Nn(r,i.found.name),o=et(i.found.updateTime),a=i.found.createTime?et(i.found.createTime):C.min(),h=new H({mapValue:{fields:i.found.fields}});return ie.newFoundDocument(s,o,a,h)})(n,e):"missing"in e?(function(r,i){G(!!i.missing,3894),G(!!i.readTime,22933);const s=Nn(r,i.missing),o=et(i.readTime);return ie.newNoDocument(s,o)})(n,e):P(7234,{result:e})}function Nl(n,e){let t;if(e instanceof Ss)t={update:li(n,e.key,e.value)};else if(e instanceof Wn)t={delete:zt(n,e.key)};else if(e instanceof Gn)t={update:li(n,e.key,e.data),updateMask:Vl(e.fieldMask)};else{if(!(e instanceof Rs))return P(16599,{U:e.type});t={verify:zt(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(s,o){const a=o.transform;if(a instanceof yl)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(a instanceof Il)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:a.elements}};if(a instanceof El)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:a.elements}};if(a instanceof wl)return{fieldPath:o.field.canonicalString(),increment:a.$};throw P(20930,{transform:o.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(i,s){return s.updateTime!==void 0?{updateTime:Rl(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:P(27497)})(n,e.precondition)),t}function Ps(n,e){const t={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=(function(m,_){return Kn(m.databaseId,_)})(n,i);const s=(function(m){if(m.length!==0)return Ns(yt.create(m,"and"))})(e.filters);s&&(t.structuredQuery.where=s);const o=(function(m){if(m.length!==0)return m.map((_=>(function(I){return{field:Ie(I.field),direction:kl(I.dir)}})(_)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const a=(function(m,_){return m.useProto3Json||gs(_)?_:{value:_}})(n,e.limit);return a!==null&&(t.structuredQuery.limit=a),e.startAt&&(t.structuredQuery.startAt=(function(m){return{before:m.inclusive,values:m.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(m){return{before:!m.inclusive,values:m.position}})(e.endAt)),{M:t,parent:i}}function kl(n){return Tl[n]}function Cl(n){return Al[n]}function Dl(n){return vl[n]}function Ie(n){return{fieldPath:n.canonicalString()}}function Ns(n){return n instanceof ne?(function(t){if(t.op==="=="){if(oi(t.value))return{unaryFilter:{field:Ie(t.field),op:"IS_NAN"}};if(si(t.value))return{unaryFilter:{field:Ie(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(oi(t.value))return{unaryFilter:{field:Ie(t.field),op:"IS_NOT_NAN"}};if(si(t.value))return{unaryFilter:{field:Ie(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Ie(t.field),op:Cl(t.op),value:t.value}}})(n):n instanceof yt?(function(t){const r=t.getFilters().map((i=>Ns(i)));return r.length===1?r[0]:{compositeFilter:{op:Dl(t.op),filters:r}}})(n):P(54877,{filter:n})}function Vl(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function ks(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function Cs(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jn(n){return new bl(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ol{}class Ll extends Ol{constructor(e,t,r,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=i,this.k=!1}j(){if(this.k)throw new w(y.FAILED_PRECONDITION,"The client has already been terminated.")}I(e,t,r,i){return this.j(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([s,o])=>this.connection.I(e,Pn(t,r),i,s,o))).catch((s=>{throw s.name==="FirebaseError"?(s.code===y.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new w(y.UNKNOWN,s.toString())}))}D(e,t,r,i,s){return this.j(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,a])=>this.connection.D(e,Pn(t,r),i,o,a,s))).catch((o=>{throw o.name==="FirebaseError"?(o.code===y.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new w(y.UNKNOWN,o.toString())}))}terminate(){this.k=!0,this.connection.terminate()}}async function Qn(n,e){const t=Ve(n),r={writes:e.map((i=>Nl(t.serializer,i)))};await t.I("Commit",t.serializer.databaseId,k.emptyPath(),r)}async function Ml(n,e){const t=Ve(n),r={documents:e.map((a=>zt(t.serializer,a)))},i=await t.D("BatchGetDocuments",t.serializer.databaseId,k.emptyPath(),r,e.length),s=new Map;i.forEach((a=>{const h=Pl(t.serializer,a);s.set(h.key.toString(),h)}));const o=[];return e.forEach((a=>{const h=s.get(a.toString());G(!!h,55234,{key:a}),o.push(h)})),o}async function Ul(n,e){const t=Ve(n),{M:r,parent:i}=Ps(t.serializer,gl(e));return(await t.D("RunQuery",t.serializer.databaseId,i,{structuredQuery:r.structuredQuery})).filter((s=>!!s.document)).map((s=>(function(a,h,m){const _=Nn(a,h.name),E=et(h.updateTime),I=h.createTime?et(h.createTime):C.min(),b=new H({mapValue:{fields:h.fields}}),A=ie.newFoundDocument(_,E,I,b);return m?A.setHasCommittedMutations():A})(t.serializer,s.document,void 0)))}async function Fl(n,e,t){const r=Ve(n),{request:i,K:s,parent:o}=(function(_,E,I,b){const{M:A,parent:N}=Ps(_,E),R={},x=[];let z=0;return I.forEach(($=>{const J="aggregate_"+z++;R[J]=$.alias,$.aggregateType==="count"?x.push({alias:J,count:{}}):$.aggregateType==="avg"?x.push({alias:J,avg:{field:Ie($.fieldPath)}}):$.aggregateType==="sum"&&x.push({alias:J,sum:{field:Ie($.fieldPath)}})})),{request:{structuredAggregationQuery:{aggregations:x,structuredQuery:A.structuredQuery},parent:A.parent},K:R,parent:N}})(r.serializer,(function(_){const E=Ve(_);return E.B||(E.B=vs(E,_.explicitOrderBy)),E.B})(e),t);r.connection.T||delete i.parent;const a=(await r.D("RunAggregationQuery",r.serializer.databaseId,o,i,1)).filter((m=>!!m.result));G(a.length===1,64727);const h=a[0].result?.aggregateFields;return Object.keys(h).reduce(((m,_)=>(m[s[_]]=h[_],m)),{})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ds="ComponentProvider",tt=new Map;function It(n){if(n._terminated)throw new w(y.FAILED_PRECONDITION,"The client has already been terminated.");if(!tt.has(n)){De(Ds,"Initializing Datastore");const e=(function(s){return new tl(s)})((function(s,o,a,h,m){return new qu(s,o,a,m.host,m.ssl,m.experimentalForceLongPolling,m.experimentalAutoDetectLongPolling,ms(m.experimentalLongPollingOptions),m.useFetchStreams,m.isUsingEmulator,h)})(n._databaseId,n.app.options.appId||"",n._persistenceKey,n.app.options.apiKey,n._freezeSettings())),t=Jn(n._databaseId),r=(function(s,o,a,h){return new Ll(s,o,a,h)})(n._authCredentials,n._appCheckCredentials,e,t);tt.set(n,r)}return tt.get(n)}const xl=1048576,Vs="firestore.googleapis.com",hi=!0;class di{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new w(y.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Vs,this.ssl=hi}else this.host=e.host,this.ssl=e.ssl??hi;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<xl)throw new w(y.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(r,i,s,o){if(i===!0&&o===!0)throw new w(y.INVALID_ARGUMENT,`${r} and ${s} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=ms(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new w(y.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new w(y.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new w(y.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,i){return r.timeoutSeconds===i.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Qe{constructor(e,t,r,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new di({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new w(y.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new w(y.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new di(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new Uu;switch(r.type){case"firstParty":return new Bu(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new w(y.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=tt.get(t);r&&(De(Ds,"Removing Datastore"),tt.delete(t),r.terminate())})(this),Promise.resolve()}}function $l(n,e){const t=typeof n=="object"?n:Ni(),r=typeof n=="string"?n:"(default)",i=On(t,"firestore/lite").getImmediate({identifier:r});if(!i._initialized){const s=oo("firestore");s&&Bl(i,...s)}return i}function Bl(n,e,t,r={}){n=Je(n,Qe);const i=ze(e),s=n._getSettings(),o={...s,emulatorOptions:n._getEmulatorOptions()},a=`${e}:${t}`;i&&(vi(`https://${a}`),bi("Firestore",!0)),s.host!==Vs&&s.host!==a&&us("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const h={...s,host:a,ssl:i,emulatorOptions:r};if(!Ne(h,o)&&(n._setSettings(h),r.mockUserToken)){let m,_;if(typeof r.mockUserToken=="string")m=r.mockUserToken,_=j.MOCK_USER;else{m=co(r.mockUserToken,n._app?.options.projectId);const E=r.mockUserToken.sub||r.mockUserToken.user_id;if(!E)throw new w(y.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");_=new j(E)}n._authCredentials=new Fu(new hs(m,_))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ve{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new ve(this.firestore,e,this._query)}}class O{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Ae(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new O(this.firestore,e,this._key)}toJSON(){return{type:O._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(_t(t,O._jsonSchema))return new O(e,r||null,new M(k.fromString(t.referencePath)))}}O._jsonSchemaVersion="firestore/documentReference/1.0",O._jsonSchema={type:K("string",O._jsonSchemaVersion),referencePath:K("string")};class Ae extends ve{constructor(e,t,r){super(e,t,(function(s){return new Xt(s)})(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new O(this.firestore,null,new M(e))}withConverter(e){return new Ae(this.firestore,e,this._path)}}function Os(n,e,...t){if(n=F(n),fs("collection","path",e),n instanceof Qe){const r=k.fromString(e,...t);return Qr(r),new Ae(n,null,r)}{if(!(n instanceof O||n instanceof Ae))throw new w(y.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(k.fromString(e,...t));return Qr(r),new Ae(n.firestore,null,r)}}function Yn(n,e,...t){if(n=F(n),arguments.length===1&&(e=Gu.newId()),fs("doc","path",e),n instanceof Qe){const r=k.fromString(e,...t);return Jr(r),new O(n,null,new M(r))}{if(!(n instanceof O||n instanceof Ae))throw new w(y.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(k.fromString(e,...t));return Jr(r),new O(n.firestore,n instanceof Ae?n.converter:null,new M(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e){this._byteString=e}static fromBase64String(e){try{return new W(fe.fromBase64String(e))}catch(t){throw new w(y.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new W(fe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:W._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(_t(e,W._jsonSchema))return W.fromBase64String(e.bytes)}}W._jsonSchemaVersion="firestore/bytes/1.0",W._jsonSchema={type:K("string",W._jsonSchemaVersion),bytes:K("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new w(y.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new q(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oe{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new w(y.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new w(y.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return D(this._lat,e._lat)||D(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:oe._jsonSchemaVersion}}static fromJSON(e){if(_t(e,oe._jsonSchema))return new oe(e.latitude,e.longitude)}}oe._jsonSchemaVersion="firestore/geoPoint/1.0",oe._jsonSchema={type:K("string",oe._jsonSchemaVersion),latitude:K("number"),longitude:K("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){/**
* @license
* Copyright 2017 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0})(this._values,e._values)}toJSON(){return{type:ee._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(_t(e,ee._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new ee(e.vectorValues);throw new w(y.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}ee._jsonSchemaVersion="firestore/vectorValue/1.0",ee._jsonSchema={type:K("string",ee._jsonSchemaVersion),vectorValues:K("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jl=/^__.*__$/;class ql{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Gn(e,this.data,this.fieldMask,t,this.fieldTransforms):new Ss(e,this.data,t,this.fieldTransforms)}}class Ls{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Gn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Ms(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw P(40011,{dataSource:n})}}class er{constructor(e,t,r,i,s,o){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.validatePath(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new er({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){const t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){const t=this.path?.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return Gt(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(Ms(this.dataSource)&&jl.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class Hl{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||Jn(e)}createContext(e,t,r,i=!1){return new er({dataSource:e,methodName:t,targetDoc:r,path:q.emptyPath(),arrayElement:!1,hasConverter:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function tr(n){const e=n._freezeSettings(),t=Jn(n._databaseId);return new Hl(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Us(n,e,t,r,i,s={}){const o=n.createContext(s.merge||s.mergeFields?2:0,e,t,i);nr("Data must be an object, but it was:",o,r);const a=Fs(r,o);let h,m;if(s.merge)h=new Me(o.fieldMask),m=o.fieldTransforms;else if(s.mergeFields){const _=[];for(const E of s.mergeFields){const I=He(e,E,t);if(!o.contains(I))throw new w(y.INVALID_ARGUMENT,`Field '${I}' is specified in your field mask but missing from your input data.`);Bs(_,I)||_.push(I)}h=new Me(_),m=o.fieldTransforms.filter((E=>h.covers(E.field)))}else h=null,m=o.fieldTransforms;return new ql(new H(a),h,m)}class tn extends Zn{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof tn}}function zl(n,e,t,r){const i=n.createContext(1,e,t);nr("Data must be an object, but it was:",i,r);const s=[],o=H.empty();gt(r,((h,m)=>{const _=$s(e,h,t);m=F(m);const E=i.childContextForFieldPath(_);if(m instanceof tn)s.push(_);else{const I=Et(m,E);I!=null&&(s.push(_),o.set(_,I))}}));const a=new Me(s);return new Ls(o,a,i.fieldTransforms)}function Gl(n,e,t,r,i,s){const o=n.createContext(1,e,t),a=[He(e,r,t)],h=[i];if(s.length%2!=0)throw new w(y.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let I=0;I<s.length;I+=2)a.push(He(e,s[I])),h.push(s[I+1]);const m=[],_=H.empty();for(let I=a.length-1;I>=0;--I)if(!Bs(m,a[I])){const b=a[I];let A=h[I];A=F(A);const N=o.childContextForFieldPath(b);if(A instanceof tn)m.push(b);else{const R=Et(A,N);R!=null&&(m.push(b),_.set(b,R))}}const E=new Me(m);return new Ls(_,E,o.fieldTransforms)}function Wl(n,e,t,r=!1){return Et(t,n.createContext(r?4:3,e))}function Et(n,e){if(xs(n=F(n)))return nr("Unsupported field value:",e,n),Fs(n,e);if(n instanceof Zn)return(function(r,i){if(!Ms(i.dataSource))throw i.createError(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(r,i){const s=[];let o=0;for(const a of r){let h=Et(a,i.childContextForArray(o));h==null&&(h={nullValue:"NULL_VALUE"}),s.push(h),o++}return{arrayValue:{values:s}}})(n,e)}return(function(r,i){if((r=F(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return _l(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=L.fromDate(r);return{timestampValue:Rn(i.serializer,s)}}if(r instanceof L){const s=new L(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Rn(i.serializer,s)}}if(r instanceof oe)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof W)return{bytesValue:Sl(i.serializer,r._byteString)};if(r instanceof O){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i.createError(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:Kn(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof ee)return(function(o,a){const h=o instanceof ee?o.toArray():o;return{mapValue:{fields:{[Is]:{stringValue:Es},[$t]:{arrayValue:{values:h.map((_=>{if(typeof _!="number")throw a.createError("VectorValues must only contain numeric values.");return bs(a.serializer,_)}))}}}}}})(r,i);if(Cs(r))return r._toProto(i.serializer);throw i.createError(`Unsupported field value: ${Yt(r)}`)})(n,e)}function Fs(n,e){const t={};return(function(i){for(const s in i)if(Object.prototype.hasOwnProperty.call(i,s))return!1;return!0})(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):gt(n,((r,i)=>{const s=Et(i,e.childContextForField(r));s!=null&&(t[r]=s)})),{mapValue:{fields:t}}}function xs(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof L||n instanceof oe||n instanceof W||n instanceof O||n instanceof Zn||n instanceof ee||Cs(n))}function nr(n,e,t){if(!xs(t)||!ps(t)){const r=Yt(t);throw r==="an object"?e.createError(n+" a custom object"):e.createError(n+" "+r)}}function He(n,e,t){if((e=F(e))instanceof Xn)return e._internalPath;if(typeof e=="string")return $s(n,e);throw Gt("Field path arguments must be of type string or ",n,!1,void 0,t)}const Kl=new RegExp("[~\\*/\\[\\]]");function $s(n,e,t){if(e.search(Kl)>=0)throw Gt(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Xn(...e.split("."))._internalPath}catch{throw Gt(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Gt(n,e,t,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let a=`Function ${e}() called with invalid data`;t&&(a+=" (via `toFirestore()`)"),a+=". ";let h="";return(s||o)&&(h+=" (found",s&&(h+=` in field ${r}`),o&&(h+=` in document ${i}`),h+=")"),new w(y.INVALID_ARGUMENT,a+n+h)}function Bs(n,e){return n.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kn{constructor(e,t,r,i,s){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new O(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new js(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){return this._document?.data.clone().value.mapValue.fields??void 0}get(e){if(this._document){const t=this._document.data.field(He("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class js extends kn{data(){return super.data()}}class Jl{constructor(e,t){this._docs=t,this.query=e}get docs(){return[...this._docs]}get size(){return this.docs.length}get empty(){return this.docs.length===0}forEach(e,t){this._docs.forEach(e,t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr{}class ir extends rr{}function sr(n,e,...t){let r=[];e instanceof rr&&r.push(e),r=r.concat(t),(function(s){const o=s.filter((h=>h instanceof or)).length,a=s.filter((h=>h instanceof nn)).length;if(o>1||o>0&&a>0)throw new w(y.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(const i of r)n=i._apply(n);return n}class nn extends ir{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new nn(e,t,r)}_apply(e){const t=this._parse(e);return zs(e._query,t),new ve(e.firestore,e.converter,Sn(e._query,t))}_parse(e){const t=tr(e.firestore);return(function(s,o,a,h,m,_,E){let I;if(m.isKeyField()){if(_==="array-contains"||_==="array-contains-any")throw new w(y.INVALID_ARGUMENT,`Invalid Query. You can't perform '${_}' queries on documentId().`);if(_==="in"||_==="not-in"){pi(E,_);const A=[];for(const N of E)A.push(fi(h,s,N));I={arrayValue:{values:A}}}else I=fi(h,s,E)}else _!=="in"&&_!=="not-in"&&_!=="array-contains-any"||pi(E,_),I=Wl(a,o,E,_==="in"||_==="not-in");return ne.create(m,_,I)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function qs(n,e,t){const r=e,i=He("where",n);return nn._create(i,r,t)}class or extends rr{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new or(e,t)}_parse(e){const t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:yt.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(i,s){let o=i;const a=s.getFlattenedFilters();for(const h of a)zs(o,h),o=Sn(o,h)})(e._query,t),new ve(e.firestore,e.converter,Sn(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class ar extends ir{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new ar(e,t)}_apply(e){const t=(function(i,s,o){if(i.startAt!==null)throw new w(y.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new w(y.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new qt(s,o)})(e._query,this._field,this._direction);return new ve(e.firestore,e.converter,(function(i,s){const o=i.explicitOrderBy.concat([s]);return new Xt(i.path,i.collectionGroup,o,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)})(e._query,t))}}function Ql(n,e="asc"){const t=e,r=He("orderBy",n);return ar._create(r,t)}class cr extends ir{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new cr(e,t,r)}_apply(e){return new ve(e.firestore,e.converter,(function(r,i,s){return new Xt(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),i,s,r.startAt,r.endAt)})(e._query,this._limit,this._limitType))}}function Hs(n){return Qu("limit",n),cr._create("limit",n,"F")}function fi(n,e,t){if(typeof(t=F(t))=="string"){if(t==="")throw new w(y.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!pl(e)&&t.indexOf("/")!==-1)throw new w(y.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(k.fromString(t));if(!M.isDocumentKey(r))throw new w(y.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return ii(n,new M(r))}if(t instanceof O)return ii(n,t._key);throw new w(y.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Yt(t)}.`)}function pi(n,e){if(!Array.isArray(n)||n.length===0)throw new w(y.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function zs(n,e){const t=(function(i,s){for(const o of i)for(const a of o.getFlattenedFilters())if(s.indexOf(a.op)>=0)return a.op;return null})(n.filters,(function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new w(y.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new w(y.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class Yl{convertValue(e,t="none"){switch(Le(e)){case 0:return null;case 1:return e.booleanValue;case 2:return V(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(at(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw P(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return gt(e,((i,s)=>{r[i]=this.convertValue(s,t)})),r}convertVectorValue(e){const t=e.fields?.[$t].arrayValue?.values?.map((r=>V(r.doubleValue)));return new ee(t)}convertGeoPoint(e){return new oe(V(e.latitude),V(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const r=ys(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(ct(e));default:return null}}convertTimestamp(e){const t=Oe(e);return new L(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=k.fromString(e);G(ks(r),9688,{name:e});const i=new ot(r.get(1),r.get(3)),s=new M(r.popFirst(5));return i.isEqual(t)||Qt(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gs(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}class ur extends Yl{constructor(e){super(),this.firestore=e}convertBytes(e){return new W(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new O(this.firestore,null,t)}}function Ws(n){(function(i){if(i.limitType==="L"&&i.explicitOrderBy.length===0)throw new w(y.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")})((n=Je(n,ve))._query);const e=It(n.firestore),t=new ur(n.firestore);return Ul(e,n._query).then((r=>{const i=r.map((s=>new js(n.firestore,t,s.key,s,n.converter)));return n._query.limitType==="L"&&i.reverse(),new Jl(n,i)}))}function Xl(n,e,t){const r=Gs((n=Je(n,O)).converter,e,t),i=Us(tr(n.firestore),"setDoc",n._key,r,n.converter!==null,t);return Qn(It(n.firestore),[i.toMutation(n._key,Y.none())])}function Zl(n){return Qn(It((n=Je(n,O)).firestore),[new Wn(n._key,Y.none())])}const mi="4.12.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eh{constructor(e,t,r){this.alias=e,this.aggregateType=t,this.fieldPath=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ks{constructor(e,t,r=1e3,i=1.5,s=6e4){this.t=e,this.timerId=t,this.i=r,this.o=i,this.h=s,this.u=0,this.l=null,this._=Date.now(),this.reset()}reset(){this.u=0}m(){this.u=this.h}A(e){this.cancel();const t=Math.floor(this.u+this.p()),r=Math.max(0,Date.now()-this._),i=Math.max(0,t-r);i>0&&De("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.u} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.l=this.t.enqueueAfterDelay(this.timerId,i,(()=>(this._=Date.now(),e()))),this.u*=this.o,this.u<this.i&&(this.u=this.i),this.u>this.h&&(this.u=this.h)}T(){this.l!==null&&(this.l.skipDelay(),this.l=null)}cancel(){this.l!==null&&(this.l.cancel(),this.l=null)}p(){return(Math.random()-.5)*this.u}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class th{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class nh{constructor(e,t,r){this._userDataWriter=t,this._data=r,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}_fieldsProto(){return new H({mapValue:{fields:this._data}}).clone().value.mapValue.fields}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rh(n){return ih(n,{count:sh()})}function ih(n,e){const t=Je(n.firestore,Qe),r=It(t),i=nl(e,((s,o)=>new eh(o,s.aggregateType,s._internalFieldPath)));return Fl(r,n._query,i).then((s=>(function(a,h,m){const _=new ur(a);return new nh(h,_,m)})(t,n,s)))}function sh(){return new th("count")}function St(n,e){if((n=F(n)).firestore!==e)throw new w(y.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oh{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new w(y.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await Ml(this.datastore,e);return t.forEach((r=>this.recordVersion(r))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(r){this.lastTransactionError=r}this.writtenDocs.add(e.toString())}delete(e){this.write(new Wn(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((t,r)=>{const i=M.fromPath(r);this.mutations.push(new Rs(i,this.precondition(i)))})),await Qn(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw P(50498,{R:e.constructor.name});t=C.min()}const r=this.readVersions.get(e.key.toString());if(r){if(!t.isEqual(r))throw new w(y.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(C.min())?Y.exists(!1):Y.updateTime(t):Y.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(C.min()))throw new w(y.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return Y.updateTime(t)}return Y.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ah={maxAttempts:5};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ch{constructor(e,t,r,i,s){this.asyncQueue=e,this.datastore=t,this.options=r,this.updateFunction=i,this.deferred=s,this.I=r.maxAttempts,this.P=new Ks(this.asyncQueue,"transaction_retry")}V(){this.I-=1,this.D()}D(){this.P.A((async()=>{const e=new oh(this.datastore),t=this.F(e);t&&t.then((r=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(r)})).catch((i=>{this.v(i)}))))})).catch((r=>{this.v(r)}))}))}F(e){try{const t=this.updateFunction(e);return!gs(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}v(e){this.I>0&&this.B(e)?(this.I-=1,this.asyncQueue.enqueueAndForget((()=>(this.D(),Promise.resolve())))):this.deferred.reject(e)}B(e){if(e?.name==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!el(t)}return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pn(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr{constructor(e,t,r,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new lr,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,i,s){const o=Date.now()+r,a=new hr(e,t,o,i,s);return a.start(r),a}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new w(y.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gi="AsyncQueue";class uh{constructor(e=Promise.resolve()){this.k=[],this.q=!1,this.O=[],this.S=null,this.C=!1,this.M=!1,this.N=[],this.P=new Ks(this,"async_queue_retry"),this.L=()=>{const r=pn();r&&De(gi,"Visibility state changed to "+r.visibilityState),this.P.T()},this.W=e;const t=pn();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.L)}get isShuttingDown(){return this.q}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.U(),this.$(e)}enterRestrictedMode(e){if(!this.q){this.q=!0,this.M=e||!1;const t=pn();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.L)}}enqueue(e){if(this.U(),this.q)return new Promise((()=>{}));const t=new lr;return this.$((()=>this.q&&this.M?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.k.push(e),this.j())))}async j(){if(this.k.length!==0){try{await this.k[0](),this.k.shift(),this.P.reset()}catch(e){if(!(function(r){return r.name==="IndexedDbTransactionError"})(e))throw e;De(gi,"Operation failed with retryable error: "+e)}this.k.length>0&&this.P.A((()=>this.j()))}}$(e){const t=this.W.then((()=>(this.C=!0,e().catch((r=>{this.S=r,this.C=!1;const i=_i(r);throw Qt("INTERNAL UNHANDLED ERROR: ",i),r})).then((r=>(this.C=!1,r))))));return this.W=t,t}enqueueAfterDelay(e,t,r){this.U(),this.N.indexOf(e)>-1&&(t=0);const i=hr.createAndSchedule(this,e,t,r,(s=>this.G(s)));return this.O.push(i),i}U(){this.S&&P(47125,{H:_i(this.S)})}verifyOperationInProgress(){}async J(){let e;do e=this.W,await e;while(e!==this.W)}K(e){for(const t of this.O)if(t.timerId===e)return!0;return!1}X(e){return this.J().then((()=>{this.O.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.O)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.J()}))}Y(e){this.N.push(e)}G(e){const t=this.O.indexOf(e);this.O.splice(t,1)}}function _i(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lh{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=tr(e)}get(e){const t=St(e,this._firestore),r=new ur(this._firestore);return this._transaction.lookup([t._key]).then((i=>{if(!i||i.length!==1)return P(24041);const s=i[0];if(s.isFoundDocument())return new kn(this._firestore,r,s.key,s,t.converter);if(s.isNoDocument())return new kn(this._firestore,r,t._key,null,t.converter);throw P(18433,{doc:s})}))}set(e,t,r){const i=St(e,this._firestore),s=Gs(i.converter,t,r),o=Us(this._dataReader,"Transaction.set",i._key,s,i.converter!==null,r);return this._transaction.set(i._key,o),this}update(e,t,r,...i){const s=St(e,this._firestore);let o;return o=typeof(t=F(t))=="string"||t instanceof Xn?Gl(this._dataReader,"Transaction.update",s._key,t,r,i):zl(this._dataReader,"Transaction.update",s._key,t),this._transaction.update(s._key,o),this}delete(e){const t=St(e,this._firestore);return this._transaction.delete(t._key),this}}function hh(n,e,t){n=Je(n,Qe);const r=It(n),i={...ah,...t};(function(a){if(a.maxAttempts<1)throw new w(y.INVALID_ARGUMENT,"Max attempts must be at least 1")})(i);const s=new lr;return new ch((function(){return new uh})(),r,i,(o=>e(new lh(n,o))),s).V(),s.promise}(function(){Mu(`${Ge}_lite`),Be(new ke("firestore/lite",((e,{instanceIdentifier:t,options:r})=>{const i=e.getProvider("app").getImmediate(),s=new Qe(new xu(e.getProvider("auth-internal")),new ju(i,e.getProvider("app-check-internal")),Hu(i,t),i);return r&&s._setSettings(r),s}),"PUBLIC").setMultipleInstances(!0)),Te("firestore-lite",mi,""),Te("firestore-lite",mi,"esm2020")})();const Js=Pi({apiKey:"AIzaSyBmY2MC3gACK-Q6DtMmn1jCY7OVI-RF-aU",authDomain:"phyloguessr.firebaseapp.com",projectId:"phyloguessr",storageBucket:"phyloguessr.firebasestorage.app",messagingSenderId:"482031111716",appId:"1:482031111716:web:1de25af2d6f4f3e7b752b1",measurementId:"G-H60S7BXHPJ"}),dr=Ou(Js),fr=$l(Js),pr=Os(fr,"scores"),dh=new ce;let te=null,Qs;const wt=new Promise(n=>{Qs=n});Ac(dr,n=>{te=n,Qs()});async function gh(){return await wt,te?.uid??null}async function _h(){return await wt,te}async function yh(){return(await qc(dr,dh)).user}async function Ih(){ph(),te&&await Zl(Yn(mr,te.uid)).catch(()=>{}),await dr.signOut()}function Ys(n,e){return{uid:typeof e.uid=="string"?e.uid:n,name:typeof e.name=="string"?e.name:"Anonymous",bestStreak:typeof e.bestStreak=="number"?e.bestStreak:0,currentStreak:typeof e.currentStreak=="number"?e.currentStreak:0,totalWins:typeof e.totalWins=="number"?e.totalWins:0,totalPlayed:typeof e.totalPlayed=="number"?e.totalPlayed:0,timestamp:typeof e.timestamp=="number"?e.timestamp:0}}async function Eh(n){await wt;const e=sr(pr,qs("name","==",n),Hs(1));return(await Ws(e)).docs.some(r=>r.id!==te?.uid)}async function wh(n,e){if(await wt,!te)return;const t=te.uid,r=Yn(pr,t);await hh(fr,async i=>{const s=await i.get(r);if(s.exists()){const o=Ys(t,s.data()),a=e?o.currentStreak+1:0;i.set(r,{uid:t,name:n,bestStreak:Math.max(o.bestStreak,a),currentStreak:a,totalWins:o.totalWins+(e?1:0),totalPlayed:o.totalPlayed+1,timestamp:Date.now()})}else i.set(r,{uid:t,name:n,bestStreak:e?1:0,currentStreak:e?1:0,totalWins:e?1:0,totalPlayed:1,timestamp:Date.now()})})}async function Th(n=20){const e=sr(pr,Ql("bestStreak","desc"),Hs(n));return(await Ws(e)).docs.map(i=>Ys(i.id,i.data())).sort((i,s)=>s.bestStreak-i.bestStreak).slice(0,n)}const mr=Os(fr,"presence"),fh=120*1e3;async function mn(){if(await wt,!te)return;const n=localStorage.getItem("phyloLeaderboardName")??"Anonymous";await Xl(Yn(mr,te.uid),{uid:te.uid,name:n,lastSeen:Date.now()})}let nt=null,rt=null;function Ah(){nt===null&&(mn(),nt=setInterval(()=>mn(),6e4),rt=()=>{document.visibilityState==="visible"&&mn()},document.addEventListener("visibilitychange",rt))}function ph(){nt!==null&&(clearInterval(nt),nt=null),rt&&(document.removeEventListener("visibilitychange",rt),rt=null)}async function vh(){const n=Date.now()-fh,e=sr(mr,qs("lastSeen",">",n));return(await rh(e)).data().count}export{gh as a,_h as b,Ih as c,Ah as d,vh as e,Th as g,Eh as i,wh as r,yh as s};
//# sourceMappingURL=firebase.eKwsH3k5.js.map
