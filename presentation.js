import Reveal from 'reveal.js';
import _ from 'lodash';
import SvgFragment from './reveal-svg-fragment.js'

const templates = document.querySelectorAll('template:not(.hidden)')
for (const template of templates) {
   template.insertAdjacentHTML('afterend', template.innerHTML)
   template.remove()
}

if (localStorage.add && document.body.querySelector('.additional')) {
   document.body.querySelector('.additional').innerHTML += localStorage.add
}

let deck

const init = () => {
   if (deck) deck.destroy()
   deck = new Reveal()
   SvgFragment(deck)
   deck.initialize({
      hash: true,
      controlsTutorial: false,
      plugins: [SvgFragment],
      controls: false,
      width: window.innerWidth,
      height: window.innerHeight,
   })   
}

init()

window.addEventListener('resize', _.debounce(() => {
   deck.configure({ 
      width: window.innerWidth,
      height: window.innerHeight,
   })
   deck.layout()
}, 300))