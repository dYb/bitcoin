import { redirect, $, getUserInfo } from '../js/util'
import '../css/reset.css'
import './index.less'

$('.phone').textContent = getUserInfo().phone

$('.g-container').addEventListener('click', (e) => {
  redirect(e.target.dataset.href, e.target.textContent)
}, false)
