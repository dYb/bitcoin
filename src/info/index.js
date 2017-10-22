import { redirect, $, getUserInfo } from '../js/util'

$('.card-header').textContent = getUserInfo().phone

$('.js-list').addEventListener('click', (e) => {
  redirect(e.target.dataset.href, e.target.textContent)
}, false)
