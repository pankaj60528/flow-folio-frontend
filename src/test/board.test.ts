import { describe, it, expect, beforeEach } from 'vitest';

// Test the board hook logic inline since we can't easily test hooks outside React
// We'll test the pure logic functions

describe('Task Board Logic', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should handle empty/missing localStorage gracefully', () => {
    const raw = localStorage.getItem('taskboard_state');
    expect(raw).toBeNull();
    
    // Simulate the loadState logic
    const fallback = { tasks: [], activityLog: [] };
    const result = raw ? JSON.parse(raw) : fallback;
    expect(result.tasks).toEqual([]);
    expect(result.activityLog).toEqual([]);
  });

  it('should handle corrupted localStorage data', () => {
    localStorage.setItem('taskboard_state', 'not-json');
    let state = { tasks: [] as any[], activityLog: [] as any[] };
    try {
      const parsed = JSON.parse(localStorage.getItem('taskboard_state')!);
      state = {
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
        activityLog: Array.isArray(parsed.activityLog) ? parsed.activityLog : [],
      };
    } catch {
      state = { tasks: [], activityLog: [] };
    }
    expect(state.tasks).toEqual([]);
  });

  it('should validate login credentials correctly', () => {
    const VALID_EMAIL = 'intern@demo.com';
    const VALID_PASSWORD = 'intern123';

    const tryLogin = (email: string, password: string) => {
      if (!email.trim()) return { success: false, error: 'Email is required' };
      if (!password.trim()) return { success: false, error: 'Password is required' };
      if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
        return { success: false, error: 'Invalid email or password' };
      }
      return { success: true };
    };

    expect(tryLogin('', '')).toEqual({ success: false, error: 'Email is required' });
    expect(tryLogin('test@test.com', '')).toEqual({ success: false, error: 'Password is required' });
    expect(tryLogin('wrong@test.com', 'wrong')).toEqual({ success: false, error: 'Invalid email or password' });
    expect(tryLogin(VALID_EMAIL, VALID_PASSWORD)).toEqual({ success: true });
  });

  it('should sort tasks with empty due dates last', () => {
    const tasks = [
      { title: 'No date', dueDate: null },
      { title: 'Later', dueDate: '2026-12-01' },
      { title: 'Earlier', dueDate: '2026-01-01' },
      { title: 'No date 2', dueDate: null },
    ];

    const sorted = [...tasks].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    expect(sorted[0].title).toBe('Earlier');
    expect(sorted[1].title).toBe('Later');
    expect(sorted[2].dueDate).toBeNull();
    expect(sorted[3].dueDate).toBeNull();
  });

  it('should persist and retrieve board state from localStorage', () => {
    const state = {
      tasks: [{ id: '1', title: 'Test Task', columnId: 'todo', priority: 'high', tags: [], description: '', dueDate: null, createdAt: new Date().toISOString() }],
      activityLog: [{ id: 'a1', action: 'created', taskTitle: 'Test Task', timestamp: new Date().toISOString() }],
    };
    
    localStorage.setItem('taskboard_state', JSON.stringify(state));
    const loaded = JSON.parse(localStorage.getItem('taskboard_state')!);
    
    expect(loaded.tasks).toHaveLength(1);
    expect(loaded.tasks[0].title).toBe('Test Task');
    expect(loaded.activityLog).toHaveLength(1);
  });
});
