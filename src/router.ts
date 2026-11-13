import { createRouter, createWebHashHistory } from 'vue-router'
import StartView from './views/StartView.vue'
import SimulatorView from './views/SimulatorView.vue'
import HundertFansView from './views/HundertFansView.vue'
import SelbsttestView from './views/SelbsttestView.vue'
import FaktenView from './views/FaktenView.vue'
import HilfeView from './views/HilfeView.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: StartView, meta: { titel: 'Start' } },
    { path: '/simulator', component: SimulatorView, meta: { titel: 'Wett-Simulator' } },
    { path: '/100-fans', component: HundertFansView, meta: { titel: '100 Fans' } },
    { path: '/selbsttest', component: SelbsttestView, meta: { titel: 'Selbsttest' } },
    { path: '/fakten', component: FaktenView, meta: { titel: 'Fakten' } },
    { path: '/hilfe', component: HilfeView, meta: { titel: 'Hilfe' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
