import Reveal from 'https://cdn.skypack.dev/reveal.js';
import Notes from 'https://cdn.skypack.dev/reveal.js/plugin/notes/notes.js';
import _ from 'https://cdn.skypack.dev/lodash';
import SvgFragment from './reveal-svg-fragment.js'

let deck

const init = () => {
   if (deck) deck.destroy()
   deck = new Reveal()
   SvgFragment(deck)
   deck.initialize({
      hash: true,
      controlsTutorial: false,
      plugins: [Notes, SvgFragment],
      controls: false,
      width: window.innerWidth,
      height: window.innerHeight,
      // transition: 'slide',
      // backgroundTransition: 'slide',
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