/**
 * Generates <micro-frontend> element for seamless embedding
 * and provides helper function to run inside embedded frame.
 * Works cross-domain
 */
class MicroFrontend extends HTMLElement {
    constructor() {        
        super();

        if(!this.id)
            throw TypeError("MicroFrontend must have id");

        this.frame = document.createElement("iframe");
        this.frame.addEventListener("load", this.setupIframe.bind(this));

        this.setupLoaderDiv()

        window.addEventListener("message", e=>{
            if(e.data.id === this.id){
                const ev = new Event(e.data.eventName, {bubbles: true})
                ev.detail = e.data;
                this.dispatchEvent(ev)
            }
        })
        
    }

    // render loader div
    setupLoaderDiv() {
        this.loaderDiv = document.createElement("div");
        this.loaderDiv.innerHTML = ` <div class="loading-dots">
            <div class="loading-dots--dot"></div>
            <div class="loading-dots--dot"></div>
            <div class="loading-dots--dot"></div>
        </div>`;
        this.loaderDiv.classList.add("loader")
        this.appendChild(this.loaderDiv);

    }

    // invoked each time the custom element is appended into a document-connected element
    connectedCallback() {
        const styles = window.getComputedStyle(this);

        setTimeout(() => {
            this.frame.src = this.getAttribute("src")
        }, 1000);


        this.appendChild(this.frame);

        this.frame.style.height = styles.height;
        this.frame.style.width = styles.width;
        this.loaderDiv.style = `width: ${styles.width}; height: ${styles.height}; position: absolute; z-index: 2; top: -${styles.height}; left: 0`;
    }

    attributeChangedCallback(a, v) {
        console.log(a, v)
    }

    on(eventName, func){
        this.addEventListener(eventName, func);
        return this;
    }

    // called when loading page in IFrame is ready
    setupIframe() {
        this.loaderDiv.classList.add("hide")

        window.addEventListener("message", e => {
            if (e.data.height) {
                this.frame.style.width = "100%";
                this.frame.style.height = (e.data.height + 32) + "px";
                this.frame.style.visibility = 'visible';
            }
        })

        const styles = this.getRelevantStyles();

        // pass context to iframe - in a cross-domain way
        this.frame.contentWindow.postMessage({
            id: this.id,
            referrer: window.location.href,
            styles: styles,
            data: this.data || {}
            
        })
    }

    // get styles to reapply to IFrame document for a seamless appearance
    getRelevantStyles() {
        let compStyles = window.getComputedStyle(this);

        let bgcolor = MicroFrontend.getElementDefiningCssStyle(this, "background-color");

        this.loaderDiv.style.backgroundColor = bgcolor;

        return `body {
            color: ${compStyles["color"]};
            font-family: ${compStyles["font-family"]};
            font-size: ${compStyles["font-size"]};
            background-color: ${bgcolor};
        }
        `
    }

    static getElementDefiningCssStyle(elm, style) {
        let result = window.getComputedStyle(elm)[style];
        if (style === "background-color" && (result === "rgba(0, 0, 0, 0)" || result === "transparent")) result = null;
        if (!result) {
            elm = elm.parentNode;
            if (!elm)
                return null;

            return this.getElementDefiningCssStyle(elm, style)
        }
        return result;
    }

    static get(id) {
        return document.getElementById(id);
    }

    set data(value) {
        this._data = value
    }

    get data() {
        return this._data;
    }

    /**
     * Method to run inside micro-frontend page
     */
    static async run() {
        console.log("Run app in micro-frontend");

        // listen to postMessage calls
        window.addEventListener("message", e => {
            Object.keys(e.data).forEach(k => {
                console.log("Message: ", k);

                switch (k) {
                    case "id":
                        window.microFrontendId = e.data[k];
                        break;
                    case "referrer": // makes sure relative links work in IFRAME
                        let base = document.createElement("base");
                        base.href = e.data[k].split("#")[0];
                        base.target = "_parent";
                        document.querySelector("head").appendChild(base)
                        break;
                    case "styles": // passes in the relevant styles to make IFRAME look 'seamless'
                        const styles = e.data[k];
                        const cssSheet = document.createElement("style");
                        cssSheet.innerHTML = styles;
                        document.querySelector("head").appendChild(cssSheet);
                        break;
                    case "data":
                        console.log("data:", e.data[k]);
                        break;
                }
            })
        })
    }

    // triggers an event on micro-frontend element from the page in the IFrame 
    static trigger(eventName, data){
        
        parent.postMessage({
            eventName: eventName,
            id: window.microFrontendId,
            ...data
        })
    }
}

export default MicroFrontend;