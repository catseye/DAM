import DAM from './DAM/dam.js'
import { makePanel, makeCheckbox } from './DAM/dam-widgets.js'


const div = DAM.maker('div')

document.getElementById('zlerp').appendChild(
  div(
    {style: "border: 1px solid blue"},
    makePanel(
      { title: "Options", isOpen: false },
      makeCheckbox({ onchange: function(b) { console.log('understood:' + b) } }, "I understand"),
      makeCheckbox({ onchange: function(b) { console.log('great:' + b) } }, "It's great")
    )
  )
)
