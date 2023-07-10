import Reveal from 'reveal.js';
import _ from 'lodash';
import SvgFragment from './reveal-svg-fragment.js'

if (localStorage.add) {
   document.body.querySelector('#additional h2').innerHTML += localStorage.add
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