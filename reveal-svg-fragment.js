export default () => ({
  id: 'toaster',
  init: async ( deck ) => {
    const svgs = document.querySelectorAll('[data-svg]')
    for (const svg of svgs) {
      const fileName = svg.getAttribute('data-svg')
      const file = await fetch(location.pathname + fileName).then(response => response.text())
      svg.innerHTML = file.replaceAll('inkscape:label', 'inkscape-label')
      svg.children[0].removeAttribute('width')
      svg.children[0].removeAttribute('height')
      const fragments = svg.getAttribute('data-svg-fragments').split(',')

      for (const fragment of fragments) {
        const layer = svg.querySelector(`[inkscape-label="${fragment}"]`)
        layer?.classList.add('fragment')
      }
    }
  }
})