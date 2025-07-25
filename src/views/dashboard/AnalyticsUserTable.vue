<script setup>
import avatar1 from '@images/avatars/avatar-1.png';
import avatar2 from '@images/avatars/avatar-2.png';
import avatar3 from '@images/avatars/avatar-3.png';
import avatar4 from '@images/avatars/avatar-4.png';
import avatar5 from '@images/avatars/avatar-5.png';
import avatar6 from '@images/avatars/avatar-6.png';
import avatar7 from '@images/avatars/avatar-7.png';
import avatar8 from '@images/avatars/avatar-8.png';

const headers = [
  {
    title: 'User',
    key: 'username',
  },
  {
    title: 'Email',
    key: 'email',
  },
  {
    title: 'Role',
    key: 'role',
  },
  {
    title: 'Status',
    key: 'status',
  },
];

const userData = [
  {
    id: 1,
    fullName: '최지은',
    company: 'Yotz PVT LTD',
    role: 'Super Admin',
    username: 'choejieun',
    country: '대한민국',
    contact: '(010) 232-9151',
    email: 'choejieun@hanwha.com',
    currentPlan: 'enterprise',
    status: 'inactive',
    avatar: avatar1,
  },
  {
    id: 3,
    fullName: '박서준',
    company: 'Oozz PVT LTD',
    role: 'Workspace Admin',
    username: 'parkseojun',
    country: '대한민국',
    contact: '(010) 264-4599',
    email: 'parkseojun@hanwha.com',
    currentPlan: 'enterprise',
    status: 'active',
    avatar: avatar3,
  },
  {
    id: 4,
    fullName: '이하늘',
    company: 'Oozz PVT LTD',
    role: 'Super Operator',
    username: 'leehaneul',
    country: '대한민국',
    contact: '(010) 690-6806',
    email: 'leehaneul@hanwha.com',
    currentPlan: 'team',
    status: 'inactive',
    avatar: avatar4,
  },
  {
    id: 5,
    fullName: '정유진',
    company: 'Aimbo PVT LTD',
    role: 'Tenant Admin',
    username: 'jungyujin',
    country: '대한민국',
    contact: '(010) 914-1078',
    email: 'jungyujin@hanwha.com',
    currentPlan: 'enterprise',
    status: 'pending',
    avatar: avatar5,
  },
  {
    id: 7,
    fullName: '한지민',
    company: 'Jazzy PVT LTD',
    role: 'Super Admin',
    username: 'hanjimin',
    country: '대한민국',
    contact: '(010) 977-8152',
    email: 'hanjimin@hanwha.com',
    currentPlan: 'company',
    status: 'pending',
    avatar: avatar7,
  },
  {
    id: 9,
    fullName: '장민호',
    company: 'Hanwha PVT LTD',
    role: 'Member',
    username: 'jangminho',
    country: '대한민국',
    contact: '(010) 123-4567',
    email: 'jangminho@hanwha.com',
    currentPlan: 'company',
    status: 'active',
    avatar: avatar1,
  },
  {
    id: 10,
    fullName: '신유라',
    company: 'Hanwha PVT LTD',
    role: 'Member',
    username: 'shinyura',
    country: '대한민국',
    contact: '(010) 987-6543',
    email: 'shinyura@hanwha.com',
    currentPlan: 'team',
    status: 'inactive',
    avatar: avatar2,
  },
];

const resolveUserRoleVariant = role => {
  const roleLowerCase = role.toLowerCase();
  if (roleLowerCase === 'subscriber')
    return {
      color: 'success',
      icon: 'ri-user-line',
    };
  if (roleLowerCase.includes('operator'))
    return {
      color: 'error',
      icon: 'ri-computer-line',
    };
  if (roleLowerCase === 'maintainer')
    return {
      color: 'info',
      icon: 'ri-pie-chart-line',
    };
  if (roleLowerCase === 'editor')
    return {
      color: 'warning',
      icon: 'ri-edit-box-line',
    };
  if (
    roleLowerCase === 'admin' ||
    roleLowerCase === 'super admin' ||
    roleLowerCase === 'tenant admin' ||
    roleLowerCase === 'workspace admin'
  )
    return {
      color: 'primary',
      icon: 'ri-vip-crown-line',
    };

  return {
    color: 'success',
    icon: 'ri-user-line',
  };
};

const resolveUserStatusVariant = stat => {
  const statLowerCase = stat.toLowerCase();
  if (statLowerCase === 'pending') return 'warning';
  if (statLowerCase === 'active') return 'success';
  if (statLowerCase === 'inactive') return 'secondary';

  return 'primary';
};
</script>

<template>
  <VCard>
    <VDataTable
      :headers="headers"
      :items="userData"
      item-value="id"
      class="text-no-wrap"
    >
      <!-- User -->
      <template #item.username="{ item }">
        <div class="d-flex align-center gap-x-4">
          <VAvatar
            size="34"
            :variant="!item.avatar ? 'tonal' : undefined"
            :color="
              !item.avatar ? resolveUserRoleVariant(item.role).color : undefined
            "
          >
            <VImg v-if="item.avatar" :src="item.avatar" />
          </VAvatar>

          <div class="d-flex flex-column">
            <h6 class="text-h6 font-weight-medium user-list-name">
              {{ item.fullName }}
            </h6>

            <span class="text-sm text-medium-emphasis"
              >@{{ item.username }}</span
            >
          </div>
        </div>
      </template>
      <!-- Role -->
      <template #item.role="{ item }">
        <div class="d-flex gap-4">
          <VIcon
            :icon="resolveUserRoleVariant(item.role).icon"
            :color="resolveUserRoleVariant(item.role).color"
            size="22"
          />
          <div class="text-capitalize text-high-emphasis">
            {{ item.role }}
          </div>
        </div>
      </template>
      <!-- Plan -->
      <template #item.plan="{ item }">
        <span class="text-capitalize text-high-emphasis">{{
          item.currentPlan
        }}</span>
      </template>
      <!-- Status -->
      <template #item.status="{ item }">
        <VChip
          :color="resolveUserStatusVariant(item.status)"
          size="small"
          class="text-capitalize"
        >
          {{ item.status }}
        </VChip>
      </template>

      <template #bottom />
    </VDataTable>
  </VCard>
</template>
