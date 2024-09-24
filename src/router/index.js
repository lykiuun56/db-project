import { createRouter, createWebHistory } from 'vue-router';
// import TotalDatabase from '@/views/TotalDatabase.vue';
import TotalDatabaseHome from "@/views/TotalDatabaseHome.vue";
import AddToDatabase from '@/unused/AddToDatabase.vue';
import RemoveFromDatabase from '@/unused/RemoveFromDatabase.vue';
import ChangeInfo from '@/unused/ChangeInfo.vue';
import FindCreator from '@/unused/FindCreator.vue';
import CollaboratedDatabase from "@/views/CollaboratedDatabase.vue";
import BlackList from "@/views/BlackList.vue";
import ManagementEmail from "@/views/ManagementEmail.vue";
import RemoveDuplicate from "@/views/RemoveDuplicate.vue";
import TotalProject from "@/views/TotalProject.vue";
import CollaboratedProject from "@/views/CollaboratedProject.vue";

import TiktokHome from '@/TiktokService/Tiktokhome.vue'
import TiktokHash from '@/TiktokService/TiktokHash.vue'
import TiktokHandle from '@/TiktokService/TiktokHandle.vue';

import EmailExtra from '@/TiktokService/EmailExtra.vue';

import TDAdd from "@/TotalDB/TDAdd.vue";
import TDChange from "@/TotalDB/TDChange.vue";
import TDFind from "@/TotalDB/TDFind.vue";
import TDRemove from "@/TotalDB/TDRemove.vue";
import TDGrid from "@/TotalDB/TDGrid.vue";
import TDSelect from "@/TotalDB/TDSelect.vue";


import CDAdd from '@/CollaboratedDB/CDAdd.vue';
import CDFind from '@/CollaboratedDB/CDFind.vue';
import CDRemove from '@/CollaboratedDB/CDRemove.vue';
import CDChange from '@/CollaboratedDB/CDChange.vue';
import CDGrid from "@/CollaboratedDB/CDGrid.vue";

import BLAdd from "@/BlackListDB/BLAdd.vue";
import BLGrid from "@/BlackListDB/BLGrid.vue";
import BLRemove from "@/BlackListDB/BLRemove.vue";

import MDFind from "@/ManagementDB/MDFind.vue";
import MDAdd from "@/ManagementDB/MDAdd.vue";
import MDGrid from "@/ManagementDB/MDGrid.vue";

import CDFindResult from "@/Results/CDFindResult.vue";
import TDFindResult from "@/Results/TDFindResult.vue";

import TPSearchResult from "@/Results/TPSearchResult.vue";
import TPGrid from "@/TotalProjectDB/TPGrid.vue";
import TPSearch from "@/TotalProjectDB/TPSearch.vue";

import CPGrid from "@/CollaboratedProject/CPGrid.vue";
import CPSearch from "@/CollaboratedProject/CPSearch.vue";
import CPSearchResult from "@/Results/CPSearchResult.vue";


import HomePage from '@/views/Homepage.vue';
import LoginForm from '@/components/LoginForm.vue';


import WishList from "@/views/WishList.vue";
import CreateWishlist from "@/WishList/CreateWishlist.vue";
import ViewWishlist from "@/WishList/ViewWishlist.vue";
import WishlistDetail from '@/WishList/WishlistDetail.vue';






const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginForm
  },
    {
    path: '/home',
    component: HomePage, // Set HomePage as the parent component
    children: [

      {
        path: '/total-database-home',
        name: 'TotalDatabaseHome',
        component: TotalDatabaseHome
      },

      {
        path: '/add-to-database',
        name: 'AddToDatabase',
        component: AddToDatabase
      },
      {
        path: '/remove-from-database',
        name: 'RemoveFromDatabase',
        component: RemoveFromDatabase
      },
      {
        path: '/find-creator',
        name: 'FindCreator',
        component: FindCreator
      },
      {
        path: '/change-info',
        name: 'ChangeInfo',
        component: ChangeInfo
      },
      {
        path: '/collaborated-database',
        name: 'CollaboratedDatabase',
        component: CollaboratedDatabase
      },
      {
        path: '/block-someone/black-list',
        name: 'BlackList',
        component: BlackList
      },
      {
        path: '/block-someone/management-email',
        name: 'ManagementEmail',
        component: ManagementEmail
      },
      {
        path: '/remove-duplicate',
        name: 'RemoveDuplicate',
        component: RemoveDuplicate
      },
      {
        path: '/total-project',
        name: 'TotalProject',
        component: TotalProject
      },
      {
        path: '/collaborated-project',
        name: 'CollaboratedProject',
        component: CollaboratedProject
      },
      {
        path: '/tiktok-home',
        name: 'TiktokHome',
        component: TiktokHome
      },
      {
        path: '/tik-hash-tag',
        name: 'TiktokHash',
        component: TiktokHash
      },
      {
        path: '/tik-search-name',
        name: 'TiktokHandle',
        component: TiktokHandle
      },
      {
        path: '/email-extra',
        name: 'EmailExtra',
        component: EmailExtra
      },
      {
        path: '/td-add',
        name: 'TDAdd',
        component: TDAdd
      },
      {
        path: '/td-find',
        name: 'TDFind',
        component: TDFind
      },
      {
        path: '/td-change',
        name: 'TDChange',
        component: TDChange
      },
      {
        path: '/td-remove',
        name: 'TDRemove',
        component: TDRemove
      },
      {
        path: '/td-grid',
        name: 'TDGrid',
        component: TDGrid
      },
      {
        path: '/td-select',
        name: 'TDSelect',
        component: TDSelect
      },
      // {
      //   path: 'td-remove-result',
      //   name: 'TDRemoveResult',
      //   component: TDRemoveResult
      // },
      {
        path: '/cd-add',
        name: 'CDAdd',
        component: CDAdd
      },
      {
        path: '/cd-find',
        name: 'CDFind',
        component: CDFind
      },
      {
        path: '/cd-change',
        name: 'CDChange',
        component: CDChange
      },
      {
        path: '/cd-remove',
        name: 'CDRemove',
        component: CDRemove
      },
      {
        path: '/cd-grid',
        name: 'CDGrid',
        component: CDGrid
      },
      {
        path: '/bl-add',
        name: 'Bl-Add',
        component: BLAdd
      },
      {
        path: '/bl-grid',
        name: 'BLGrid',
        component: BLGrid
      },
      {
        path: '/bl-remove',
        name: 'BLRemove',
        component: BLRemove
      },
      {
        path: '/md-find',
        name: 'MDFind',
        component: MDFind
      },
      {
        path: '/md-add',
        name: 'MDAdd',
        component: MDAdd
      },
      {
        path: '/md-grid',
        name: 'MDGrid',
        component: MDGrid
      },
      {
        path: '/cd-find-result',
        name: 'CDFindResult',
        component: CDFindResult
      },
      {
        path: '/td-find-result',
        name: 'TDFindResult',
        component: TDFindResult
      },
      {
        path: '/tp-search-result',
        name: 'TPSearchResult',
        component: TPSearchResult
      },
      {
        path: '/tp-grid',
        name: 'TPGrid',
        component: TPGrid
      },
      {
        path: '/tp-search',
        name: 'TPSearch',
        component: TPSearch
      },
      {
        path: '/cp-grid',
        name: 'CPGrid',
        component: CPGrid
      },
      {
        path: '/cp-search',
        name: 'CPSearch',
        component: CPSearch
      },
      {
        path: '/cp-search-result',
        name: 'CPSearchResult',
        component: CPSearchResult
      },
      {
        path: '/wishlist',
        name: 'WishList',
        component: WishList
      },
      {
        path: '/create-wishlist',
        name: 'CreateWishlist',
        component: CreateWishlist
      },
      {
        path: '/view-wishlist',
        name: 'ViewWishlist',
        component: ViewWishlist
      },
      {
        path: '/wishlist/:wishlistId',
        name: 'WishlistDetail',
        component: WishlistDetail,
        props: true // This allows route params to be passed as props
      },

    ]
  },


];



const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});
router.beforeEach((to, from, next) => {
  const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn')) || false;
  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) {
    next('/login'); // Redirect to login if not authenticated
  } else {
    next(); // Proceed to the route
  }
});

export default router;
