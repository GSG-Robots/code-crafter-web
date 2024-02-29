import showdown from 'showdown/dist/showdown';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';

hljs.registerLanguage('python', python);


const converter = new showdown.Converter({
    strikethrough: true,
    simplifiedAutoLink: true,
    tables: true,
    tasklists: true,
    ghCodeBlocks: true,
    simpleLineBreaks: true,
    ghMentions: true,
    emoji: true,
    openLinksInNewWindow: true,
    backslashEscapesHTMLTags: true,
    underline: true,
    encodeEmails: true,
    completeHTMLDocument: false,
    ellipsis: true,
    requireSpaceBeforeHeadingText: true,
    tablesHeaderId: true,
    ghCompatibleHeaderId: true,
    customizedHeaderId: true,
    excludeTrailingPunctuationFromURLs: true,
    parseImgDimensions: true,
    splitAdjacentBlockquotes: true,
    extensions: [ownPlugin()]
});
converter.setFlavor('github');

const markdownStylesExtra = `
:host blockquote {
    margin: 0;
    padding: 1rem 1.25rem;
    border-left: .25rem solid #dfe2e5;
    margin-bottom: 1rem;
}

:host blockquote h1 {
    all: unset;
    margin-top: 0;
    margin-bottom: .25rem;
    font-weight: bold;
    font-size: 1.1rem;
}

:host blockquote p:not(h1 + *) {
    margin-top: 0;
}

:host blockquote p {
    margin-bottom: 0;
}

:host blockquote.alert.alert-note {
    border-color: #306cc8;
}

:host blockquote.alert.alert-note > h1 {
    color: #306cc8;
}

:host blockquote.alert.alert-tip {
    border-color: #55aa58;
}

:host blockquote.alert.alert-tip > h1 {
    color: #55aa58;
}

:host blockquote.alert.alert-important {
    border-color: #9a70e3;
}

:host blockquote.alert.alert-important > h1 {
    color: #9a70e3;
}

:host blockquote.alert.alert-warning {
    border-color: #c69026;
}

:host blockquote.alert.alert-warning > h1 {
    color: #c69026;
}

:host blockquote.alert.alert-caution {
    border-color: #e8554d;
}

:host blockquote.alert.alert-caution > h1 {
    color: #e8554d;
}

:host a.btn {
    all: unset;
}

:host button {
    all: unset;
    padding: .5rem 1rem;
    border-radius: .25rem;
    background-color: rgba(0, 0, 0, .7);
    color: #fff;
    cursor: pointer;
    transition: background-color .2s;
}

:host button:hover {
    background-color: rgba(0, 0, 0, .6);
}

:host div.center {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
}

:host pre {
    color: white;
    padding: 1rem;
    border-radius: .25rem;
    background-color: #434b55;
    margin-bottom: 1rem;
}

:host pre ::selection {
    background-color: rgba(43, 52, 55, 1);
}
`;

const gfmAlertsMap = {
    TIP: 'Tipp',
    NOTE: 'Info',
    IMPORTANT: 'Wichtig',
    WARNING: 'Achtung',
    CAUTION: 'Gefahr'
};

function ownPlugin() {
    return function () {
        return [
            {
                type: 'lang',
                filter: function (text, converter) {
                    text = text.replace(/\[CENTER\]\s*(.+?)\s*\[\/CENTER\]/gsi, function (wholeMatch, content) {
                        return '<div class="center">' + converter.makeHtml(content) + '</div>';
                    });
                    return text;
                }
            },
            {
                type: 'lang',
                filter: function (text, converter) {
                    console.log(text)
                    text = text.replace(/> \[!(TIP|NOTE|IMPORTANT|WARNING|CAUTION)\](?:\s)*(\n(?:[ \t]*> (?:\s|\S)+?\n)*)/gsi, function (wholeMatch, type, content) {
                        let new_content = ("\n" + content).replace(/(?:\n)\> /gmi, '<br>').replace(/^\s*<br>/, '');
                        console.log("!!!", new_content)
                        return '<blockquote class="alert alert-' + type.toLowerCase() + '"><h1 class="alert-title">' + gfmAlertsMap[type] + '</h1><p class="alert-content">' + converter.makeHtml(new_content) + '</p></blockquote>';
                    });
                    console.log(text)
                    return text;
                }
            },
            {
                type: "lang",
                filter: function (text) {
                    text = text.replace(/!btn\[(.+?)\]\((.+?)\)/gsi, function (wholeMatch, display, url) {
                        return '<a class="btn" href="' + url + '"><button>' + display + '</button></a>';
                    });
                    return text;
                }
            },
            {
                type: "output",
                filter: function (text) {
                    text = text.replace(/<pre><code class=".+?language-(\S+?)(?:\s+(?:.+?)?)?">(.+?)<\/code><\/pre>/gsi, function (wholeMatch, lang, content) {
                        return '<pre><code class="language-' + lang + '">' + hljs.highlight(content, { language: lang }).value + '</code></pre>';
                    });
                    return text;
                }
            },
            {
                type: "output",
                filter: function (text) {
                    text = text.replace(/  <br(?:\s|\/)*>/gsi, '</p><p>');
                    return text;
                }
            }
        ];
    };
};

function markdownToHTML(
    content = "No content provided.",
) {
    const html = converter.makeHtml(content);
    return html;
}

function cleanMarkdown(source) {
    const noStartNL = source.replace(/^[\n\r]*/g, '');
    const startSpace = /^\n?(\s*)/gi.exec(noStartNL)[1];
    const noAmpersandSyntax = noStartNL.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\'');
    const cleanedContent = noAmpersandSyntax.replace(new RegExp(`^${startSpace}`, 'gmi'), '').replace(new RegExp(`\s*$`, 'gi'), '');
    return cleanedContent;
}

export default class MarkdownDisplay extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = document.querySelector('template[for="markdown-display"]').innerHTML;

        this._interval_id = null;
        this._cache = "";

        this.redraw = this.redraw.bind(this);
        this.redrawIfChanged = this.redrawIfChanged.bind(this);
    }

    static get observedAttributes() {
        return ['interval'];
    }

    get interval() {
        return parseInt(this.getAttribute('interval') || "-1") || -1;
    }

    set interval(value) {
        this.setAttribute('interval', value);
        clearInterval(this._interval_id);
        if (this.interval === -1) return;
        this._interval_id = setInterval(this.redrawIfChanged.bind(this), this.interval);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'interval') {
            if (oldValue === newValue) return;
            this.interval = parseInt(this.getAttribute('interval') || "-1") || -1;
        }
    }

    connectedCallback() {
        // whyever this is necessary... but it is
        setTimeout(() => {
            this.redrawIfChanged();
        }, 0);

        this.interval = parseInt(this.getAttribute('interval') || "-1") || -1;
    }

    disconnectedCallback() {
        clearInterval(this._interval_id);
    }

    redrawIfChanged() {
        if (this.innerHTML !== this._cache) {
            this.redraw();
            this._cache = this.innerHTML;
        }
    }

    get innerMarkdown() {
        return cleanMarkdown(this.innerHTML);
    }

    redraw() {
        const html = markdownToHTML(this.innerMarkdown);;
        this.shadowRoot.getElementById("content").innerHTML = `
        <!--<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/vscode-dark.min.css">
        <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/highlight.min.js"></script>
        <style>
            ${markdownStylesExtra}
        </style>-->
        ${html}
        `;
    }
}

window.customElements.define('markdown-display', MarkdownDisplay);
