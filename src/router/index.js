import { createRouter, createWebHistory } from 'vue-router';
import TotalDatabase from '@/views/TotalDatabase.vue';
import TotalDatabaseHome from '@/views/TotalDatabaseHome.vue';
import AddToDatabase from '@/views/AddToDatabase.vue';
import RemoveFromDatabase from '@/views/RemoveFromDatabase.vue'; 
import ChangeInfo from '@/views/ChangeInfo.vue'; 
import FindCreator from '@/views/FindCreator.vue';
import CollaboratedDatabase from "@/views/CollaboratedDatabase.vue";
import BlackList from "@/views/BlackList.vue";
import ManagementEmail from "@/views/ManagementEmail.vue";
import RemoveDuplicate from "@/views/RemoveDuplicate.vue";

import TiktokHome from '@/TiktokService/Tiktokhome.vue'
import TiktokHash from '@/TiktokService/TiktokHash.vue'
import TiktokHandle from '@/TiktokService/TiktokHandle.vue';

import EmailExtra from '@/TiktokService/EmailExtra.vue';


import CDAdd from '@/CollaboratedDB/CDAdd.vue';
import CDFind from '@/CollaboratedDB/CDFind.vue';
import CDRemove from '@/CollaboratedDB/CDRemove.vue';
import CDChange from '@/CollaboratedDB/CDChange.vue';
import CDGrid from "@/CollaboratedDB/CDGrid.vue";

const routes = [
  {
    path: '/',
    name: 'TotalDatabase',
    component: TotalDatabase
  },
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
    path:'/remove-duplicate',
    name: 'RemoveDuplicate',
    component: RemoveDuplicate
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
  }
];



const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
