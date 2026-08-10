export const ROLES = {
  ADMIN: 'admin',
  EXEC_DIRECTOR: 'exec_director',
  INTAKE_ADMIN: 'intake_admin',
  PROGRAM_DIRECTOR: 'program_director',
  PROGRAM_EDUCATOR: 'program_educator',
  DATA_OFFICER: 'data_officer',
  VIEWER: 'viewer',
  PARTICIPANT: 'participant',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.EXEC_DIRECTOR]: 'Exec. Director',
  [ROLES.INTAKE_ADMIN]: 'Intake Admin',
  [ROLES.PROGRAM_DIRECTOR]: 'Program Director',
  [ROLES.PROGRAM_EDUCATOR]: 'Program Educator',
  [ROLES.DATA_OFFICER]: 'Data Officer',
  [ROLES.VIEWER]: 'Viewer',
  [ROLES.PARTICIPANT]: 'Participant',
};

export const ROLE_GROUPS = {
  roleManagers: [ROLES.ADMIN, ROLES.EXEC_DIRECTOR],
  operationalEditors: [ROLES.INTAKE_ADMIN, ROLES.PROGRAM_DIRECTOR, ROLES.PROGRAM_EDUCATOR],
  dashboardViewers: [ROLES.EXEC_DIRECTOR, ROLES.DATA_OFFICER],
  dashboardConfigEditors: [ROLES.DATA_OFFICER],
  externalDataOperators: [ROLES.DATA_OFFICER],
  readOnlyStaff: [ROLES.DATA_OFFICER, ROLES.VIEWER],
};

export const canViewDashboard = (role) => ROLE_GROUPS.dashboardViewers.includes(role);
export const canConfigureDashboard = (role) => ROLE_GROUPS.dashboardConfigEditors.includes(role);
export const canEditOperationalRecords = (role) => ROLE_GROUPS.operationalEditors.includes(role);
export const canManageRoles = (role) => ROLE_GROUPS.roleManagers.includes(role);
