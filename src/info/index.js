import { redirect, $ } from '../js/util'

$('.js-list').addEventListener('click', (e) => {
  redirect(e.target.dataset.href, e.target.textContent)
}, false)
