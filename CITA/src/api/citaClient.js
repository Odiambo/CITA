'use client';

import { appParams } from '@/lib/app-params';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

const {
  supabaseUrl,
  supabasePublishableKey,
  participantsTable,
  usersTable,
  localBypassAuth,
  localUser,
  authRedirectPath,
} = appParams;

const hasSupabaseConfig = Boolean(supabaseUrl && supabasePublishableKey);

let browserSupabase = null;

export const getSupabase = () => {
  if (!hasSupabaseConfig || typeof window === 'undefined') return null;
  if (!browserSupabase) {
    browserSupabase = createBrowserSupabaseClient();
  }
  return browserSupabase;
};

const sortToOrder = (sort) => {
  const value = sort || 'created_date';
  const descending = value.startsWith('-');
  const rawColumn = descending ? value.slice(1) : value;
  const column = rawColumn === 'created_date' ? 'created_at' : rawColumn;
  return { column, ascending: !descending };
};

const toAppRow = (row) => {
  if (!row) return row;
  return {
    ...row,
    created_date: row.created_date || row.created_at || null,
  };
};

const fromAppPayload = (payload) => {
  if (!payload) return payload;
  const next = { ...payload };
  if (next.created_date && !next.created_at) {
    next.created_at = next.created_date;
  }
  delete next.created_date;
  return next;
};

const ensureSupabase = () => {
  if (getSupabase()) return;
  throw new Error(
    'Missing Supabase environment. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
  );
};

const getCurrentUser = async () => {
  const supabase = getSupabase();
  if (!supabase) {
    return localBypassAuth ? localUser : null;
  }

  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  const authUser = data?.user;

  if (!authUser) {
    return localBypassAuth ? localUser : null;
  }

  const { data: profileData } = await supabase
    .from(usersTable)
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  return {
    id: authUser.id,
    email: authUser.email,
    full_name: profileData?.full_name || authUser.email,
    role: profileData?.role || 'participant',
    created_date: profileData?.created_date || profileData?.created_at || authUser.created_at,
  };
};

const createAuditEvent = async (event) => {
  const supabase = getSupabase();
  if (!supabase) return null;
  const me = await getCurrentUser().catch(() => null);
  const { data, error } = await supabase
    .from('audit_events')
    .insert({
      actor_id: me?.id || null,
      actor_email: me?.email || null,
      ...event,
    })
    .select('*')
    .single();
  if (error) {
    console.warn('[CITA audit] event was not recorded:', error);
    return null;
  }
  return data;
};

const createStageEvent = async ({ participantId, fromStage, toStage }) => {
  const supabase = getSupabase();
  if (!supabase || !participantId || !toStage || fromStage === toStage) return null;
  const me = await getCurrentUser().catch(() => null);
  const { data, error } = await supabase
    .from('participant_stage_events')
    .insert({
      participant_id: participantId,
      from_stage: fromStage || null,
      to_stage: toStage,
      changed_by: me?.id || null,
    })
    .select('*')
    .single();
  if (error) {
    console.warn('[CITA stage event] transition was not recorded:', error);
    return null;
  }
  return data;
};

const participants = {
  async list(sort = '-created_date', limit = 200) {
    ensureSupabase();
    const supabase = getSupabase();
    const { column, ascending } = sortToOrder(sort);
    const { data, error } = await supabase
      .from(participantsTable)
      .select('*')
      .order(column, { ascending })
      .limit(limit);
    if (error) throw error;
    return (data || []).map(toAppRow);
  },

  async filter(criteria = {}) {
    ensureSupabase();
    const supabase = getSupabase();
    let query = supabase.from(participantsTable).select('*');
    Object.entries(criteria).forEach(([key, value]) => {
      const column = key === 'created_date' ? 'created_at' : key;
      query = query.eq(column, value);
    });
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(toAppRow);
  },

  async getById(id) {
    const rows = await participants.filter({ id });
    return rows[0] || null;
  },

  async create(payload) {
    ensureSupabase();
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from(participantsTable)
      .insert(fromAppPayload(payload))
      .select('*')
      .single();
    if (error) throw error;
    await createAuditEvent({
      action: 'participant.created',
      entity_type: 'participant',
      entity_id: data.id,
      after: data,
    });
    return toAppRow(data);
  },

  async update(id, payload) {
    ensureSupabase();
    const supabase = getSupabase();
    const before = await participants.getById(id);
    const { data, error } = await supabase
      .from(participantsTable)
      .update(fromAppPayload(payload))
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;

    if (payload.stage && payload.stage !== before?.stage) {
      await createStageEvent({
        participantId: id,
        fromStage: before?.stage,
        toStage: payload.stage,
      });
    }

    await createAuditEvent({
      action: payload.stage ? 'participant.stage_updated' : 'participant.updated',
      entity_type: 'participant',
      entity_id: id,
      before,
      after: data,
    });
    return toAppRow(data);
  },
};

const users = {
  async list(sort = '-created_date', limit = 200) {
    const supabase = getSupabase();
    if (!supabase) {
      return localBypassAuth ? [localUser] : [];
    }

    const { column, ascending } = sortToOrder(sort);
    const { data, error } = await supabase
      .from(usersTable)
      .select('*')
      .order(column, { ascending })
      .limit(limit);

    if (error) {
      const me = await getCurrentUser();
      return me ? [toAppRow(me)] : [];
    }

    return (data || []).map(toAppRow);
  },

  async updateRole(userId, role) {
    ensureSupabase();
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc('update_user_role', {
      target_user_id: userId,
      next_role: role,
    });
    if (error) throw error;
    return toAppRow(data);
  },

  async inviteUser() {
    throw new Error('Role assignment requires an admin or exec_director through updateRole.');
  },
};

const analytics = {
  async dashboardSummary() {
    ensureSupabase();
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc('get_dashboard_summary');
    if (error) throw error;
    return data;
  },

  async predictiveReadiness() {
    ensureSupabase();
    const supabase = getSupabase();
    const { data, error } = await supabase.rpc('get_predictive_readiness');
    if (error) throw error;
    return data;
  },
};

const appointments = {
  async listForParticipant(participantId) {
    ensureSupabase();
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('participant_id', participantId)
      .order('starts_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },
};

const auth = {
  async me() {
    const me = await getCurrentUser();
    if (!me) {
      throw new Error('auth_required');
    }
    return me;
  },

  async logout(redirectUrl = '/') {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = redirectUrl;
  },

  redirectToLogin() {
    if (localBypassAuth) {
      return;
    }
    window.location.href = authRedirectPath;
  },

  async updateMe(payload) {
    const me = await getCurrentUser();
    if (!me) throw new Error('auth_required');
    const { role: _role, ...safePayload } = payload || {};

    const supabase = getSupabase();
    if (!supabase) {
      return { ...me, ...safePayload };
    }

    const { data, error } = await supabase
      .from(usersTable)
      .update(safePayload)
      .eq('id', me.id)
      .select('*')
      .single();
    if (error) throw error;
    await createAuditEvent({
      action: 'profile.updated',
      entity_type: 'profile',
      entity_id: me.id,
      after: data,
    });
    return toAppRow(data);
  },
};

const notifications = {
  Core: {
    async SendEmail(message) {
      console.info('[Email adapter fallback] Configure a provider for production:', message);
      return { ok: true, mode: 'local_stub' };
    },
  },
};

export const cita = {
  auth,
  users,
  participants,
  analytics,
  appointments,
  integrations: notifications,
  getSupabase,
};
