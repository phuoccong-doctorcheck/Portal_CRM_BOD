
import CommingSoon from "../components/CommingSoon"

import PublicLayout from "../layouts/PublicLayout"
import Dashboard from "../pages/Dashboard"

import HomePage from "../pages/HomePage"
import Login from "../pages/Login"

const routes: any[] = [
    {
        path: "/",
        component: Dashboard,
        layout: PublicLayout,    
    },
    {
        path: "/s",
        component: CommingSoon,
        layout: PublicLayout,    
    },
    {
        path: "*",
        component: CommingSoon,
        layout: PublicLayout,    
    },
]

export  { routes }