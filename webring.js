const DATA_FOR_WEBRING = `https://raw.githubusercontent.com/izmedien/umw/main/data/webring.json`;

const template = document.createElement("template");
template.innerHTML = `
<style>
   .umw-webring {
      display: block;
      max-width: 640px;
      margin: 0 auto;
      padding: 7px;
      font-size: 15px;
      border: 1px solid #ccc;
   }
   .umw-webring p,
   .umw-webring-nav {
      margin: 0 0 7px;
   }
   .umw-webring p:last-child {
      margin: 0;
   }
   .umw-webring-title {
      font-weight: bold;
      text-align: center;
   }
   .umw-webring-now {
      text-align: center;
   }
   .umw-webring-nav {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 5px;
      height: 2.5em;
   }
   .umw-webring-nav a {
      text-decoration: none;
      align-self: center;
   }
   .umw-webring-nav--prev {
      justify-self: start;
   }
   .umw-webring-nav--rand {
      justify-self: center;
   }
   .umw-webring-nav--prev {
      justify-self: end;
   }
</style>
<div id="umw-webring" class="umw-webring"></div>
`;

class WebRing extends HTMLElement {
   connectedCallback() {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      const thisSite = this.getAttribute("site");

      fetch(DATA_FOR_WEBRING)
         .then((response) => response.json())
         .then((sites) => {

         const matchedSiteIndex = sites.findIndex(
            (site) => site.url === thisSite
         );
         const matchedSite = sites[matchedSiteIndex];

         let prevSiteIndex = matchedSiteIndex - 1;
         if (prevSiteIndex === -1) prevSiteIndex = sites.length - 1;

         let nextSiteIndex = matchedSiteIndex + 1;
         if (nextSiteIndex > sites.length) nextSiteIndex = 0;

         const randomSiteIndex = this.getRandomInt(0, sites.length - 1);

         const cp = `
            <p class="umw-webring-title"><abbr title="Unabhängige Muslimische Websites">UMW</abbr> Webring</p>
            <p class="umw-webring-now">Aktuelle Seite im Webring: <a href="${matchedSite.url}">${matchedSite.name}</a> von ${matchedSite.owner}</p>
            
            <nav class="umw-webring-nav">
               <a href="${sites[prevSiteIndex].url}" class="umw-webring-nav--prev">&ltrif; Vorherige Website</a>
               <a href="${sites[randomSiteIndex].url}" class="umw-webring-nav--rand">[Zufällige Website]</a>
               <a href="${sites[nextSiteIndex].url}" class="umw-webring-nav--next">Nächste Website &rtrif;</a>
            </nav>
            <p class="umw-webring-contact"><small><a href="https://islamische-zeitung.de/kontakt/" target="_blank">Schreiben Sie uns</a>, wenn Sie Ihre Website auch in diesen Webring aufnehmen lassen möchten. Kriterien für eine Aufnahme in diesen Webring sind: Website hat islamischen Inhalt, ist finanziell unabhängig und nicht an eine staatliche Organisation gebunden. <a href="">Mehr Infos zu diesem Webring</a></small>.</p>
         `;

         this.shadowRoot
            .querySelector("#umw-webring")
            .insertAdjacentHTML("afterbegin", cp);
         });
   }

   getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
   }
}

window.customElements.define("webring-umw", WebRing);
