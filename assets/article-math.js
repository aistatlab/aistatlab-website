/* Optional MathJax support for article pages. No credentials are exposed to the public. */
window.MathJax = { tex: { inlineMath: [['\\(', '\\)']], displayMath: [['$$', '$$'], ['\\[', '\\]']] }, options: {skipHtmlTags:['script','noscript','style','textarea','pre','code']} };
const script=document.createElement('script');script.async=true;script.src='https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';document.head.appendChild(script);
