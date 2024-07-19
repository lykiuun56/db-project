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
    name: 'ManagermentEmail',
    component: ManagementEmail
  },
  {
    path:'/remove-duplicate',
    name: 'RemoveDupliate',
    component: RemoveDuplicate
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
