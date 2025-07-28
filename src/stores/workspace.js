import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useWorkspaceStore = defineStore('workspace', () => {
  // Workspace 데이터
  const workspaces = ref([
    { id: 1, name: 'AI솔루션팀', level: 0, isCustom: false },
    { id: 2, name: 'AI사업팀', level: 0, isCustom: false },
    { id: 3, name: 'XXXX팀', level: 0, isCustom: false },
    { id: 4, name: 'AI솔루션개발팀', level: 1, parentId: 1, isCustom: false },
    {
      id: 5,
      name: 'AI솔루션테스트팀',
      level: 1,
      parentId: 1,
      isCustom: false,
    },
    { id: 6, name: 'XXX프로젝트 TF', level: 2, parentId: 4, isCustom: true },
    { id: 7, name: 'YYY프로젝트 TF', level: 2, parentId: 5, isCustom: true },
  ]);

  // 선택된 Workspace
  const selectedWorkspace = ref(workspaces.value[0]);

  // Workspace 추가
  function addWorkspace(workspaceData) {
    const newId = Math.max(...workspaces.value.map(w => w.id)) + 1;
    const newWorkspace = {
      id: newId,
      isCustom: true, // 새로 추가하는 workspace는 항상 Custom
      ...workspaceData,
    };
    workspaces.value.push(newWorkspace);
    return newWorkspace;
  }

  // Workspace 선택
  function selectWorkspace(workspace) {
    selectedWorkspace.value = workspace;
  }

  // Workspace 업데이트
  function updateWorkspace(id, updates) {
    const index = workspaces.value.findIndex(w => w.id === id);
    if (index !== -1) {
      workspaces.value[index] = { ...workspaces.value[index], ...updates };
    }
  }

  // Workspace 삭제
  function removeWorkspace(id) {
    const index = workspaces.value.findIndex(w => w.id === id);
    if (index !== -1) {
      workspaces.value.splice(index, 1);
    }
  }

  // 들여쓰기 레벨 계산 함수
  const getIndentLevel = name => {
    const dashCount = (name.match(/-/g) || []).length;
    return dashCount * 20; // 대시 하나당 20px 들여쓰기
  };

  // 표시용 Workspace명 추출 함수 (대시 제거)
  const getDisplayName = name => {
    return name.replace(/^-+/, ''); // 앞의 대시들 제거
  };

  // 계층 구조별 Workspace 목록
  const workspacesByLevel = computed(() => {
    const result = {};
    workspaces.value.forEach(workspace => {
      if (!result[workspace.level]) {
        result[workspace.level] = [];
      }
      result[workspace.level].push(workspace);
    });
    return result;
  });

  // 특정 Workspace의 하위 Workspace들
  const getChildWorkspaces = parentId => {
    return workspaces.value.filter(w => w.parentId === parentId);
  };

  // 특정 Workspace의 상위 Workspace들 (경로)
  const getWorkspacePath = workspaceId => {
    const path = [];
    let current = workspaces.value.find(w => w.id === workspaceId);

    while (current) {
      path.unshift(current);
      current = workspaces.value.find(w => w.id === current.parentId);
    }

    return path;
  };

  return {
    // State
    workspaces,
    selectedWorkspace,

    // Actions
    addWorkspace,
    selectWorkspace,
    updateWorkspace,
    removeWorkspace,

    // Getters
    workspacesByLevel,
    getChildWorkspaces,
    getWorkspacePath,

    // Utils
    getIndentLevel,
    getDisplayName,
  };
});
