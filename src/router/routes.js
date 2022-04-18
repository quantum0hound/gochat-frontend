import SignIn from "pages/SignIn";
import SignUp from "pages/SignUp";
import MainPage from "pages/MainPage";
import App from "src/App";

const routes = [

  { path: '/', component: MainPage},
  { path: '/signin', component: SignIn },
  { path: '/signup', component: SignUp },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
