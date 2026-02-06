'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'

// ============== DEMO MODE CONFIG ==============
const DEMO_CONTACT_URL = 'https://whop.com/theta-trading' // REPLACE with your Whop/contact link

// ============== DEMO DATA (realistic trading performance) ==============
const DEMO_DATA = {
  trades: [
    { id: 1, date: '2026-02-06', time: '09:45', instrument: 'NQ', symbol: 'NQ', dir: 'LONG', pnl: 850, rr: '2.5:1', outcome: 'TP', strategy: 'ORB', session: 'NY', emotion: 'calm', notes: '#breakout Clean opening range break with volume confirmation.', tags: ['ORB', 'Breakout'], priceActionImage: '', orderflowImage: '' },
    { id: 2, date: '2026-02-06', time: '14:22', instrument: 'NQ', symbol: 'NQ', dir: 'SHORT', pnl: -320, rr: '1:1', outcome: 'SL', strategy: 'FVG', session: 'NY', emotion: 'anxious', notes: 'Entered too early. Should have waited for confirmation.', tags: ['FVG'], priceActionImage: '', orderflowImage: '' },
    { id: 3, date: '2026-02-05', time: '10:15', instrument: 'NQ', symbol: 'NQ', dir: 'LONG', pnl: 1200, rr: '3:1', outcome: 'TP', strategy: 'ICT', session: 'NY', emotion: 'confident', notes: '#liquidity Perfect liquidity sweep into FVG. Textbook.', tags: ['ICT', 'Liquidity'], priceActionImage: '', orderflowImage: '' },
    { id: 4, date: '2026-02-05', time: '15:30', instrument: 'NQ', symbol: 'NQ', dir: 'LONG', pnl: 450, rr: '1.5:1', outcome: 'TP', strategy: 'Scalp', session: 'NY', emotion: 'calm', notes: 'Quick scalp on momentum continuation.', tags: ['Scalp'], priceActionImage: '', orderflowImage: '' },
    { id: 5, date: '2026-02-04', time: '09:32', instrument: 'NQ', symbol: 'NQ', dir: 'SHORT', pnl: 680, rr: '2:1', outcome: 'TP', strategy: 'ORB', session: 'NY', emotion: 'confident', notes: 'Opening range breakdown. Clear seller control.', tags: ['ORB'], priceActionImage: '', orderflowImage: '' },
    { id: 6, date: '2026-02-04', time: '11:45', instrument: 'NQ', symbol: 'NQ', dir: 'LONG', pnl: -180, rr: '0.5:1', outcome: 'SL', strategy: 'Reversal', session: 'NY', emotion: 'frustrated', notes: 'Tried to catch falling knife. Poor discipline.', tags: ['Reversal'], priceActionImage: '', orderflowImage: '' },
    { id: 7, date: '2026-02-03', time: '10:00', instrument: 'NQ', symbol: 'NQ', dir: 'LONG', pnl: 920, rr: '2.8:1', outcome: 'TP', strategy: 'ICT', session: 'NY', emotion: 'calm', notes: 'Silver bullet setup at 10am. Perfect execution.', tags: ['ICT', 'Silver Bullet'], priceActionImage: '', orderflowImage: '' },
    { id: 8, date: '2026-02-03', time: '14:00', instrument: 'NQ', symbol: 'NQ', dir: 'SHORT', pnl: 550, rr: '1.8:1', outcome: 'TP', strategy: 'FVG', session: 'NY', emotion: 'confident', notes: 'Afternoon reversal from daily FVG.', tags: ['FVG'], priceActionImage: '', orderflowImage: '' },
    { id: 9, date: '2026-01-31', time: '09:50', instrument: 'NQ', symbol: 'NQ', dir: 'LONG', pnl: 1100, rr: '2.2:1', outcome: 'TP', strategy: 'ORB', session: 'NY', emotion: 'confident', notes: 'Strong trend day. Held full position.', tags: ['ORB', 'Trend'], priceActionImage: '', orderflowImage: '' },
    { id: 10, date: '2026-01-30', time: '10:30', instrument: 'NQ', symbol: 'NQ', dir: 'SHORT', pnl: 780, rr: '2.6:1', outcome: 'TP', strategy: 'ICT', session: 'NY', emotion: 'calm', notes: 'FOMC day reversal. Patient entry.', tags: ['ICT', 'FOMC'], priceActionImage: '', orderflowImage: '' },
  ],
  tasks: [
    { id: 1, title: 'Review weekly trading journal', done: true, urgent: true, important: true, deadline: '2026-02-06', projectId: 1, order: 1 },
    { id: 2, title: 'Backtest new ICT strategy', done: false, urgent: false, important: true, deadline: '2026-02-08', projectId: 1, order: 2 },
    { id: 3, title: 'Update risk management rules', done: true, urgent: true, important: true, deadline: '2026-02-05', projectId: 1, order: 3 },
    { id: 4, title: 'Record YouTube video on ORB', done: false, urgent: true, important: true, deadline: '2026-02-07', projectId: 2, order: 1 },
    { id: 5, title: 'Plan Discord community event', done: false, urgent: false, important: false, deadline: '2026-02-10', projectId: 2, order: 2 },
    { id: 6, title: 'Morning meditation', done: true, urgent: false, important: true, deadline: '2026-02-06', order: 4 },
    { id: 7, title: 'Cold shower protocol', done: true, urgent: false, important: true, deadline: '2026-02-06', order: 5 },
    { id: 8, title: 'Analyze last week P&L', done: true, urgent: true, important: true, deadline: '2026-02-06', projectId: 1, order: 6 },
  ],
  projects: [
    { id: 1, name: 'Trading System Optimization', color: '#8b5cf6', tasks: 4, completed: 3, deadline: '2026-02-28' },
    { id: 2, name: 'Content Creation', color: '#22c55e', tasks: 2, completed: 0, deadline: '2026-02-15' },
    { id: 3, name: 'Community Growth', color: '#f59e0b', tasks: 3, completed: 1, deadline: '2026-03-01' },
  ],
  habits: [
    { id: 1, name: 'Morning Routine', icon: '🌅', done: true, streak: 47, target: 1, current: 1, unit: 'times' },
    { id: 2, name: 'Meditation', icon: '🧘', done: true, streak: 32, target: 20, current: 20, unit: 'min' },
    { id: 3, name: 'Cold Shower', icon: '🚿', done: true, streak: 28, target: 3, current: 3, unit: 'min' },
    { id: 4, name: 'Workout', icon: '💪', done: false, streak: 15, target: 1, current: 0, unit: 'times' },
    { id: 5, name: 'Reading', icon: '📚', done: true, streak: 21, target: 30, current: 35, unit: 'min' },
    { id: 6, name: 'Journal', icon: '📝', done: true, streak: 54, target: 1, current: 1, unit: 'times' },
  ],
  diary: [
    { id: 1, date: '2026-02-06', content: 'Feeling focused and ready. HRV is excellent, slept 8h. Goals: stick to the plan, no revenge trading. Market looks bullish but will wait for confirmation.', mood: 'great', aiAnalysis: 'Strong positive mindset. High correlation with winning days historically (78% win rate in similar states).' },
    { id: 2, date: '2026-02-05', content: 'Excellent trading day. Followed rules perfectly. The ICT setup was textbook. Need to remember this feeling of discipline.', mood: 'great', aiAnalysis: 'Peak performance state detected. Emotion regulation excellent.' },
    { id: 3, date: '2026-02-04', content: 'Mixed day. One good trade, one bad. The reversal attempt was a mistake. Need to wait for confirmation.', mood: 'neutral', aiAnalysis: 'Self-awareness present. Learning from mistakes is positive.' },
  ],
  transactions: [
    { id: 1, date: '2026-02-06', description: 'Trading P&L', amount: 530, category: 'Trading', type: 'income' },
    { id: 2, date: '2026-02-05', description: 'Trading P&L', amount: 1650, category: 'Trading', type: 'income' },
    { id: 3, date: '2026-02-04', description: 'Trading P&L', amount: 500, category: 'Trading', type: 'income' },
    { id: 4, date: '2026-02-03', description: 'Trading P&L', amount: 1470, category: 'Trading', type: 'income' },
    { id: 5, date: '2026-02-01', description: 'Whop Membership Revenue', amount: 8550, category: 'Business', type: 'income' },
    { id: 6, date: '2026-02-01', description: 'TradingView Pro', amount: -59.95, category: 'Software', type: 'expense' },
    { id: 7, date: '2026-02-01', description: 'Discord Nitro', amount: -9.99, category: 'Software', type: 'expense' },
    { id: 8, date: '2026-01-28', description: 'Trading P&L', amount: 2340, category: 'Trading', type: 'income' },
  ],
  events: [
    { id: 1, title: 'NY Session Trading', date: '2026-02-06', time: '09:30', duration: 180, color: '#8b5cf6', description: 'Main trading session' },
    { id: 2, title: 'Team Call', date: '2026-02-06', time: '15:00', duration: 60, color: '#22c55e', description: 'Weekly sync' },
    { id: 3, title: 'Content Recording', date: '2026-02-07', time: '14:00', duration: 120, color: '#f59e0b', description: 'YouTube video' },
  ],
  resources: [
    { id: 1, name: 'ICT Mentorship Notes', notes: 'Complete notes from ICT mentorship 2022-2024. All concepts and setups.', link: '', fileName: 'ICT_Notes.pdf', fileData: '', category: 'Trading', tags: ['ICT', 'Strategy'], createdAt: '2026-01-15' },
    { id: 2, name: 'Risk Calculator', notes: 'Position sizing calculator based on account and risk %.', link: '', fileName: 'Risk_Calc.xlsx', fileData: '', category: 'Tools', tags: ['Risk', 'Calculator'], createdAt: '2026-01-10' },
    { id: 3, name: 'Trading in the Zone Notes', notes: 'Key takeaways from Mark Douglas book.', link: '', fileName: '', fileData: '', category: 'Books', tags: ['Psychology'], createdAt: '2026-01-08' },
    { id: 4, name: 'ORB Playbook', notes: 'Opening Range Breakout strategy rules and examples.', link: '', fileName: 'ORB_Playbook.pdf', fileData: '', category: 'Trading', tags: ['ORB', 'Strategy'], createdAt: '2026-01-20' },
  ],
  backtest: [
    { id: 1, date: '2026-01-28', setup: 'ORB Long', result: 'win', rr: '2.5', notes: 'Clean break with volume', tags: ['ORB'] },
    { id: 2, date: '2026-01-28', setup: 'FVG Short', result: 'win', rr: '1.8', notes: 'Perfect fill and rejection', tags: ['FVG'] },
    { id: 3, date: '2026-01-27', setup: 'ICT Silver Bullet', result: 'win', rr: '3.2', notes: 'Textbook 10am setup', tags: ['ICT'] },
    { id: 4, date: '2026-01-27', setup: 'ORB Short', result: 'loss', rr: '-1', notes: 'Fakeout', tags: ['ORB'] },
    { id: 5, date: '2026-01-26', setup: 'Liquidity Sweep', result: 'win', rr: '2.1', notes: 'Clear stop hunt', tags: ['ICT'] },
  ],
  behaviors: [
    { id: 1, label: 'Pre-market analysis completed', sort_order: 1 },
    { id: 2, label: 'Risk defined before entry', sort_order: 2 },
    { id: 3, label: 'No revenge trading', sort_order: 3 },
    { id: 4, label: 'Followed trading plan', sort_order: 4 },
    { id: 5, label: 'Stopped at daily loss limit', sort_order: 5 },
  ],
  checklist: [
    { id: 1, label: 'Check economic calendar', sort_order: 1 },
    { id: 2, label: 'Review overnight price action', sort_order: 2 },
    { id: 3, label: 'Mark key levels on chart', sort_order: 3 },
    { id: 4, label: 'Set alerts', sort_order: 4 },
  ],
  health: { resilience: 85, readiness: 88, sleep: 92, activity: 72, heartRate: 54, stress: 18, hrv: 58 },
  deepWork: {
    isActive: false, mode: 'idle' as const, currentBlock: 0, blockTime: 0, blockDuration: 0,
    totalDeepMinutes: 145, sessionsToday: 2, weeklyMinutes: 680, flowScore: 82, optimalTime: '06:00',
    history: [
      { date: '2026-02-05', minutes: 150, blocks: 3, avgFlowScore: 85 },
      { date: '2026-02-04', minutes: 120, blocks: 2, avgFlowScore: 78 },
      { date: '2026-02-03', minutes: 180, blocks: 4, avgFlowScore: 88 },
    ],
    correlations: [
      { condition: 'HRV > 50ms + Sleep > 85%', tradingWinRate: 78, productivity: 92 },
      { condition: 'Morning session (6-10am)', tradingWinRate: 72, productivity: 88 },
    ]
  },
  automation: {
    discord: { connected: true, botActive: true, autoShare: true, dailyDigest: true, memberCount: 1247, engagement: 13 },
    youtube: { connected: true, subscribers: 8934, videoCount: 127, totalViews: 458000 },
    whop: { connected: true, members: 342, mrr: 8550, churnRisk: [{ name: 'Marco R.', risk: 78, suggestion: 'Send personalized check-in' }] }
  },
  sentiment: {
    marketSentiment: 72, vix: 14.8,
    diaryKeywords: ['✓ focused', '✓ disciplined', '✓ confident'],
    correlation: 'POSITIVE', warning: '',
    prediction: 'High alignment between mental state and market. Historical win rate: 74%.',
    historicalMatch: [
      { pattern: 'Good bio (HRV>50 + Readiness>85)', winRate: 78, trades: 45 },
      { pattern: 'Positive diary mood', winRate: 72, trades: 32 },
    ],
    lastUpdate: new Date(), loading: false
  },
  economicEvents: [
    { time: '08:30', name: 'Initial Jobless Claims', impact: 'medium', currency: 'USD' },
    { time: '10:00', name: 'ISM Services PMI', impact: 'high', currency: 'USD' },
    { time: '14:00', name: 'Fed Chair Powell Speaks', impact: 'high', currency: 'USD' },
  ],
  memberJourney: {
    funnel: { youtube: 8934, discord: 1247, whop: 342, advocates: 24 },
    automations: [
      { name: 'Welcome Sequence', status: 'active', converted: 67 },
      { name: 'Engagement Revival', status: 'active', converted: 23 },
      { name: 'Upgrade Nudge', status: 'active', converted: 89 }
    ]
  }
}

const Icons: Record<string, () => JSX.Element> = {
  dashboard: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>,
  tasks: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 12l2 2 4-4" style={{strokeLinecap:'round'}}/></svg>,
  calendar: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>,
  trading: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-6" style={{strokeLinecap:'round'}}/></svg>,
  health: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>,
  workout: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="1" y="8" width="4" height="8" rx="1"/><rect x="5" y="6" width="3" height="12" rx="1"/><rect x="16" y="6" width="3" height="12" rx="1"/><rect x="19" y="8" width="4" height="8" rx="1"/><rect x="8" y="10" width="8" height="4" rx="0.5"/></svg>,
  notion: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M4 4h10l6 6v10a2 2 0 01-2 2H4V4z"/><path d="M14 4v6h6"/><path d="M8 13h8M8 17h5"/></svg>,
  media: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  social: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
  ai: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>,
  backtest: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M3 3v18h18"/><path d="M7 12l3-3 3 3 4-4"/><circle cx="17" cy="8" r="2"/><path d="M20 14l-3-3"/></svg>,
  diary: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  insights: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z"/><path d="M9 21h6"/></svg>,
  mail: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>,
  meditate: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="4" r="2"/><path d="M12 6v4M8 14v6h8v-6M4 20l4-6M20 20l-4-6M8 14c0-2 1.5-4 4-4s4 2 4 4"/></svg>,
  shower: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M4 5h16v3H4z"/><path d="M6 12v2M10 11v3M14 12v2M18 11v3"/></svg>,
  journal: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h5"/></svg>,
  read: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M2 4c0 0 2-1 5-1s5 1 5 1v15c0 0-2-.5-5-.5s-5 .5-5 .5V4z"/><path d="M12 4c0 0 2-1 5-1s5 1 5 1v15c0 0-2-.5-5-.5s-5 .5-5 .5V4z"/></svg>,
  yoga: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="4" r="2"/><path d="M4 17l4-4 4 3 4-3 4 4"/><path d="M12 6v8M8 10l4 2 4-2"/></svg>,
  mic: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0014 0v-2M12 19v3M8 22h8"/></svg>,
  play: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  stop: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="4" y="4" width="16" height="16" rx="2"/></svg>,
  check: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'}}><path d="M20 6L9 17l-5-5"/></svg>,
  close: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'}}><path d="M18 6L6 18M6 6l12 12"/></svg>,
  plus: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'}}><path d="M12 5v14M5 12h14"/></svg>,
  edit: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  copy: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  upload: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>,
  drag: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/></svg>,
  spotify: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="12" r="10"/><path d="M8 15c2-1 4-1 6 0M7 12c3-1.5 6-1.5 9 0M6 9c4-2 8-2 12 0"/></svg>,
  folder: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M3 7c0-1.1.9-2 2-2h4l2 2h8c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V7z"/></svg>,
  brain: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z"/><path d="M9 21h6"/></svg>,
  undo: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'}}><path d="M3 7v6h6M3 13a9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9 9 9 0 01-6.36-2.64"/></svg>,
  keyboard: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M6 16h12" style={{strokeLinecap:'round'}}/></svg>,
  image: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  glucose: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  cold: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M12 2v20M2 12h20M6 6l12 12M18 6L6 18"/></svg>,
  wave: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M2 12c1.5-3 3-4 4.5-4s3 2 4.5 4 3 4 4.5 4 3-1 4.5-4"/></svg>,
  moon: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  discord: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M9 12a1 1 0 100 2 1 1 0 000-2zM15 12a1 1 0 100 2 1 1 0 000-2z"/><path d="M7.5 7.5c2-.5 4-.5 4.5-.5s2.5 0 4.5.5M7.5 16.5c2 .5 4 .5 4.5.5s2.5 0 4.5-.5"/><path d="M15.5 17c1 1.5 2 3 2.5 3.5 3-1 5-3 6-5-1-5-3-9-6-11-1 0-2.5.5-4 1M8.5 17c-1 1.5-2 3-2.5 3.5-3-1-5-3-6-5 1-5 3-9 6-11 1 0 2.5.5 4 1"/></svg>,
  youtube: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="2" y="5" width="20" height="14" rx="3"/><polygon points="10 8 16 12 10 16 10 8"/></svg>,
  robot: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="3" y="8" width="18" height="12" rx="2"/><circle cx="9" cy="14" r="1.5"/><circle cx="15" cy="14" r="1.5"/><path d="M12 2v4M8 8V6a4 4 0 018 0v2"/></svg>,
  link: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  zap: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  send: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  scan: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1"/></svg>,
  heart: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  share: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>,
  bookmark: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>,
  refresh: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  globe: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  search: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>,
  music: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  volume: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14"/></svg>,
  doc: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  table: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>,
  note: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/><path d="M14 2v6h6"/></svg>,
  x: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.4-8M20 4l-6.4 8"/></svg>,
  whop: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>,
  settings: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  star: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  chevronDown: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'}}><path d="M6 9l6 6 6-6"/></svg>,
  chevronRight: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round'}}><path d="M9 18l6-6-6-6"/></svg>,
  shield: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  activity: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  pulse: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M3 12h4l3-9 6 18 3-9h4"/></svg>,
  scale: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M12 3v18M3 9l3 6h6l3-6M3 9h12M15 9l3 6h3l3-6M15 9h6"/></svg>,
  clock: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  target: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  wallet: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20"/><circle cx="16" cy="14" r="2"/></svg>,
  steps: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M9 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-4 2-4 2 2.9 2 4z"/><path d="M19 12c0 1.1-.9 2-2 2s-2-.9-2-2 .9-4 2-4 2 2.9 2 4z"/><path d="M9 8c0 1.1-.9 2-2 2s-2-.9-2-2 .9-4 2-4 2 2.9 2 4z"/><path d="M19 4c0 .55-.45 1-1 1s-1-.45-1-1 .45-2 1-2 1 1.45 1 2z"/></svg>,
  flame: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M12 22c4.97 0 7-3.58 7-7 0-4-3-8-7-12-4 4-7 8-7 12 0 3.42 2.03 7 7 7z"/><path d="M12 22c-1.66 0-3-1.34-3-3 0-2 1.5-4 3-6 1.5 2 3 4 3 6 0 1.66-1.34 3-3 3z"/></svg>,
  bolt: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  route: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="5" r="3"/><path d="M12 8v4"/><path d="M6 16h12"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>,
  running: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="14" cy="4" r="2"/><path d="M18 10l-4-2-3 3-4-1-3 4"/><path d="M14 8l-1 5-5-1-2 4"/><path d="M8 16l-4 4M13 13l3 7"/></svg>,
  walking: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="4" r="2"/><path d="M12 6v6l-2 4M12 12l2 4"/><path d="M10 16l-2 6M14 16l2 6"/><path d="M9 9l-2 1M15 9l2 1"/></svg>,
  lotus: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M12 20c-4 0-7-3-7-7 0-2 1-4 3-5"/><path d="M12 20c4 0 7-3 7-7 0-2-1-4-3-5"/><path d="M12 20V10"/><path d="M8 8c0-3 2-6 4-6s4 3 4 6"/><path d="M4 13c-1-2 0-5 2-6M20 13c1-2 0-5-2-6"/></svg>,
  chair: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M5 11h14v2H5z"/><path d="M5 13v5M19 13v5"/><path d="M7 11V6a2 2 0 012-2h6a2 2 0 012 2v5"/><path d="M5 18h4M15 18h4"/></svg>,
  alert: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01" style={{strokeLinecap:'round'}}/></svg>,
  tag: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" style={{strokeLinejoin:'round'}}/><circle cx="7" cy="7" r="1" style={{fill:'currentColor'}}/></svg>,
  loading: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" style={{strokeLinecap:'round'}}/></svg>,
  ban: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/></svg>,
  halfMoon: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M12 3a9 9 0 109 9c0-1.5-.3-3-.9-4.3A7 7 0 017.7 3.9C9 3.3 10.5 3 12 3z"/></svg>,
  ruler: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M3 5h18v14H3z"/><path d="M6 5v3M9 5v5M12 5v3M15 5v5M18 5v3"/></svg>,
  flask: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M9 3h6M10 3v6l-5 8a2 2 0 001.7 3h10.6a2 2 0 001.7-3l-5-8V3"/><path d="M7 17h10"/></svg>,
  lightbulb: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-1 1h-6a1 1 0 01-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7z"/></svg>,
  trophy: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M6 9H3a1 1 0 01-1-1V5a1 1 0 011-1h3M18 9h3a1 1 0 001-1V5a1 1 0 00-1-1h-3"/><path d="M6 4h12v7a6 6 0 11-12 0V4z"/><path d="M12 17v3M8 22h8"/></svg>,
  list: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  mapPin: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M12 21s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 7.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>,
  trendUp: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>,
  recover: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="12" r="10"/><path d="M12 6v6"/><circle cx="12" cy="12" r="2" style={{fill:'currentColor'}}/></svg>,
  walk: () => <svg viewBox="0 0 24 24" style={{fill:'none',stroke:'currentColor',strokeWidth:1.5}}><circle cx="12" cy="4" r="2"/><path d="M7 20l3-6 2 1v5M17 20l-3-8-4 1"/></svg>,
}

const Icon = ({ name, size = 'md', color }: { name: string, size?: string, color?: string }) => {
  const I = Icons[name]; const c = size === 'sm' ? 'icon-sm' : size === 'lg' ? 'icon-lg' : size === 'xl' ? 'icon-xl' : 'icon'
  return <span className={c} style={{ color }}>{I ? <I /> : null}</span>
}

const themes = [
  { id: 'midnight', name: 'Midnight', colors: ['#8b5cf6', '#a78bfa', '#22c55e', '#030305'] },
  { id: 'ocean', name: 'Ocean', colors: ['#3b82f6', '#60a5fa', '#06b6d4', '#020617'] },
  { id: 'forest', name: 'Forest', colors: ['#22c55e', '#4ade80', '#10b981', '#020a05'] },
  { id: 'sunset', name: 'Sunset', colors: ['#f97316', '#fb923c', '#ef4444', '#0a0502'] },
  { id: 'lavender', name: 'Lavender', colors: ['#c084fc', '#d8b4fe', '#ec4899', '#05020a'] },
  { id: 'mono', name: 'Mono', colors: ['#529cca', '#4dab9a', '#e9a23b', '#191919'] },
  { id: 'ruby', name: 'Ruby', colors: ['#ef4444', '#f87171', '#f43f5e', '#050202'] },
  { id: 'gold', name: 'Gold', colors: ['#eab308', '#facc15', '#f59e0b', '#050402'] },
  { id: 'arctic', name: 'Arctic', colors: ['#38bdf8', '#7dd3fc', '#22d3ee', '#020508'] },
  { id: 'neon', name: 'Neon', colors: ['#00ff7f', '#7fff00', '#00ffff', '#000'] },
]

const eventCategories = [{ id: 'work', name: 'Work', color: 'cat-work' }, { id: 'trading', name: 'Trading', color: 'cat-trading' }, { id: 'personal', name: 'Personal', color: 'cat-personal' }, { id: 'health', name: 'Health', color: 'cat-health' }, { id: 'social', name: 'Social', color: 'cat-social' }]

const defaultExamCategories = ['Blood Test', 'ECG', 'MRI', 'X-Ray', 'Ultrasound', 'Eye Exam', 'Dental', 'Other']

const weeklyWorkouts: Record<string, { name: string; exercises: { id: number; name: string; duration?: number; reps?: number; type: string }[] }> = {
  monday: { name: 'Upper Body', exercises: [{ id: 1, name: 'Cat-Cow', duration: 60, type: 'yoga' }, { id: 2, name: 'Dumbbell Press', reps: 12, type: 'strength' }, { id: 3, name: 'Push-ups', reps: 15, type: 'strength' }] },
  tuesday: { name: 'Lower Body', exercises: [{ id: 1, name: 'Stretch', duration: 90, type: 'yoga' }, { id: 2, name: 'Goblet Squat', reps: 12, type: 'strength' }] },
  wednesday: { name: 'Full Body', exercises: [{ id: 1, name: 'Sun Salutation', duration: 180, type: 'yoga' }, { id: 2, name: 'Burpees', reps: 10, type: 'cardio' }] },
  thursday: { name: 'Upper Body', exercises: [{ id: 1, name: 'Arm Circles', duration: 60, type: 'warmup' }, { id: 2, name: 'Bench Press', reps: 12, type: 'strength' }] },
  friday: { name: 'Stretch', exercises: [{ id: 1, name: 'Full Body Stretch', duration: 300, type: 'yoga' }] },
}

interface Trade { id: number; date: string; time: string; symbol: string; dir: string; session: string; strategy: string; outcome: string; pnl: number; rr: string; notes: string; emotion: string; tags: string[]; priceActionImage: string; orderflowImage: string }
interface BacktestTrade { id: number; date: string; time: string; session: string; strategy: string; symbol: string; dir: string; entry: number; exit: number; sl: number; tp: number; rr: string; pnl: number; outcome: string; image: string; aiAnalyzed: boolean; tags: string[]; notes: string }
interface Strategy { id: number; name: string; trades: number; winRate: number; avgRR: number; totalPnl: number; expectancy: number }
interface Task { id: number; title: string; urgent: boolean; important: boolean; deadline: string; projectId: number | null; completed: boolean; order: number }
interface Project { id: number; name: string; color: string; deadline: string }
interface CalEvent { id: number; title: string; date: string; time: string; category: string }
interface Resource { id: number; name: string; notes: string; link: string; fileName: string; fileData: string; category: string; tags: string[]; createdAt: string }
interface DiaryEntry { id: number; date: string; content: string; mood: string; aiAnalysis: string }
interface HealthExam { id: number; name: string; date: string; category: string; file: string }
interface Habit { id: number; name: string; icon: string; color: string; done: boolean; streak: number }
interface MediaItem { id: number; url: string; type: 'image' | 'video' }
interface Trick { id: number; name: string; description: string; image: string; tags: string[]; createdAt: string }
interface WsFolder { id: string; name: string; parent_id: string | null; created_at: string; updated_at: string }
interface WsFile { id: string; name: string; type: 'document' | 'sheet' | 'link' | 'note'; content: any; folder_id: string | null; created_at: string; updated_at: string }

export default function Theta() {
  const [mounted, setMounted] = useState(false)
  const [isDemo, setIsDemo] = useState(true) // DEMO VERSION - Always demo mode
  const [theme, setTheme] = useState('mono')
  const [timezone, setTimezone] = useState('Europe/Rome')
  const [showThemes, setShowThemes] = useState(false)
  const [section, setSection] = useState('dashboard')
  // OAuth States
  const [googleUser, setGoogleUser] = useState<{email: string, name: string, picture: string} | null>(null)
  const [googleAccounts, setGoogleAccounts] = useState<{email: string, name: string, picture: string, token?: string}[]>([])
  const [spotifyUser, setSpotifyUser] = useState<{id: string, name: string, image: string} | null>(null)
  const [spotifyPlaying, setSpotifyPlaying] = useState<{playing: boolean, track?: {name: string, artist: string, image: string}} | null>(null)
  const [gmailEmails, setGmailEmails] = useState<{id: string, from: string, subject: string, snippet: string, unread: boolean, body?: string, date?: string, hasAttachment?: boolean, starred?: boolean, labels?: string[]}[]>([])
  const [gcalEvents, setGcalEvents] = useState<{id: string, title: string, start: string, end: string, calendarId?: string}[]>([])
  const [authLoading, setAuthLoading] = useState(false)
  const [selectedEmail, setSelectedEmail] = useState<{id: string, from: string, subject: string, snippet: string, body?: string} | null>(null)
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [showCompose, setShowCompose] = useState(false)
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' })
  const [replyTo, setReplyTo] = useState<{to: string, subject: string} | null>(null)
  // Mail filters & settings
  const [mailFolder, setMailFolder] = useState<'inbox' | 'sent' | 'starred' | 'spam' | 'trash'>('inbox')
  const [mailFilter, setMailFilter] = useState({ sender: '', hasAttachment: false, dateFrom: '', dateTo: '' })
  const [mailSignature, setMailSignature] = useState('')
  const [showMailSettings, setShowMailSettings] = useState(false)
  const [senderSuggestions, setSenderSuggestions] = useState<string[]>([])
  // Calendar multi-account
  const [calendarAccounts, setCalendarAccounts] = useState<{email: string, name: string, calendars: {id: string, name: string, color: string}[]}[]>([])
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>(['primary'])
  const [toasts, setToasts] = useState<{id:number,msg:string,type?:string}[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [contextMenu, setContextMenu] = useState<{x:number,y:number,type:string,item:any}|null>(null)
  const [navOrder, setNavOrder] = useState(['dashboard','tasks','calendar','trading','finance','biohacking','neuro','workout','resources','social','automation','mail','insights'])
  const [draggedNav, setDraggedNav] = useState<string|null>(null)
  const [pomodoroActive, setPomodoroActive] = useState(false)
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60)
  
  // === DEEP WORK MODE (Koe + Doris Flow Protocol) ===
  const [deepWork, setDeepWork] = useState<{
    isActive: boolean
    mode: 'build' | 'creative' | 'recovery' | 'idle'
    currentBlock: number // which block in the session (1-4)
    blockTime: number // seconds remaining in current block
    blockDuration: number // total seconds for current block
    totalDeepMinutes: number // today's accumulated deep work
    sessionsToday: number
    weeklyMinutes: number
    flowScore: number // 0-100 calculated from Oura
    optimalTime: string // suggested best time based on chronotype
    history: { date: string, minutes: number, blocks: number, avgFlowScore: number }[]
    correlations: { condition: string, tradingWinRate: number, productivity: number }[]
  }>({
    isActive: false,
    mode: 'idle',
    currentBlock: 0,
    blockTime: 0,
    blockDuration: 0,
    totalDeepMinutes: 0,
    sessionsToday: 0,
    weeklyMinutes: 0,
    flowScore: 0,
    optimalTime: '06:00',
    history: [],
    correlations: []
  })
  const [showDeepWorkModal, setShowDeepWorkModal] = useState(false)
  const [deepWorkConfig, setDeepWorkConfig] = useState({
    buildDuration: 50, // minutes
    creativeDuration: 20, // minutes (walk/think)
    recoveryDuration: 10, // minutes (boring break)
    blocksPerSession: 3,
    autoAdvance: true
  })
  
  const [health, setHealth] = useState({ resilience: 78, readiness: 82, sleep: 85, activity: 65, heartRate: 58, stress: 28, hrv: 50 })
  const [healthSource, setHealthSource] = useState<'loading'|'live'|'fallback'|'error'>('loading')
  const [healthLastUpdate, setHealthLastUpdate] = useState<Date|null>(null)
  const [ouraReport, setOuraReport] = useState<any>(null)
  const [ouraReportPeriod, setOuraReportPeriod] = useState<'daily'|'weekly'|'monthly'>('daily')
  const [ouraLoading, setOuraLoading] = useState(false)
  const [ouraTags, setOuraTags] = useState<{ enhanced: any[], legacy: any[] }>({ enhanced: [], legacy: [] })
  const [aiBodyRecap, setAiBodyRecap] = useState<string>('')
  const [aiBodyRecapLoading, setAiBodyRecapLoading] = useState(false)
  const [aiBodyRecapLastUpdate, setAiBodyRecapLastUpdate] = useState<Date|null>(null)
  const [notionDatabases, setNotionDatabases] = useState<any[]>([])
  const [notionPages, setNotionPages] = useState<any[]>([])
  const [notionSelectedDb, setNotionSelectedDb] = useState<string>('')
  const [notionPageContent, setNotionPageContent] = useState<any>(null)
  const [notionLoading, setNotionLoading] = useState(false)
  const [youtubeChannelData, setYoutubeChannelData] = useState<any>(null)
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([])
  const [marketData, setMarketData] = useState<{ price: number; change: number; changePercent: number; high: number; low: number } | null>(null)
  const [marketNews, setMarketNews] = useState<{ headline: string; source: string; url: string }[]>([])
  
  // Behaviors (dashboard only, editable)
  const [behaviors, setBehaviors] = useState<{id: number, label: string, sort_order?: number}[]>([])
  const [checkedBehaviors, setCheckedBehaviors] = useState<number[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('theta_behavior_checks_' + new Date().toISOString().slice(0, 10))
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [showBehaviorsModal, setShowBehaviorsModal] = useState(false)
  const [editingBehavior, setEditingBehavior] = useState<{id: number, label: string} | null>(null)
  
  // Checklist (dashboard only, editable)
  const [checklist, setChecklist] = useState<{id: number, label: string, sort_order?: number}[]>([])
  const [checkedChecklist, setCheckedChecklist] = useState<number[]>(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = localStorage.getItem('theta_checklist_checks_' + new Date().toISOString().slice(0, 10))
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [showChecklistModal, setShowChecklistModal] = useState(false)
  
  // Finance
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2025-02-04', type: 'income', category: 'Trading', description: 'TopstepX Payout', amount: 2500.00, account: 'Main', image: '' },
    { id: 2, date: '2025-02-03', type: 'income', category: 'Course', description: 'Trading Mastery Sale', amount: 497.00, account: 'Business', image: '' },
    { id: 3, date: '2025-02-02', type: 'expense', category: 'Subscriptions', description: 'TradingView Pro+', amount: 59.95, account: 'Business', image: '' },
    { id: 4, date: '2025-02-01', type: 'expense', category: 'Food', description: 'Groceries', amount: 127.50, account: 'Main', image: '' },
    { id: 5, date: '2025-01-30', type: 'expense', category: 'Health', description: 'Supplements iHerb', amount: 89.00, account: 'Main', image: '' },
    { id: 6, date: '2025-01-28', type: 'income', category: 'YouTube', description: 'AdSense January', amount: 340.00, account: 'Business', image: '' }
  ])
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [newTransaction, setNewTransaction] = useState({ type: 'expense', category: 'Food', description: '', amount: '', account: 'Main', image: '' })
  const [financeFilter, setFinanceFilter] = useState({ type: 'all', category: 'all', period: 'all' })
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactions[0] | null>(null)
  const financeCategories = {
    income: ['Trading', 'Course', 'YouTube', 'Sponsorship', 'Salary', 'Other'],
    expense: ['Rent', 'Food', 'Transport', 'Utilities', 'Subscriptions', 'Health', 'Education', 'Entertainment', 'Other']
  }
  const accounts = ['Main', 'Business', 'Savings']
  
  // Daily motivational quotes - changes based on day of year
  const dailyQuotes = [
    "Execute or be executed.",
    "Discipline is the bridge between goals and accomplishment.",
    "The market rewards patience and punishes impatience.",
    "Trust the process. Respect the risk.",
    "Small consistent gains compound into greatness.",
    "Your edge is your consistency.",
    "Pain is temporary. Regret is forever.",
    "The best trade is often no trade.",
    "Control what you can. Accept what you cannot.",
    "Winners focus on winning. Losers focus on winners.",
    "The process is the goal.",
    "Stay humble. Stay hungry.",
    "Risk management is profit management.",
    "Trade what you see, not what you think.",
    "Protect capital first. Profits will follow.",
    "One good trade at a time.",
    "The trend is your friend until the end.",
    "Patience is not waiting. It is timing.",
    "Cut losses short. Let winners run.",
    "The market is always right.",
    "Fear and greed are your enemies.",
    "Plan your trade. Trade your plan.",
    "Simplicity is the ultimate sophistication.",
    "The best traders are students forever.",
    "Emotions are expensive in trading.",
    "Success is the sum of small efforts.",
    "Focus on the process, not the outcome.",
    "Every master was once a disaster.",
    "Your worst enemy is yourself.",
    "Consistency beats intensity.",
    "The money is in the waiting."
  ]
  const getDailyQuote = () => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
    return dailyQuotes[dayOfYear % dailyQuotes.length]
  }
  const [examCategories, setExamCategories] = useState(defaultExamCategories)
  const [healthExams, setHealthExams] = useState<HealthExam[]>([])
  const [showExamModal, setShowExamModal] = useState(false)
  const [selectedExam, setSelectedExam] = useState<HealthExam|null>(null)
  const [examFilter, setExamFilter] = useState({ category: '', dateFrom: '', dateTo: '' })
  const [showAddExamModal, setShowAddExamModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [habits, setHabits] = useState<Habit[]>([])
  const [showHabitEditModal, setShowHabitEditModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit|null>(null)
  const [habitIcons] = useState(['check', 'meditate', 'yoga', 'workout', 'read', 'journal', 'cold', 'shower', 'running', 'walking', 'brain', 'lotus', 'chair', 'flame', 'star', 'heart', 'bolt', 'shield'])
  const [habitLogs, setHabitLogs] = useState<{id: number, habit_id: number, date: string}[]>([])
  const [tradingTab, setTradingTab] = useState<string>('bias')
  // Dynamic sizing computed from real Oura data
  const computeDynamicSizing = (h: typeof health) => {
    const hrvBase = 50 // personal baseline HRV
    const hrvF = h.hrv > 0 ? Math.min(1.3, Math.max(0.3, h.hrv / hrvBase)) : 0.5
    const sleepF = h.sleep > 0 ? Math.min(1.2, Math.max(0.3, h.sleep / 80)) : 0.5
    const streakF = habits.filter(hb => hb.done).length >= 3 ? 1.1 : habits.filter(hb => hb.done).length >= 1 ? 1.0 : 0.9
    const emotionF = h.stress < 20 ? 1.1 : h.stress < 40 ? 1.0 : h.stress < 60 ? 0.75 : 0.5
    const final = Math.round(Math.min(100, Math.max(0, 100 * hrvF * sleepF * streakF * emotionF)))
    return {
      baseSize: 100,
      hrvFactor: Math.round(hrvF * 100) / 100,
      sleepFactor: Math.round(sleepF * 100) / 100,
      streakFactor: Math.round(streakF * 100) / 100,
      emotionFactor: Math.round(emotionF * 100) / 100,
      finalSize: final,
      personalCorrelations: [
        { condition: `HRV ${h.hrv > 0 ? h.hrv : '—'}ms + Sleep ${h.sleep > 0 ? h.sleep + '%' : '—'}`, winRate: final > 75 ? 78 : final > 40 ? 52 : 34, suggestedSize: final },
        { condition: 'HRV >55 + All habits done', winRate: 78, suggestedSize: 100 },
        { condition: 'After loss + Stress >60%', winRate: 22, suggestedSize: 0 }
      ]
    }
  }
  const dynamicSizing = computeDynamicSizing(health)
  const [futureSelf, setFutureSelf] = useState({ isOpen: false, messages: [{ from: 'future', text: "Hey, I am you from 2026. I have access to all your data. About to make that trade? Let's talk." }], input: '' })
  const [sentimentMirror, setSentimentMirror] = useState<{marketSentiment: number, vix: number, diaryKeywords: string[], correlation: string, warning: string, prediction: string, historicalMatch: {pattern: string, winRate: number, trades: number}[], lastUpdate: Date|null, loading: boolean}>({ marketSentiment: 0, vix: 0, diaryKeywords: [], correlation: '—', warning: '', prediction: '', historicalMatch: [], lastUpdate: null, loading: false })
  const [tradeNotes, setTradeNotes] = useState<{id: number, date: string, tradeId?: number, content: string, audioUrl?: string, mood: string, tags: string[]}[]>([])
  const [newTradeNote, setNewTradeNote] = useState({ content: '', mood: 'neutral', linkedTradeId: 0 as number | undefined, tags: '' })
  const [isRecordingAudio, setIsRecordingAudio] = useState(false)
  const [audioRecorder, setAudioRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [dataReady, setDataReady] = useState(false)
  const [dbStatus, setDbStatus] = useState<'checking'|'ok'|'error'|'offline'>('checking')
  const [journalFilter, setJournalFilter] = useState({ outcome: 'all', strategy: 'all', session: 'all', emotion: 'all' })
  const [newJournalTag, setNewJournalTag] = useState('')
  const [showTradeModal, setShowTradeModal] = useState(false)
  const [editingTrade, setEditingTrade] = useState<Trade|null>(null)
  const [economicEvents, setEconomicEvents] = useState<{time: string, name: string, impact: string, currency?: string}[]>([{ time: '08:30', name: 'Loading...', impact: 'medium' }])
  
  // Generate dynamic macro bias based on economic events
  const generateMacroBias = () => {
    const highImpactEvents = economicEvents.filter(e => e.impact === 'high')
    
    const hasNFP = economicEvents.some(e => e.name.includes('Non-Farm') || e.name.includes('Employment'))
    const hasFOMC = economicEvents.some(e => e.name.includes('FOMC') || e.name.includes('Fed'))
    const hasCPI = economicEvents.some(e => e.name.includes('CPI'))
    const hasISM = economicEvents.some(e => e.name.includes('ISM'))
    
    let bias: 'bullish' | 'bearish' | 'ranging' = 'bullish'
    let bullish = 55, bearish = 25, ranging = 20
    let summary = ''
    
    if (hasFOMC) {
      summary = `FOMC day - High volatility expected.\n\nKey events:\n${highImpactEvents.map(e => `• ${e.name} @ ${e.time} EST`).join('\n')}\n\nAI Analysis: Fed rhetoric is key. Watch for hawkish/dovish signals on rate path. Markets pricing rate cuts - deviation could cause sharp moves. Use smaller positions until post-FOMC.`
      ranging = 40; bullish = 35; bearish = 25; bias = 'ranging'
    } else if (hasNFP) {
      summary = `NFP Friday - Major market mover.\n\nKey events:\n${highImpactEvents.map(e => `• ${e.name} @ ${e.time} EST`).join('\n')}\n\nAI Analysis: Strong jobs = hawkish Fed = risk-off. Weak jobs = dovish Fed = risk-on. Wait for 08:30 EST release before taking directional bias.`
      ranging = 35; bullish = 40; bearish = 25; bias = 'ranging'
    } else if (hasCPI) {
      summary = `CPI Release - Inflation focus.\n\nKey events:\n${highImpactEvents.map(e => `• ${e.name} @ ${e.time} EST`).join('\n')}\n\nAI Analysis: Higher CPI = hawkish Fed = bearish equities. Lower CPI = rate cuts closer = bullish. Core CPI (ex food/energy) is the key metric.`
      bullish = 50; bearish = 30; ranging = 20
    } else if (hasISM) {
      summary = `ISM PMI Day - Economic pulse.\n\nKey events:\n${highImpactEvents.map(e => `• ${e.name} @ ${e.time} EST`).join('\n')}\n\nAI Analysis: ISM > 50 = expansion = bullish. < 50 = contraction = bearish. Services PMI more important than Manufacturing. Watch employment component.`
      bullish = 62; bearish = 23; ranging = 15
    } else if (highImpactEvents.length > 0) {
      summary = `Mixed macro day.\n\nKey events:\n${highImpactEvents.map(e => `• ${e.name} @ ${e.time} EST`).join('\n')}\n\nAI Analysis: Multiple releases today. Trend remains bullish on dovish Fed expectations. Follow the trend until proven otherwise.`
      bullish = 65; bearish = 20; ranging = 15
    } else {
      summary = `Light data day - Technical trading.\n\n${economicEvents.length > 0 ? `Events:\n${economicEvents.map(e => `• ${e.name} @ ${e.time} (${e.impact})`).join('\n')}` : 'No events.'}\n\nAI Analysis: Without macro catalysts, focus on technicals and price action. Current structure remains bullish. Key levels define the range.`
      bullish = 68; bearish = 18; ranging = 14
    }
    
    if (bullish > bearish && bullish > ranging) bias = 'bullish'
    else if (bearish > bullish && bearish > ranging) bias = 'bearish'
    else bias = 'ranging'
    
    return { bias, bullish, bearish, ranging, summary }
  }
  
  const macroBias = generateMacroBias()
  
  const [paBias] = useState({ setup: `IF Asia tight AND London breaks above\nTHEN 68% NY continues higher`, sessions: { asia: { prob: 52 }, london: { prob: 65 }, ny: { prob: 72 } } })
  const [tasks, setTasks] = useState<Task[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task|null>(null)
  const [editingProject, setEditingProject] = useState<Project|null>(null)
  const [selectedProject, setSelectedProject] = useState<Project|null>(null)
  const [newProjectTasks, setNewProjectTasks] = useState<{title: string, urgent: boolean, important: boolean, deadline: string}[]>([{ title: '', urgent: false, important: false, deadline: '' }])
  const [calendarEvents, setCalendarEvents] = useState<CalEvent[]>([])
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalEvent|null>(null)
  const [resources, setResources] = useState<Resource[]>([])
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [editingResource, setEditingResource] = useState<Resource|null>(null)
  const [resourceCategories, setResourceCategories] = useState<string[]>(['Trading', 'Books', 'Tools', 'Courses', 'Notes'])
  const [resourceFilter, setResourceFilter] = useState<string>('all')
  const [resourceTagFilter, setResourceTagFilter] = useState<string>('all')
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [tricks, setTricks] = useState<Trick[]>([])
  const [showTrickModal, setShowTrickModal] = useState(false)
  const [editingTrick, setEditingTrick] = useState<Trick|null>(null)
  const [tricksAiAnalysis, setTricksAiAnalysis] = useState('')
  const [tricksAiLoading, setTricksAiLoading] = useState(false)
  const [socialFeed, setSocialFeed] = useState<{id: number, author: string, content: string, platform: string, likes: number, time: string, url: string, thumbnail?: string}[]>([])
  const [socialFilter, setSocialFilter] = useState('all')
  const [socialSearchQuery, setSocialSearchQuery] = useState('')
  const [socialSearching, setSocialSearching] = useState(false)
  const [aiInsight, setAiInsight] = useState('')
  const [aiInsightLoading, setAiInsightLoading] = useState(false)
  const [claudeWidgetOpen, setClaudeWidgetOpen] = useState(false)
  const claudeWidgetRef = useRef<HTMLDivElement>(null)
  const [showContentImporter, setShowContentImporter] = useState(false)
  const [contentUrl, setContentUrl] = useState('')
  const [contentAnalyzing, setContentAnalyzing] = useState(false)
  const [contentAnalysis, setContentAnalysis] = useState<{summary: string, actions: {section: string, suggestion: string}[]} | null>(null)
  // Twitter State
  const [twitterUsername, setTwitterUsername] = useState('')
  const [twitterProfile, setTwitterProfile] = useState<{username: string, name: string, profileImage: string, followers: number, following: number, tweets: number} | null>(null)
  const [twitterTweets, setTwitterTweets] = useState<{id: string, text: string, likes: number, retweets: number, createdAt: string}[]>([])
  const [twitterLoading, setTwitterLoading] = useState(false)
  const [twitterConnected, setTwitterConnected] = useState(false)
  const [newTweet, setNewTweet] = useState('')
  const [twitterPosting, setTwitterPosting] = useState(false)
  // Workspace State
  const [wsFolders, setWsFolders] = useState<WsFolder[]>([])
  const [wsFiles, setWsFiles] = useState<WsFile[]>([])
  const [wsCurrentFolder, setWsCurrentFolder] = useState<string | null>(null)
  const [wsSelectedFile, setWsSelectedFile] = useState<WsFile | null>(null)
  const [wsLoading, setWsLoading] = useState(true)
  const [wsView, setWsView] = useState<'browser' | 'editor' | 'sheet'>('browser')
  const [wsEditorContent, setWsEditorContent] = useState('')
  const [wsSheetData, setWsSheetData] = useState<string[][]>([['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']])
  const [wsSearch, setWsSearch] = useState('')
  const [wsSearchResults, setWsSearchResults] = useState<WsFile[]>([])
  const [wsAiInput, setWsAiInput] = useState('')
  const [wsAiLoading, setWsAiLoading] = useState(false)
  const [wsShowNewFolder, setWsShowNewFolder] = useState(false)
  const [wsNewFolderName, setWsNewFolderName] = useState('')
  const [wsShowNewFile, setWsShowNewFile] = useState(false)
  const [wsNewFileName, setWsNewFileName] = useState('')
  const [wsNewFileType, setWsNewFileType] = useState<'document' | 'sheet' | 'link' | 'note'>('document')
  // Claude Chat State
  const [claudeMessages, setClaudeMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([])
  const [claudeInput, setClaudeInput] = useState('')
  const [claudeLoading, setClaudeLoading] = useState(false)
  const [backtestTrades, setBacktestTrades] = useState<BacktestTrade[]>([])
  const [backtestFilter, setBacktestFilter] = useState({ outcome: 'all', strategy: 'all', session: 'all', tag: 'all' })
  const [editingBacktestTrade, setEditingBacktestTrade] = useState<BacktestTrade | null>(null)
  const [newBacktestTag, setNewBacktestTag] = useState('')
  const [strategies, setStrategies] = useState<Strategy[]>([
    { id: 1, name: 'ORB', trades: 45, winRate: 67, avgRR: 2.1, totalPnl: 4250, expectancy: 0.89 },
    { id: 2, name: 'FVG', trades: 32, winRate: 72, avgRR: 1.8, totalPnl: 3100, expectancy: 0.94 },
    { id: 3, name: 'Reversal', trades: 28, winRate: 54, avgRR: 2.5, totalPnl: 1850, expectancy: 0.62 },
  ])
  const [showBacktestModal, setShowBacktestModal] = useState(false)
  const [backtestAnalyzing, setBacktestAnalyzing] = useState(false)
  const [backtestImage, setBacktestImage] = useState<string>('')
  const [analyzedTrade, setAnalyzedTrade] = useState<Partial<BacktestTrade> | null>(null)
  const backtestImageRef = useRef<HTMLInputElement>(null)
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [showDiaryModal, setShowDiaryModal] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [diaryText, setDiaryText] = useState('')
  const [diaryMode, setDiaryMode] = useState<'write'|'voice'>('write')
  const [workoutDay, setWorkoutDay] = useState<keyof typeof weeklyWorkouts>('monday')
  const [workoutActive, setWorkoutActive] = useState(false)
  const [currentExIdx, setCurrentExIdx] = useState(0)
  const [exTimer, setExTimer] = useState(0)
  const [undoAction, setUndoAction] = useState<{type:string,data:any,msg:string}|null>(null)
  const [showUndo, setShowUndo] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    { id: 1, url: 'https://picsum.photos/seed/1/400/400', type: 'image' },
    { id: 2, url: 'https://picsum.photos/seed/2/400/400', type: 'image' },
    { id: 3, url: 'https://picsum.photos/seed/3/400/400', type: 'image' },
    { id: 4, url: 'https://picsum.photos/seed/4/400/400', type: 'image' },
    { id: 5, url: 'https://picsum.photos/seed/5/400/400', type: 'image' },
    { id: 6, url: 'https://picsum.photos/seed/6/400/400', type: 'image' },
    { id: 7, url: 'https://picsum.photos/seed/7/400/400', type: 'image' },
    { id: 8, url: 'https://picsum.photos/seed/8/400/400', type: 'image' },
  ])
  const [lightboxImage, setLightboxImage] = useState<string|null>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)

  // BIOHACKING STATE
  const [coldProtocol, setColdProtocol] = useState({ todayDone: false, duration: 0, streak: 12, waterTemp: 15, norepinephrine: '+340%', disciplineBoost: 18, history: [120, 90, 150, 120, 0, 180, 120], isActive: false, timer: 0 })

  // NEURO STATE
  const [neuroSoundscape, setNeuroSoundscape] = useState({ isPlaying: false, currentMode: 'focus', bpm: 72, frequency: '40Hz Gamma', adaptiveReason: 'HRV optimal - maintaining focus state', modes: ['focus', 'calm', 'recovery', 'sleep', 'flow'], volume: 75 })
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const [tradingMusicPlaying, setTradingMusicPlaying] = useState(false)
  const tradingMusicRef = useRef<OscillatorNode | null>(null)
  const tradingAudioCtxRef = useRef<AudioContext | null>(null)
  const [aiMeditation, setAiMeditation] = useState({ isActive: false, duration: 480, currentPhase: 'breathing', script: '', generated: false, generating: false, personalFactors: [] as string[] })
  const [dreamDecoder, setDreamDecoder] = useState({ entries: [{ id: 1, date: '2025-01-30', dream: 'I was running but could not reach the destination', themes: ['anxiety', 'pursuit', 'goals'], aiAnalysis: 'Recurring theme of frustration. Correlation: -23% risk management in days following this pattern.', lucidScore: 2 }], showInput: false, newDream: '', lucidTraining: { enabled: true, reminderTime: '03:30', technique: 'MILD' } })

  // AUTOMATION STATE  
  const [contentAI, setContentAI] = useState({
    discord: { connected: false, botActive: true, autoShare: true, dailyDigest: true, memberCount: 0, engagement: 0 },
    youtube: { connected: false, subscribers: 0, videoCount: 0, totalViews: 0 },
    whop: { connected: false, members: 0, mrr: 0, churnRisk: [] as {name: string, risk: number, suggestion: string}[] }
  })
  const [socialProof, setSocialProof] = useState({ recentWins: [] as {type: string, value: string, date: string}[], autoPosts: false, platforms: ['discord', 'youtube'] })
  const [memberJourney, setMemberJourney] = useState({ 
    funnel: { youtube: 0, discord: 0, whop: 0, advocates: 0 },
    automations: [{ name: 'Welcome Sequence', status: 'active', converted: 67 }, { name: 'Engagement Revival', status: 'active', converted: 23 }, { name: 'Upgrade Nudge', status: 'active', converted: 89 }]
  })

  const todayStr = '2025-01-30'
  const todayTrades = trades.filter(t => t.date === todayStr)
  const todayPnl = todayTrades.reduce((s, t) => s + t.pnl, 0)
  const totalPnl = trades.reduce((s, t) => s + t.pnl, 0)
  const winRate = Math.round((trades.filter(t => t.pnl > 0).length / Math.max(trades.length, 1)) * 100)
  const todayEvents = calendarEvents.filter(e => e.date === todayStr)
  const gateOpen = healthSource === 'live' ? (health.hrv > 40 && health.sleep > 70) : healthSource === 'fallback' ? true : true
  const sizeMultiplier = healthSource === 'live' ? (health.hrv > 50 ? 100 : health.hrv > 40 ? 50 : 0) : 100
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order)
  const getProjectProgress = (p: Project) => { const pt = tasks.filter(t => t.projectId === p.id); return pt.length === 0 ? 0 : Math.round((pt.filter(t => t.completed).length / pt.length) * 100) }
  const filteredExams = healthExams.filter(e => {
    if (examFilter.category && e.category !== examFilter.category) return false
    if (examFilter.dateFrom && e.date < examFilter.dateFrom) return false
    if (examFilter.dateTo && e.date > examFilter.dateTo) return false
    return true
  })

  useEffect(() => { 
    setMounted(true)
    // Check for demo mode via URL param
    const params = new URLSearchParams(window.location.search)
    if (params.get('demo') === 'true') {
      setIsDemo(true)
      console.log('[THETA] 🎯 DEMO MODE ENABLED')
    }
  }, [])
  
  // Load DEMO data when in demo mode
  useEffect(() => {
    if (!isDemo) return
    console.log('[THETA DEMO] Loading demo data...')
    setTrades(DEMO_DATA.trades as Trade[])
    setTasks(DEMO_DATA.tasks as Task[])
    setProjects(DEMO_DATA.projects as Project[])
    setHabits(DEMO_DATA.habits as Habit[])
    setDiaryEntries(DEMO_DATA.diary as DiaryEntry[])
    setTransactions(DEMO_DATA.transactions as Transaction[])
    setCalendarEvents(DEMO_DATA.events as CalEvent[])
    setResources(DEMO_DATA.resources as Resource[])
    setBacktestTrades(DEMO_DATA.backtest as BacktestTrade[])
    setBehaviors(DEMO_DATA.behaviors)
    setChecklist(DEMO_DATA.checklist)
    setHealth(DEMO_DATA.health)
    setHealthSource('live')
    setDeepWork(DEMO_DATA.deepWork as any)
    setContentAI(DEMO_DATA.automation)
    setSentimentMirror(DEMO_DATA.sentiment as any)
    setCheckedBehaviors([1, 2, 3, 4])
    setCheckedChecklist([1, 2])
    setDbStatus('ok')
    setDataReady(true)
    setMemberJourney(DEMO_DATA.memberJourney as any)
    setEconomicEvents(DEMO_DATA.economicEvents as any)
    console.log('[THETA DEMO] ✓ Demo data loaded')
  }, [isDemo])
  
  // Load data from Supabase on mount (fallback to localStorage) - SKIP in demo mode
  useEffect(() => {
    if (isDemo) return // Skip data loading in demo mode
    const loadData = async () => {
      console.log('[THETA] Loading data...')
      
      // Try localStorage FIRST as instant fallback
      try {
        const ls = (key: string) => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : null } catch { return null } }
        const lsTrades = ls('theta_trades')
        const lsBacktest = ls('theta_backtest')
        const lsTasks = ls('theta_tasks')
        const lsTransactions = ls('theta_transactions')
        const lsProjects = ls('theta_projects')
        if (lsTrades?.length) setTrades(lsTrades)
        if (lsBacktest?.length) setBacktestTrades(lsBacktest)
        if (lsTasks?.length) setTasks(lsTasks)
        if (lsTransactions?.length) setTransactions(lsTransactions)
        if (lsProjects?.length) setProjects(lsProjects)
        const lsResources = ls('theta_resources')
        const lsResCats = ls('theta_resource_categories')
        if (lsResources?.length) setResources(lsResources)
        if (lsResCats?.length) setResourceCategories(lsResCats)
        console.log('[THETA] localStorage loaded:', { trades: lsTrades?.length || 0, backtest: lsBacktest?.length || 0, tasks: lsTasks?.length || 0 })
      } catch (e) { console.warn('[THETA] localStorage read failed:', e) }
      
      // Then try Supabase (will override localStorage if data exists)
      try {
        const [tradesRes, backtestRes, tasksRes, transactionsRes, projectsRes, habitsRes, habitLogsRes, behaviorsRes, checklistRes, tradeNotesRes, diaryRes, examsRes, calEventsRes, resourcesRes, tricksRes] = await Promise.all([
          fetch('/api/data?table=trades'),
          fetch('/api/data?table=backtest_trades'),
          fetch('/api/data?table=tasks'),
          fetch('/api/data?table=transactions'),
          fetch('/api/data?table=projects'),
          fetch('/api/data?table=habits'),
          fetch('/api/data?table=habit_logs'),
          fetch('/api/data?table=behaviors'),
          fetch('/api/data?table=checklist'),
          fetch('/api/data?table=trade_notes'),
          fetch('/api/data?table=diary_entries'),
          fetch('/api/data?table=health_exams'),
          fetch('/api/data?table=calendar_events'),
          fetch('/api/data?table=resources'),
          fetch('/api/data?table=tricks')
        ])
        
        const tradesData = await tradesRes.json()
        const backtestData = await backtestRes.json()
        const tasksData = await tasksRes.json()
        const transactionsData = await transactionsRes.json()
        const projectsData = await projectsRes.json()
        const habitsData = await habitsRes.json()
        const habitLogsData = await habitLogsRes.json()
        const behaviorsData = await behaviorsRes.json()
        const checklistData = await checklistRes.json()
        const tradeNotesData = await tradeNotesRes.json()
        const diaryData = await diaryRes.json()
        const examsData = await examsRes.json()
        const calEventsData = await calEventsRes.json()
        const resourcesData = await resourcesRes.json()
        const tricksData = await tricksRes.json()
        
        // Check if Supabase is actually working
        const hasError = [tradesData, backtestData, tasksData, transactionsData, projectsData].some(d => d.error)
        if (hasError) {
          console.warn('[THETA] Supabase errors:', { 
            trades: tradesData.error, backtest: backtestData.error, 
            tasks: tasksData.error, transactions: transactionsData.error, projects: projectsData.error 
          })
        }
        
        console.log('[THETA] Supabase response:', { 
          trades: tradesData.data?.length || 0, backtest: backtestData.data?.length || 0,
          tasks: tasksData.data?.length || 0, transactions: transactionsData.data?.length || 0,
          projects: projectsData.data?.length || 0, habits: habitsData.data?.length || 0,
          behaviors: behaviorsData.data?.length || 0, diary: diaryData.data?.length || 0,
          exams: examsData.data?.length || 0, calEvents: calEventsData.data?.length || 0,
          resources: resourcesData.data?.length || 0
        })
        
        // Override with DB data if present
        if (tradesData.data?.length) setTrades(tradesData.data.map((t: any) => ({ ...t, tags: t.tags || [], priceActionImage: t.price_action_image, orderflowImage: t.orderflow_image })))
        if (backtestData.data?.length) setBacktestTrades(backtestData.data.map((t: any) => ({ ...t, tags: t.tags || [], aiAnalyzed: t.ai_analyzed, image: t.screenshot || t.image || '' })))
        if (tasksData.data?.length) setTasks(tasksData.data.map((t: any) => ({ id: t.id, title: t.text || '', urgent: t.priority === 'high' || t.priority === 'urgent', important: t.priority === 'high' || t.priority === 'important', deadline: t.due || '', projectId: t.project_id || null, completed: t.completed || false, order: t.task_order || 0 })))
        if (transactionsData.data?.length) setTransactions(transactionsData.data)
        if (projectsData.data?.length) setProjects(projectsData.data.map((p: any) => ({ id: p.id, name: p.name, color: p.color || '#6366f1', deadline: '' })))
        
        // NEW: Load persisted data
        const todayDate = new Date().toISOString().slice(0, 10)
        if (habitsData.data?.length) {
          const todayLogs = (habitLogsData.data || []).filter((l: any) => l.date === todayDate)
          setHabitLogs(habitLogsData.data || [])
          setHabits(habitsData.data.map((h: any) => ({
            id: h.id, name: h.name, icon: h.icon || 'check', color: h.color || '#6366f1',
            done: todayLogs.some((l: any) => l.habit_id === h.id),
            streak: h.streak || 0
          })).sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)))
        }
        if (behaviorsData.data?.length) {
          setBehaviors(behaviorsData.data.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)))
        }
        if (checklistData.data?.length) {
          setChecklist(checklistData.data.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)))
        }
        if (tradeNotesData.data?.length) {
          setTradeNotes(tradeNotesData.data.map((n: any) => ({
            id: n.id,
            date: n.created_at,
            tradeId: n.trade_id,
            content: n.content,
            mood: n.mood || 'neutral',
            tags: n.tags ? n.tags.split(',') : []
          })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()))
        }
        if (diaryData.data?.length) setDiaryEntries(diaryData.data.map((d: any) => ({ id: d.id, date: d.date, content: d.content, mood: d.mood || 'neutral', aiAnalysis: d.ai_analysis || '' })))
        if (examsData.data?.length) setHealthExams(examsData.data)
        if (calEventsData.data?.length) setCalendarEvents(calEventsData.data)
        if (resourcesData.data?.length) setResources(resourcesData.data.map((r: any) => ({ id: r.id, name: r.name, notes: r.notes || '', link: r.link || '', fileName: r.file_name || '', fileData: '', category: r.category || 'General', tags: r.tags ? r.tags.split(',') : [], createdAt: r.created_at || '' })))
        if (tricksData.data?.length) setTricks(tricksData.data.map((t: any) => ({ id: t.id, name: t.name, description: t.description || '', image: t.image || '', tags: t.tags ? t.tags.split(',') : [], createdAt: t.created_at || '' })))
        
      } catch (err) {
        console.warn('[THETA] Supabase fetch failed (using localStorage):', err)
      }
      
      // Enable localStorage saves after a short delay
      setTimeout(() => { setDataReady(true); console.log('[THETA] ✓ Data ready — saves enabled') }, 300)
      
      // Test DB write capability
      try {
        const testRes = await fetch('/api/data?table=_debug')
        const testData = await testRes.json()
        if (testData.tables) {
          const allOk = Object.values(testData.tables).every((t: any) => t.exists)
          setDbStatus(allOk ? 'ok' : 'error')
          console.log('[THETA] DB status:', allOk ? 'OK' : 'TABLES MISSING', testData.tables)
          if (!allOk) console.error('[THETA] Missing tables:', Object.entries(testData.tables).filter(([,v]: any) => !v.exists).map(([k]) => k))
        } else {
          setDbStatus('offline')
          console.warn('[THETA] Supabase not configured — using localStorage only')
        }
      } catch { setDbStatus('offline') }
    }
    loadData()
  }, [isDemo])
  
  // ============= DB SAVE HELPERS =============
  
  const dbInsert = async (table: string, data: any): Promise<any> => {
    try {
      const res = await fetch('/api/data', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, data }) })
      const result = await res.json()
      if (result.error) {
        console.error(`[DB] INSERT ${table} FAILED:`, result.error, result.debug || '')
        toast(`DB Error: ${result.error}`, 'error')
        return null
      }
      console.log(`[DB] INSERT ${table} OK, id:`, result.data?.id)
      return result.data
    } catch (e: any) { 
      console.error(`[DB] INSERT ${table} NETWORK FAIL:`, e)
      toast(`Network error: ${e.message}`, 'error')
      return null 
    }
  }
  
  const dbUpdate = async (table: string, id: number, data: any): Promise<any> => {
    try {
      const res = await fetch('/api/data', { method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, id, data }) })
      const result = await res.json()
      if (result.error) { console.error(`[DB] UPDATE ${table} id=${id} FAILED:`, result.error); return null }
      return result.data
    } catch (e) { console.error(`[DB] UPDATE ${table} NETWORK FAIL:`, e); return null }
  }
  
  const dbDelete = async (table: string, id: number): Promise<boolean> => {
    try {
      const res = await fetch(`/api/data?table=${table}&id=${id}`, { method: 'DELETE' })
      const result = await res.json()
      if (result.error) { console.error(`[DB] DELETE ${table} id=${id} FAILED:`, result.error); return false }
      return result.success || false
    } catch (e) { console.error(`[DB] DELETE ${table} NETWORK FAIL:`, e); return false }
  }
  
  // Mappers: frontend state → DB columns
  const tradeToDb = (t: Trade) => ({
    date: t.date, time: t.time, symbol: t.symbol, dir: t.dir, session: t.session,
    strategy: t.strategy, outcome: t.outcome, pnl: Number(t.pnl) || 0, rr: t.rr || '1:1',
    notes: t.notes || '', emotion: t.emotion || '', tags: t.tags || [],
    price_action_image: t.priceActionImage || '', orderflow_image: t.orderflowImage || ''
  })
  
  const backtestToDb = (t: BacktestTrade) => {
    // Limit screenshot to ~100KB base64 to prevent DB issues
    let screenshot = t.image || ''
    if (screenshot.length > 150000) {
      console.warn('Screenshot too large, truncating for DB storage')
      screenshot = '' // Don't store oversized images in DB
    }
    return {
      date: t.date, time: t.time, symbol: t.symbol, dir: t.dir, session: t.session,
      strategy: t.strategy, outcome: t.outcome, pnl: Number(t.pnl) || 0, rr: t.rr || '1:1',
      notes: t.notes || '', emotion: '', tags: t.tags || [],
      screenshot, ai_analyzed: t.aiAnalyzed || false
    }
  }
  
  const taskToDb = (t: Task) => ({
    text: t.title || '', completed: t.completed || false,
    priority: (t.urgent && t.important) ? 'high' : t.urgent ? 'urgent' : t.important ? 'important' : 'medium',
    due: t.deadline || '', project_id: t.projectId, task_order: t.order || 0
  })
  
  const transactionToDb = (t: any) => ({
    date: t.date, type: t.type, category: t.category, amount: Number(t.amount) || 0,
    description: t.description || '', account: t.account || 'Main'
  })
  
  const projectToDb = (p: Project) => ({
    name: p.name, color: p.color || '#6366f1'
  })

  const habitToDb = (h: Habit) => ({
    name: h.name, icon: h.icon || 'check', color: h.color || '#6366f1',
    streak: h.streak || 0, sort_order: 0
  })

  const behaviorToDb = (b: {label: string, sort_order?: number}) => ({
    label: b.label, sort_order: b.sort_order || 0
  })

  const diaryToDb = (d: DiaryEntry) => ({
    date: d.date, content: d.content, mood: d.mood || 'neutral',
    ai_analysis: d.aiAnalysis || ''
  })

  const examToDb = (e: HealthExam) => ({
    name: e.name, date: e.date, category: e.category || 'Other',
    file: e.file || ''
  })

  const calEventToDb = (e: CalEvent) => ({
    title: e.title, date: e.date, time: e.time || '09:00',
    category: e.category || 'personal'
  })

  const resourceToDb = (r: Resource) => ({
    name: r.name, notes: r.notes || '', link: r.link || '',
    file_name: r.fileName || '', category: r.category || 'General',
    tags: r.tags?.join(',') || ''
  })

  // ============= SAVE FUNCTIONS (called by UI actions) =============
  
  const saveTrade = async (data: Partial<Trade>) => {
    if (demoBlock()) return
    if (editingTrade) {
      // UPDATE existing
      const updated = { ...editingTrade, ...data }
      setTrades(p => p.map(t => t.id === editingTrade.id ? updated : t))
      dbUpdate('trades', editingTrade.id, tradeToDb(updated as Trade))
    } else {
      // INSERT new — get DB id back
      const tempId = Date.now()
      const newTrade: Trade = { id: tempId, date: todayStr, time: formatClock(new Date()), symbol: 'NQ', dir: 'LONG', session: 'NY', strategy: '', outcome: 'TP', pnl: 0, rr: '1:1', notes: '', emotion: 'calm', tags: [], priceActionImage: '', orderflowImage: '', ...data }
      setTrades(p => [...p, newTrade])
      const dbRecord = await dbInsert('trades', tradeToDb(newTrade))
      if (dbRecord?.id) setTrades(p => p.map(t => t.id === tempId ? { ...t, id: dbRecord.id } : t))
    }
    setShowTradeModal(false)
    setEditingTrade(null)
    toast('Saved', 'success')
  }
  
  const deleteTrade = async (trade: Trade) => {
    if (demoBlock()) return
    setTrades(p => p.filter(t => t.id !== trade.id))
    dbDelete('trades', trade.id)
  }
  
  const saveBacktestTrade = async (newTrade: BacktestTrade) => {
    const tempId = newTrade.id || Date.now()
    setBacktestTrades(p => [{ ...newTrade, id: tempId }, ...p])
    try {
      const dbRecord = await dbInsert('backtest_trades', backtestToDb(newTrade))
      if (dbRecord?.id) {
        setBacktestTrades(p => p.map(t => t.id === tempId ? { ...t, id: dbRecord.id } : t))
        console.log('[SAVE] Backtest trade saved to DB, id:', dbRecord.id)
      } else {
        console.warn('[SAVE] Backtest: no DB id returned')
      }
    } catch (err) {
      console.error('[SAVE] Backtest save failed:', err)
    }
    toast('Trade saved!', 'success')
  }
  
  const updateBacktestTrade = async (trade: BacktestTrade) => {
    setBacktestTrades(p => p.map(t => t.id === trade.id ? trade : t))
    dbUpdate('backtest_trades', trade.id, backtestToDb(trade))
  }
  
  const deleteBacktestTrade = async (trade: BacktestTrade) => {
    setBacktestTrades(p => p.filter(t => t.id !== trade.id))
    dbDelete('backtest_trades', trade.id)
  }
  
  const saveTask = async (data: Partial<Task>) => {
    if (demoBlock()) return
    if (editingTask) {
      const updated = { ...editingTask, ...data }
      setTasks(p => p.map(t => t.id === editingTask.id ? updated : t))
      dbUpdate('tasks', editingTask.id, taskToDb(updated as Task))
    } else {
      const tempId = Date.now()
      const newTask: Task = { id: tempId, title: '', urgent: false, important: false, deadline: '', projectId: null, completed: false, order: 0, ...data }
      setTasks(p => [...p, newTask])
      const dbRecord = await dbInsert('tasks', taskToDb(newTask))
      if (dbRecord?.id) setTasks(p => p.map(t => t.id === tempId ? { ...t, id: dbRecord.id } : t))
    }
    setShowTaskModal(false)
    setEditingTask(null)
    toast('Saved', 'success')
  }
  
  const deleteTask = async (task: Task) => {
    if (demoBlock()) return
    setTasks(p => p.filter(t => t.id !== task.id))
    dbDelete('tasks', task.id)
  }
  
  const toggleTaskComplete = async (task: Task) => {
    if (demoBlock()) return
    const updated = { ...task, completed: !task.completed }
    setTasks(p => p.map(t => t.id === task.id ? updated : t))
    dbUpdate('tasks', task.id, taskToDb(updated))
  }

  // localStorage sync — saves every state change AFTER initial load completes
  const safeSave = (key: string, data: any) => { try { localStorage.setItem(key, JSON.stringify(data)) } catch (e) { console.warn('[LS] Save failed:', key, e) } }
  useEffect(() => { if (dataReady) safeSave('theta_trades', trades) }, [trades, dataReady])
  useEffect(() => { if (dataReady) safeSave('theta_backtest', backtestTrades) }, [backtestTrades, dataReady])
  useEffect(() => { if (dataReady) safeSave('theta_tasks', tasks) }, [tasks, dataReady])
  useEffect(() => { if (dataReady) safeSave('theta_transactions', transactions) }, [transactions, dataReady])
  useEffect(() => { if (dataReady) safeSave('theta_projects', projects) }, [projects, dataReady])
  useEffect(() => { if (dataReady) safeSave('theta_resources', resources) }, [resources, dataReady])
  useEffect(() => { if (dataReady) safeSave('theta_resource_categories', resourceCategories) }, [resourceCategories, dataReady])
  // Behavior checks: save by date (resets daily)
  useEffect(() => { if (dataReady) safeSave('theta_behavior_checks_' + new Date().toISOString().slice(0, 10), checkedBehaviors) }, [checkedBehaviors, dataReady])
  // Checklist checks: save by date (resets daily)
  useEffect(() => { if (dataReady) safeSave('theta_checklist_checks_' + new Date().toISOString().slice(0, 10), checkedChecklist) }, [checkedChecklist, dataReady])
  
  useEffect(() => {
    const savedTz = localStorage.getItem('theta_timezone')
    if (savedTz) setTimezone(savedTz)
    // Load saved YouTube channel
    const savedYt = localStorage.getItem('theta_yt_channel')
    if (savedYt) {
      fetch(`/api/youtube?action=channel&channelId=${encodeURIComponent(savedYt)}`)
        .then(r => r.json())
        .then(data => {
          if (data.channel) {
            setYoutubeChannelData(data.channel)
            if (data.channel.uploadsPlaylistId) {
              fetch(`/api/youtube?action=videos&playlistId=${data.channel.uploadsPlaylistId}&maxResults=6`)
                .then(r => r.json())
                .then(vData => { if (vData.videos) setYoutubeVideos(vData.videos) })
                .catch(() => {})
            }
          }
        })
        .catch(() => {})
    }
  }, [])
  useEffect(() => { 
    fetch('/api/economic-calendar')
      .then(r => r.json())
      .then(data => { if (data.events) setEconomicEvents(data.events) })
      .catch(() => {})
  }, [])
  
  // Fetch market data from Finnhub
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const [quoteRes, vixRes, newsRes] = await Promise.all([
          fetch('/api/finnhub?action=quote&symbol=QQQ'),
          fetch('/api/finnhub?action=vix'),
          fetch('/api/finnhub?action=news')
        ])
        const quoteData = await quoteRes.json()
        const vixData = await vixRes.json()
        const newsData = await newsRes.json()
        
        if (quoteData.price) setMarketData(quoteData)
        if (vixData.vixLevel) {
          setSentimentMirror(p => ({...p, vix: vixData.vixLevel}))
        }
        if (newsData.news) setMarketNews(newsData.news.slice(0, 5))
      } catch (err) {
        console.log('Finnhub not configured')
      }
    }
    fetchMarketData()
    // Refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])
  
  // Load mail signature from localStorage
  useEffect(() => {
    const sig = localStorage.getItem('theta_mail_signature')
    if (sig) setMailSignature(sig)
  }, [])
  
  // Load OAuth states from cookies and fetch data
  useEffect(() => {
    // Check Google auth
    const googleCookie = document.cookie.split('; ').find(c => c.startsWith('google_user='))
    if (googleCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(googleCookie.split('=')[1]))
        setGoogleUser(user)
        // Fetch Gmail
        fetch('/api/gmail').then(r => r.json()).then(data => {
          if (data.emails) setGmailEmails(data.emails)
        }).catch(() => {})
        // Fetch Calendar
        fetch('/api/gcalendar').then(r => r.json()).then(data => {
          if (data.events) setGcalEvents(data.events)
        }).catch(() => {})
      } catch {}
    }
    // Load Google accounts list
    const accountsCookie = document.cookie.split('; ').find(c => c.startsWith('google_accounts='))
    if (accountsCookie) {
      try {
        const accounts = JSON.parse(decodeURIComponent(accountsCookie.split('=')[1]))
        setGoogleAccounts(accounts)
        // Initialize selected calendars with all account emails
        setSelectedCalendars(accounts.map((a: any) => a.email))
      } catch {}
    }
    // Check Spotify auth
    const spotifyCookie = document.cookie.split('; ').find(c => c.startsWith('spotify_user='))
    if (spotifyCookie) {
      try {
        const user = JSON.parse(decodeURIComponent(spotifyCookie.split('=')[1]))
        setSpotifyUser(user)
        // Fetch currently playing
        const fetchSpotify = () => {
          fetch('/api/spotify?action=current').then(r => r.json()).then(data => {
            setSpotifyPlaying(data)
          }).catch(() => {})
        }
        fetchSpotify()
        const interval = setInterval(fetchSpotify, 10000) // Update every 10s
        return () => clearInterval(interval)
      } catch {}
    }
  }, [])
  
  // Fetch Automation Hub data (Discord, YouTube, Whop)
  useEffect(() => {
    const fetchAutomationData = async () => {
      let discordMembers = 0, youtubeSubscribers = 0, whopMembers = 0
      
      // Fetch Discord stats
      try {
        const discordRes = await fetch('/api/discord?action=stats')
        const discordData = await discordRes.json()
        if (discordData.connected) {
          discordMembers = discordData.memberCount || 0
          setContentAI(p => ({
            ...p,
            discord: {
              ...p.discord,
              connected: true,
              memberCount: discordData.memberCount || p.discord.memberCount,
              engagement: discordData.onlineCount ? Math.round((discordData.onlineCount / discordData.memberCount) * 100) : p.discord.engagement
            }
          }))
        } else if (discordData.configured || discordData.hasWebhook) {
          setContentAI(p => ({ ...p, discord: { ...p.discord, connected: true } }))
        }
      } catch (e) { console.log('Discord API not configured') }
      
      // Fetch YouTube stats
      try {
        const youtubeRes = await fetch('/api/youtube?action=stats')
        const youtubeData = await youtubeRes.json()
        if (youtubeData.connected) {
          youtubeSubscribers = youtubeData.subscribers || 0
          setContentAI(p => ({
            ...p,
            youtube: {
              connected: true,
              subscribers: youtubeData.subscribers || 0,
              videoCount: youtubeData.videoCount || 0,
              totalViews: youtubeData.totalViews || 0
            }
          }))
        }
      } catch (e) { console.log('YouTube API not configured') }
      
      // Fetch Whop stats
      try {
        const whopRes = await fetch('/api/whop?action=stats')
        const whopData = await whopRes.json()
        if (whopData.configured !== false) {
          whopMembers = whopData.activeMembers || whopData.members || 0
          setContentAI(p => ({
            ...p,
            whop: {
              ...p.whop,
              connected: true,
              members: whopData.activeMembers || whopData.members || p.whop.members,
              mrr: whopData.mrr || p.whop.mrr,
              churnRisk: whopData.churnRisk || p.whop.churnRisk
            }
          }))
        }
      } catch (e) { console.log('Whop API not configured') }
      
      // Update member journey funnel with real data
      setMemberJourney(p => ({
        ...p,
        funnel: {
          youtube: youtubeSubscribers,
          discord: discordMembers,
          whop: whopMembers,
          advocates: Math.round(whopMembers * 0.07) // ~7% become advocates
        }
      }))
    }
    
    fetchAutomationData()
    // Refresh every 10 minutes
    const interval = setInterval(fetchAutomationData, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])
  
  useEffect(() => {
    // Fetch Oura data with auto-refresh
    const fetchOuraData = () => {
      setOuraLoading(true)
      fetch('/api/oura?period=daily')
        .then(res => res.json())
        .then(data => {
          if (data.error && data.error.includes('No Oura token')) {
            setHealthSource('fallback')
          } else if (!data.error) {
            // Check if we got real data (at least one non-null score)
            const hasRealData = data.daily && (data.daily.readiness != null || data.daily.sleep != null || data.daily.activity != null)
            setHealth({ 
              resilience: typeof data.daily?.resilience === 'string' ? (data.daily.resilience === 'strong' ? 90 : data.daily.resilience === 'adequate' ? 70 : 50) : (data.daily?.resilience || 78),
              readiness: data.daily?.readiness ?? data.readiness ?? 0, 
              sleep: data.daily?.sleep ?? data.sleep ?? 0, 
              activity: data.daily?.activity ?? data.activity ?? 0, 
              heartRate: data.daily?.heartRate ?? data.heartRate ?? 0, 
              stress: data.daily?.stress ?? data.stress ?? 0,
              hrv: data.daily?.sleepSession?.hrv ?? data.hrv ?? 0
            })
            setOuraReport(data)
            if (data.tags) setOuraTags(data.tags)
            setHealthSource(hasRealData ? 'live' : 'fallback')
            setHealthLastUpdate(new Date())
          } else {
            setHealthSource('error')
          }
          setOuraLoading(false)
        })
        .catch(() => { setOuraLoading(false); setHealthSource('error') })
    }
    fetchOuraData()
    const ouraInterval = setInterval(fetchOuraData, 5 * 60 * 1000) // Refresh every 5 min
    // Fetch Workspace folders and files
    Promise.all([
      fetch('/api/folders').then(r => r.json()),
      fetch('/api/files').then(r => r.json())
    ]).then(([foldersData, filesData]) => {
      if (foldersData.folders) setWsFolders(foldersData.folders)
      if (filesData.files && filesData.files.length > 0) {
        setWsFiles(filesData.files)
      }
      setWsLoading(false)
    }).catch(() => setWsLoading(false))
    return () => clearInterval(ouraInterval)
  }, [])
  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t) }, [])
  useEffect(() => { document.documentElement.setAttribute('data-theme', theme) }, [theme])
  useEffect(() => { const h = () => setContextMenu(null); document.addEventListener('click', h); return () => document.removeEventListener('click', h) }, [])
  useEffect(() => { if (pomodoroActive && pomodoroTime > 0) { const t = setTimeout(() => setPomodoroTime(p => p - 1), 1000); return () => clearTimeout(t) } else if (pomodoroTime === 0 && pomodoroActive) { setPomodoroActive(false); setPomodoroTime(25 * 60); toast(' Pomodoro complete!', 'success') } }, [pomodoroActive, pomodoroTime])
  useEffect(() => { if (workoutActive) { const ex = weeklyWorkouts[workoutDay].exercises[currentExIdx]; if (ex?.duration && exTimer < ex.duration) { const t = setTimeout(() => setExTimer(p => p + 1), 1000); return () => clearTimeout(t) } } }, [workoutActive, exTimer, currentExIdx, workoutDay])
  useEffect(() => { if (showUndo) { const t = setTimeout(() => setShowUndo(false), 5000); return () => clearTimeout(t) } }, [showUndo])
  useEffect(() => { if (coldProtocol.isActive) { const t = setTimeout(() => setColdProtocol(p => ({...p, timer: p.timer + 1})), 1000); return () => clearTimeout(t) } }, [coldProtocol.isActive, coldProtocol.timer])
  useEffect(() => { if (aiMeditation.isActive && aiMeditation.duration > 0) { const t = setTimeout(() => setAiMeditation(p => ({...p, duration: p.duration - 1})), 1000); return () => clearTimeout(t) } else if (aiMeditation.duration === 0 && aiMeditation.isActive) { setAiMeditation(p => ({...p, isActive: false, duration: 480})); toast(' Meditation complete. You are centered.', 'success') } }, [aiMeditation.isActive, aiMeditation.duration])

  // === DEEP WORK MODE — Timer + Flow Score Computation ===
  const computeFlowScore = useCallback(() => {
    if (healthSource !== 'live') return 50 // default if no Oura
    const hrvScore = Math.min(40, Math.max(0, (health.hrv - 30) * 2)) // 30-50 HRV = 0-40 points
    const sleepScore = Math.min(30, Math.max(0, (health.sleep - 60) * 0.75)) // 60-100 sleep = 0-30 points
    const stressScore = Math.min(20, Math.max(0, (60 - health.stress) * 0.5)) // low stress = up to 20 points
    const readinessBonus = health.readiness > 80 ? 10 : health.readiness > 70 ? 5 : 0
    return Math.round(Math.min(100, hrvScore + sleepScore + stressScore + readinessBonus))
  }, [health, healthSource])

  const getOptimalFlowTime = useCallback(() => {
    // Based on chronobiology: most people peak 2-4h after waking
    // High HRV in morning = early bird, lower = later peak
    if (healthSource !== 'live') return '08:00'
    if (health.hrv > 55) return '06:00' // high HRV = early riser
    if (health.hrv > 45) return '08:00' // normal
    return '10:00' // lower HRV = later peak
  }, [health.hrv, healthSource])

  const startDeepWorkSession = useCallback((mode: 'build' | 'creative' | 'recovery') => {
    const duration = mode === 'build' ? deepWorkConfig.buildDuration * 60 
      : mode === 'creative' ? deepWorkConfig.creativeDuration * 60 
      : deepWorkConfig.recoveryDuration * 60
    setDeepWork(p => ({
      ...p,
      isActive: true,
      mode,
      currentBlock: p.currentBlock + 1,
      blockTime: duration,
      blockDuration: duration,
      flowScore: computeFlowScore()
    }))
    setPomodoroActive(false) // pause regular pomodoro if running
    toast(`${mode.charAt(0).toUpperCase() + mode.slice(1)} block started`, 'success')
  }, [deepWorkConfig, computeFlowScore])

  const stopDeepWork = useCallback(() => {
    const minutesWorked = Math.round((deepWork.blockDuration - deepWork.blockTime) / 60)
    setDeepWork(p => ({
      ...p,
      isActive: false,
      mode: 'idle',
      totalDeepMinutes: p.totalDeepMinutes + minutesWorked,
      sessionsToday: p.sessionsToday + (minutesWorked > 5 ? 1 : 0),
      currentBlock: 0,
      blockTime: 0,
      blockDuration: 0
    }))
    if (minutesWorked > 5) toast(`${minutesWorked}min deep work logged`, 'success')
  }, [deepWork.blockDuration, deepWork.blockTime])

  const advanceDeepWorkBlock = useCallback(() => {
    // Cycle: Build → Recovery → Build → Creative → Build → Recovery...
    const sequence: ('build' | 'recovery' | 'creative')[] = ['build', 'recovery', 'build', 'creative']
    const nextIdx = deepWork.currentBlock % sequence.length
    const nextMode = sequence[nextIdx]
    if (deepWork.currentBlock >= deepWorkConfig.blocksPerSession * 2) {
      // Session complete
      const totalMins = deepWork.totalDeepMinutes + Math.round(deepWork.blockDuration / 60)
      setDeepWork(p => ({
        ...p,
        isActive: false,
        mode: 'idle',
        currentBlock: 0,
        blockTime: 0,
        totalDeepMinutes: totalMins,
        sessionsToday: p.sessionsToday + 1
      }))
      toast('Deep work session complete! Take a long break.', 'success')
    } else {
      startDeepWorkSession(nextMode)
    }
  }, [deepWork.currentBlock, deepWork.totalDeepMinutes, deepWork.blockDuration, deepWorkConfig.blocksPerSession, startDeepWorkSession])

  // Deep Work Timer
  useEffect(() => {
    if (!deepWork.isActive || deepWork.blockTime <= 0) return
    const timer = setTimeout(() => {
      setDeepWork(p => ({ ...p, blockTime: p.blockTime - 1 }))
    }, 1000)
    return () => clearTimeout(timer)
  }, [deepWork.isActive, deepWork.blockTime])

  // Deep Work block completion
  useEffect(() => {
    if (deepWork.isActive && deepWork.blockTime === 0 && deepWork.blockDuration > 0) {
      const minutesWorked = Math.round(deepWork.blockDuration / 60)
      setDeepWork(p => ({ ...p, totalDeepMinutes: p.totalDeepMinutes + minutesWorked }))
      if (deepWorkConfig.autoAdvance) {
        toast(`${deepWork.mode} block complete!`, 'success')
        setTimeout(() => advanceDeepWorkBlock(), 2000)
      } else {
        setDeepWork(p => ({ ...p, isActive: false, mode: 'idle' }))
        toast(`${deepWork.mode} block complete! Start next manually.`, 'success')
      }
    }
  }, [deepWork.isActive, deepWork.blockTime, deepWork.blockDuration, deepWork.mode, deepWorkConfig.autoAdvance, advanceDeepWorkBlock])

  // Update flow score periodically
  useEffect(() => {
    const score = computeFlowScore()
    const optTime = getOptimalFlowTime()
    setDeepWork(p => ({ ...p, flowScore: score, optimalTime: optTime }))
  }, [health, computeFlowScore, getOptimalFlowTime])

  // AI Body Recap — auto-generate every 10 minutes
  const generateBodyRecap = useCallback(() => {
    if (aiBodyRecapLoading) return
    setAiBodyRecapLoading(true)
    const todayData = {
      date: new Date().toISOString().split('T')[0],
      healthSource,
      readiness: health.readiness, sleep: health.sleep, activity: health.activity,
      hrv: health.hrv, heartRate: health.heartRate, stress: health.stress, resilience: health.resilience,
      sleepSession: ouraReport?.daily?.sleepSession || null,
      activityDetails: ouraReport?.daily?.activityDetails || null,
      stressData: ouraReport?.daily?.stressData || null,
      spo2: ouraReport?.daily?.spo2 || null,
      tags: {
        enhanced: ouraTags.enhanced.map((t: any) => t.tagTypeCode?.replace(/^tag_/, '').replace(/_/g, ' ')).filter(Boolean),
        legacy: ouraTags.legacy.flatMap((t: any) => (t.tags || []).map((tag: string) => tag.replace(/^tag_generic_/, '').replace(/^tag_/, '').replace(/_/g, ' ')))
      },
      habitsCompleted: habits.filter(hb => hb.done).map(hb => hb.name),
      habitsTotal: habits.length,
    }
    const historicalData = {
      averages: ouraReport?.averages || null,
      trend: ouraReport?.trend ? {
        readiness: (ouraReport.trend.readiness || []).slice(-7),
        sleep: (ouraReport.trend.sleep || []).slice(-7),
        activity: (ouraReport.trend.activity || []).slice(-7),
        sleepSessions: (ouraReport.trend.sleepSessions || []).slice(-7),
      } : null,
    }
    fetch('/api/claude', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system: `Sei l'assistente AI personale di THETA, un sistema di biohacking e trading. Il tuo compito è fare un resoconto giornaliero del corpo dell'utente basandoti sui dati biometrici di OGGI e confrontandoli con lo storico recente. Parla in prima persona plurale (noi) come se fossi un coach personale. Usa italiano. Sii diretto, pratico e motivante. Struttura la risposta in 3 sezioni brevi:\n1. 🔍 STATO ATTUALE - Come sta il corpo oggi (2-3 frasi)\n2. 📊 CONFRONTO STORICO - Trend rispetto ai giorni precedenti (2-3 frasi)\n3. ⚡ AZIONI CONSIGLIATE - 2-3 consigli specifici per oggi\n\nSe i dati sono in demo/fallback, dillo chiaramente. Se ci sono tag Oura, incorporali nell'analisi. Mantieni il tutto sotto 200 parole.`,
        messages: [{ role: 'user', content: `Ecco i dati del mio corpo di oggi e lo storico:\n\nOGGI:\n${JSON.stringify(todayData, null, 2)}\n\nSTORICO RECENTE:\n${JSON.stringify(historicalData, null, 2)}\n\nFammi un resoconto completo.` }]
      })
    })
      .then(r => r.json())
      .then(data => {
        setAiBodyRecap(data.content || data.error || 'Errore nella generazione del recap.')
        setAiBodyRecapLastUpdate(new Date())
        setAiBodyRecapLoading(false)
      })
      .catch(() => {
        setAiBodyRecap('⚠ Impossibile generare il recap. Verifica che ANTHROPIC_API_KEY sia configurata.')
        setAiBodyRecapLoading(false)
      })
  }, [health, healthSource, ouraReport, ouraTags, habits, aiBodyRecapLoading])

  useEffect(() => {
    // First recap after 8 seconds (let Oura data load first)
    const initialTimeout = setTimeout(() => generateBodyRecap(), 8000)
    // Then refresh every 10 minutes
    const recapInterval = setInterval(() => generateBodyRecap(), 10 * 60 * 1000)
    return () => { clearTimeout(initialTimeout); clearInterval(recapInterval) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // === SENTIMENT MIRROR — Computed from REAL data (diary, trades, biometrics, market) ===
  const computeSentimentMirror = useCallback(async () => {
    if (sentimentMirror.loading) return
    setSentimentMirror(p => ({...p, loading: true}))
    
    try {
      // 1. Extract diary keywords from recent entries
      const recentDiary = diaryEntries.slice(-3)
      const diaryText = recentDiary.map(d => d.content).join(' ')
      const positiveWords = ['focused', 'confident', 'calm', 'good', 'strong', 'disciplined', 'patient', 'clear', 'motivated', 'ready', 'sharp']
      const negativeWords = ['anxious', 'stressed', 'tired', 'frustrated', 'angry', 'revenge', 'fomo', 'scared', 'confused', 'lost', 'bad']
      const foundPositive = positiveWords.filter(w => diaryText.toLowerCase().includes(w))
      const foundNegative = negativeWords.filter(w => diaryText.toLowerCase().includes(w))
      const diaryKeywords = [...foundPositive.map(w => `✓ ${w}`), ...foundNegative.map(w => `✗ ${w}`)].slice(0, 5)
      const diaryScore = foundPositive.length * 15 - foundNegative.length * 20

      // 2. Trade performance metrics
      const todayStr = new Date().toISOString().slice(0, 10)
      const recentTrades = trades.filter(t => {
        const d = new Date(t.date)
        const diff = (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)
        return diff <= 7
      })
      const wins = recentTrades.filter(t => t.pnl > 0).length
      const losses = recentTrades.filter(t => t.pnl < 0).length
      const wr = recentTrades.length > 0 ? Math.round((wins / recentTrades.length) * 100) : 50
      const tradeScore = wr - 50 // -50 to +50 range
      
      // 3. Biometric score from Oura
      const bioScore = healthSource === 'live' 
        ? ((health.readiness > 70 ? 20 : -10) + (health.stress < 40 ? 15 : -15) + (health.hrv > 45 ? 15 : -10) + (health.sleep > 75 ? 10 : -10))
        : 0

      // 4. Overall market sentiment estimation (from trades direction + diary mood)
      const rawSentiment = Math.max(10, Math.min(95, 50 + diaryScore + tradeScore + (bioScore / 2)))
      const marketSentiment = Math.round(rawSentiment)
      
      // 5. Determine correlation
      const isPositive = diaryScore >= 0 && bioScore >= 0
      const isNegative = diaryScore < -10 || bioScore < -10
      const correlation = isPositive ? 'POSITIVE' : isNegative ? 'NEGATIVE' : 'NEUTRAL'
      
      // 6. Warnings
      let warning = ''
      if (losses >= 3 && recentTrades.length > 0) warning = '⚠ 3+ losses recenti. Risk of revenge trading.'
      if (health.stress > 60) warning = '⚠ Stress alto da Oura. Considera pausa.'
      if (foundNegative.includes('revenge') || foundNegative.includes('fomo')) warning = '⚠ Diary keywords suggeriscono stato emotivo a rischio.'

      // 7. Generate AI prediction via Claude
      let prediction = `Sentiment: ${marketSentiment}% | WR 7d: ${wr}% | Bio: ${bioScore > 0 ? 'OK' : 'Attenzione'}`
      try {
        const aiRes = await fetch('/api/claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: 'Sei un trading psychologist AI. Analizza i dati e dai una previsione BREVE (max 2 frasi) sulla qualità di esecuzione del trader oggi. Parla in italiano, sii diretto.',
            message: `Diary keywords: ${diaryKeywords.join(', ') || 'nessuno'}. Win rate 7d: ${wr}% (${wins}W/${losses}L). Biometrics: Readiness ${health.readiness}, HRV ${health.hrv}, Stress ${health.stress}, Sleep ${health.sleep}. Habits done: ${habits.filter(h => h.done).length}/${habits.length}. Correlation: ${correlation}. Warning: ${warning || 'nessuno'}.`
          })
        })
        const aiData = await aiRes.json()
        if (aiData.response) prediction = aiData.response
      } catch {}

      // 8. Build historical match patterns from real trade data
      const historicalMatch: {pattern: string, winRate: number, trades: number}[] = []
      if (recentTrades.length >= 3) {
        historicalMatch.push({ pattern: `Last 7 days pattern (${wins}W/${losses}L)`, winRate: wr, trades: recentTrades.length })
      }
      if (healthSource === 'live' && health.hrv > 45 && health.readiness > 70) {
        const goodBioTrades = trades.filter(t => t.pnl > 0).length
        historicalMatch.push({ pattern: 'Good bio state (HRV>45 + Readiness>70)', winRate: trades.length > 0 ? Math.round((goodBioTrades / Math.max(trades.length, 1)) * 100) : 0, trades: trades.length })
      }
      if (diaryKeywords.length > 0 && foundPositive.length > foundNegative.length) {
        historicalMatch.push({ pattern: `Positive diary mood`, winRate: Math.min(85, wr + 10), trades: recentTrades.length })
      }

      setSentimentMirror(prev => ({
        ...prev,
        marketSentiment,
        // Keep VIX from API fetch, don't overwrite
        diaryKeywords,
        correlation,
        warning,
        prediction,
        historicalMatch,
        lastUpdate: new Date(),
        loading: false
      }))
    } catch (e) {
      console.warn('[THETA] Sentiment Mirror error:', e)
      setSentimentMirror(p => ({...p, loading: false}))
    }
  }, [diaryEntries, trades, health, healthSource, habits, sentimentMirror.loading])

  // Auto-compute Sentiment Mirror after data loads and every 10 min
  useEffect(() => {
    const sentimentTimeout = setTimeout(() => computeSentimentMirror(), 12000)
    const sentimentInterval = setInterval(() => computeSentimentMirror(), 10 * 60 * 1000)
    return () => { clearTimeout(sentimentTimeout); clearInterval(sentimentInterval) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // === SOCIAL PROOF — Auto-populate from real trade wins + habit streaks ===
  useEffect(() => {
    if (!dataReady) return
    const wins: {type: string, value: string, date: string}[] = []
    // Recent winning trades
    const recentWinTrades = trades.filter(t => t.pnl > 0).slice(-5)
    recentWinTrades.forEach(t => {
      wins.push({ type: 'trade', value: `+$${t.pnl}`, date: t.date })
    })
    // Habit streaks > 5 days
    habits.filter(h => h.streak >= 5).forEach(h => {
      wins.push({ type: 'streak', value: `${h.streak}d ${h.name}`, date: new Date().toISOString().slice(0, 10) })
    })
    // Cold protocol streak
    if (coldProtocol.streak >= 5) {
      wins.push({ type: 'streak', value: `${coldProtocol.streak}d Cold Protocol`, date: new Date().toISOString().slice(0, 10) })
    }
    setSocialProof(p => ({...p, recentWins: wins.slice(-6)}))
  }, [dataReady, trades, habits, coldProtocol.streak])

  const toast = (msg: string, type?: string) => { const id = Date.now(); setToasts(p => [...p, { id, msg, type }]); setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000) }
  
  // Demo mode blocker - shows toast and returns true if in demo mode
  const demoBlock = () => {
    if (isDemo) {
      toast('🔒 Demo mode — Get THETA to unlock all features!', 'info')
      return true
    }
    return false
  }
  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
  const formatClock = (d: Date) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  
  // Convert EST time to user's local timezone and calculate countdown
  const getEventCountdown = (eventTimeEST: string) => {
    const [h, m] = eventTimeEST.split(':').map(Number)
    const now = new Date()
    
    // Create event time in EST (UTC-5)
    const estOffset = -5 // EST is UTC-5
    const eventUTC = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), h - estOffset, m))
    
    // Get user's local time offset in hours
    const localOffset = -now.getTimezoneOffset() / 60
    
    // Convert to user's local time
    const eventLocal = new Date(eventUTC.getTime())
    const localTimeStr = eventLocal.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timezone })
    
    // Calculate diff from now
    const diff = eventUTC.getTime() - now.getTime()
    const isPast = diff < 0
    const hours = Math.floor(Math.abs(diff) / 3600000)
    const mins = Math.floor((Math.abs(diff) % 3600000) / 60000)
    const countdown = isPast ? 'RELEASED' : hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
    
    return { countdown, isPast, localTimeStr }
  }
  
  const toggleHabit = async (id: number) => {
    if (demoBlock()) return
    const h = habits.find(x => x.id === id)
    if (!h) return
    if (h.name === 'Workout' && !h.done) { setSection('workout'); return }
    const nowDone = !h.done
    const newStreak = nowDone ? h.streak + 1 : Math.max(0, h.streak - 1)
    setHabits(p => p.map(hb => hb.id === id ? { ...hb, done: nowDone, streak: newStreak } : hb))
    toast(`${h.done ? 'Unchecked' : 'OK'} ${h.name}`)
    // Persist: update streak on habits table
    dbUpdate('habits', id, { streak: newStreak })
    // Persist: add/remove habit_log for today
    const todayDate = new Date().toISOString().slice(0, 10)
    if (nowDone) {
      const logRecord = await dbInsert('habit_logs', { habit_id: id, date: todayDate })
      if (logRecord?.id) setHabitLogs(p => [...p, { id: logRecord.id, habit_id: id, date: todayDate }])
    } else {
      // Remove today's log
      const todayLog = habitLogs.find(l => l.habit_id === id && l.date === todayDate)
      if (todayLog) {
        dbDelete('habit_logs', todayLog.id)
        setHabitLogs(p => p.filter(l => l.id !== todayLog.id))
      }
    }
  }

  const pushUndo = (type: string, data: any, msg: string) => { setUndoAction({ type, data, msg }); setShowUndo(true) }
  const doUndo = () => {
    if (!undoAction) return
    const { type, data } = undoAction
    if (type === 'delete-task') { setTasks(p => [...p, data]); dbInsert('tasks', taskToDb(data)) }
    if (type === 'delete-project') setProjects(p => [...p, data])
    if (type === 'delete-trade') { setTrades(p => [...p, data]); dbInsert('trades', tradeToDb(data)) }
    if (type === 'delete-event') { setCalendarEvents(p => [...p, data]); dbInsert('calendar_events', calEventToDb(data)) }
    if (type === 'delete-resource') { setResources(p => [...p, data]); dbInsert('resources', resourceToDb(data)) }
    if (type === 'complete-task') { setTasks(p => p.map(t => t.id === data.id ? { ...t, completed: false } : t)); dbUpdate('tasks', data.id, taskToDb({ ...data, completed: false })) }
    setShowUndo(false); toast('Undone!', 'success')
  }

  const handleContextMenu = (e: React.MouseEvent, type: string, item: any) => { e.preventDefault(); e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, type, item }) }
  const handleContextAction = (action: string) => {
    if (!contextMenu) return
    const { type, item } = contextMenu
    if (action === 'edit') {
      if (type === 'trade') { setEditingTrade(item); setShowTradeModal(true) }
      if (type === 'task') { setEditingTask(item); setShowTaskModal(true) }
      if (type === 'project') { setEditingProject(item); setShowProjectModal(true) }
      if (type === 'event') { setEditingEvent(item); setShowEventModal(true) }
      if (type === 'resource') { setEditingResource(item); setShowResourceModal(true) }
    }
    if (action === 'delete') {
      if (type === 'trade') { pushUndo('delete-trade', item, 'Deleted'); deleteTrade(item) }
      if (type === 'task') { pushUndo('delete-task', item, 'Deleted'); deleteTask(item) }
      if (type === 'project') { pushUndo('delete-project', item, 'Deleted'); setProjects(p => p.filter(pr => pr.id !== item.id)) }
      if (type === 'event') { pushUndo('delete-event', item, 'Deleted'); setCalendarEvents(p => p.filter(e => e.id !== item.id)); dbDelete('calendar_events', item.id) }
      if (type === 'resource') { pushUndo('delete-resource', item, 'Deleted'); setResources(p => p.filter(r => r.id !== item.id)); dbDelete('resources', item.id) }
    }
    setContextMenu(null)
  }

  const handleNavDragStart = (id: string) => setDraggedNav(id)
  const handleNavDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); if (!draggedNav || draggedNav === id) return; const n = [...navOrder]; const f = n.indexOf(draggedNav); const t = n.indexOf(id); n.splice(f, 1); n.splice(t, 0, draggedNav); setNavOrder(n) }
  const handleNavDragEnd = () => setDraggedNav(null)

  // saveTrade and saveTask are now defined above with DB integration
  const saveProject = async (data: Partial<Project>) => {
    if (demoBlock()) return
    const tempPid = editingProject ? editingProject.id : Date.now()
    if (editingProject) { 
      const updated = { ...editingProject, ...data }
      setProjects(p => p.map(pr => pr.id === editingProject.id ? { ...pr, ...data } : pr))
      dbUpdate('projects', editingProject.id, projectToDb(updated as Project))
    } else {
      const newProj = { id: tempPid, name: '', color: '#8b5cf6', deadline: '', ...data }
      setProjects(p => [...p, newProj])
      const dbRec = await dbInsert('projects', projectToDb(newProj as Project))
      const realPid = dbRec?.id || tempPid
      if (dbRec?.id) setProjects(p => p.map(pr => pr.id === tempPid ? { ...pr, id: dbRec.id } : pr))
      // Insert project tasks
      newProjectTasks.forEach(async (t, i) => { 
        if (t.title.trim()) { 
          const newTask: Task = { id: Date.now() + i, title: t.title, urgent: t.urgent, important: t.important, deadline: t.deadline || data.deadline || '', projectId: realPid, completed: false, order: i }
          setTasks(p => [...p, newTask])
          const taskRec = await dbInsert('tasks', taskToDb(newTask))
          if (taskRec?.id) setTasks(p => p.map(tk => tk.id === newTask.id ? { ...tk, id: taskRec.id } : tk))
        } 
      })
    }
    setNewProjectTasks([]); setShowProjectModal(false); setEditingProject(null); toast('Saved', 'success')
  }
  const saveEvent = async (data: Partial<CalEvent>) => { 
    if (editingEvent) {
      const updated = { ...editingEvent, ...data }
      setCalendarEvents(p => p.map(e => e.id === editingEvent.id ? updated : e))
      dbUpdate('calendar_events', editingEvent.id, calEventToDb(updated as CalEvent))
    } else {
      const tempId = Date.now()
      const newEvent: CalEvent = { id: tempId, title: '', date: todayStr, time: '09:00', category: 'personal', ...data }
      setCalendarEvents(p => [...p, newEvent])
      const dbRecord = await dbInsert('calendar_events', calEventToDb(newEvent))
      if (dbRecord?.id) setCalendarEvents(p => p.map(e => e.id === tempId ? { ...e, id: dbRecord.id } : e))
    }
    setShowEventModal(false); setEditingEvent(null); toast('Saved', 'success') 
  }
  const saveResource = async (data: Partial<Resource>) => { 
    if (demoBlock()) return
    if (editingResource) { 
      const updated = { ...editingResource, ...data }
      setResources(p => p.map(r => r.id === editingResource.id ? updated : r))
      dbUpdate('resources', editingResource.id, resourceToDb(updated as Resource))
    } else { 
      const tempId = Date.now()
      const newResource: Resource = { id: tempId, name: '', notes: '', link: '', fileName: '', fileData: '', category: resourceCategories[0] || 'General', createdAt: new Date().toISOString(), ...data }
      setResources(p => [...p, newResource])
      const dbRecord = await dbInsert('resources', resourceToDb(newResource))
      if (dbRecord?.id) setResources(p => p.map(r => r.id === tempId ? { ...r, id: dbRecord.id } : r))
    }
    setShowResourceModal(false)
    setEditingResource(null)
    toast('Saved', 'success') 
  }
  const completeTask = (id: number) => { const t = tasks.find(x => x.id === id); if (t) { if (!t.completed) pushUndo('complete-task', t, 'Completed'); toggleTaskComplete(t) } }

  // AI Backtest Image Analysis
  const analyzeBacktestImage = async (file: File) => {
    setBacktestAnalyzing(true)
    
    // Convert to base64
    const reader = new FileReader()
    reader.onload = async (evt) => {
      const base64Full = evt.target?.result as string
      
      // Create a resized thumbnail (max 400px wide) as persistent base64 for storage
      const img = new Image()
      img.onload = async () => {
        const canvas = document.createElement('canvas')
        const maxW = 300
        const scale = Math.min(maxW / img.width, 1)
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
        const thumbnailBase64 = canvas.toDataURL('image/jpeg', 0.5)
        
        // Use thumbnail for display (persists across reloads)
        setBacktestImage(thumbnailBase64)
        
        try {
          const res = await fetch('/api/claude', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              messages: [{ 
                role: 'user', 
                content: [
                  { 
                    type: 'image', 
                    source: { 
                      type: 'base64', 
                      media_type: file.type, 
                      data: base64Full.split(',')[1] 
                    } 
                  },
                  { 
                    type: 'text', 
                    text: `You are a MotiveWave chart analyst. Extract trade data from this screenshot.

FOLLOW THESE STEPS IN EXACT ORDER:

═══ STEP 1: READ P/L VALUE (MOST CRITICAL STEP) ═══
Find the text "PL:" on the chart. It is usually displayed as white text.
- Read the EXACT number after "PL:" character by character
- PAY ATTENTION TO THE SIGN:
  * If you see "PL:500.00" or "PL: 500.00" → pnl = 500 (POSITIVE — NO minus sign before the number)
  * If you see "PL:-260.00" or "PL: -260.00" → pnl = -260 (NEGATIVE — there IS a minus/hyphen "-" before the number)
  * If you see "PL:0.00" → pnl = 0
- The "-" character is a small horizontal dash right before the first digit. Look carefully.
- DO NOT confuse the colon ":" with a minus sign
- DO NOT assume or infer the sign from anything else — READ IT from the "PL:" text

═══ STEP 2: DETERMINE OUTCOME (BASED ONLY ON STEP 1) ═══
This is a DIRECT mapping from the P/L sign:
- pnl > 0 (positive number, no "-") → outcome = "TP" (Take Profit was hit)
- pnl < 0 (negative number, has "-") → outcome = "SL" (Stop Loss was hit)
- pnl = 0 → outcome = "BE" (Break Even)
DO NOT use any other information to determine outcome. The PL value IS the truth.

═══ STEP 3: DETERMINE DIRECTION ═══
Use the ENTRY ORDER LABEL as your PRIMARY indicator:
- Look for labels on the chart: "BOT" (Bought) or "SLD" (Sold)
- The FIRST order label (leftmost/earliest) is the ENTRY:
  • If entry says "BOT LMT", "BOT MKT", or starts with "BOT" → dir = "LONG"
  • If entry says "SLD LMT", "SLD MKT", or starts with "SLD" → dir = "SHORT"
SECONDARY: blue zone ABOVE entry line = LONG, blue zone BELOW entry line = SHORT

═══ STEP 4: CALCULATE R:R ═══
- Look for colored zones on the chart:
  * A GREEN or BLUE zone = profit target area
  * A RED zone = stop loss area
- REWARD = distance from entry to the edge of the profit zone
- RISK = distance from entry to the edge of the stop/red zone
- R:R = REWARD ÷ RISK, format "X.X:1"
- If you can read price levels from the Y-axis, use those for precision
- If zones are not visible, estimate from entry to exit vs entry to where the stop would be

═══ STEP 5: READ TIME FROM X-AXIS (CRITICAL) ═══
Look at the BOTTOM of the chart — the X-axis shows timestamps.
- Find the timestamp directly below or nearest to the ENTRY order label
- Read the EXACT time shown (e.g., "10:15", "15:45", "08:30")
- Format: "HH:MM" in 24-hour format
- These timestamps may be in CET (Central European Time) or ET (US Eastern Time)
- IMPORTANT: Do NOT guess the time. Read it from the X-axis numbers.

═══ STEP 6: DETERMINE SESSION ═══
Based on the time you read from the X-axis, determine the trading session.
If chart time appears to be CET (European timezone):
- 01:00–09:00 → "Tokyo"
- 09:00–15:30 → "London"  
- 15:30–22:00 → "NY"
If chart time appears to be ET (US Eastern):
- 19:00–03:00 → "Tokyo"
- 03:00–09:30 → "London"
- 09:30–16:00 → "NY"
Default to "NY" if unsure.

═══ STEP 7: READ DATE ═══
Look for a date near timestamps or in the header bar. US format: MM-DD = Month-Day.
Convert to: YYYY-MM-DD

═══ STEP 8: READ SYMBOL ═══
Top-left corner shows instrument (e.g., "NQH6" → "NQ", "ESZ5" → "ES")

Reply with ONLY valid JSON, no markdown, no backticks:
{"pnl": 500, "rr": "1.5:1", "outcome": "TP", "dir": "LONG", "time": "10:15", "session": "London", "date": "2025-01-06", "symbol": "NQ", "contracts": 1}`
                  }
                ]
              }] 
            })
          })
          
          const data = await res.json()
          try {
            const jsonMatch = data.content.match(/\{[\s\S]*\}/)
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0])
              
              // FORCE consistency: pnl sign determines outcome
              const pnl = Number(parsed.pnl) || 0
              let outcome = pnl > 0 ? 'TP' : pnl < 0 ? 'SL' : 'BE'
              // If AI says TP or SL and pnl is 0, trust AI (could be rounding)
              if (pnl === 0 && (parsed.outcome === 'TP' || parsed.outcome === 'SL')) outcome = parsed.outcome
              
              // Validate direction: trust AI's reading of order labels
              const dir = (parsed.dir === 'LONG' || parsed.dir === 'SHORT') ? parsed.dir : 'LONG'
              
              // Validate R:R format — must be "X.X:1" or "X:1"
              let rr = parsed.rr || '1:1'
              const rrMatch = rr.match(/^(\d+\.?\d*):(\d+\.?\d*)$/)
              if (!rrMatch) rr = '1:1'
              else {
                const rrVal = parseFloat(rrMatch[1]) / parseFloat(rrMatch[2])
                if (rrVal < 0.1 || rrVal > 20) rr = '1:1'
              }
              
              // Use AI-provided session, with fallback
              const time = parsed.time || '09:30'
              const validSessions = ['Tokyo', 'London', 'NY']
              let session = validSessions.includes(parsed.session) ? parsed.session : 'NY'
              
              setAnalyzedTrade({
                strategy: '',
                symbol: parsed.symbol || 'NQ',
                dir: dir,
                entry: 0, exit: 0, sl: 0, tp: 0,
                rr: rr,
                pnl: pnl,
                outcome: outcome,
                date: parsed.date || todayStr,
                time: time,
                session: session,
                tags: [],
                notes: ''
              })
              toast('Trade analyzed!', 'success')
            } else {
              throw new Error('No JSON found')
            }
          } catch {
            setAnalyzedTrade({ 
              strategy: '', symbol: 'NQ', dir: 'LONG', 
              entry: 0, exit: 0, sl: 0, tp: 0, rr: '1:1', pnl: 0, outcome: 'SL',
              date: todayStr, time: '09:30', session: 'NY', tags: [], notes: ''
            })
            toast('Enter values manually', 'success')
          }
        } catch (err) {
          setAnalyzedTrade({ 
            strategy: '', symbol: 'NQ', dir: 'LONG', 
            entry: 0, exit: 0, sl: 0, tp: 0, rr: '1:1', pnl: 0, outcome: 'SL',
            date: todayStr, time: '09:30', session: 'NY', tags: [], notes: ''
          })
          toast('Offline mode', 'success')
        }
        
        setBacktestAnalyzing(false)
      }
      img.src = base64Full
    }
    reader.readAsDataURL(file)
  }

  const navLabels: Record<string, { label: string; icon: string }> = { dashboard: { label: 'Dashboard', icon: 'dashboard' }, tasks: { label: 'Tasks & Projects', icon: 'tasks' }, calendar: { label: 'Calendar', icon: 'calendar' }, trading: { label: 'Trading', icon: 'trading' }, finance: { label: 'Finance', icon: 'wallet' }, biohacking: { label: 'Health & Bio', icon: 'health' }, neuro: { label: 'Neuro', icon: 'meditate' }, workout: { label: 'Workout', icon: 'workout' }, resources: { label: 'Resources', icon: 'folder' }, social: { label: 'Social Feed', icon: 'social' }, automation: { label: 'Automation Hub', icon: 'robot' }, mail: { label: 'Mail', icon: 'mail' }, insights: { label: 'Insights', icon: 'insights' } }

  const [futureSelfLoading, setFutureSelfLoading] = useState(false)
  const sendToFutureSelf = async (input: string) => {
    if (!input.trim() || futureSelfLoading) return
    setFutureSelf(p => ({...p, messages: [...p.messages, { from: 'user', text: input }], input: ''}))
    setFutureSelfLoading(true)
    try {
      const context = `Dati attuali: HRV ${health.hrv}ms, Readiness ${health.readiness}%, Stress ${health.stress}%, Sleep ${health.sleep}%. Trades oggi: ${trades.filter(t => t.date === new Date().toISOString().slice(0, 10)).length}. Win rate: ${trades.length > 0 ? Math.round((trades.filter(t => t.pnl > 0).length / trades.length) * 100) : 0}%. Habits done: ${habits.filter(h => h.done).length}/${habits.length}.`
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: `Sei "Future Self" — la versione futura (2026) dell'utente. Hai accesso a TUTTI i suoi dati: biometrici, trading, abitudini, diario. Parla come se fossi davvero lui dal futuro, in italiano. Sii diretto, a volte duro ma sempre con amore. Usa i dati reali per dare risposte personalizzate. Se l'utente chiede conferme per decisioni rischiose, sfidalo. Max 3-4 frasi.`,
          message: `${context}\n\nL'utente dice: "${input}"`
        })
      })
      const data = await res.json()
      setFutureSelf(p => ({...p, messages: [...p.messages, { from: 'future', text: data.response || 'Errore nella connessione. Ma fidati: quello che stai per fare, lo rifaresti tra un anno? Pensaci.' }]}))
    } catch {
      setFutureSelf(p => ({...p, messages: [...p.messages, { from: 'future', text: 'Non riesco a connettermi dal futuro in questo momento. Ma il mio consiglio resta: respira, aspetta 5 minuti, poi decidi.' }]}))
    }
    setFutureSelfLoading(false)
  }

  // Twitter functions
  const connectTwitter = async (username: string) => {
    if (!username) return
    setTwitterLoading(true)
    try {
      const res = await fetch(`/api/twitter?username=${username}`)
      const data = await res.json()
      if (data.error) {
        toast(data.error, 'error')
      } else {
        setTwitterProfile(data.user)
        setTwitterTweets(data.tweets || [])
        setTwitterConnected(true)
        localStorage.setItem('theta_twitter_username', username)
        toast('Twitter connected!', 'success')
      }
    } catch (err) {
      toast('Failed to connect Twitter', 'error')
    }
    setTwitterLoading(false)
  }

  const postTweet = async () => {
    if (!newTweet.trim() || newTweet.length > 280) return
    setTwitterPosting(true)
    try {
      const res = await fetch('/api/twitter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTweet })
      })
      const data = await res.json()
      if (data.error) {
        toast(data.error, 'error')
        console.error('Twitter error:', data)
      } else {
        toast('🐦 Tweet posted!', 'success')
        setNewTweet('')
      }
    } catch (err) {
      toast('Failed to post tweet', 'error')
      console.error(err)
    }
    setTwitterPosting(false)
  }

  // Load saved Twitter username
  useEffect(() => {
    const savedTwitter = localStorage.getItem('theta_twitter_username')
    if (savedTwitter) {
      setTwitterUsername(savedTwitter)
      connectTwitter(savedTwitter)
    }
  }, [])

  // Habit button component - used in both Dashboard and Health
  const HabitButton = ({ h }: { h: Habit }) => (
    <div className={`habit-btn ${h.done ? 'done' : ''}`} onClick={(e) => { e.stopPropagation(); toggleHabit(h.id) }} onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setEditingHabit({...h}); setShowHabitEditModal(true) }}>
      <div className="habit-icon"><Icon name={h.icon} size="sm" color={h.done ? '#000' : h.color} /></div>
      <span className="habit-name">{h.name}</span>
    </div>
  )

  const saveHabit = async (h: Habit) => {
    setHabits(p => p.map(hb => hb.id === h.id ? {...hb, name: h.name, icon: h.icon, color: h.color} : hb))
    dbUpdate('habits', h.id, { name: h.name, icon: h.icon, color: h.color })
    toast(`Habit "${h.name}" aggiornato`, 'success')
    setShowHabitEditModal(false)
    setEditingHabit(null)
  }

  const deleteHabit = async (id: number) => {
    const h = habits.find(hb => hb.id === id)
    if (!h) return
    if (!confirm(`Eliminare "${h.name}"?`)) return
    setHabits(p => p.filter(hb => hb.id !== id))
    dbDelete('habits', id)
    toast(`Habit "${h.name}" eliminato`)
    setShowHabitEditModal(false)
    setEditingHabit(null)
  }

  if (!mounted) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div className="logo">O</div></div>

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* DEMO MODE BANNER */}
      {isDemo && (
        <div style={{ 
          background: 'linear-gradient(90deg, #8b5cf6, #6366f1, #8b5cf6)', 
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s linear infinite',
          color: 'white', 
          padding: '14px 24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 9999,
          boxShadow: '0 4px 20px rgba(139,92,246,0.4)'
        }}>
          <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '24px', animation: 'pulse 2s infinite' }}>🎯</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '0.5px' }}>THETA DEMO — Complete Trading Performance System</div>
              <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>Biometrics • AI Insights • Journal • Analytics • Automation • All-in-one trading ecosystem</div>
            </div>
          </div>
          <a 
            href={DEMO_CONTACT_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              background: 'white', 
              color: '#7c3aed', 
              padding: '12px 28px', 
              borderRadius: '10px', 
              fontWeight: 700, 
              textDecoration: 'none',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)' }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            🚀 Get THETA Now
          </a>
        </div>
      )}
      
      <div style={{ flex: 1, display: 'flex' }}>
      {toasts.map(t => <div key={t.id} className="toast"><span style={{ color: t.type === 'error' ? 'var(--red)' : t.type === 'success' ? 'var(--green)' : 'var(--accent)' }}>{t.type === 'error' ? '✕' : t.type === 'success' ? '✓' : 'i'}</span>{t.msg}</div>)}
      {showUndo && undoAction && <div className="undo-toast"><span>{undoAction.msg}</span><button className="btn btn-ghost btn-sm" onClick={doUndo}><Icon name="undo" size="sm" /> Undo</button><button className="btn btn-ghost btn-xs" onClick={() => setShowUndo(false)}><Icon name="close" size="sm" /></button></div>}
      {contextMenu && <div className="context-menu" style={{ left: contextMenu.x, top: contextMenu.y }}><div className="context-menu-item" onClick={() => handleContextAction('edit')}><Icon name="edit" size="sm" /> Edit</div><div className="context-menu-divider" /><div className="context-menu-item danger" onClick={() => handleContextAction('delete')}><Icon name="trash" size="sm" /> Delete</div></div>}
      {lightboxImage && <div className="lightbox" onClick={() => setLightboxImage(null)}><img src={lightboxImage} alt="" /></div>}

      <aside className="sidebar">
        <div className="flex gap-sm items-center" style={{ padding: '0 8px', marginBottom: '20px' }}><div className="logo">O</div><div><div style={{ fontSize: '18px', fontWeight: 700 }}>THETA</div><div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>v8.0 * PIONEER</div></div></div>
        {dbStatus !== 'ok' && <div style={{ margin: '0 8px 12px', padding: '6px 10px', borderRadius: '6px', fontSize: '10px', background: dbStatus === 'checking' ? 'var(--bg-hover)' : dbStatus === 'offline' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: dbStatus === 'checking' ? 'var(--text-muted)' : dbStatus === 'offline' ? '#f59e0b' : '#ef4444' }}>
          {dbStatus === 'checking' ? '⟳ Connecting...' : dbStatus === 'offline' ? '⚠ Local mode (no DB)' : '✕ DB error — check tables'}
        </div>}
        <nav style={{ flex: 1 }}>{navOrder.map(id => { const nav = navLabels[id]; if (!nav) return null; const unreadCount = id === 'mail' ? gmailEmails.filter(e => e.unread).length : 0; return <div key={id} className={`nav-item ${section === id ? 'active' : ''}`} onClick={() => setSection(id)} draggable onDragStart={() => handleNavDragStart(id)} onDragOver={(e) => handleNavDragOver(e, id)} onDragEnd={handleNavDragEnd}><span className="drag-handle"><Icon name="drag" size="sm" /></span><Icon name={nav.icon} size="sm" /><span>{nav.label}</span>{unreadCount > 0 && <span style={{ marginLeft: 'auto', background: 'var(--accent)', color: 'white', borderRadius: '10px', padding: '2px 8px', fontSize: '10px', fontWeight: 700 }}>{unreadCount}</span>}</div> })}</nav>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}><div className="flex-between text-xs mb-sm"><span style={{ color: gateOpen ? 'var(--green)' : 'var(--red)' }}>Gate: {gateOpen ? 'OK OPEN' : ' LOCKED'}</span><span className="text-muted">Size: {sizeMultiplier}%</span></div><button className={`btn btn-ghost btn-sm w-full ${section === 'settings' ? 'active' : ''}`} onClick={() => setSection('settings')}><Icon name="settings" size="sm" /> Settings</button></div>
      </aside>

      <main style={{ flex: 1, padding: '20px 24px', overflow: 'auto' }}>
        <div className="flex-between mb-md"><div style={{ fontSize: '22px', fontWeight: 700 }}>{navLabels[section]?.label}</div><div className="text-sm text-muted">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div></div>

        {section === 'dashboard' && <div>
          <div className="glass card mb-md text-center" style={{ padding: '40px 20px' }}>
            <div style={{ fontSize: '38px', fontWeight: 700, letterSpacing: '-1px' }}>"{getDailyQuote()}"</div>
          </div>
          
          {/* Row 1: Clock/Deep Work Mode + Behaviors (editable) */}
          <div style={{ display: 'grid', gridTemplateColumns: '500px 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="glass card">
              <div className="text-center mb-sm">
                <div style={{ fontSize: '32px', fontWeight: 700 }} className="glow-text">{formatClock(currentTime)}</div>
                <div className="text-xs text-muted">{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
              </div>
              
              {/* Deep Work Mode */}
              <div style={{ padding: '10px', background: deepWork.isActive ? 'rgba(139,92,246,0.15)' : 'var(--bg-hover)', borderRadius: '8px', marginBottom: '8px', border: deepWork.isActive ? '1px solid var(--accent)' : '1px solid transparent', cursor: !deepWork.isActive ? 'pointer' : 'default' }} onClick={() => !deepWork.isActive && setShowDeepWorkModal(true)}>
                <div className="flex-between mb-xs">
                  <span className="text-xs flex items-center gap-xs" style={{ color: deepWork.isActive ? 'var(--accent)' : 'var(--text-muted)', fontWeight: 600 }}>
                    <Icon name="brain" size="sm" /> {deepWork.isActive ? `${deepWork.mode.toUpperCase()} BLOCK` : 'DEEP WORK'} {!deepWork.isActive && <span style={{ opacity: 0.6 }}>(click to configure)</span>}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: deepWork.isActive ? 'var(--accent)' : 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                    {deepWork.isActive ? formatTime(deepWork.blockTime) : `${deepWork.totalDeepMinutes}m today`}
                  </span>
                </div>
                {deepWork.isActive && (
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ height: '4px', background: 'var(--bg)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${((deepWork.blockDuration - deepWork.blockTime) / deepWork.blockDuration) * 100}%`, background: deepWork.mode === 'build' ? 'var(--accent)' : deepWork.mode === 'creative' ? 'var(--green)' : 'var(--blue)', transition: 'width 1s linear' }} />
                    </div>
                    <div className="flex-between text-xs text-muted mt-xs">
                      <span>Block {deepWork.currentBlock}/{deepWorkConfig.blocksPerSession * 2}</span>
                      <span className="flex items-center gap-xs">{deepWork.mode === 'build' ? <><Icon name="bolt" size="sm" /> Focus</> : deepWork.mode === 'creative' ? <><Icon name="walk" size="sm" /> Walk/Think</> : <><Icon name="recover" size="sm" /> Boring Break</>}</span>
                    </div>
                  </div>
                )}
                <div className="flex-between text-xs mb-sm" onClick={e => e.stopPropagation()}>
                  <span style={{ color: healthSource === 'live' ? 'var(--green)' : 'var(--text-muted)' }}>
                    Flow Score: <strong>{deepWork.flowScore}</strong>/100
                  </span>
                  <span className="text-muted">Best: {deepWork.optimalTime}</span>
                </div>
              </div>
              
              {deepWork.isActive ? (
                <div className="flex gap-sm">
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={stopDeepWork}>
                    <Icon name="stop" size="sm" /> Stop
                  </button>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={advanceDeepWorkBlock}>
                    <Icon name="chevronRight" size="sm" /> Skip
                  </button>
                </div>
              ) : (
                <div className="flex gap-sm">
                  <button className="btn btn-primary btn-sm" style={{ flex: 2 }} onClick={(e) => { e.stopPropagation(); startDeepWorkSession('build') }}>
                    <Icon name="bolt" size="sm" /> Start Build Block
                  </button>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={(e) => { e.stopPropagation(); setShowDeepWorkModal(true) }}>
                    <Icon name="settings" size="sm" /> Config
                  </button>
                </div>
              )}
              
              {/* Mini stats */}
              <div className="flex-between text-xs text-muted mt-sm" style={{ padding: '6px 8px', background: 'var(--bg)', borderRadius: '6px' }}>
                <span>Sessions: {deepWork.sessionsToday}</span>
                <span>|</span>
                <span>Week: {deepWork.weeklyMinutes}m</span>
              </div>
            </div>
            
            {/* Behaviors & Checklist - Two Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Behaviors */}
              <div className="glass card">
                <div className="flex-between mb-sm">
                  <span className="card-title"><Icon name="check" size="sm" /> Behaviors</span>
                  <button className="btn btn-ghost btn-xs" onClick={() => setShowBehaviorsModal(true)}><Icon name="edit" size="sm" /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {behaviors.map(b => {
                    const isChecked = checkedBehaviors.includes(b.id)
                    return (
                      <div key={b.id} className="flex items-center gap-sm clickable" style={{ padding: '8px 10px', background: isChecked ? 'rgba(34,197,94,0.1)' : 'var(--bg-hover)', borderRadius: '8px', border: isChecked ? '1px solid var(--green)' : '1px solid transparent' }} onClick={() => setCheckedBehaviors(prev => prev.includes(b.id) ? prev.filter(x => x !== b.id) : [...prev, b.id])}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--border)', background: isChecked ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isChecked && <Icon name="check" size="sm" color="white" />}
                        </div>
                        <span className="text-sm" style={{ flex: 1 }}>{b.label}</span>
                      </div>
                    )
                  })}
                  {behaviors.length === 0 && <div className="text-xs text-muted text-center" style={{ padding: '16px' }}>Click edit to add behaviors</div>}
                </div>
              </div>
              
              {/* Checklist */}
              <div className="glass card">
                <div className="flex-between mb-sm">
                  <span className="card-title"><Icon name="list" size="sm" /> Checklist</span>
                  <button className="btn btn-ghost btn-xs" onClick={() => setShowChecklistModal(true)}><Icon name="edit" size="sm" /></button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {checklist.map(c => {
                    const isChecked = checkedChecklist.includes(c.id)
                    return (
                      <div key={c.id} className="flex items-center gap-sm clickable" style={{ padding: '8px 10px', background: isChecked ? 'rgba(139,92,246,0.1)' : 'var(--bg-hover)', borderRadius: '8px', border: isChecked ? '1px solid var(--accent)' : '1px solid transparent' }} onClick={() => setCheckedChecklist(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: '2px solid var(--border)', background: isChecked ? 'var(--accent)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {isChecked && <Icon name="check" size="sm" color="white" />}
                        </div>
                        <span className="text-sm" style={{ flex: 1 }}>{c.label}</span>
                      </div>
                    )
                  })}
                  {checklist.length === 0 && <div className="text-xs text-muted text-center" style={{ padding: '16px' }}>Click edit to add checklist items</div>}
                </div>
              </div>
            </div>
          </div>
          
          {/* Row 2: Health + Tasks (bigger) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="glass card clickable" onClick={() => setSection('biohacking')}><div className="card-header"><span className="card-title"><Icon name="health" size="sm" /> Health & Habits</span><span className="text-xs" style={{ padding: '2px 8px', borderRadius: '10px', fontWeight: 600, background: healthSource === 'live' ? 'rgba(34,197,94,0.15)' : healthSource === 'loading' ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.15)', color: healthSource === 'live' ? 'var(--green)' : healthSource === 'loading' ? 'var(--accent)' : 'var(--amber)' }}>{healthSource === 'live' ? '● LIVE' : healthSource === 'loading' ? '⏳ Loading...' : healthSource === 'error' ? '⚠ Error' : '◌ DEMO'}</span></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>{[
                { l: 'Readiness', v: health.readiness, c: health.readiness > 70 ? 'var(--green)' : health.readiness > 0 ? 'var(--amber)' : 'var(--text-muted)', icon: 'zap' },
                { l: 'Sleep', v: health.sleep, c: health.sleep > 75 ? 'var(--green)' : health.sleep > 0 ? 'var(--amber)' : 'var(--text-muted)', icon: 'moon' },
                { l: 'HRV', v: health.hrv, c: health.hrv > 50 ? 'var(--green)' : health.hrv > 30 ? 'var(--amber)' : health.hrv > 0 ? 'var(--red)' : 'var(--text-muted)', icon: 'pulse', unit: 'ms' },
                { l: 'Activity', v: health.activity, c: health.activity > 60 ? 'var(--green)' : health.activity > 0 ? 'var(--amber)' : 'var(--text-muted)', icon: 'activity' },
                { l: 'HR', v: health.heartRate, c: health.heartRate > 0 ? (health.heartRate < 65 ? 'var(--green)' : 'var(--amber)') : 'var(--text-muted)', icon: 'heart', unit: 'bpm' },
                { l: 'Stress', v: health.stress, c: health.stress > 60 ? 'var(--red)' : health.stress > 30 ? 'var(--amber)' : health.stress > 0 ? 'var(--green)' : 'var(--text-muted)', icon: 'meditate', unit: 'min' }
              ].map(m => <div key={m.l} className="text-center" style={{ padding: '6px', background: 'var(--bg-hover)', borderRadius: '8px' }}><div style={{ marginBottom: '2px', display: 'flex', justifyContent: 'center' }}><Icon name={m.icon} size="sm" color={m.c} /></div><div style={{ fontSize: '16px', fontWeight: 700, color: m.c }}>{m.v > 0 ? `${m.v}${m.unit || '%'}` : '—'}</div><div className="text-xs text-muted">{m.l}</div></div>)}</div><div className="flex gap-xs flex-wrap justify-center">{habits.map(h => <HabitButton key={h.id} h={h} />)}</div></div>
            
            {/* Tasks - Bigger */}
            <div className="glass card clickable" onClick={() => setSection('tasks')}>
              <div className="card-header"><span className="card-title"><Icon name="tasks" size="sm" /> Tasks</span><span className="text-xs text-muted">{tasks.filter(t => !t.completed).length} remaining</span></div>
              {sortedTasks.filter(t => !t.completed).slice(0, 5).map(t => (
                <div key={t.id} className="flex gap-sm items-center" style={{ padding: '8px', marginBottom: '6px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <input type="checkbox" checked={t.completed} onChange={() => completeTask(t.id)} onClick={e => e.stopPropagation()} />
                  <span className="text-sm" style={{ flex: 1 }}>{t.title}</span>
                  {t.urgent && <span className="tag tag-red">!</span>}
                  {t.project && <span className="tag tag-accent">{t.project}</span>}
                </div>
              ))}
              {sortedTasks.filter(t => !t.completed).length === 0 && <div className="text-sm text-muted text-center" style={{ padding: '20px' }}>All done!</div>}
            </div>
          </div>
          
          {/* Row 3: Economic Calendar + Trading + Today */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="glass card clickable" onClick={() => { setSection('trading'); setTradingTab('bias') }}><div className="card-header"><span className="card-title"><Icon name="calendar" size="sm" /> Economic Calendar</span></div>{economicEvents.length === 0 ? <div className="text-sm text-muted text-center" style={{ padding: '20px' }}>No events today</div> : economicEvents.slice(0,3).map((ev, i) => {
              const { countdown, isPast } = getEventCountdown(ev.time)
              const impactColor = ev.impact === 'high' ? 'var(--red)' : ev.impact === 'medium' ? 'var(--amber)' : 'var(--text-muted)'
              return <div key={i} style={{ padding: '8px', marginBottom: '6px', background: 'var(--bg-hover)', borderRadius: '8px', borderLeft: `3px solid ${impactColor}`, opacity: isPast ? 0.5 : 1 }}>
                <div className="flex-between"><span className="text-sm font-semibold">{ev.name}</span><span className="text-xs" style={{ color: isPast ? 'var(--text-muted)' : 'var(--green)' }}>{countdown}</span></div>
              </div>
            })}</div>
            <div className="glass card clickable" onClick={() => setSection('trading')}><div className="card-header"><span className="card-title"><Icon name="trading" size="sm" /> Trading</span></div><div className="flex-between mb-sm"><div style={{ textAlign: 'center', flex: 1 }}><div style={{ fontSize: '24px', fontWeight: 700, color: todayPnl >= 0 ? 'var(--green)' : 'var(--red)' }} className="glow-text">{todayPnl >= 0 ? '+' : ''}${todayPnl}</div><div className="text-xs text-muted">Daily P&L</div></div><div style={{ textAlign: 'center', flex: 1 }}><div className="text-xl font-bold">{todayTrades.length}</div><div className="text-xs text-muted">Trades</div></div><div style={{ textAlign: 'center', flex: 1 }}><div className="text-xl font-bold" style={{ color: 'var(--green)' }}>{winRate}%</div><div className="text-xs text-muted">Win Rate</div></div></div><div style={{ padding: '10px', background: 'var(--bg-hover)', borderRadius: '10px' }}><div className="flex-between"><span className="text-xs font-semibold">NQ Bias</span><span className={`tag ${macroBias.bias === 'bullish' ? 'tag-green' : 'tag-red'}`}>{macroBias.bias.toUpperCase()}</span></div></div></div>
            <div className="glass card clickable" onClick={() => setSection('calendar')}><div className="card-header"><span className="card-title"><Icon name="calendar" size="sm" /> Today</span></div>{todayEvents.length === 0 ? <div className="text-sm text-muted text-center" style={{ padding: '20px' }}>No events</div> : todayEvents.slice(0,3).map(ev => <div key={ev.id} className="flex gap-sm items-center mb-sm" style={{ padding: '8px', background: 'var(--bg-hover)', borderRadius: '8px' }}><div className={`cal-event ${eventCategories.find(c => c.id === ev.category)?.color}`} style={{ padding: '4px 8px' }}>{ev.time}</div><div className="font-semibold text-sm">{ev.title}</div></div>)}</div>
          </div>
          {spotifyUser && spotifyPlaying?.playing ? (
            <div className="spotify-bar">
              {spotifyPlaying.track?.image && <img src={spotifyPlaying.track.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px' }} />}
              <div style={{ flex: 1 }}>
                <div className="font-semibold text-sm">{spotifyPlaying.track?.name || 'Unknown'}</div>
                <div className="text-xs text-muted">{spotifyPlaying.track?.artist || 'Unknown'}</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={async () => { await fetch('/api/spotify', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ action: 'previous' }) }); toast('', 'success') }} style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}><Icon name="play" size="sm" /></button>
              <button className="btn btn-primary btn-sm" onClick={async () => { await fetch('/api/spotify', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ action: 'pause' }) }); setSpotifyPlaying(p => p ? {...p, playing: false} : null) }} style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}><Icon name="stop" size="sm" /></button>
              <button className="btn btn-ghost btn-sm" onClick={async () => { await fetch('/api/spotify', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ action: 'next' }) }); toast('', 'success') }} style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}><Icon name="play" size="sm" /></button>
            </div>
          ) : spotifyUser ? (
            <div className="spotify-bar clickable" onClick={async () => { await fetch('/api/spotify', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ action: 'play' }) }); toast(' Playing', 'success') }}>
              <Icon name="spotify" size="lg" />
              <div style={{ flex: 1 }}><div className="font-semibold text-sm">Spotify Connected</div><div className="text-xs text-muted">{spotifyUser.name} * Click to play</div></div>
              <button className="btn btn-primary btn-sm" style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}><Icon name="play" size="sm" /></button>
            </div>
          ) : (
            <div className="spotify-bar clickable" onClick={() => window.location.href = '/api/auth/spotify?action=login'}>
              <Icon name="spotify" size="lg" />
              <div style={{ flex: 1 }}><div className="font-semibold text-sm">Connect Spotify</div><div className="text-xs text-muted">Click to connect</div></div>
              <button className="btn btn-primary btn-sm" style={{ borderRadius: '50%', width: '36px', height: '36px', padding: 0 }}><Icon name="link" size="sm" /></button>
            </div>
          )}
        </div>}

        {section === 'trading' && <div>
          <div className="flex-between mb-md"><div className="tabs">{[
            { id: 'bias', label: 'Bias' },
            { id: 'nq-stats', label: 'NQ Stats' },
            { id: 'journal', label: 'Journal' },
            { id: 'backtest', label: 'Backtest' },
            { id: 'ai-sizing', label: 'Size' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'tricks', label: 'Tricks' }
          ].map(t => <div key={t.id} className={`tab ${tradingTab === t.id ? 'active' : ''}`} onClick={() => setTradingTab(t.id)}>{t.label}</div>)}</div></div>
          
          {tradingTab === 'bias' && <div>
            <div className="grid-2" style={{ gap: '20px' }}>
              {/* LEFT SIDE - Price Action */}
              <div>
                <div className="text-sm font-semibold mb-sm text-muted">PRICE ACTION</div>
                
                {/* Live Market Data from Finnhub */}
                {marketData && (
                  <div className="glass card mb-md glow-box" style={{ background: marketData.change >= 0 ? 'linear-gradient(135deg, rgba(77,170,87,0.15), transparent)' : 'linear-gradient(135deg, rgba(229,57,53,0.15), transparent)' }}>
                    <div className="flex-between mb-sm">
                      <div className="flex items-center gap-sm">
                        <Icon name="trading" size="lg" color={marketData.change >= 0 ? 'var(--green)' : 'var(--red)'} />
                        <div>
                          <div className="text-lg font-bold">QQQ (NQ Proxy)</div>
                          <div className="text-xs text-muted">Live via Finnhub</div>
                        </div>
                      </div>
                      <span className={`tag ${marketData.change >= 0 ? 'tag-green' : 'tag-red'}`}>LIVE</span>
                    </div>
                    <div className="grid-4" style={{ gap: '10px' }}>
                      <div className="text-center">
                        <div style={{ fontSize: '24px', fontWeight: 700 }}>${marketData.price?.toFixed(2)}</div>
                        <div className="text-xs text-muted">Price</div>
                      </div>
                      <div className="text-center">
                        <div style={{ fontSize: '20px', fontWeight: 700, color: marketData.change >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          {marketData.change >= 0 ? '+' : ''}{marketData.change?.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted">Change</div>
                      </div>
                      <div className="text-center">
                        <div style={{ fontSize: '20px', fontWeight: 700, color: marketData.changePercent >= 0 ? 'var(--green)' : 'var(--red)' }}>
                          {marketData.changePercent >= 0 ? '+' : ''}{marketData.changePercent?.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted">%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm">${marketData.low?.toFixed(0)} - ${marketData.high?.toFixed(0)}</div>
                        <div className="text-xs text-muted">Range</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="glass card mb-md" style={{ background: 'linear-gradient(135deg, rgba(77,170,87,0.1), transparent)' }}>
                  <div className="flex-between mb-md">
                    <div className="flex items-center gap-sm"><Icon name="brain" size="lg" color="var(--green)" /><div><div className="text-lg font-semibold">AI Bias Engine</div><div className="text-xs text-muted">NQ Statistical Analysis</div></div></div>
                    <span className="tag tag-green">LIVE</span>
                  </div>
                  <div className="text-center" style={{ padding: '16px' }}>
                    <div className="text-xs text-muted mb-xs">CURRENT BIAS</div>
                    <div style={{ fontSize: '42px', fontWeight: 700, color: macroBias.bias === 'bullish' ? 'var(--green)' : macroBias.bias === 'bearish' ? 'var(--red)' : 'var(--amber)' }}>{macroBias.bias.toUpperCase()}</div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--green)' }}>{macroBias.bullish}% Confidence</div>
                  </div>
                </div>
                
                <div className="glass card mb-md">
                  <div className="text-xs text-muted mb-sm">SESSION STRUCTURE</div>
                  <div className="mb-sm">
                    <div className="flex-between text-xs mb-xs"><span className="text-muted">Asia Range</span><span>21,450 - 21,520</span></div>
                    <div className="progress"><div className="progress-fill" style={{ width: '100%', background: 'var(--purple)' }} /></div>
                  </div>
                  <div className="mb-sm">
                    <div className="flex-between text-xs mb-xs"><span className="text-muted">London Range</span><span>21,380 - 21,580</span></div>
                    <div className="progress"><div className="progress-fill" style={{ width: '100%', background: 'var(--accent)' }} /></div>
                  </div>
                  <div className="mb-sm">
                    <div className="flex-between text-xs mb-xs"><span className="text-muted">NY Current</span><span>21,520 - 21,650</span></div>
                    <div className="progress"><div className="progress-fill" style={{ width: '60%', background: 'var(--green)' }} /></div>
                  </div>
                </div>
                
                <div className="glass card mb-md" style={{ border: sentimentMirror.correlation === 'NEGATIVE' ? '1px solid rgba(224,62,62,0.3)' : sentimentMirror.correlation === 'POSITIVE' ? '1px solid rgba(34,197,94,0.2)' : undefined }}>
                  <div className="flex-between mb-sm">
                    <div className="text-xs text-muted">SENTIMENT MIRROR {healthSource === 'live' && <span style={{ color: 'var(--green)' }}>● LIVE</span>}</div>
                    <button className="btn btn-ghost btn-xs" disabled={sentimentMirror.loading} onClick={() => computeSentimentMirror()} title="Aggiorna Sentiment">↻</button>
                  </div>
                  {sentimentMirror.loading ? (
                    <div className="text-center" style={{ padding: '20px' }}><div className="text-sm text-muted" style={{ animation: 'pulse 1.5s infinite' }}>Analisi sentiment in corso...</div></div>
                  ) : (
                    <>
                      <div className="grid-4 mb-sm">
                        <div className="metric"><div className="metric-value" style={{ color: sentimentMirror.marketSentiment > 60 ? 'var(--green)' : sentimentMirror.marketSentiment > 40 ? 'var(--amber)' : 'var(--red)', fontSize: '20px' }}>{sentimentMirror.marketSentiment || '—'}%</div><div className="metric-label">Sentiment</div></div>
                        <div className="metric"><div className="metric-value" style={{ color: sentimentMirror.vix > 25 ? 'var(--red)' : sentimentMirror.vix > 18 ? 'var(--amber)' : 'var(--green)', fontSize: '20px' }}>{sentimentMirror.vix || '—'}</div><div className="metric-label">VIX</div></div>
                        <div className="metric"><div className="metric-value" style={{ color: sentimentMirror.correlation === 'POSITIVE' ? 'var(--green)' : sentimentMirror.correlation === 'NEGATIVE' ? 'var(--red)' : 'var(--amber)', fontSize: '16px' }}>{sentimentMirror.correlation}</div><div className="metric-label">Align</div></div>
                        <div className="metric"><div className="metric-value" style={{ fontSize: '16px', color: 'var(--accent)' }}>{sentimentMirror.diaryKeywords.length > 0 ? sentimentMirror.diaryKeywords.length : '—'}</div><div className="metric-label">Signals</div></div>
                      </div>
                      {sentimentMirror.diaryKeywords.length > 0 && <div className="flex gap-xs flex-wrap mb-sm">{sentimentMirror.diaryKeywords.map((k, i) => <span key={i} className={`tag ${k.startsWith('✓') ? 'tag-green' : 'tag-amber'}`} style={{ fontSize: '10px' }}>{k}</span>)}</div>}
                      {sentimentMirror.warning && <div className="alert-card mb-sm" style={{ padding: '8px 12px', fontSize: '11px' }}>{sentimentMirror.warning}</div>}
                      <div className="ai-box"><div className="text-xs">{sentimentMirror.prediction || 'In attesa di dati sufficienti...'}</div></div>
                      {sentimentMirror.historicalMatch.length > 0 && <div className="mt-sm">{sentimentMirror.historicalMatch.map((h, i) => <div key={i} className="flex-between text-xs mb-xs" style={{ padding: '6px 8px', background: 'var(--bg-hover)', borderRadius: '6px' }}><span className="text-muted">{h.pattern}</span><span className="font-bold" style={{ color: h.winRate >= 60 ? 'var(--green)' : h.winRate >= 40 ? 'var(--amber)' : 'var(--red)' }}>{h.winRate}% WR ({h.trades}t)</span></div>)}</div>}
                      {sentimentMirror.lastUpdate && <div className="text-xs text-muted mt-xs text-right">Updated {sentimentMirror.lastUpdate.toLocaleTimeString()}</div>}
                    </>
                  )}
                </div>
              </div>
              
              {/* RIGHT SIDE - Macro */}
              <div>
                <div className="text-sm font-semibold mb-sm text-muted">MACRO</div>
                
                <div className="glass card mb-md glow-box">
                  <div className="flex-between mb-sm">
                    <div><div className="text-xs text-muted">NQ BIAS</div><div className="text-2xl font-bold" style={{ color: macroBias.bias === 'bullish' ? 'var(--green)' : 'var(--red)' }}>{macroBias.bias.toUpperCase()}</div></div>
                    <div className="flex gap-md">
                      <div className="text-center"><div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--green)' }}>{macroBias.bullish}%</div><div className="text-xs text-muted">Bull</div></div>
                      <div className="text-center"><div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--red)' }}>{macroBias.bearish}%</div><div className="text-xs text-muted">Bear</div></div>
                      <div className="text-center"><div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--amber)' }}>{macroBias.ranging}%</div><div className="text-xs text-muted">Range</div></div>
                    </div>
                  </div>
                  <div className="ai-box"><div className="text-xs" style={{ whiteSpace: 'pre-wrap' }}>{macroBias.summary}</div></div>
                </div>
                
                <div className="glass card">
                  <div className="flex-between mb-sm">
                    <span className="card-title"><Icon name="calendar" size="sm" /> Economic Calendar</span>
                    <button className="btn btn-ghost btn-xs" onClick={() => { fetch('/api/economic-calendar').then(r => r.json()).then(data => { if (data.events) { setEconomicEvents(data.events); toast('Updated', 'success') } }) }}><Icon name="refresh" size="sm" /></button>
                  </div>
                  <div style={{ maxHeight: '350px', overflow: 'auto' }}>
                    {economicEvents.length === 0 ? (
                      <div className="text-center text-muted" style={{ padding: '30px' }}>No events today</div>
                    ) : economicEvents.map((ev, i) => {
                      const { countdown, isPast, localTimeStr } = getEventCountdown(ev.time)
                      const stars = ev.impact === 'high' ? 3 : ev.impact === 'medium' ? 2 : 1
                      const impactColor = ev.impact === 'high' ? 'var(--red)' : ev.impact === 'medium' ? 'var(--amber)' : 'var(--text-muted)'
                      return (
                        <div key={i} style={{ 
                          padding: '12px', 
                          marginBottom: '8px', 
                          background: ev.impact === 'high' ? 'rgba(224,62,62,0.08)' : 'var(--bg-hover)', 
                          borderRadius: '8px', 
                          borderLeft: `3px solid ${impactColor}`,
                          opacity: isPast ? 0.5 : 1 
                        }}>
                          <div className="flex-between mb-xs">
                            <div className="flex gap-sm items-center">
                              <span style={{ color: impactColor, fontSize: '11px', letterSpacing: '1px' }}>{'★'.repeat(stars)}{'☆'.repeat(3-stars)}</span>
                              <span className="font-semibold text-sm">{ev.name}</span>
                            </div>
                            <span className="text-xs font-semibold" style={{ 
                              color: isPast ? 'var(--text-muted)' : 'var(--green)',
                              background: isPast ? 'transparent' : 'rgba(34,197,94,0.1)',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>{countdown}</span>
                          </div>
                          <div className="flex-between">
                            <span className="text-xs text-muted">{localTimeStr} local / {ev.time} EST</span>
                            {ev.currency && <span className="text-xs" style={{ background: 'var(--bg)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>{ev.currency}</span>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-xs text-muted text-center mt-sm" style={{ padding: '8px', borderTop: '1px solid var(--border)' }}>
                    Times shown in your timezone ({timezone.split('/')[1] || timezone})
                  </div>
                </div>
              </div>
            </div>
          </div>}
          
          {/* === NQ STATS TAB — Based on nqstats.com by @ProbableChris === */}
          {tradingTab === 'nq-stats' && <div>
            <div className="glass card mb-md" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), transparent)' }}>
              <div className="flex items-center gap-sm mb-xs">
                <Icon name="trading" size="lg" color="var(--accent)" />
                <div>
                  <div className="text-lg font-bold">NQ Probability Stats</div>
                  <div className="text-xs text-muted">10-20 Year Statistical Analysis (2004-2025) • Source: nqstats.com by @ProbableChris</div>
                </div>
              </div>
            </div>
            
            {/* Quick Reference - High Probability Edges */}
            <div className="glass card mb-md glow-box">
              <div className="card-title mb-md"><Icon name="target" size="sm" /> High Probability Edges (70%+)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '8px' }}>
                {[
                  { pattern: 'ALN: London Engulfs → NY breaks 1 side', prob: 98 },
                  { pattern: 'IB broken before 4pm', prob: 96 },
                  { pattern: 'ALN: Asia Engulfs → NY breaks London', prob: 95 },
                  { pattern: 'RTH opens outside pRTH → No other break', prob: 83 },
                  { pattern: 'IB broken before noon', prob: 83 },
                  { pattern: 'IB High break → Low won\'t break', prob: 82 },
                  { pattern: 'IB upper close → HIGH breaks', prob: 81 },
                  { pattern: 'ALN: Partial Up → NY breaks London H', prob: 79 },
                  { pattern: '8am BEAR + 9am BULL → Low 9:30-10', prob: 74 },
                  { pattern: 'ALN: Partial Down → NY breaks London L', prob: 73 },
                  { pattern: 'RTH inside pRTH → Breaks 1 side', prob: 73 },
                  { pattern: '9am GREEN → NY session GREEN', prob: 70 },
                ].map((s, i) => (
                  <React.Fragment key={i}>
                    <div className="text-sm" style={{ padding: '8px', background: 'var(--bg-hover)', borderRadius: '6px' }}>{s.pattern}</div>
                    <div className="text-center font-bold" style={{ padding: '8px', background: s.prob >= 90 ? 'rgba(34,197,94,0.2)' : s.prob >= 80 ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.1)', borderRadius: '6px', color: s.prob >= 80 ? 'var(--green)' : 'var(--accent)' }}>{s.prob}%</div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            
            <div className="grid-2" style={{ gap: '16px' }}>
              {/* ALN Sessions */}
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="mapPin" size="sm" /> ALN Sessions (Asia/London/NY)</div>
                <div className="text-xs text-muted mb-md">Sample: 10 years (Aug 2015 - Aug 2025)</div>
                
                <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div className="text-xs font-semibold mb-xs" style={{ color: 'var(--accent)' }}>Session Times (ET)</div>
                  <div className="grid-3 text-xs">
                    <div><strong>Asia:</strong> 8PM-2AM</div>
                    <div><strong>London:</strong> 2AM-8AM</div>
                    <div><strong>NY:</strong> 8AM-4PM</div>
                  </div>
                </div>
                
                <div className="text-sm font-semibold mb-xs">Pattern 1: London Engulfs Asia</div>
                <div className="text-xs text-muted mb-sm">London H > Asia H AND London L &lt; Asia L</div>
                <div className="mb-md">{[
                  { label: 'NY breaks at least ONE side', val: '98%', color: 'var(--green)' },
                  { label: 'NY engulfs (both sides)', val: '43%', color: 'var(--text)' },
                  { label: 'If High first → Low prob', val: '44%', color: 'var(--text)' },
                  { label: 'If Low first → High prob', val: '45%', color: 'var(--text)' },
                ].map((r, i) => <div key={i} className="flex-between text-xs mb-xs" style={{ padding: '6px 10px', background: 'var(--bg)', borderRadius: '4px' }}><span>{r.label}</span><strong style={{ color: r.color }}>{r.val}</strong></div>)}</div>
                
                <div className="text-sm font-semibold mb-xs">Pattern 2: London Partial Up</div>
                <div className="text-xs text-muted mb-sm">London H > Asia H, but L >= Asia L</div>
                <div className="mb-md">{[
                  { label: 'NY breaks London HIGH', val: '79%', color: 'var(--green)' },
                  { label: 'NY breaks London LOW', val: '63%', color: 'var(--text)' },
                  { label: 'NY breaks Asia LOW', val: '51%', color: 'var(--text)' },
                ].map((r, i) => <div key={i} className="flex-between text-xs mb-xs" style={{ padding: '6px 10px', background: 'var(--bg)', borderRadius: '4px' }}><span>{r.label}</span><strong style={{ color: r.color }}>{r.val}</strong></div>)}</div>
                
                <div className="text-sm font-semibold mb-xs">Pattern 3: London Partial Down</div>
                <div className="text-xs text-muted mb-sm">London L &lt; Asia L, but H &lt;= Asia H</div>
                <div>{[
                  { label: 'NY breaks London LOW', val: '73%', color: 'var(--green)' },
                  { label: 'NY breaks London HIGH', val: '66%', color: 'var(--text)' },
                  { label: 'NY breaks Asia HIGH', val: '54%', color: 'var(--text)' },
                ].map((r, i) => <div key={i} className="flex-between text-xs mb-xs" style={{ padding: '6px 10px', background: 'var(--bg)', borderRadius: '4px' }}><span>{r.label}</span><strong style={{ color: r.color }}>{r.val}</strong></div>)}</div>
              </div>
              
              {/* Initial Balance */}
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="clock" size="sm" /> Initial Balance (IB)</div>
                <div className="text-xs text-muted mb-md">IB = 9:30 AM - 10:30 AM ET • Sample: 10 years</div>
                
                <div className="text-sm font-semibold mb-xs">Core Statistics</div>
                <div className="mb-md">{[
                  { label: 'IB broken before 4:00 PM', val: '96%', color: 'var(--green)' },
                  { label: 'IB broken before 12:00 PM', val: '83%', color: 'var(--green)' },
                  { label: 'IB closes UPPER half → HIGH breaks', val: '81%', color: 'var(--green)' },
                  { label: 'IB closes LOWER half → LOW breaks', val: '74%', color: 'var(--green)' },
                ].map((r, i) => <div key={i} className="flex-between text-xs mb-xs" style={{ padding: '6px 10px', background: 'var(--bg)', borderRadius: '4px' }}><span>{r.label}</span><strong style={{ color: r.color }}>{r.val}</strong></div>)}</div>
                
                <div className="text-sm font-semibold mb-xs">Break Type Distribution</div>
                <div className="grid-3 text-center mb-md" style={{ gap: '8px' }}>
                  <div style={{ padding: '12px', background: 'rgba(139,92,246,0.1)', borderRadius: '8px' }}><div className="text-lg font-bold">80%</div><div className="text-xs text-muted">Single Break</div></div>
                  <div style={{ padding: '12px', background: 'rgba(245,158,11,0.1)', borderRadius: '8px' }}><div className="text-lg font-bold">15%</div><div className="text-xs text-muted">Double Break</div></div>
                  <div style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}><div className="text-lg font-bold">5%</div><div className="text-xs text-muted">No Break</div></div>
                </div>
                
                <div className="text-sm font-semibold mb-xs">Conditional Probability</div>
                <div className="ai-box" style={{ padding: '10px' }}>
                  <div className="text-xs"><strong>If HIGH breaks → LOW will NOT break: 82%</strong></div>
                  <div className="text-xs mt-xs"><strong>If LOW breaks → HIGH will NOT break: 82%</strong></div>
                </div>
              </div>
              
              {/* 1H Continuation */}
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="insights" size="sm" /> 1H Continuation</div>
                <div className="text-xs text-muted mb-md">Does hour direction predict session direction?</div>
                
                <div className="text-sm font-semibold mb-xs" style={{ color: 'var(--green)' }}>9am Hour (KEY HOUR) <Icon name="star" size="sm" color="var(--amber)" /></div>
                <div className="mb-md" style={{ padding: '12px', background: 'rgba(34,197,94,0.1)', borderRadius: '8px', border: '1px solid var(--green)' }}>
                  <div className="flex-between text-sm mb-xs"><span>9am GREEN → NY session GREEN</span><strong style={{ color: 'var(--green)' }}>70%</strong></div>
                  <div className="flex-between text-sm"><span>9am RED → NY session RED</span><strong>~65%</strong></div>
                </div>
                
                <div className="text-sm font-semibold mb-xs">6pm Hour (Session Open)</div>
                <div className="mb-md">{[
                  { label: '6pm GREEN → Full session GREEN', val: '59%' },
                  { label: '6pm RED → NY session GREEN (!)', val: '56%', note: 'INVERSE' },
                ].map((r, i) => <div key={i} className="flex-between text-xs mb-xs" style={{ padding: '6px 10px', background: 'var(--bg)', borderRadius: '4px' }}><span>{r.label} {r.note && <span className="tag tag-amber" style={{ fontSize: '9px', marginLeft: '4px' }}>{r.note}</span>}</span><strong>{r.val}</strong></div>)}</div>
                
                <div className="alert-card" style={{ padding: '10px', marginTop: '8px' }}>
                  <div className="text-xs font-semibold"><Icon name="lightbulb" size="sm" /> KEY INSIGHT</div>
                  <div className="text-xs">If 9am candle closes GREEN at 10:00 AM, NY session closes GREEN 70% of the time. This is one of the strongest statistical edges!</div>
                </div>
              </div>
              
              {/* Morning Judas MYTH */}
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="ban" size="sm" /> Morning Judas (MYTH BUSTED!)</div>
                <div className="text-xs text-muted mb-md">The "10am Reversal" is a lie. Data proves CONTINUATION wins.</div>
                
                <div className="text-sm font-semibold mb-xs">9:30 to 9:40 Analysis</div>
                <div className="mb-md">{[
                  { label: '9:40 > 9:30 (UP) → Continuation to 10:00', val: '64%' },
                  { label: '9:40 < 9:30 (DOWN) → Continuation to 10:00', val: '70%' },
                ].map((r, i) => <div key={i} className="flex-between text-xs mb-xs" style={{ padding: '6px 10px', background: 'var(--bg)', borderRadius: '4px' }}><span>{r.label}</span><strong style={{ color: 'var(--green)' }}>{r.val}</strong></div>)}</div>
                
                <div className="text-sm font-semibold mb-xs">10:00 AM "Reversal" Analysis</div>
                <div className="mb-md">{[
                  { label: '10:00 > 9:30 (UP) → Continuation to 12:00', val: '68%' },
                  { label: '10:00 < 9:30 (DOWN) → Continuation to 12:00', val: '59%' },
                ].map((r, i) => <div key={i} className="flex-between text-xs mb-xs" style={{ padding: '6px 10px', background: 'var(--bg)', borderRadius: '4px' }}><span>{r.label}</span><strong style={{ color: 'var(--green)' }}>{r.val}</strong></div>)}</div>
                
                <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px', border: '1px solid var(--red)' }}>
                  <div className="text-sm font-bold mb-xs" style={{ color: 'var(--red)' }}>CONCLUSION</div>
                  <div className="text-xs">Trade WITH the initial move, not against it! The "Morning Judas" and "10am Reversal" are statistically disproven myths.</div>
                </div>
              </div>
              
              {/* Noon Curve */}
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="halfMoon" size="sm" /> Noon Curve</div>
                <div className="text-xs text-muted mb-md">Sample: 20 years (2004-2024) • 8am-4pm ET</div>
                
                <div className="text-sm font-semibold mb-xs">High/Low Distribution</div>
                <div className="grid-2 text-center mb-md" style={{ gap: '8px' }}>
                  <div style={{ padding: '16px', background: 'rgba(34,197,94,0.1)', borderRadius: '8px', border: '1px solid var(--green)' }}>
                    <div className="text-2xl font-bold" style={{ color: 'var(--green)' }}>74.3%</div>
                    <div className="text-xs text-muted">H/L on OPPOSITE sides of noon</div>
                  </div>
                  <div style={{ padding: '16px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                    <div className="text-2xl font-bold">25.7%</div>
                    <div className="text-xs text-muted">H/L on SAME side</div>
                  </div>
                </div>
                
                <div className="text-sm font-semibold mb-xs">Quarterly Breakdown</div>
                <div className="grid-4 text-center text-xs" style={{ gap: '4px' }}>
                  <div style={{ padding: '8px', background: 'var(--bg)', borderRadius: '4px' }}><strong>Q1</strong><br/>8-10am</div>
                  <div style={{ padding: '8px', background: 'var(--bg)', borderRadius: '4px' }}><strong>Q2</strong><br/>10-12pm</div>
                  <div style={{ padding: '8px', background: 'var(--bg)', borderRadius: '4px' }}><strong>Q3</strong><br/>12-2pm</div>
                  <div style={{ padding: '8px', background: 'var(--bg)', borderRadius: '4px' }}><strong>Q4</strong><br/>2-4pm</div>
                </div>
                
                <div className="ai-box mt-md" style={{ padding: '10px' }}>
                  <div className="text-xs"><strong>RULE:</strong> If Q1 sets H/L and Q2 breaks Q1's low → expect NEW PM LOW (66%). Opposite for high breaks (68%).</div>
                </div>
              </div>
              
              {/* RTH Breaks */}
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="trendUp" size="sm" /> RTH Breaks (Prior Day Range)</div>
                <div className="text-xs text-muted mb-md">Sample: 10 years • RTH = 9:30am-4pm ET</div>
                
                <div className="text-sm font-semibold mb-xs">Open OUTSIDE pRTH (Gap)</div>
                <div className="mb-md" style={{ padding: '12px', background: 'rgba(139,92,246,0.1)', borderRadius: '8px' }}>
                  <div className="flex-between text-sm"><span>Will NOT break other side of pRTH</span><strong style={{ color: 'var(--green)' }}>83.29%</strong></div>
                  <div className="text-xs text-muted mt-xs">If gaps above pRTH high, 83% chance won't test pRTH low</div>
                </div>
                
                <div className="text-sm font-semibold mb-xs">Open INSIDE pRTH (Normal)</div>
                <div style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div className="flex-between text-sm"><span>Will break at least ONE side</span><strong style={{ color: 'var(--green)' }}>72.66%</strong></div>
                </div>
                
                <div className="alert-card mt-md" style={{ padding: '10px' }}>
                  <div className="text-xs"><strong>STRATEGY:</strong> On gap days, don't expect gap fill. On normal opens, expect a break of pRTH high or low.</div>
                </div>
              </div>
              
              {/* Hour Stats */}
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="clock" size="sm" /> Hour Stats (Sweep Retrace)</div>
                <div className="text-xs text-muted mb-md">Sample: 10 years (2014-2024)</div>
                
                <div className="text-sm font-semibold mb-xs">Retrace Probability by Segment</div>
                <div className="text-xs text-muted mb-sm">If current hour opens INSIDE prior hour and sweeps H/L...</div>
                <div className="grid-3 text-center mb-md" style={{ gap: '8px' }}>
                  <div style={{ padding: '12px', background: 'rgba(34,197,94,0.15)', borderRadius: '8px', border: '1px solid var(--green)' }}>
                    <div className="text-lg font-bold" style={{ color: 'var(--green)' }}>75%+</div>
                    <div className="text-xs">1st Segment</div>
                    <div className="text-xs text-muted">0-20 min</div>
                  </div>
                  <div style={{ padding: '12px', background: 'rgba(245,158,11,0.1)', borderRadius: '8px' }}>
                    <div className="text-lg font-bold" style={{ color: 'var(--amber)' }}>50-75%</div>
                    <div className="text-xs">2nd Segment</div>
                    <div className="text-xs text-muted">20-40 min</div>
                  </div>
                  <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>
                    <div className="text-lg font-bold" style={{ color: 'var(--red)' }}>&lt;50%</div>
                    <div className="text-xs">3rd Segment</div>
                    <div className="text-xs text-muted">40-60 min</div>
                  </div>
                </div>
                
                <div className="ai-box" style={{ padding: '10px' }}>
                  <div className="text-xs"><strong>KEY:</strong> Earlier sweeps = higher retrace probability. 9am hour is SPECIAL due to 9:30 RTH volatility injection - any H/L set in first 20min likely won't hold.</div>
                </div>
              </div>
              
              {/* Net Change SDEV */}
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="ruler" size="sm" /> Standard Deviation Levels</div>
                <div className="text-xs text-muted mb-md">Sample: 20 years (2004-2024)</div>
                
                <div className="text-sm font-semibold mb-sm">Daily Net Change Distribution</div>
                <div className="mb-md">{[
                  { label: '0.5 SDEV', val: '±0.688%', prob: '~38%' },
                  { label: '1 SDEV', val: '±1.376%', prob: '68.27%', highlight: true },
                  { label: '1.5 SDEV', val: '±2.064%', prob: '~87%' },
                  { label: '2 SDEV', val: '±2.752%', prob: '~95%' },
                ].map((r, i) => <div key={i} className="flex-between text-xs mb-xs" style={{ padding: '8px 10px', background: r.highlight ? 'rgba(139,92,246,0.15)' : 'var(--bg)', borderRadius: '4px', border: r.highlight ? '1px solid var(--accent)' : 'none' }}><span><strong>{r.label}</strong> = {r.val}</span><strong style={{ color: r.highlight ? 'var(--accent)' : 'var(--text)' }}>{r.prob}</strong></div>)}</div>
                
                <div style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div className="text-xs font-semibold mb-xs">Example Calculation</div>
                  <div className="text-xs text-muted">Open at 20,000 → 1 SDEV = 275 pts</div>
                  <div className="text-xs text-muted">Range: 19,725 - 20,275</div>
                  <div className="text-xs mt-xs"><strong>68% of sessions close within 1 SDEV!</strong></div>
                </div>
              </div>
              
              {/* Custom Patterns */}
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="flask" size="sm" /> Custom Patterns</div>
                <div className="text-xs text-muted mb-md">Analysis of NQ hourly data 2023-2026</div>
                
                <div className="text-sm font-semibold mb-xs" style={{ color: 'var(--green)' }}>8am BEAR + 9am BULL <Icon name="star" size="sm" color="var(--amber)" /></div>
                <div className="mb-md" style={{ padding: '12px', background: 'rgba(34,197,94,0.1)', borderRadius: '8px', border: '1px solid var(--green)' }}>
                  <div className="flex-between text-sm"><span>Low forms 9:30-10:00</span><strong style={{ color: 'var(--green)' }}>73.7%</strong></div>
                  <div className="text-xs text-muted mt-xs">When 8am bearish and 9am reverses bullish, session low forms early in RTH</div>
                </div>
                
                <div className="text-sm font-semibold mb-xs">Hour Volatility Rankings</div>
                <div className="text-xs">{[
                  { hour: '8am', range: '70.5 pts', pct: '71.7%', note: 'BEST for momentum' },
                  { hour: '3am', range: '51.9 pts', pct: '55.1%', note: 'London open' },
                  { hour: '4am', range: '49.2 pts', pct: '52.1%', note: '' },
                  { hour: '5-6am', range: '~43 pts', pct: 'LOW', note: 'Dead zone' },
                ].map((h, i) => <div key={i} className="flex-between mb-xs" style={{ padding: '6px 10px', background: 'var(--bg)', borderRadius: '4px' }}><span><strong>{h.hour}</strong> — {h.range}</span><span className="text-muted">{h.note}</span></div>)}</div>
                
                <div className="ai-box mt-md" style={{ padding: '10px' }}>
                  <div className="text-xs"><strong>8am is BEST:</strong> Highest range, highest volatility, 40.3% chance of forming session HIGH.</div>
                </div>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="text-xs text-muted text-center mt-md" style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
              <strong>DISCLAIMER:</strong> These statistics are based on historical data and do not guarantee future results. Always use proper risk management. Data source: nqstats.com by @ProbableChris
            </div>
          </div>}
          
          
          {tradingTab === 'ai-sizing' && <div>
            <div className="glass card mb-md glow-box">
              <div className="flex items-center gap-sm mb-md"><Icon name="brain" size="lg" color="var(--accent)" /><div><div className="text-lg font-bold">AI Dynamic Position Sizing</div><div className="text-xs text-muted">Personalized to YOUR biometric-performance correlations {healthSource === 'live' ? <span style={{ color: 'var(--green)', fontWeight: 600 }}>● Live Oura data</span> : <span style={{ color: 'var(--amber)' }}>◌ Demo mode</span>}</div></div></div>
              <div className="text-center mb-md" style={{ padding: '30px' }}>
                <div className="text-xs text-muted mb-xs">RECOMMENDED SIZE</div>
                <div className="glow-text" style={{ fontSize: '64px', fontWeight: 800, color: dynamicSizing.finalSize > 75 ? 'var(--green)' : dynamicSizing.finalSize > 40 ? 'var(--amber)' : 'var(--red)' }}>{dynamicSizing.finalSize}%</div>
              </div>
              <div className="grid-4 mb-md">{[{ l: 'HRV Factor', v: `${(dynamicSizing.hrvFactor * 100).toFixed(0)}%`, c: dynamicSizing.hrvFactor >= 1 ? 'var(--green)' : 'var(--amber)' }, { l: 'Sleep Factor', v: `${(dynamicSizing.sleepFactor * 100).toFixed(0)}%`, c: dynamicSizing.sleepFactor >= 1 ? 'var(--green)' : 'var(--amber)' }, { l: 'Streak Factor', v: `${(dynamicSizing.streakFactor * 100).toFixed(0)}%`, c: 'var(--green)' }, { l: 'Emotion Factor', v: `${(dynamicSizing.emotionFactor * 100).toFixed(0)}%`, c: dynamicSizing.emotionFactor >= 1 ? 'var(--green)' : 'var(--red)' }].map(f => <div key={f.l} className="metric"><div className="metric-value" style={{ fontSize: '18px', color: f.c }}>{f.v}</div><div className="metric-label">{f.l}</div></div>)}</div>
            </div>
            <div className="glass card"><div className="card-title mb-md"> Your Personal Correlations (AI Learned)</div>{dynamicSizing.personalCorrelations.map((c, i) => <div key={i} className="flex-between mb-sm" style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '10px' }}><div><div className="font-semibold text-sm">{c.condition}</div><div className="text-xs text-muted">Win Rate: {c.winRate}%</div></div><div className="text-right"><div className="font-bold" style={{ color: c.suggestedSize > 50 ? 'var(--green)' : c.suggestedSize > 0 ? 'var(--amber)' : 'var(--red)' }}>{c.suggestedSize}%</div><div className="text-xs text-muted">Suggested</div></div></div>)}</div>
          </div>}

          {tradingTab === 'journal' && (() => {
            // Get unique values for filters
            const allJournalStrategies = [...new Set(trades.map(t => t.strategy).filter(Boolean))]
            const allJournalTags = [...new Set(trades.flatMap(t => t.tags || []))]
            const allJournalSessions = ['Tokyo', 'London', 'NY']
            const allEmotions = ['calm', 'confident', 'anxious', 'frustrated']
            
            // Apply filters
            const filteredTrades = trades.filter(t => {
              if (journalFilter.outcome !== 'all') {
                if (journalFilter.outcome === 'win' && t.pnl <= 0) return false
                if (journalFilter.outcome === 'loss' && t.pnl >= 0) return false
              }
              if (journalFilter.strategy !== 'all' && t.strategy !== journalFilter.strategy) return false
              if (journalFilter.session !== 'all' && t.session !== journalFilter.session) return false
              if (journalFilter.emotion !== 'all' && t.emotion !== journalFilter.emotion) return false
              return true
            })
            
            return <div>
              {/* Filters */}
              <div className="flex gap-sm mb-md items-center" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
                <select className="btn btn-ghost btn-sm" style={{ minWidth: 'auto' }} value={journalFilter.outcome} onChange={e => setJournalFilter(p => ({...p, outcome: e.target.value}))}>
                  <option value="all">All Results</option>
                  <option value="win">Winners</option>
                  <option value="loss">Losers</option>
                </select>
                <select className="btn btn-ghost btn-sm" style={{ minWidth: 'auto' }} value={journalFilter.strategy} onChange={e => setJournalFilter(p => ({...p, strategy: e.target.value}))}>
                  <option value="all">All Strategies</option>
                  {allJournalStrategies.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="btn btn-ghost btn-sm" style={{ minWidth: 'auto' }} value={journalFilter.session} onChange={e => setJournalFilter(p => ({...p, session: e.target.value}))}>
                  <option value="all">All Sessions</option>
                  {allJournalSessions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select className="btn btn-ghost btn-sm" style={{ minWidth: 'auto' }} value={journalFilter.emotion} onChange={e => setJournalFilter(p => ({...p, emotion: e.target.value}))}>
                  <option value="all">All Emotions</option>
                  {allEmotions.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
                </select>
                {(journalFilter.outcome !== 'all' || journalFilter.strategy !== 'all' || journalFilter.session !== 'all' || journalFilter.emotion !== 'all') && (
                  <button className="btn btn-ghost btn-sm" onClick={() => setJournalFilter({ outcome: 'all', strategy: 'all', session: 'all', emotion: 'all' })}><Icon name="close" size="sm" /> Clear</button>
                )}
                <div style={{ flex: 1 }} />
                <button className="btn btn-primary btn-sm" style={{ flexShrink: 0 }} onClick={() => { setEditingTrade(null); setShowTradeModal(true) }}><Icon name="plus" size="sm" /> New Trade</button>
              </div>
              
              {/* Stats */}
              <div className="grid-4 mb-md" style={{ gap: '10px' }}>
                {[
                  { l: 'Total Trades', v: filteredTrades.length },
                  { l: 'Win Rate', v: `${Math.round(filteredTrades.filter(t => t.pnl > 0).length / Math.max(filteredTrades.length, 1) * 100)}%`, c: 'var(--green)' },
                  { l: 'Total P&L', v: `$${filteredTrades.reduce((a, t) => a + t.pnl, 0).toLocaleString()}`, c: filteredTrades.reduce((a, t) => a + t.pnl, 0) >= 0 ? 'var(--green)' : 'var(--red)' },
                  { l: 'Avg P&L', v: `$${Math.round(filteredTrades.reduce((a, t) => a + t.pnl, 0) / Math.max(filteredTrades.length, 1))}` }
                ].map(m => <div key={m.l} style={{ padding: '14px', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border)', textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: 700, color: m.c }}>{m.v}</div><div className="text-xs text-muted">{m.l}</div></div>)}
              </div>
              
              {/* Trade List */}
              {filteredTrades.map(t => (
                <div key={t.id} className="list-item clickable mb-sm" style={{ padding: '14px', background: 'var(--bg-hover)', borderRadius: '10px' }} onClick={() => { setEditingTrade(t); setShowTradeModal(true) }}>
                  <div style={{ width: '60px', height: '45px', borderRadius: '8px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {t.priceActionImage ? <img src={t.priceActionImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} /> : <Icon name="trading" color="var(--text-muted)" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="flex-between mb-xs">
                      <div className="flex items-center gap-sm">
                        <span className="font-bold">{t.strategy || 'No Strategy'}</span>
                        <span className={`tag ${t.outcome === 'TP' ? 'tag-green' : t.outcome === 'BE' ? 'tag-amber' : 'tag-red'}`}>{t.outcome}</span>
                        <span className="tag">{t.session}</span>
                        <span className={`tag ${t.emotion === 'calm' || t.emotion === 'confident' ? 'tag-green' : 'tag-amber'}`}>{t.emotion}</span>
                      </div>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: t.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>{t.pnl >= 0 ? '+' : ''}${t.pnl}</span>
                    </div>
                    <div className="flex-between">
                      <div className="text-xs text-muted">{t.date} {t.time} • {t.dir} • R:R {t.rr}</div>
                      <div className="flex gap-xs">{t.tags?.slice(0, 3).map(tag => <span key={tag} className="tag tag-accent" style={{ fontSize: '10px' }}>{tag}</span>)}</div>
                    </div>
                    {t.notes && <div className="text-xs text-muted mt-xs" style={{ opacity: 0.7 }}>{t.notes.slice(0, 80)}{t.notes.length > 80 ? '...' : ''}</div>}
                  </div>
                </div>
              ))}
              {filteredTrades.length === 0 && <div className="text-center text-muted" style={{ padding: '40px' }}>{trades.length === 0 ? 'Add your first trade to start journaling' : 'No trades match filters'}</div>}
            </div>
          })()}

          {tradingTab === 'analytics' && <div className="grid-4">{[{ l: 'Total P&L', v: `$${totalPnl}`, c: totalPnl >= 0 ? 'var(--green)' : 'var(--red)' }, { l: 'Win Rate', v: `${winRate}%`, c: winRate >= 50 ? 'var(--green)' : 'var(--red)' }, { l: 'Trades', v: trades.length, c: 'var(--text)' }, { l: 'Avg', v: `$${Math.round(totalPnl / Math.max(trades.length, 1))}`, c: 'var(--text)' }].map(s => <div key={s.l} className="glass card text-center"><div className="text-xs text-muted mb-xs">{s.l}</div><div className="text-2xl font-bold font-mono glow-text" style={{ color: s.c as string }}>{s.v}</div></div>)}</div>}

          {tradingTab === 'backtest' && (() => {
            // Get unique values for filters
            const allStrategies = [...new Set(backtestTrades.map(t => t.strategy).filter(Boolean))]
            const allTags = [...new Set(backtestTrades.flatMap(t => t.tags || []))]
            const allSessions = ['Tokyo', 'London', 'NY']
            
            // Apply filters
            const filteredBacktestTrades = backtestTrades.filter(t => {
              if (backtestFilter.outcome !== 'all') {
                if (backtestFilter.outcome === 'win' && t.pnl <= 0) return false
                if (backtestFilter.outcome === 'loss' && t.pnl >= 0) return false
              }
              if (backtestFilter.strategy !== 'all' && t.strategy !== backtestFilter.strategy) return false
              if (backtestFilter.session !== 'all' && t.session !== backtestFilter.session) return false
              if (backtestFilter.tag !== 'all' && !t.tags?.includes(backtestFilter.tag)) return false
              return true
            })
            
            return <div>
            {/* Filters */}
            <div className="flex gap-sm mb-md items-center" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
              <select className="btn btn-ghost btn-sm" style={{ minWidth: 'auto' }} value={backtestFilter.outcome} onChange={e => setBacktestFilter(p => ({...p, outcome: e.target.value}))}>
                <option value="all">All Results</option>
                <option value="win">Winners</option>
                <option value="loss">Losers</option>
              </select>
              <select className="btn btn-ghost btn-sm" style={{ minWidth: 'auto' }} value={backtestFilter.strategy} onChange={e => setBacktestFilter(p => ({...p, strategy: e.target.value}))}>
                <option value="all">All Strategies</option>
                {allStrategies.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="btn btn-ghost btn-sm" style={{ minWidth: 'auto' }} value={backtestFilter.session} onChange={e => setBacktestFilter(p => ({...p, session: e.target.value}))}>
                <option value="all">All Sessions</option>
                {allSessions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select className="btn btn-ghost btn-sm" style={{ minWidth: 'auto' }} value={backtestFilter.tag} onChange={e => setBacktestFilter(p => ({...p, tag: e.target.value}))}>
                <option value="all">All Tags</option>
                {allTags.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {(backtestFilter.outcome !== 'all' || backtestFilter.strategy !== 'all' || backtestFilter.session !== 'all' || backtestFilter.tag !== 'all') && (
                <button className="btn btn-ghost btn-sm" onClick={() => setBacktestFilter({ outcome: 'all', strategy: 'all', session: 'all', tag: 'all' })}><Icon name="close" size="sm" /> Clear</button>
              )}
            </div>
            
            <div className="grid-2 mb-md">
              {/* AI Scanner */}
              <div className="glass card glow-box" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), transparent)' }}>
                <div className="flex-between mb-sm">
                  <div className="flex items-center gap-sm"><div className="icon-box"><Icon name="scan" /></div><div><div className="font-bold">AI Trade Scanner</div><div className="text-xs text-muted">Upload Motivewave screenshot</div></div></div>
                </div>
                <div className="text-center" style={{ padding: '20px', border: '2px dashed var(--border)', borderRadius: '8px', cursor: 'pointer' }} onClick={() => backtestImageRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onDragLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)' }}
                  onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--border)'; const f = e.dataTransfer.files?.[0]; if (f) analyzeBacktestImage(f) }}>
                  {backtestImage ? <img src={backtestImage} alt="" style={{ maxWidth: '100%', maxHeight: '140px', borderRadius: '6px' }} /> : <><Icon name="upload" size="lg" /><div className="text-sm text-muted mt-sm">Click or drag screenshot</div></>}
                </div>
                <input ref={backtestImageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) analyzeBacktestImage(f) }} />
                {backtestAnalyzing && <div className="mt-md text-center"><div className="flex items-center justify-center gap-sm"><Icon name="brain" size="sm" color="var(--accent)" /><span className="text-sm" style={{ color: 'var(--accent)' }}>Analyzing...</span></div><div className="progress mt-sm"><div className="progress-fill" style={{ width: '70%', animation: 'pulse 1s infinite' }} /></div></div>}
                
                {/* Analyzed Trade Form - All fields editable */}
                {analyzedTrade && !backtestAnalyzing && <div className="mt-md">
                  <div className="grid-3 mb-sm" style={{ gap: '8px' }}>
                    <div><label className="text-xs text-muted">P&L ($)</label><input type="number" value={analyzedTrade.pnl || 0} onChange={e => setAnalyzedTrade(prev => prev ? {...prev, pnl: parseFloat(e.target.value) || 0} : null)} style={{ color: (analyzedTrade.pnl || 0) >= 0 ? 'var(--green)' : 'var(--red)' }} /></div>
                    <div><label className="text-xs text-muted">R:R</label><input value={analyzedTrade.rr || ''} onChange={e => setAnalyzedTrade(prev => prev ? {...prev, rr: e.target.value} : null)} placeholder="1.5:1" /></div>
                    <div><label className="text-xs text-muted">Outcome</label><select value={analyzedTrade.outcome} onChange={e => setAnalyzedTrade(prev => prev ? {...prev, outcome: e.target.value} : null)}><option>TP</option><option>SL</option><option>BE</option></select></div>
                  </div>
                  <div className="grid-4 mb-sm" style={{ gap: '8px' }}>
                    <div><label className="text-xs text-muted">Date</label><input type="date" value={analyzedTrade.date || todayStr} onChange={e => setAnalyzedTrade(prev => prev ? {...prev, date: e.target.value} : null)} /></div>
                    <div><label className="text-xs text-muted">Time</label><input type="time" value={analyzedTrade.time || ''} onChange={e => setAnalyzedTrade(prev => prev ? {...prev, time: e.target.value} : null)} /></div>
                    <div><label className="text-xs text-muted">Session</label><select value={analyzedTrade.session} onChange={e => setAnalyzedTrade(prev => prev ? {...prev, session: e.target.value} : null)}><option>Tokyo</option><option>London</option><option>NY</option></select></div>
                    <div><label className="text-xs text-muted">Direction</label><select value={analyzedTrade.dir} onChange={e => setAnalyzedTrade(prev => prev ? {...prev, dir: e.target.value} : null)}><option>LONG</option><option>SHORT</option></select></div>
                  </div>
                  <div className="grid-2 mb-sm" style={{ gap: '8px' }}>
                    <div><label className="text-xs text-muted">Symbol</label><input value={analyzedTrade.symbol || 'NQ'} onChange={e => setAnalyzedTrade(prev => prev ? {...prev, symbol: e.target.value} : null)} /></div>
                    <div><label className="text-xs text-muted">Strategy</label><input value={analyzedTrade.strategy || ''} onChange={e => setAnalyzedTrade(prev => prev ? {...prev, strategy: e.target.value} : null)} placeholder="ORB, FVG, ICT..." /></div>
                  </div>
                  <div className="mb-sm"><label className="text-xs text-muted">Notes & Tags</label><textarea value={analyzedTrade.notes || ''} onChange={e => setAnalyzedTrade(prev => prev ? {...prev, notes: e.target.value} : null)} placeholder="#breakout #fvg Good setup, clean entry..." style={{ minHeight: '60px' }} /></div>
                  <div className="flex gap-sm">
                    <button className="btn btn-ghost btn-sm" onClick={() => { setAnalyzedTrade(null); setBacktestImage('') }}><Icon name="close" size="sm" /></button>
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => { 
                      // Extract tags from notes
                      const tagMatches = (analyzedTrade.notes || '').match(/#\w+/g) || []
                      const tags = tagMatches.map(t => t.slice(1))
                      const newTrade: BacktestTrade = { 
                        id: Date.now(), 
                        date: analyzedTrade.date || todayStr,
                        time: analyzedTrade.time || '09:30',
                        session: analyzedTrade.session || 'NY',
                        strategy: analyzedTrade.strategy || '',
                        symbol: analyzedTrade.symbol || 'NQ',
                        dir: analyzedTrade.dir || 'LONG',
                        entry: 0, exit: 0, sl: 0, tp: 0,
                        rr: analyzedTrade.rr || '1:1',
                        pnl: analyzedTrade.pnl || 0,
                        outcome: analyzedTrade.outcome || 'SL',
                        image: backtestImage, 
                        aiAnalyzed: true,
                        tags: tags,
                        notes: analyzedTrade.notes || ''
                      }
                      saveBacktestTrade(newTrade)
                      setAnalyzedTrade(null)
                      setBacktestImage('')
                    }}><Icon name="check" size="sm" /> Add Trade</button>
                  </div>
                </div>}
              </div>
              
              {/* Stats */}
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="trading" size="sm" /> Statistics</div>
                <div className="grid-2 mb-md" style={{ gap: '10px' }}>
                  {[
                    { l: 'Total Trades', v: filteredBacktestTrades.length },
                    { l: 'Win Rate', v: `${Math.round(filteredBacktestTrades.filter(t => t.pnl > 0).length / Math.max(filteredBacktestTrades.length, 1) * 100)}%`, c: 'var(--green)' },
                    { l: 'Total P&L', v: `$${filteredBacktestTrades.reduce((a, t) => a + t.pnl, 0).toLocaleString()}`, c: filteredBacktestTrades.reduce((a, t) => a + t.pnl, 0) >= 0 ? 'var(--green)' : 'var(--red)' },
                    { l: 'Avg P&L', v: `$${Math.round(filteredBacktestTrades.reduce((a, t) => a + t.pnl, 0) / Math.max(filteredBacktestTrades.length, 1))}` }
                  ].map(m => <div key={m.l} style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px', textAlign: 'center' }}><div style={{ fontSize: '20px', fontWeight: 700, color: m.c }}>{m.v}</div><div className="text-xs text-muted">{m.l}</div></div>)}
                </div>
                <div className="text-xs text-muted mb-xs">By Session</div>
                {allSessions.map(s => {
                  const sessionTrades = filteredBacktestTrades.filter(t => t.session === s)
                  const sessionPnl = sessionTrades.reduce((a, t) => a + t.pnl, 0)
                  return <div key={s} className="flex-between text-sm mb-xs"><span>{s}</span><span style={{ fontWeight: 600, color: sessionPnl >= 0 ? 'var(--green)' : 'var(--red)' }}>{sessionTrades.length} trades / ${sessionPnl}</span></div>
                })}
              </div>
            </div>
            
            {/* Trade List */}
            <div className="glass card">
              <div className="flex-between mb-md"><span className="card-title"><Icon name="journal" size="sm" /> Backtest History</span><span className="text-sm text-muted">{filteredBacktestTrades.length} trades</span></div>
              {filteredBacktestTrades.map(t => (
                <div key={t.id} className="list-item clickable mb-sm" style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }} onClick={() => setEditingBacktestTrade(t)}>
                  {t.image && <img src={t.image} alt="" style={{ width: '70px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />}
                  <div style={{ flex: 1 }}>
                    <div className="flex-between mb-xs">
                      <div className="flex items-center gap-sm">
                        <span className="font-bold">{t.strategy || 'No Strategy'}</span>
                        <span className={`tag ${t.outcome === 'TP' ? 'tag-green' : t.outcome === 'BE' ? 'tag-amber' : 'tag-red'}`}>{t.outcome}</span>
                        <span className="tag">{t.session}</span>
                      </div>
                      <span style={{ fontSize: '18px', fontWeight: 700, color: t.pnl >= 0 ? 'var(--green)' : 'var(--red)' }}>{t.pnl >= 0 ? '+' : ''}${t.pnl}</span>
                    </div>
                    <div className="flex-between">
                      <div className="text-xs text-muted">{t.date} {t.time} • {t.dir} • R:R {t.rr}</div>
                      <div className="flex gap-xs">{t.tags?.slice(0, 3).map(tag => <span key={tag} className="tag tag-accent" style={{ fontSize: '10px' }}>{tag}</span>)}</div>
                    </div>
                    {t.notes && <div className="text-xs text-muted mt-xs" style={{ opacity: 0.7 }}>{t.notes.slice(0, 80)}{t.notes.length > 80 ? '...' : ''}</div>}
                  </div>
                </div>
              ))}
              {filteredBacktestTrades.length === 0 && <div className="text-center text-muted" style={{ padding: '40px' }}>{backtestTrades.length === 0 ? 'Upload a Motivewave screenshot to start' : 'No trades match filters'}</div>}
            </div>
          </div>})()}

          {tradingTab === 'tricks' && <div>
            {/* Header */}
            <div className="flex-between mb-md">
              <div>
                <div className="text-lg font-bold">Trading Tricks</div>
                <div className="text-xs text-muted">Pattern, setup e appunti per migliorare il trading</div>
              </div>
              <button className="btn btn-primary" onClick={() => { setEditingTrick(null); setShowTrickModal(true) }}><Icon name="plus" size="sm" /> New Trick</button>
            </div>
            
            {/* Tricks Grid */}
            {tricks.length === 0 ? (
              <div className="glass card text-center" style={{ padding: '60px' }}>
                <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.3 }}><Icon name="insights" /></div>
                <div className="text-lg font-bold mb-sm">Nessun trick salvato</div>
                <div className="text-sm text-muted mb-md">Aggiungi pattern, setup o osservazioni che ti aiutano nel trading.</div>
                <button className="btn btn-primary" onClick={() => { setEditingTrick(null); setShowTrickModal(true) }}><Icon name="plus" size="sm" /> Aggiungi Trick</button>
              </div>
            ) : (
              <div className="grid-3 mb-md" style={{ gap: '12px' }}>
                {tricks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(trick => (
                  <div key={trick.id} className="glass card clickable glow-box" style={{ padding: '0', overflow: 'hidden' }} onClick={() => { setEditingTrick(trick); setShowTrickModal(true) }}>
                    {trick.image && <div style={{ height: '120px', background: `url(${trick.image}) center/cover`, borderBottom: '1px solid var(--border)' }} />}
                    <div style={{ padding: '14px' }}>
                      <div className="font-semibold mb-xs">{trick.name || 'Untitled'}</div>
                      {trick.description && <div className="text-sm text-muted mb-sm" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{trick.description}</div>}
                      {trick.tags && trick.tags.length > 0 && (
                        <div className="flex gap-xs flex-wrap">
                          {trick.tags.slice(0, 4).map(tag => <span key={tag} className="tag tag-accent" style={{ fontSize: '9px', padding: '2px 6px' }}>{tag}</span>)}
                          {trick.tags.length > 4 && <span className="text-xs text-muted">+{trick.tags.length - 4}</span>}
                        </div>
                      )}
                      <div className="text-xs text-muted mt-sm">{new Date(trick.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* AI Analysis Section */}
            {tricks.length > 0 && (
              <div className="glass card glow-box" style={{ background: 'linear-gradient(145deg, rgba(139,92,246,0.1), transparent)' }}>
                <div className="flex-between mb-md">
                  <div className="flex items-center gap-sm">
                    <div className="icon-box"><Icon name="brain" /></div>
                    <div>
                      <div className="font-bold">AI Pattern Analyzer</div>
                      <div className="text-xs text-muted">Confronta tricks con Journal e Backtest</div>
                    </div>
                  </div>
                  <button 
                    className={`btn ${tricksAiLoading ? 'btn-ghost' : 'btn-primary'} btn-sm`}
                    disabled={tricksAiLoading}
                    onClick={async () => {
                      setTricksAiLoading(true)
                      setTricksAiAnalysis('')
                      
                      // Prepare data for AI
                      const tricksData = tricks.map(t => ({
                        name: t.name,
                        description: t.description,
                        tags: t.tags
                      }))
                      
                      const journalData = trades.slice(0, 50).map(t => ({
                        date: t.date,
                        strategy: t.strategy,
                        outcome: t.outcome,
                        pnl: t.pnl,
                        emotion: t.emotion,
                        tags: t.tags,
                        notes: t.notes?.slice(0, 100)
                      }))
                      
                      const backtestData = backtestTrades.slice(0, 50).map(t => ({
                        strategy: t.strategy,
                        outcome: t.outcome,
                        pnl: t.pnl,
                        rr: t.rr,
                        session: t.session,
                        tags: t.tags
                      }))
                      
                      try {
                        const res = await fetch('/api/claude', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            message: `Sei un trading coach esperto. Analizza questi dati e trova pattern utili.

**TRICKS SALVATI:**
${JSON.stringify(tricksData, null, 2)}

**JOURNAL (ultimi 50 trade):**
${JSON.stringify(journalData, null, 2)}

**BACKTEST (ultimi 50 trade):**
${JSON.stringify(backtestData, null, 2)}

OBIETTIVI:
1. Confronta i tricks con i risultati reali del Journal e Backtest
2. Identifica quali tricks hanno correlazione con trade vincenti
3. Trova pattern ricorrenti che il trader potrebbe non aver notato
4. Suggerisci variabili oggettive da tracciare (es: ora del giorno, sessione, setup specifici)
5. Dai suggerimenti concreti per migliorare

Rispondi in italiano, in modo conciso e pratico. Usa bullet points. Max 400 parole.`,
                            context: { type: 'tricks_analysis' }
                          })
                        })
                        const data = await res.json()
                        setTricksAiAnalysis(data.response || 'Analisi non disponibile')
                      } catch (e) {
                        setTricksAiAnalysis('Errore durante l\'analisi. Riprova.')
                      }
                      setTricksAiLoading(false)
                    }}
                  >
                    {tricksAiLoading ? <><Icon name="brain" size="sm" /> Analizzando...</> : <><Icon name="zap" size="sm" /> Analizza Pattern</>}
                  </button>
                </div>
                
                {tricksAiLoading && (
                  <div className="ai-box" style={{ padding: '20px' }}>
                    <div className="flex items-center gap-sm">
                      <Icon name="brain" size="sm" color="var(--accent)" />
                      <span className="text-sm" style={{ animation: 'pulse 1.5s infinite' }}>Sto analizzando {tricks.length} tricks, {trades.length} trade e {backtestTrades.length} backtest...</span>
                    </div>
                  </div>
                )}
                
                {tricksAiAnalysis && !tricksAiLoading && (
                  <div className="ai-box" style={{ padding: '16px' }}>
                    <div className="text-sm" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{tricksAiAnalysis}</div>
                  </div>
                )}
                
                {!tricksAiAnalysis && !tricksAiLoading && (
                  <div className="text-sm text-muted text-center" style={{ padding: '20px' }}>
                    Clicca "Analizza Pattern" per confrontare i tuoi tricks con i dati di Journal e Backtest
                  </div>
                )}
              </div>
            )}
          </div>}
        </div>}

        {/* FINANCE */}
        {section === 'finance' && (() => {
          // Calcoli Finance
          const now = new Date()
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
          
          const filteredTx = transactions.filter(tx => {
            if (financeFilter.type !== 'all' && tx.type !== financeFilter.type) return false
            if (financeFilter.category !== 'all' && tx.category !== financeFilter.category) return false
            if (financeFilter.period === 'week' && new Date(tx.date) < weekAgo) return false
            if (financeFilter.period === 'month' && new Date(tx.date) < monthStart) return false
            return true
          })
          
          const weeklyIncome = transactions.filter(t => t.type === 'income' && new Date(t.date) >= weekAgo).reduce((a, t) => a + t.amount, 0)
          const weeklyExpense = transactions.filter(t => t.type === 'expense' && new Date(t.date) >= weekAgo).reduce((a, t) => a + t.amount, 0)
          const monthlyIncome = transactions.filter(t => t.type === 'income' && new Date(t.date) >= monthStart).reduce((a, t) => a + t.amount, 0)
          const monthlyExpense = transactions.filter(t => t.type === 'expense' && new Date(t.date) >= monthStart).reduce((a, t) => a + t.amount, 0)
          
          // Category breakdown
          const expenseByCategory: Record<string, number> = {}
          const incomeByCategory: Record<string, number> = {}
          transactions.forEach(tx => {
            if (tx.type === 'expense') expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount
            else incomeByCategory[tx.category] = (incomeByCategory[tx.category] || 0) + tx.amount
          })
          
          const allCategories = [...new Set([...financeCategories.income, ...financeCategories.expense])]
          
          return <div>
            {/* Filters */}
            <div className="flex-between mb-md items-center" style={{ overflowX: 'auto', paddingBottom: '4px' }}>
              <div className="flex gap-sm items-center" style={{ flexShrink: 0 }}>
                <select className="btn btn-ghost btn-sm" style={{ minWidth: 'auto' }} value={financeFilter.type} onChange={e => setFinanceFilter(p => ({...p, type: e.target.value}))}>
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select className="btn btn-ghost btn-sm" style={{ minWidth: 'auto' }} value={financeFilter.category} onChange={e => setFinanceFilter(p => ({...p, category: e.target.value}))}>
                  <option value="all">All Categories</option>
                  {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="btn btn-ghost btn-sm" style={{ minWidth: 'auto' }} value={financeFilter.period} onChange={e => setFinanceFilter(p => ({...p, period: e.target.value}))}>
                  <option value="all">All Time</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <button className="btn btn-primary btn-sm" style={{ flexShrink: 0 }} onClick={() => { setSelectedTransaction(null); setShowTransactionModal(true) }}><Icon name="plus" size="sm" /> Add</button>
            </div>
            
            {/* Summary Cards */}
            <div className="grid-4 mb-md" style={{ gap: '12px' }}>
              <div className="glass card" style={{ borderLeft: '4px solid var(--green)' }}>
                <div className="text-xs text-muted mb-xs">Total Income</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--green)' }}>€{transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0).toLocaleString()}</div>
              </div>
              <div className="glass card" style={{ borderLeft: '4px solid var(--red)' }}>
                <div className="text-xs text-muted mb-xs">Total Expenses</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--red)' }}>€{transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0).toLocaleString()}</div>
              </div>
              <div className="glass card" style={{ borderLeft: '4px solid var(--accent)' }}>
                <div className="text-xs text-muted mb-xs">Balance</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent)' }}>€{(transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0) - transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)).toLocaleString()}</div>
              </div>
              <div className="glass card" style={{ borderLeft: '4px solid var(--amber)' }}>
                <div className="text-xs text-muted mb-xs">Transactions</div>
                <div style={{ fontSize: '22px', fontWeight: 700 }}>{filteredTx.length}</div>
              </div>
            </div>
            
            {/* Weekly & Monthly Report */}
            <div className="grid-2 mb-md" style={{ gap: '12px' }}>
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="calendar" size="sm" /> This Week</div>
                <div className="flex-between mb-xs"><span className="text-sm">Income</span><span className="font-bold" style={{ color: 'var(--green)' }}>+€{weeklyIncome.toFixed(2)}</span></div>
                <div className="flex-between mb-xs"><span className="text-sm">Expenses</span><span className="font-bold" style={{ color: 'var(--red)' }}>-€{weeklyExpense.toFixed(2)}</span></div>
                <div className="flex-between" style={{ paddingTop: '8px', borderTop: '1px solid var(--border)' }}><span className="font-semibold">Net</span><span className="font-bold" style={{ color: weeklyIncome - weeklyExpense >= 0 ? 'var(--green)' : 'var(--red)' }}>€{(weeklyIncome - weeklyExpense).toFixed(2)}</span></div>
              </div>
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="calendar" size="sm" /> This Month</div>
                <div className="flex-between mb-xs"><span className="text-sm">Income</span><span className="font-bold" style={{ color: 'var(--green)' }}>+€{monthlyIncome.toFixed(2)}</span></div>
                <div className="flex-between mb-xs"><span className="text-sm">Expenses</span><span className="font-bold" style={{ color: 'var(--red)' }}>-€{monthlyExpense.toFixed(2)}</span></div>
                <div className="flex-between" style={{ paddingTop: '8px', borderTop: '1px solid var(--border)' }}><span className="font-semibold">Net</span><span className="font-bold" style={{ color: monthlyIncome - monthlyExpense >= 0 ? 'var(--green)' : 'var(--red)' }}>€{(monthlyIncome - monthlyExpense).toFixed(2)}</span></div>
              </div>
            </div>
            
            {/* Category Breakdown */}
            <div className="grid-2 mb-md" style={{ gap: '12px' }}>
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="zap" size="sm" /> Income by Category</div>
                {Object.entries(incomeByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => {
                  const pct = Math.round(amount / Math.max(monthlyIncome, 1) * 100)
                  return <div key={cat} className="mb-sm"><div className="flex-between text-sm mb-xs"><span>{cat}</span><span className="font-bold">€{amount.toFixed(0)} ({pct}%)</span></div><div className="progress"><div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--green)' }} /></div></div>
                })}
                {Object.keys(incomeByCategory).length === 0 && <div className="text-sm text-muted">No income yet</div>}
              </div>
              <div className="glass card">
                <div className="card-title mb-sm"><Icon name="wallet" size="sm" /> Expenses by Category</div>
                {Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => {
                  const pct = Math.round(amount / Math.max(monthlyExpense, 1) * 100)
                  return <div key={cat} className="mb-sm"><div className="flex-between text-sm mb-xs"><span>{cat}</span><span className="font-bold">€{amount.toFixed(0)} ({pct}%)</span></div><div className="progress"><div className="progress-fill" style={{ width: `${pct}%`, background: 'var(--red)' }} /></div></div>
                })}
                {Object.keys(expenseByCategory).length === 0 && <div className="text-sm text-muted">No expenses yet</div>}
              </div>
            </div>
            
            {/* Transactions List */}
            <div className="glass card">
              <div className="card-header mb-sm"><span className="card-title">Transactions ({filteredTx.length})</span></div>
              {filteredTx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(tx => (
                <div key={tx.id} className="list-item clickable" style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }} onClick={() => setSelectedTransaction(tx)}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: tx.type === 'income' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={tx.type === 'income' ? 'zap' : 'wallet'} size="sm" color={tx.type === 'income' ? 'var(--green)' : 'var(--red)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="font-semibold">{tx.description}</div>
                    <div className="text-xs text-muted">{tx.category} • {tx.date} • {tx.account}</div>
                  </div>
                  {tx.image && <Icon name="image" size="sm" color="var(--text-muted)" />}
                  <div style={{ fontSize: '16px', fontWeight: 700, color: tx.type === 'income' ? 'var(--green)' : 'var(--red)' }}>
                    {tx.type === 'income' ? '+' : '-'}€{tx.amount.toFixed(2)}
                  </div>
                </div>
              ))}
              {filteredTx.length === 0 && <div className="text-center text-muted" style={{ padding: '40px' }}>No transactions found</div>}
            </div>
          </div>
        })()}

        {section === 'tasks' && <div>
          <div className="flex-between mb-md"><div className="flex gap-sm items-center"><span className="text-sm text-muted">Filter:</span><select className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }} value={selectedProject?.id || ''} onChange={(e) => setSelectedProject(e.target.value ? projects.find(p => p.id === Number(e.target.value)) || null : null)}><option value="">All Projects</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div><div className="flex gap-sm"><button className="btn btn-ghost btn-sm" onClick={() => { setEditingProject(null); setNewProjectTasks(['']); setShowProjectModal(true) }}><Icon name="folder" size="sm" /> Project</button><button className="btn btn-primary btn-sm" onClick={() => { setEditingTask(null); setShowTaskModal(true) }}><Icon name="plus" size="sm" /> Task</button></div></div>
          <div className="split-view">
            <div className="split-left">
              <div className="text-sm font-semibold text-muted mb-sm">PROJECTS</div>
              {projects.map(p => {
                const projectTasks = tasks.filter(t => t.projectId === p.id && !t.completed)
                const isSelected = selectedProject?.id === p.id
                return (
                  <div key={p.id} className="glass card mb-sm" style={{ padding: '12px', borderColor: isSelected ? p.color : undefined, background: isSelected ? 'var(--bg-hover)' : undefined }}>
                    <div className="flex gap-sm items-center clickable" style={{ marginBottom: isSelected && projectTasks.length > 0 ? '10px' : 0 }} onClick={() => setSelectedProject(isSelected ? null : p)} onContextMenu={(e) => handleContextMenu(e, 'project', p)}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: p.color }} />
                      <span className="font-semibold" style={{ flex: 1 }}>{p.name}</span>
                      <span className="text-xs text-muted">{projectTasks.length}</span>
                      <Icon name={isSelected ? 'chevronDown' : 'chevronRight'} size="sm" />
                    </div>
                    {isSelected && projectTasks.length > 0 && (
                      <div style={{ marginTop: '8px', paddingLeft: '18px', borderLeft: `2px solid ${p.color}` }}>
                        {projectTasks.slice(0, 5).map(t => (
                          <div key={t.id} className="flex items-center gap-sm text-sm" style={{ padding: '4px 0' }}>
                            <input type="checkbox" checked={t.completed} onChange={() => completeTask(t.id)} style={{ transform: 'scale(0.8)' }} />
                            <span style={{ flex: 1, opacity: t.completed ? 0.5 : 1 }}>{t.title}</span>
                            {t.deadline && <span className="text-xs text-muted">{t.deadline.slice(5)}</span>}
                          </div>
                        ))}
                        {projectTasks.length > 5 && <div className="text-xs text-muted">+{projectTasks.length - 5} more</div>}
                      </div>
                    )}
                    <div className="progress mt-sm"><div className="progress-fill" style={{ width: `${getProjectProgress(p)}%`, background: p.color }} /></div>
                  </div>
                )
              })}
            </div>
            <div className="split-right">
              <div className="grid-2" style={{ gap: '12px' }}>
                {[
                  { q: 'q1', title: 'Urgent+Important', color: 'var(--red)', filter: (t: Task) => t.urgent && t.important },
                  { q: 'q2', title: 'Important', color: 'var(--amber)', filter: (t: Task) => !t.urgent && t.important },
                  { q: 'q3', title: 'Urgent', color: 'var(--accent)', filter: (t: Task) => t.urgent && !t.important },
                  { q: 'q4', title: 'Neither', color: 'var(--text-muted)', filter: (t: Task) => !t.urgent && !t.important }
                ].map(({ q, title, color, filter }) => {
                  const ft = sortedTasks.filter(t => filter(t) && !t.completed && (selectedProject ? t.projectId === selectedProject.id : true))
                  return (
                    <div key={q} className={`matrix-quadrant matrix-${q}`}>
                      <div className="matrix-title" style={{ color }}>{title}</div>
                      {ft.map(t => (
                        <div key={t.id} className="flex items-center gap-sm" style={{ padding: '8px 12px', background: 'var(--bg-hover)', borderRadius: '6px', marginBottom: '6px', cursor: 'pointer' }} onClick={() => { setEditingTask(t); setShowTaskModal(true) }} onContextMenu={(e) => handleContextMenu(e, 'task', t)}>
                          <input type="checkbox" checked={t.completed} onChange={() => completeTask(t.id)} onClick={e => e.stopPropagation()} />
                          <div style={{ flex: 1 }}>
                            <span className="text-sm">{t.title}</span>
                            {t.deadline && <div className="text-xs text-muted">{t.deadline}</div>}
                          </div>
                          {t.projectId && <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: projects.find(p => p.id === t.projectId)?.color || 'var(--accent)' }} />}
                        </div>
                      ))}
                      {ft.length === 0 && <div className="text-sm text-muted" style={{ padding: '8px' }}>No tasks</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>}

        {section === 'calendar' && <div className="flex gap-md">
          {/* Calendar Sidebar */}
          <div style={{ width: '220px', flexShrink: 0 }}>
            <button className="btn btn-primary w-full mb-md" onClick={() => { setEditingEvent(null); setShowEventModal(true) }}><Icon name="plus" size="sm" /> New Event</button>
            
            {/* Accounts & Calendars */}
            <div className="glass card mb-md" style={{ padding: '12px' }}>
              <div className="text-xs text-muted mb-sm">CALENDARS</div>
              {googleAccounts.length > 0 ? googleAccounts.map(acc => (
                <div key={acc.email} className="mb-sm">
                  <div className="flex items-center gap-sm mb-xs">
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: acc.email.includes('famiglia') || acc.email.includes('family') ? 'var(--green)' : 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700, color: 'white' }}>{acc.email[0].toUpperCase()}</div>
                    <span className="text-sm font-semibold">{acc.email.includes('famiglia') || acc.email.includes('family') ? 'Family' : 'Personal'}</span>
                  </div>
                  <div className="flex items-center gap-xs clickable" style={{ padding: '6px 8px', marginLeft: '20px', borderRadius: '6px', background: selectedCalendars.includes(acc.email) ? 'var(--bg-hover)' : 'transparent' }}>
                    <input type="checkbox" checked={selectedCalendars.includes(acc.email)} onChange={(e) => { e.stopPropagation(); setSelectedCalendars(p => p.includes(acc.email) ? p.filter(c => c !== acc.email) : [...p, acc.email]) }} style={{ accentColor: acc.email.includes('famiglia') || acc.email.includes('family') ? 'var(--green)' : 'var(--accent)' }} />
                    <span className="text-xs" onClick={() => setSelectedCalendars(p => p.includes(acc.email) ? p.filter(c => c !== acc.email) : [...p, acc.email])}>{acc.email.split('@')[0]}</span>
                  </div>
                </div>
              )) : googleUser ? (
                <div className="flex items-center gap-sm clickable" style={{ padding: '8px', borderRadius: '8px', background: 'var(--bg-hover)' }}>
                  <input type="checkbox" checked={selectedCalendars.includes(googleUser.email)} onChange={(e) => setSelectedCalendars(p => p.includes(googleUser.email) ? p.filter(c => c !== googleUser.email) : [...p, googleUser.email])} />
                  <span className="text-sm">{googleUser.email.split('@')[0]}</span>
                </div>
              ) : (
                <div className="text-sm text-muted">No calendar connected</div>
              )}
              <button className="btn btn-ghost btn-sm w-full mt-sm" onClick={() => window.location.href = '/api/auth/google?action=login&prompt=select_account'}><Icon name="plus" size="sm" /> Add Account</button>
            </div>
            
            {/* Sync button */}
            {googleUser && (
              <button className="btn btn-ghost btn-sm w-full" onClick={async () => { 
                const res = await fetch('/api/gcalendar')
                const data = await res.json()
                if (data.events) { setGcalEvents(data.events); toast('Synced!', 'success') }
              }}><Icon name="refresh" size="sm" /> Sync</button>
            )}
          </div>
          
          {/* Main Calendar Area */}
          <div style={{ flex: 1 }}>
            <div className="flex-between mb-md">
              <div className="text-xl font-bold">{currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
              {!googleUser && (
                <button className="btn btn-primary btn-sm" onClick={() => window.location.href = '/api/auth/google?action=login'}>
                  <Icon name="link" size="sm" /> Connect Google Calendar
                </button>
              )}
            </div>
            
            {/* Upcoming Events */}
            {googleUser && gcalEvents.length > 0 && (
              <div className="glass card mb-md" style={{ padding: '16px' }}>
                <div className="flex-between mb-sm">
                  <span className="font-bold text-sm">Upcoming Events</span>
                  <span className="text-xs text-muted">{gcalEvents.length} events</span>
                </div>
                <div className="grid-2" style={{ gap: '8px' }}>
                  {gcalEvents.slice(0, 6).map(ev => (
                    <div key={ev.id} className="flex gap-sm clickable" style={{ padding: '10px', background: 'var(--bg-hover)', borderRadius: '8px', borderLeft: `3px solid ${ev.calendarId === 'family' ? 'var(--green)' : 'var(--accent)'}` }} onClick={() => window.open(`https://calendar.google.com/calendar/event?eid=${ev.id}`, '_blank')}>
                      <div style={{ flex: 1 }}>
                        <div className="font-semibold text-sm">{ev.title}</div>
                        <div className="text-xs text-muted">{new Date(ev.start).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })} * {new Date(ev.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Monthly Calendar Grid */}
            <div className="glass card">
              <div className="grid-7 mb-sm">{['Dom','Lun','Mar','Mer','Gio','Ven','Sab'].map((d,i) => <div key={i} className="text-center text-xs text-muted font-semibold p-sm">{d}</div>)}</div>
              <div className="grid-7" style={{ gap: '4px' }}>
                {(() => {
                  const year = currentTime.getFullYear()
                  const month = currentTime.getMonth()
                  const firstDay = new Date(year, month, 1).getDay()
                  const daysInMonth = new Date(year, month + 1, 0).getDate()
                  const today = currentTime.getDate()
                  
                  const cells = []
                  for (let i = 0; i < firstDay; i++) {
                    cells.push(<div key={`e-${i}`} className="cal-day" style={{ opacity: 0.3 }} />)
                  }
                  for (let day = 1; day <= daysInMonth; day++) {
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const dayLocalEvents = calendarEvents.filter(e => e.date === dateStr)
                    const dayGcalEvents = gcalEvents.filter(e => new Date(e.start).toISOString().split('T')[0] === dateStr)
                    const allDayEvents = [...dayLocalEvents, ...dayGcalEvents.map(g => ({ id: g.id, title: g.title, isGcal: true, isFamily: g.calendarId === 'family' }))]
                    
                    cells.push(
                      <div key={day} className={`cal-day ${day === today ? 'today' : ''}`} onClick={() => { setEditingEvent(null); setShowEventModal(true) }}>
                        <div className="text-xs" style={{ fontWeight: day === today ? 700 : 400 }}>{day}</div>
                        {allDayEvents.slice(0, 2).map((ev: any, idx) => (
                          <div key={idx} className={`cal-event ${ev.isGcal ? '' : eventCategories.find(c => c.id === ev.category)?.color || ''}`} style={ev.isGcal ? { background: ev.isFamily ? 'rgba(34,197,94,0.3)' : 'rgba(66,133,244,0.3)', color: ev.isFamily ? 'var(--green)' : '#4285f4', fontSize: '9px' } : {}} onClick={(e) => { e.stopPropagation(); if (!ev.isGcal) { setEditingEvent(ev); setShowEventModal(true) } }}>
                            {ev.title?.slice(0, 8)}
                          </div>
                        ))}
                        {allDayEvents.length > 2 && <div className="text-xs text-muted">+{allDayEvents.length - 2}</div>}
                      </div>
                    )
                  }
                  return cells
                })()}
              </div>
            </div>
          </div>
        </div>}

        {section === 'biohacking' && <div>
          {/* No Oura Token banner */}
          {healthSource === 'fallback' && <div className="glass card mb-md" style={{ border: '1px solid var(--amber)', background: 'rgba(245,158,11,0.05)' }}>
            <div className="flex items-center gap-sm"><Icon name="alert" size="sm" color="var(--amber)" /><div><div className="font-semibold text-sm" style={{ color: 'var(--amber)' }}>No Oura Ring Connected</div><div className="text-xs text-muted">Add <code>OURA_ACCESS_TOKEN</code> to your Vercel environment variables to see live biometric data. Showing demo values.</div></div></div>
          </div>}
          {healthSource === 'error' && <div className="glass card mb-md" style={{ border: '1px solid var(--red)', background: 'rgba(239,68,68,0.05)' }}>
            <div className="flex items-center gap-sm"><Icon name="alert" size="sm" color="var(--red)" /><div><div className="font-semibold text-sm" style={{ color: 'var(--red)' }}>Oura Connection Error</div><div className="text-xs text-muted">Failed to fetch data from Oura API. Check your token or try refreshing.</div></div></div>
          </div>}
          {/* OURA Metrics - full width */}
          <div className="glass card mb-md">
            <div className="flex-between mb-sm">
              <span className="card-title"><Icon name="health" size="sm" /> OURA Metrics <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 600, marginLeft: '8px', background: healthSource === 'live' ? 'rgba(34,197,94,0.15)' : healthSource === 'loading' ? 'rgba(99,102,241,0.15)' : 'rgba(245,158,11,0.15)', color: healthSource === 'live' ? 'var(--green)' : healthSource === 'loading' ? 'var(--accent)' : 'var(--amber)' }}>{healthSource === 'live' ? '● LIVE' : healthSource === 'loading' ? '⏳' : healthSource === 'error' ? '⚠ Connection Error' : '◌ DEMO DATA'}</span>{healthLastUpdate && healthSource === 'live' && <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '8px' }}>Updated {healthLastUpdate.toLocaleTimeString()}</span>}</span>
              <div className="flex gap-xs items-center">
                <button className="btn btn-ghost btn-xs" onClick={() => { setOuraLoading(true); fetch('/api/oura?period=' + ouraReportPeriod).then(r => r.json()).then(data => { if (!data.error) { setOuraReport(data); if (data.tags) setOuraTags(data.tags); const hasReal = data.daily && (data.daily.readiness != null || data.daily.sleep != null); if (ouraReportPeriod === 'daily') { setHealth({ resilience: typeof data.daily?.resilience === 'string' ? (data.daily.resilience === 'strong' ? 90 : data.daily.resilience === 'adequate' ? 70 : 50) : (data.daily?.resilience || 78), readiness: data.daily?.readiness ?? data.readiness ?? 0, sleep: data.daily?.sleep ?? data.sleep ?? 0, activity: data.daily?.activity ?? data.activity ?? 0, heartRate: data.daily?.heartRate ?? data.heartRate ?? 0, stress: data.daily?.stress ?? data.stress ?? 0, hrv: data.daily?.sleepSession?.hrv ?? data.hrv ?? 0 }); setHealthSource(hasReal ? 'live' : 'fallback'); setHealthLastUpdate(new Date()); } } setOuraLoading(false); }).catch(() => setOuraLoading(false)); }} title="Refresh data">↻</button>
              <div className="flex gap-xs">
                {(['daily', 'weekly', 'monthly'] as const).map(p => (
                  <button key={p} className={`btn ${ouraReportPeriod === p ? 'btn-primary' : 'btn-ghost'} btn-xs`} onClick={() => {
                    if (ouraReportPeriod === p) return // già selezionato
                    setOuraReportPeriod(p)
                    setOuraLoading(true)
                    toast(`Loading ${p} data...`)
                    fetch(`/api/oura?period=${p}`)
                      .then(r => r.json())
                      .then(data => {
                        if (!data.error) { 
                          setOuraReport(data)
                          if (data.tags) setOuraTags(data.tags)
                          // Update health state with period data
                          if (p === 'daily' && data.daily) {
                            setHealth({
                              resilience: typeof data.daily?.resilience === 'string' ? (data.daily.resilience === 'strong' ? 90 : data.daily.resilience === 'adequate' ? 70 : 50) : (data.daily?.resilience || health.resilience),
                              readiness: data.daily?.readiness ?? health.readiness,
                              sleep: data.daily?.sleep ?? health.sleep,
                              activity: data.daily?.activity ?? health.activity,
                              heartRate: data.daily?.heartRate ?? health.heartRate,
                              stress: data.daily?.stress ?? health.stress,
                              hrv: data.daily?.sleepSession?.hrv ?? health.hrv
                            })
                          } else if ((p === 'weekly' || p === 'monthly') && data.averages) {
                            // Show averages for weekly/monthly
                            setHealth(prev => ({
                              ...prev,
                              readiness: data.averages.readiness ?? prev.readiness,
                              sleep: data.averages.sleep ?? prev.sleep,
                              activity: data.averages.activity ?? prev.activity,
                              hrv: data.averages.hrv ?? prev.hrv,
                              heartRate: data.averages.restingHr ?? prev.heartRate
                            }))
                          }
                          toast(`${p.charAt(0).toUpperCase() + p.slice(1)} data loaded`, 'success')
                        } else {
                          toast(`Error: ${data.error}`, 'error')
                        }
                      })
                      .catch(e => toast('Network error', 'error'))
                      .finally(() => setOuraLoading(false))
                  }}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
                ))}
              </div>
              </div>
            </div>
            
            {ouraLoading && <div className="text-center text-sm text-muted" style={{ padding: '20px' }}>Loading Oura data...</div>}
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '12px' }}>
              {[
                { l: 'Readiness', v: health.readiness, c: health.readiness > 70 ? 'var(--green)' : health.readiness > 0 ? 'var(--amber)' : 'var(--text-muted)', icon: 'zap' },
                { l: 'Sleep', v: health.sleep, c: health.sleep > 75 ? 'var(--green)' : health.sleep > 0 ? 'var(--amber)' : 'var(--text-muted)', icon: 'moon' },
                { l: 'Activity', v: health.activity, c: health.activity > 60 ? 'var(--green)' : health.activity > 0 ? 'var(--amber)' : 'var(--text-muted)', icon: 'activity' },
                { l: 'Resilience', v: health.resilience, c: health.resilience > 70 ? 'var(--green)' : health.resilience > 0 ? 'var(--amber)' : 'var(--text-muted)', icon: 'shield' },
              ].map(m => (
                <div key={m.l} className="text-center" style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '10px' }}>
                  <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}><Icon name={m.icon} size="lg" color={m.c} /></div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: m.c }}>{m.v > 0 ? `${m.v}%` : '—'}</div>
                  <div className="text-xs text-muted">{m.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { l: 'HRV', v: health.hrv, c: health.hrv > 50 ? 'var(--green)' : health.hrv > 30 ? 'var(--amber)' : health.hrv > 0 ? 'var(--red)' : 'var(--text-muted)', icon: 'pulse', unit: 'ms' },
                { l: 'Heart Rate', v: health.heartRate, c: health.heartRate > 0 ? (health.heartRate < 65 ? 'var(--green)' : 'var(--amber)') : 'var(--text-muted)', icon: 'heart', unit: 'bpm' },
                { l: 'Stress', v: health.stress, c: health.stress > 60 ? 'var(--red)' : health.stress > 30 ? 'var(--amber)' : health.stress > 0 ? 'var(--green)' : 'var(--text-muted)', icon: 'meditate', unit: 'min' }
              ].map(m => (
                <div key={m.l} className="text-center" style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '10px' }}>
                  <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}><Icon name={m.icon} size="lg" color={m.c} /></div>
                  <div style={{ fontSize: '24px', fontWeight: 700, color: m.c }}>{m.v > 0 ? `${m.v} ${m.unit}` : '—'}</div>
                  <div className="text-xs text-muted">{m.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Habits + OURA TAG — right under metrics */}
          <div className="grid-2 mb-md">
            <div className="glass card">
              <div className="flex-between mb-md"><div className="card-title"><Icon name="check" size="sm" /> Daily Habits</div><span className="text-xs text-muted" style={{ opacity: 0.5 }}>right-click to edit</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(habits.length || 5, 6)}, 1fr)`, gap: '10px' }}>{habits.map(h => <HabitButton key={h.id} h={h} />)}</div>
            </div>
            <div className="glass card" style={{ border: '1px solid rgba(139,92,246,0.3)' }}>
              <div className="flex-between mb-sm">
                <span className="card-title"><Icon name="tag" size="sm" /> OURA TAG</span>
                <span className="text-xs" style={{ padding: '2px 8px', borderRadius: '10px', fontWeight: 600, background: healthSource === 'live' && (ouraTags.enhanced.length > 0 || ouraTags.legacy.length > 0) ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)', color: healthSource === 'live' && (ouraTags.enhanced.length > 0 || ouraTags.legacy.length > 0) ? 'var(--green)' : 'var(--amber)' }}>{healthSource === 'live' && (ouraTags.enhanced.length > 0 || ouraTags.legacy.length > 0) ? `● ${ouraTags.enhanced.length + ouraTags.legacy.length} tag${ouraTags.enhanced.length + ouraTags.legacy.length !== 1 ? 's' : ''}` : '◌ No tags'}</span>
              </div>
              {ouraTags.enhanced.length === 0 && ouraTags.legacy.length === 0 ? (
                <div className="ai-box" style={{ padding: '16px', textAlign: 'center' }}>
                  <div className="text-sm text-muted mb-xs">Nessun tag per oggi</div>
                  <div className="text-xs text-muted">Apri l'app Oura → Tag → aggiungi tag per tracciare attività, sintomi, emozioni e altro.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                  {ouraTags.enhanced.map((t: any, i: number) => {
                    const tagLabel = (t.tagTypeCode || '').replace(/^tag_/, '').replace(/_/g, ' ')
                    const timeStr = t.startTime ? new Date(t.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
                    return (
                      <div key={`et-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div className="text-sm font-semibold" style={{ textTransform: 'capitalize' }}>{tagLabel || 'Tag'}</div>
                          {t.comment && <div className="text-xs text-muted">{t.comment}</div>}
                        </div>
                        {timeStr && <span className="text-xs text-muted">{timeStr}</span>}
                      </div>
                    )
                  })}
                  {ouraTags.legacy.map((t: any, i: number) => (
                    <div key={`lt-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyan)', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        {t.text && <div className="text-sm font-semibold">{t.text}</div>}
                        <div className="flex gap-xs flex-wrap mt-xs">
                          {(t.tags || []).map((tag: string, j: number) => (
                            <span key={j} className="tag tag-accent" style={{ fontSize: '10px' }}>{tag.replace(/^tag_generic_/, '').replace(/^tag_/, '').replace(/_/g, ' ')}</span>
                          ))}
                        </div>
                      </div>
                      {t.timestamp && <span className="text-xs text-muted">{new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* OURA Reports — Sleep Detail */}
          {ouraReport?.daily?.sleepSession && <div className="glass card mb-md">
            <div className="card-title mb-md"><Icon name="moon" size="sm" /> Sleep Report</div>
            <div className="grid-2" style={{ gap: '16px' }}>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { l: 'Total Sleep', v: ouraReport.daily.sleepSession.totalSleep ? `${Math.round(ouraReport.daily.sleepSession.totalSleep / 3600)}h ${Math.round((ouraReport.daily.sleepSession.totalSleep % 3600) / 60)}m` : '—' },
                    { l: 'Efficiency', v: ouraReport.daily.sleepSession.efficiency ? `${ouraReport.daily.sleepSession.efficiency}%` : '—' },
                    { l: 'Deep Sleep', v: ouraReport.daily.sleepSession.deep ? `${Math.round(ouraReport.daily.sleepSession.deep / 60)}m` : '—' },
                    { l: 'REM Sleep', v: ouraReport.daily.sleepSession.rem ? `${Math.round(ouraReport.daily.sleepSession.rem / 60)}m` : '—' },
                    { l: 'Light Sleep', v: ouraReport.daily.sleepSession.light ? `${Math.round(ouraReport.daily.sleepSession.light / 60)}m` : '—' },
                    { l: 'Awake Time', v: ouraReport.daily.sleepSession.awake ? `${Math.round(ouraReport.daily.sleepSession.awake / 60)}m` : '—' },
                    { l: 'Lowest HR', v: ouraReport.daily.sleepSession.hrLowest ? `${ouraReport.daily.sleepSession.hrLowest} bpm` : '—' },
                    { l: 'Avg HRV', v: ouraReport.daily.sleepSession.hrv ? `${ouraReport.daily.sleepSession.hrv} ms` : '—' },
                    { l: 'Avg Breathing', v: ouraReport.daily.sleepSession.breathAverage ? `${ouraReport.daily.sleepSession.breathAverage.toFixed(1)}/min` : '—' },
                    { l: 'Latency', v: ouraReport.daily.sleepSession.latency ? `${Math.round(ouraReport.daily.sleepSession.latency / 60)}m` : '—' },
                    { l: 'Avg HR', v: ouraReport.daily.sleepSession.hrAverage ? `${ouraReport.daily.sleepSession.hrAverage} bpm` : '—' },
                    { l: 'Temp Deviation', v: ouraReport.daily.sleepSession.temperatureDeviation != null ? `${ouraReport.daily.sleepSession.temperatureDeviation > 0 ? '+' : ''}${ouraReport.daily.sleepSession.temperatureDeviation.toFixed(2)}°C` : '—' },
                  ].map(m => (
                    <div key={m.l} style={{ padding: '10px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                      <div className="text-xs text-muted">{m.l}</div>
                      <div className="font-bold">{m.v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted mb-sm">Sleep Stages Breakdown</div>
                {(() => {
                  const ss = ouraReport.daily.sleepSession
                  const total = (ss.deep || 0) + (ss.rem || 0) + (ss.light || 0) + (ss.awake || 0)
                  if (!total) return <div className="text-sm text-muted">No data</div>
                  const stages = [
                    { l: 'Deep', v: ss.deep || 0, c: '#6366f1' },
                    { l: 'REM', v: ss.rem || 0, c: '#06b6d4' },
                    { l: 'Light', v: ss.light || 0, c: '#a78bfa' },
                    { l: 'Awake', v: ss.awake || 0, c: '#f97316' },
                  ]
                  return <div>
                    <div style={{ display: 'flex', height: '24px', borderRadius: '12px', overflow: 'hidden', marginBottom: '12px' }}>
                      {stages.map(s => <div key={s.l} style={{ width: `${(s.v / total) * 100}%`, background: s.c }} title={`${s.l}: ${Math.round(s.v / 60)}m`} />)}
                    </div>
                    {stages.map(s => (
                      <div key={s.l} className="flex-between mb-xs">
                        <div className="flex items-center gap-xs"><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: s.c }} /><span className="text-sm">{s.l}</span></div>
                        <span className="text-sm font-bold">{Math.round(s.v / 60)}m ({Math.round((s.v / total) * 100)}%)</span>
                      </div>
                    ))}
                    {ss.bedtimeStart && <div className="mt-md text-xs text-muted">Bedtime: {new Date(ss.bedtimeStart).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} → {ss.bedtimeEnd ? new Date(ss.bedtimeEnd).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : ''}</div>}
                  </div>
                })()}
                
                {/* Sleep Contributors */}
                {ouraReport.daily?.sleepContributors && Object.keys(ouraReport.daily.sleepContributors).length > 0 && <div className="mt-md">
                  <div className="text-xs text-muted mb-sm">Sleep Score Contributors</div>
                  {Object.entries(ouraReport.daily.sleepContributors).map(([key, val]: [string, any]) => (
                    val != null && <div key={key} className="flex-between mb-xs">
                      <span className="text-xs" style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '60px', height: '4px', borderRadius: '2px', background: 'var(--bg-hover)' }}>
                          <div style={{ width: `${Math.min(Number(val) || 0, 100)}%`, height: '100%', borderRadius: '2px', background: Number(val) > 70 ? 'var(--green)' : Number(val) > 40 ? 'var(--amber)' : 'var(--red)' }} />
                        </div>
                        <span className="text-xs font-bold">{val}</span>
                      </div>
                    </div>
                  ))}
                </div>}
              </div>
            </div>
          </div>}

          {/* OURA Reports — Readiness Contributors */}
          {ouraReport?.daily?.readinessContributors && Object.keys(ouraReport.daily.readinessContributors).length > 0 && <div className="glass card mb-md">
            <div className="card-title mb-md"><Icon name="zap" size="sm" /> Readiness Report</div>
            <div className="grid-2" style={{ gap: '16px' }}>
              <div>
                <div className="text-center mb-md" style={{ padding: '20px', background: 'var(--bg-hover)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '48px', fontWeight: 700, color: (ouraReport.daily.readiness || 0) > 70 ? 'var(--green)' : 'var(--amber)' }}>{ouraReport.daily.readiness || '—'}</div>
                  <div className="text-sm text-muted">Readiness Score</div>
                </div>
                {ouraReport.daily?.stressData && <div>
                  <div className="text-xs text-muted mb-sm">Stress & Recovery</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div style={{ padding: '10px', background: 'var(--bg-hover)', borderRadius: '8px', textAlign: 'center' }}>
                      <div className="font-bold" style={{ color: 'var(--red)' }}>{ouraReport.daily.stressData.stress_high != null ? Math.round(ouraReport.daily.stressData.stress_high / 60) : '—'}</div>
                      <div className="text-xs text-muted">Stress (min)</div>
                    </div>
                    <div style={{ padding: '10px', background: 'var(--bg-hover)', borderRadius: '8px', textAlign: 'center' }}>
                      <div className="font-bold" style={{ color: 'var(--green)' }}>{ouraReport.daily.stressData.recovery_high != null ? Math.round(ouraReport.daily.stressData.recovery_high / 60) : '—'}</div>
                      <div className="text-xs text-muted">Recovery (min)</div>
                    </div>
                  </div>
                </div>}
              </div>
              <div>
                <div className="text-xs text-muted mb-sm">Readiness Contributors</div>
                {Object.entries(ouraReport.daily.readinessContributors).map(([key, val]: [string, any]) => (
                  val != null && <div key={key} className="flex-between mb-sm" style={{ padding: '6px 0' }}>
                    <span className="text-sm" style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '6px', borderRadius: '3px', background: 'var(--bg-hover)' }}>
                        <div style={{ width: `${Math.min(Number(val) || 0, 100)}%`, height: '100%', borderRadius: '3px', background: Number(val) > 70 ? 'var(--green)' : Number(val) > 40 ? 'var(--amber)' : 'var(--red)' }} />
                      </div>
                      <span className="text-sm font-bold" style={{ minWidth: '24px', textAlign: 'right' }}>{val}</span>
                    </div>
                  </div>
                ))}
                {ouraReport.daily?.resilience && <div className="mt-md" style={{ padding: '10px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div className="text-xs text-muted">Resilience Level</div>
                  <div className="font-bold" style={{ textTransform: 'capitalize', color: ouraReport.daily.resilience === 'strong' ? 'var(--green)' : ouraReport.daily.resilience === 'adequate' ? 'var(--amber)' : 'var(--red)' }}>{ouraReport.daily.resilience}</div>
                </div>}
              </div>
            </div>
          </div>}

          {/* OURA Reports — Activity Detail */}
          {ouraReport?.daily?.activityDetails && <div className="glass card mb-md">
            <div className="card-title mb-md"><Icon name="activity" size="sm" /> Activity Report</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {[
                { l: 'Steps', v: ouraReport.daily.activityDetails.steps?.toLocaleString() || '—', icon: 'steps' },
                { l: 'Active Cal', v: ouraReport.daily.activityDetails.activeCalories ? `${ouraReport.daily.activityDetails.activeCalories} kcal` : '—', icon: 'flame' },
                { l: 'Total Cal', v: ouraReport.daily.activityDetails.totalCalories ? `${ouraReport.daily.activityDetails.totalCalories} kcal` : '—', icon: 'bolt' },
                { l: 'Distance', v: ouraReport.daily.activityDetails.equivalentWalkingDistance ? `${(ouraReport.daily.activityDetails.equivalentWalkingDistance / 1000).toFixed(1)} km` : '—', icon: 'route' },
                { l: 'High Activity', v: ouraReport.daily.activityDetails.highActivity ? `${Math.round(ouraReport.daily.activityDetails.highActivity / 60)}m` : '—', icon: 'running' },
                { l: 'Medium Activity', v: ouraReport.daily.activityDetails.mediumActivity ? `${Math.round(ouraReport.daily.activityDetails.mediumActivity / 60)}m` : '—', icon: 'walking' },
                { l: 'Low Activity', v: ouraReport.daily.activityDetails.lowActivity ? `${Math.round(ouraReport.daily.activityDetails.lowActivity / 60)}m` : '—', icon: 'lotus' },
                { l: 'Sedentary', v: ouraReport.daily.activityDetails.sedentaryTime ? `${Math.round(ouraReport.daily.activityDetails.sedentaryTime / 3600)}h` : '—', icon: 'chair' },
              ].map(m => (
                <div key={m.l} className="text-center" style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div style={{ width: '20px', height: '20px', margin: '0 auto 4px', opacity: 0.7 }}><Icon name={m.icon} size="sm" /></div>
                  <div className="font-bold">{m.v}</div>
                  <div className="text-xs text-muted">{m.l}</div>
                </div>
              ))}
            </div>
          </div>}

          {/* OURA Trend Charts (weekly/monthly) */}
          {ouraReport?.trend && (ouraReportPeriod === 'weekly' || ouraReportPeriod === 'monthly') && <div className="glass card mb-md">
            <div className="card-title mb-md"><Icon name="insights" size="sm" /> {ouraReportPeriod === 'weekly' ? '7-Day' : '30-Day'} Trends</div>
            
            {/* Period Averages */}
            {ouraReport.averages && <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {[
                { l: 'Avg Readiness', v: ouraReport.averages.readiness, c: 'var(--green)' },
                { l: 'Avg Sleep', v: ouraReport.averages.sleep, c: 'var(--accent)' },
                { l: 'Avg Activity', v: ouraReport.averages.activity, c: 'var(--amber)' },
                { l: 'Avg HRV', v: ouraReport.averages.hrv, u: 'ms', c: 'var(--cyan)' },
                { l: 'Avg Resting HR', v: ouraReport.averages.restingHr, u: 'bpm', c: 'var(--red)' },
              ].map(m => (
                <div key={m.l} className="text-center" style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: m.c }}>{m.v ?? '—'}{m.v != null ? (m.u || '') : ''}</div>
                  <div className="text-xs text-muted">{m.l}</div>
                </div>
              ))}
            </div>}
            
            {/* Readiness Trend Mini Chart */}
            {ouraReport.trend.readiness?.length > 1 && <div className="mb-md">
              <div className="text-xs text-muted mb-xs">Readiness Score Trend</div>
              <div style={{ display: 'flex', alignItems: 'end', gap: '3px', height: '60px' }}>
                {ouraReport.trend.readiness.map((d: any, i: number) => {
                  const score = d.score || 0
                  return <div key={i} title={`${d.date}: ${score}`} style={{
                    flex: 1, height: `${score}%`, borderRadius: '3px 3px 0 0',
                    background: score > 75 ? 'var(--green)' : score > 60 ? 'var(--amber)' : 'var(--red)', opacity: 0.7
                  }} />
                })}
              </div>
              <div className="flex-between text-xs text-muted mt-xs">
                <span>{ouraReport.trend.readiness[0]?.date?.slice(5)}</span>
                <span>{ouraReport.trend.readiness[ouraReport.trend.readiness.length - 1]?.date?.slice(5)}</span>
              </div>
            </div>}
            
            {/* Sleep Trend */}
            {ouraReport.trend.sleep?.length > 1 && <div className="mb-md">
              <div className="text-xs text-muted mb-xs">Sleep Score Trend</div>
              <div style={{ display: 'flex', alignItems: 'end', gap: '3px', height: '60px' }}>
                {ouraReport.trend.sleep.map((d: any, i: number) => {
                  const score = d.score || 0
                  return <div key={i} title={`${d.date}: ${score}`} style={{
                    flex: 1, height: `${score}%`, borderRadius: '3px 3px 0 0',
                    background: score > 80 ? 'var(--accent)' : score > 65 ? 'var(--amber)' : 'var(--red)', opacity: 0.7
                  }} />
                })}
              </div>
              <div className="flex-between text-xs text-muted mt-xs">
                <span>{ouraReport.trend.sleep[0]?.date?.slice(5)}</span>
                <span>{ouraReport.trend.sleep[ouraReport.trend.sleep.length - 1]?.date?.slice(5)}</span>
              </div>
            </div>}

            {/* Sleep Duration Trend */}
            {ouraReport.trend.sleepSessions?.length > 1 && <div className="mb-md">
              <div className="text-xs text-muted mb-xs">Sleep Duration & HRV</div>
              <div style={{ display: 'flex', alignItems: 'end', gap: '3px', height: '60px' }}>
                {ouraReport.trend.sleepSessions.map((d: any, i: number) => {
                  const hours = d.totalSleep ? d.totalSleep / 3600 : 0
                  const pct = Math.min((hours / 10) * 100, 100)
                  return <div key={i} title={`${d.date}: ${hours.toFixed(1)}h sleep, HRV: ${d.hrv || '?'}ms`} style={{
                    flex: 1, height: `${pct}%`, borderRadius: '3px 3px 0 0',
                    background: 'var(--cyan)', opacity: 0.6
                  }} />
                })}
              </div>
              <div className="flex-between text-xs text-muted mt-xs">
                <span>{ouraReport.trend.sleepSessions[0]?.date?.slice(5)}</span>
                <span>Avg: {ouraReport.averages?.sleepDuration ? `${(ouraReport.averages.sleepDuration / 3600).toFixed(1)}h` : '—'}</span>
              </div>
            </div>}

            {/* Activity Steps Trend */}
            {ouraReport.trend.activity?.length > 1 && <div>
              <div className="text-xs text-muted mb-xs">Daily Steps</div>
              <div style={{ display: 'flex', alignItems: 'end', gap: '3px', height: '60px' }}>
                {ouraReport.trend.activity.map((d: any, i: number) => {
                  const steps = d.steps || 0
                  const maxSteps = Math.max(...ouraReport.trend.activity.map((x: any) => x.steps || 0), 1)
                  return <div key={i} title={`${d.date}: ${steps.toLocaleString()} steps`} style={{
                    flex: 1, height: `${(steps / maxSteps) * 100}%`, borderRadius: '3px 3px 0 0',
                    background: 'var(--amber)', opacity: 0.6
                  }} />
                })}
              </div>
              <div className="flex-between text-xs text-muted mt-xs">
                <span>{ouraReport.trend.activity[0]?.date?.slice(5)}</span>
                <span>Avg: {ouraReport.averages?.steps?.toLocaleString() || '—'} steps</span>
              </div>
            </div>}
          </div>}
          
          {/* Trading Gate + AI */}
          <div className="grid-2 mb-md">
            <div className="glass card glow-box" style={{ background: gateOpen ? 'linear-gradient(135deg, rgba(34,197,94,0.1), transparent)' : 'linear-gradient(135deg, rgba(239,68,68,0.1), transparent)' }}>
              <div className="flex items-center gap-sm">
                <Icon name={gateOpen ? 'check' : 'close'} />
                <span className="text-lg font-bold" style={{ color: gateOpen ? 'var(--green)' : 'var(--red)' }}>Trading Gate {gateOpen ? 'OPEN' : 'LOCKED'}</span>
              </div>
              <div className="text-sm text-muted mt-xs">Position Size: {sizeMultiplier}%</div>
            </div>
            <div className="glass card">
              <div className="ai-box" style={{ padding: '12px' }}>
                <div className="flex items-center gap-sm">
                  <Icon name="brain" size="sm" />
                  <span className="text-sm">{health.readiness < 70 ? "Readiness below optimal. Consider reduced size." : health.stress > 50 ? "High stress detected. Take a break." : "Biometrics optimal. Ready to trade!"}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass card mb-md glow-box" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.1), transparent)' }}>
              <div className="flex-between mb-md">
                <div className="flex items-center gap-sm"><div className="icon-box icon-box-lg"><Icon name="cold" /></div><div><div className="text-lg font-bold">Cold Protocol</div><div className="text-xs text-muted">Discipline Enhancer</div></div></div>
                <button className={`btn ${coldProtocol.isActive ? 'btn-danger' : 'btn-primary'}`} onClick={() => { if (coldProtocol.isActive) { setColdProtocol(p => ({...p, isActive: false, todayDone: true, streak: p.streak + 1})); toast('Cold session complete! +' + coldProtocol.disciplineBoost + '% discipline boost', 'success') } else { setColdProtocol(p => ({...p, isActive: true, timer: 0})) } }}><Icon name={coldProtocol.isActive ? 'stop' : 'play'} size="sm" /> {coldProtocol.isActive ? 'End' : 'Start'}</button>
              </div>
              {coldProtocol.isActive ? <div className="text-center" style={{ padding: '20px' }}><div className="glow-text" style={{ fontSize: '48px', fontWeight: 700, color: 'var(--cyan)' }}>{formatTime(coldProtocol.timer)}</div><div className="text-xs text-muted">Stay strong. Embrace the cold.</div></div> : <div className="grid-3">{[{ l: 'Streak', v: `${coldProtocol.streak}d`, c: 'var(--cyan)' }, { l: 'Norepinephrine', v: coldProtocol.norepinephrine, c: 'var(--green)' }, { l: 'Discipline', v: `+${coldProtocol.disciplineBoost}%`, c: 'var(--accent)' }].map(m => <div key={m.l} className="metric"><div className="metric-value" style={{ fontSize: '18px', color: m.c }}>{m.v}</div><div className="metric-label">{m.l}</div></div>)}</div>}
              {coldProtocol.todayDone && <div className="mt-sm text-center"><span className="tag tag-green">Done today</span></div>}
          </div>
          {/* AI Daily Body Recap by Claude — auto-updates every 10 min */}
          <div className="glass card mb-md glow-box" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.05), transparent)', border: '1px solid rgba(139,92,246,0.3)' }}>
            <div className="flex-between mb-md">
              <div className="flex items-center gap-sm">
                <div className="icon-box icon-box-lg" style={{ background: 'rgba(139,92,246,0.2)' }}><Icon name="brain" /></div>
                <div>
                  <div className="text-lg font-bold">AI Daily Body Recap</div>
                  <div className="text-xs text-muted">Auto-refresh ogni 10 min {aiBodyRecapLastUpdate && <span style={{ color: 'var(--accent)' }}>• Aggiornato {aiBodyRecapLastUpdate.toLocaleTimeString()}</span>}</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-xs" disabled={aiBodyRecapLoading} onClick={() => generateBodyRecap()} title="Aggiorna ora">↻</button>
            </div>
            {aiBodyRecapLoading && (
              <div className="ai-box" style={{ padding: '24px', textAlign: 'center' }}>
                <div className="text-sm text-muted" style={{ animation: 'pulse 1.5s infinite' }}>Claude sta analizzando i tuoi dati biometrici...</div>
              </div>
            )}
            {aiBodyRecap && !aiBodyRecapLoading && (
              <div className="ai-box" style={{ padding: '16px' }}>
                <div className="text-sm" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{aiBodyRecap}</div>
              </div>
            )}
            {!aiBodyRecap && !aiBodyRecapLoading && (
              <div className="ai-box" style={{ padding: '20px', textAlign: 'center' }}>
                <div className="text-sm text-muted">Il recap si genererà automaticamente tra pochi secondi...</div>
                <div className="text-xs text-muted mt-xs">Claude analizzerà: Oura Metrics, Sleep, Activity, Stress, HRV, Tag, Habits e lo storico recente.</div>
              </div>
            )}
          </div>
          <div className="glass card"><div className="flex-between mb-md"><span className="card-title"><Icon name="journal" size="sm" /> Medical Exams</span><div className="flex gap-sm"><button className="btn btn-ghost btn-sm" onClick={() => setShowCategoryModal(true)}>Categories</button><button className="btn btn-primary btn-sm" onClick={() => setShowAddExamModal(true)}><Icon name="plus" size="sm" /> Add</button></div></div>
          <div className="flex gap-sm mb-md flex-wrap"><select value={examFilter.category} onChange={e => setExamFilter({...examFilter, category: e.target.value})} style={{ width: 'auto', padding: '6px 12px' }}><option value="">All Categories</option>{examCategories.map(c => <option key={c} value={c}>{c}</option>)}</select><input type="date" value={examFilter.dateFrom} onChange={e => setExamFilter({...examFilter, dateFrom: e.target.value})} style={{ width: 'auto', padding: '6px 12px' }} /><input type="date" value={examFilter.dateTo} onChange={e => setExamFilter({...examFilter, dateTo: e.target.value})} style={{ width: 'auto', padding: '6px 12px' }} />{(examFilter.category || examFilter.dateFrom || examFilter.dateTo) && <button className="btn btn-ghost btn-xs" onClick={() => setExamFilter({ category: '', dateFrom: '', dateTo: '' })}>Clear</button>}</div>
          {filteredExams.map(exam => <div key={exam.id} className="list-item" onClick={() => { setSelectedExam(exam); setShowExamModal(true) }}><div className="icon-box"><Icon name="journal" /></div><div style={{ flex: 1 }}><div className="font-semibold">{exam.name}</div><div className="text-xs text-muted">{exam.date}</div></div><span className="tag tag-accent">{exam.category}</span></div>)}</div>
        </div>}

        {section === 'neuro' && <div>
          <div className="glass card mb-md glow-box" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), transparent)' }}>
            <div className="flex-between mb-md">
              <div className="flex items-center gap-sm"><div className="icon-box icon-box-lg"><Icon name="wave" /></div><div><div className="text-lg font-bold">Neuro-Adaptive Soundscape</div><div className="text-xs text-muted">Binaural beats & ambient sounds</div></div></div>
              <button className={`btn ${neuroSoundscape.isPlaying ? 'btn-danger' : 'btn-primary'}`} onClick={() => {
                if (neuroSoundscape.isPlaying) {
                  oscillatorRef.current?.stop()
                  audioContextRef.current?.close()
                  audioContextRef.current = null
                  setNeuroSoundscape(p => ({...p, isPlaying: false}))
                } else {
                  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
                  audioContextRef.current = ctx
                  // Createte two oscillators for binaural beats
                  const baseFreq = 200 // Audible carrier frequency
                  const freqMap: Record<string, number> = { focus: 40, calm: 10, recovery: 7.83, sleep: 4, flow: 14 }
                  const beatFreq = freqMap[neuroSoundscape.currentMode] || 40
                  
                  // Left ear oscillator
                  const oscL = ctx.createOscillator()
                  const gainL = ctx.createGain()
                  const panL = ctx.createStereoPanner()
                  oscL.frequency.value = baseFreq
                  oscL.type = 'sine'
                  gainL.gain.value = neuroSoundscape.volume / 200
                  panL.pan.value = -1
                  oscL.connect(gainL).connect(panL).connect(ctx.destination)
                  
                  // Right ear oscillator (slightly different frequency for binaural effect)
                  const oscR = ctx.createOscillator()
                  const gainR = ctx.createGain()
                  const panR = ctx.createStereoPanner()
                  oscR.frequency.value = baseFreq + beatFreq
                  oscR.type = 'sine'
                  gainR.gain.value = neuroSoundscape.volume / 200
                  panR.pan.value = 1
                  oscR.connect(gainR).connect(panR).connect(ctx.destination)
                  
                  oscL.start()
                  oscR.start()
                  oscillatorRef.current = oscL
                  gainNodeRef.current = gainL
                  setNeuroSoundscape(p => ({...p, isPlaying: true}))
                  toast(' Use headphones for binaural beats', 'success')
                }
              }}><Icon name={neuroSoundscape.isPlaying ? 'stop' : 'play'} size="sm" /> {neuroSoundscape.isPlaying ? 'Stop' : 'Play'}</button>
            </div>
            {neuroSoundscape.isPlaying && <div className="mb-md"><div className="ai-box mb-sm" style={{ padding: '8px', borderColor: 'var(--green)' }}><div className="text-xs text-center"> Audio active - Use headphones for binaural effect</div></div><div className="flex items-center gap-sm mb-sm">{[...Array(20)].map((_, i) => <div key={i} style={{ width: '4px', height: `${Math.random() * 30 + 10}px`, background: 'var(--accent)', borderRadius: '2px', animation: 'pulse 0.5s infinite', animationDelay: `${i * 0.05}s` }} />)}</div><div className="text-center text-sm text-muted">{neuroSoundscape.adaptiveReason}</div></div>}
            <div className="flex gap-xs mb-md flex-wrap">{neuroSoundscape.modes.map(m => <button key={m} className={`btn ${neuroSoundscape.currentMode === m ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => { 
              setNeuroSoundscape(p => ({...p, currentMode: m, frequency: m === 'focus' ? '40Hz Gamma' : m === 'calm' ? '10Hz Alpha' : m === 'recovery' ? '7.83Hz Schumann' : m === 'sleep' ? '4Hz Delta' : '14Hz Beta'}))
              if (oscillatorRef.current && audioContextRef.current) {
                // Stop and restart with new frequency
                oscillatorRef.current.stop()
                audioContextRef.current.close()
                setNeuroSoundscape(p => ({...p, isPlaying: false}))
                toast('Change mode and press Play', 'success')
              }
            }}>{m.charAt(0).toUpperCase() + m.slice(1)}</button>)}</div>
            <div className="grid-3">{[{ l: 'Target BPM', v: neuroSoundscape.bpm, c: 'var(--accent)' }, { l: 'Frequency', v: neuroSoundscape.frequency, c: 'var(--cyan)' }, { l: 'Volume', v: `${neuroSoundscape.volume}%`, c: 'var(--text)' }].map(m => <div key={m.l} className="metric"><div className="metric-value" style={{ fontSize: '16px', color: m.c }}>{m.v}</div><div className="metric-label">{m.l}</div></div>)}</div>
            <div className="mt-md"><input type="range" min="0" max="100" value={neuroSoundscape.volume} onChange={e => { const v = parseInt(e.target.value); setNeuroSoundscape(p => ({...p, volume: v})); if (gainNodeRef.current) gainNodeRef.current.gain.value = v / 200 }} style={{ width: '100%' }} /></div>
          </div>
          <div className="glass card mb-md glow-box" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.1), transparent)' }}>
            <div className="flex-between mb-md">
              <div className="flex items-center gap-sm"><div className="icon-box icon-box-lg"><Icon name="meditate" /></div><div><div className="text-lg font-bold">AI Meditation</div><div className="text-xs text-muted">{healthSource === 'live' ? <span style={{ color: 'var(--green)' }}>● Personalizzata da Oura</span> : 'Basata sui tuoi dati'}</div></div></div>
              {!aiMeditation.isActive ? (
                <button className={`btn btn-primary`} disabled={aiMeditation.generating} onClick={async () => {
                  // Generate personalized factors from real data
                  const factors: string[] = []
                  if (healthSource === 'live') {
                    if (health.hrv > 0) factors.push(`HRV: ${health.hrv}ms ${health.hrv < 45 ? '(sotto ottimale)' : '(buono)'}`)
                    if (health.stress > 0) factors.push(`Stress: ${health.stress}% ${health.stress > 50 ? '(alto)' : '(ok)'}`)
                    if (health.readiness > 0) factors.push(`Readiness: ${health.readiness}%`)
                    if (health.sleep > 0) factors.push(`Sleep Score: ${health.sleep}%`)
                  }
                  const recentDiary = diaryEntries.slice(-1)
                  if (recentDiary.length > 0) factors.push(`Diary: ${recentDiary[0].mood || 'scritto di recente'}`)
                  const todayHabitsDone = habits.filter(h => h.done).length
                  factors.push(`Habits: ${todayHabitsDone}/${habits.length} completati`)
                  
                  setAiMeditation(p => ({...p, personalFactors: factors, generating: true}))
                  
                  // Generate AI meditation script
                  try {
                    const res = await fetch('/api/claude', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        system: `Sei una guida di meditazione AI personalizzata. Crea una sessione di meditazione guidata di 8 minuti basata sullo stato biometrico attuale dell'utente. Includi: 1) 2min respirazione (4-7-8 se stress alto, box breathing se ok), 2) 3min body scan personalizzato, 3) 2min visualizzazione (focus trading se c'è sessione, relax se stress alto), 4) 1min chiusura con intenzione. Scrivi in italiano, tono calmo e diretto. Usa "..." per le pause. Max 300 parole.`,
                        message: `Dati biometrici attuali: ${factors.join('. ')}. L'utente è un trader che usa questa meditazione per prepararsi alla giornata.`
                      })
                    })
                    const data = await res.json()
                    setAiMeditation(p => ({...p, script: data.response || 'Chiudi gli occhi... Respira profondamente...', generated: true, generating: false, isActive: true}))
                  } catch {
                    setAiMeditation(p => ({...p, script: 'Chiudi gli occhi... Inspira per 4 secondi... Trattieni per 7... Espira per 8... Ripeti...', generated: true, generating: false, isActive: true}))
                  }
                }}><Icon name={aiMeditation.generating ? 'loading' : 'play'} size="sm" /> {aiMeditation.generating ? 'Generating...' : 'Start AI Session'}</button>
              ) : (
                <button className="btn btn-danger" onClick={() => { setAiMeditation(p => ({...p, isActive: false, duration: 480})); toast('Meditation complete. You are centered.', 'success') }}><Icon name="stop" size="sm" /> Stop</button>
              )}
            </div>
            {aiMeditation.isActive && (
              <div className="text-center" style={{ padding: '30px' }}>
                <div className="glow-text" style={{ fontSize: '48px', fontWeight: 700, color: 'var(--accent)' }}>{formatTime(aiMeditation.duration)}</div>
                <div className="text-xs text-muted mb-md">Sessione in corso</div>
                <div className="ai-box" style={{ padding: '16px', textAlign: 'left', maxHeight: '200px', overflow: 'auto' }}>
                  <div className="text-sm" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{aiMeditation.script}</div>
                </div>
              </div>
            )}
            {!aiMeditation.isActive && !aiMeditation.generating && (
              <div className="ai-box" style={{ padding: '16px' }}>
                <div className="text-sm mb-sm">AI genera una sessione personalizzata basata su:</div>
                <div className="text-xs text-muted">• Dati Oura in tempo reale (HRV, Stress, Readiness, Sleep)</div>
                <div className="text-xs text-muted">• Mood dal diario</div>
                <div className="text-xs text-muted">• Stato degli habit di oggi</div>
                <div className="text-xs text-muted mt-sm">Premi "Start AI Session" per iniziare.</div>
              </div>
            )}
            {aiMeditation.personalFactors.length > 0 && <div className="flex gap-xs flex-wrap mt-md">{aiMeditation.personalFactors.map((f, i) => <span key={i} className="tag tag-accent">{f}</span>)}</div>}
          </div>
          <div className="glass card"><div className="card-title mb-md"><div className="icon-box"><Icon name="music" /></div> Performance Soundtrack</div><div className="ai-box"><div className="flex items-center gap-sm mb-sm"><Icon name="zap" size="sm" /><span className="font-semibold">Reactive Trading Music</span></div><div className="text-sm text-sec mb-md">AI composes music that reacts to your trading. Green trades = major keys. Red trades = calming frequencies.</div><button className={`btn ${tradingMusicPlaying ? 'btn-danger' : 'btn-primary'} btn-sm`} onClick={() => {
            if (tradingMusicPlaying) {
              tradingMusicRef.current?.stop()
              tradingAudioCtxRef.current?.close()
              tradingAudioCtxRef.current = null
              setTradingMusicPlaying(false)
            } else {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
              tradingAudioCtxRef.current = ctx
              // Createte chord based on today's P&L
              const isGreen = todayPnl >= 0
              const baseFreq = isGreen ? 261.63 : 220 // C4 for green, A3 for red
              const chordIntervals = isGreen ? [1, 1.25, 1.5] : [1, 1.2, 1.5] // Major vs Minor
              
              chordIntervals.forEach((interval, i) => {
                const osc = ctx.createOscillator()
                const gain = ctx.createGain()
                osc.frequency.value = baseFreq * interval
                osc.type = 'sine'
                gain.gain.value = 0.15
                osc.connect(gain).connect(ctx.destination)
                osc.start()
                if (i === 0) tradingMusicRef.current = osc
              })
              setTradingMusicPlaying(true)
              toast(isGreen ? ' Major chord - Green day!' : ' Minor chord - Stay calm', 'success')
            }
          }}><Icon name={tradingMusicPlaying ? 'stop' : 'play'} size="sm" /> {tradingMusicPlaying ? 'Stop' : 'Play'}</button></div></div>
        </div>}

        {section === 'automation' && <div>
          <div className="grid-3 mb-md">
            {/* Discord */}
            <div className="glass card" style={{ borderColor: contentAI.discord.connected ? 'rgba(88,101,242,0.5)' : 'var(--border)' }}>
              <div className="flex-between mb-md"><div className="flex items-center gap-sm"><div className="icon-box icon-box-lg" style={{ background: '#5865F2' }}><Icon name="discord" /></div><div><div className="font-bold">Discord</div><div className="text-xs text-muted">{contentAI.discord.connected ? 'Connected' : 'Not connected'}</div></div></div><span className={`tag ${contentAI.discord.connected ? 'tag-green' : 'tag-amber'}`}>{contentAI.discord.connected ? 'Active' : 'Connect'}</span></div>
              <div className="grid-2 mb-sm" style={{ gap: '8px' }}><div className="metric" style={{ padding: '10px' }}><div className="metric-value" style={{ fontSize: '18px' }}>{contentAI.discord.memberCount.toLocaleString()}</div><div className="metric-label">Members</div></div><div className="metric" style={{ padding: '10px' }}><div className="metric-value" style={{ fontSize: '18px', color: 'var(--green)' }}>{contentAI.discord.engagement}%</div><div className="metric-label">Online</div></div></div>
              <div className="flex gap-xs flex-wrap">{[{ l: 'Bot', v: contentAI.discord.botActive }, { l: 'Auto-Share', v: contentAI.discord.autoShare }, { l: 'Daily Digest', v: contentAI.discord.dailyDigest }].map(t => <span key={t.l} className={`tag ${t.v ? 'tag-green' : 'tag-amber'}`}>{t.l}: {t.v ? 'ON' : 'OFF'}</span>)}</div>
            </div>
            
            {/* YouTube */}
            <div className="glass card" style={{ borderColor: contentAI.youtube.connected ? 'rgba(255,0,0,0.3)' : 'var(--border)' }}>
              <div className="flex-between mb-md"><div className="flex items-center gap-sm"><div className="icon-box icon-box-lg" style={{ background: '#FF0000' }}><Icon name="youtube" /></div><div><div className="font-bold">YouTube</div><div className="text-xs text-muted">{contentAI.youtube.connected ? 'Connected' : 'Not connected'}</div></div></div><span className={`tag ${contentAI.youtube.connected ? 'tag-green' : 'tag-amber'}`}>{contentAI.youtube.connected ? 'Active' : 'Connect'}</span></div>
              <div className="grid-2 mb-sm" style={{ gap: '8px' }}><div className="metric" style={{ padding: '10px' }}><div className="metric-value" style={{ fontSize: '18px' }}>{contentAI.youtube.subscribers.toLocaleString()}</div><div className="metric-label">Subscribers</div></div><div className="metric" style={{ padding: '10px' }}><div className="metric-value" style={{ fontSize: '18px', color: 'var(--accent)' }}>{contentAI.youtube.videoCount || 0}</div><div className="metric-label">Videos</div></div></div>
              <div className="metric" style={{ padding: '8px' }}><div className="metric-value" style={{ fontSize: '14px', color: 'var(--green)' }}>{contentAI.youtube.totalViews?.toLocaleString() || '—'}</div><div className="metric-label">Total Views</div></div>
            </div>
            
            {/* Whop */}
            <div className="glass card glow-box" style={{ borderColor: 'rgba(139,92,246,0.5)' }}>
              <div className="flex-between mb-md"><div className="flex items-center gap-sm"><div className="icon-box icon-box-lg" style={{ background: 'var(--accent)' }}><Icon name="trading" /></div><div><div className="font-bold">Whop</div><div className="text-xs text-muted">{contentAI.whop.members} members</div></div></div><span className="tag tag-green">Active</span></div>
              <div className="grid-2 mb-sm" style={{ gap: '8px' }}><div className="metric" style={{ padding: '10px' }}><div className="metric-value" style={{ fontSize: '18px', color: 'var(--green)' }}>${contentAI.whop.mrr.toLocaleString()}</div><div className="metric-label">MRR</div></div><div className="metric" style={{ padding: '10px' }}><div className="metric-value" style={{ fontSize: '18px', color: contentAI.whop.churnRisk.length > 0 ? 'var(--red)' : 'var(--green)' }}>{contentAI.whop.churnRisk.length}</div><div className="metric-label">Churn Risk</div></div></div>
              {contentAI.whop.churnRisk.length > 0 && <div className="ai-box" style={{ padding: '8px', borderColor: 'var(--amber)' }}><div className="text-xs"><span className="text-muted">At-risk:</span> {contentAI.whop.churnRisk[0].name}</div></div>}
            </div>
          </div>
          <div className="glass card mb-md"><div className="card-title mb-md"><Icon name="zap" size="sm" /> Social Proof Engine</div><div className="flex-between mb-md"><span className="text-sm text-muted">Auto-generate content from your wins</span><button className={`btn ${socialProof.autoPosts ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setSocialProof(p => ({...p, autoPosts: !p.autoPosts}))}>{socialProof.autoPosts ? 'Auto-Post ON' : 'Enable Auto-Post'}</button></div>{socialProof.recentWins.map((w, i) => <div key={i} className="list-item"><div className="icon-box"><Icon name={w.type === 'trade' ? 'trading' : 'check'} /></div><div style={{ flex: 1 }}><div className="font-semibold">{w.value}</div><div className="text-xs text-muted">{w.date}</div></div><div className="flex gap-xs">{socialProof.platforms.filter(p => p !== 'twitter').map(p => <span key={p} className="tag tag-accent">{p}</span>)}</div></div>)}</div>
          <div className="glass card"><div className="card-title mb-md"><Icon name="link" size="sm" /> Member Journey Orchestrator</div><div className="flex items-center gap-md mb-md" style={{ justifyContent: 'center' }}>{Object.entries(memberJourney.funnel).filter(([k]) => k !== 'twitter').map(([k, v], i, arr) => <React.Fragment key={k}><div className="text-center"><div className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{v.toLocaleString()}</div><div className="text-xs text-muted">{k}</div></div>{i < arr.length - 1 && <span style={{ color: 'var(--text-muted)' }}>→</span>}</React.Fragment>)}</div><div className="text-sm font-semibold mb-sm">Active Automations</div>{memberJourney.automations.map((a, i) => <div key={i} className="flex-between mb-xs" style={{ padding: '10px', background: 'var(--bg-hover)', borderRadius: '8px' }}><div className="flex items-center gap-sm"><span className={`tag ${a.status === 'active' ? 'tag-green' : 'tag-amber'}`}>{a.status}</span><span>{a.name}</span></div><span className="font-bold" style={{ color: 'var(--green)' }}>{a.converted} converted</span></div>)}</div>
        </div>}

        {section === 'workout' && <div>
          {/* Oura Activity Data */}
          {healthSource === 'live' && ouraReport?.daily?.activityDetails && (
            <div className="glass card mb-md glow-box" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1), transparent)' }}>
              <div className="flex-between mb-md">
                <div className="flex items-center gap-sm"><div className="icon-box icon-box-lg"><Icon name="activity" /></div><div><div className="text-lg font-bold">Oura Activity</div><div className="text-xs text-muted"><span style={{ color: 'var(--green)' }}>● LIVE</span> — Aggiornato da Oura Ring</div></div></div>
                <div className="text-right"><div className="glow-text" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--green)' }}>{health.activity || '—'}%</div><div className="text-xs text-muted">Activity Score</div></div>
              </div>
              <div className="grid-4 mb-sm">{[
                { l: 'Steps', v: ouraReport.daily.activityDetails.steps?.toLocaleString() || '—', c: 'var(--green)' },
                { l: 'Active Cal', v: ouraReport.daily.activityDetails.activeCalories || '—', c: 'var(--amber)' },
                { l: 'High Activity', v: ouraReport.daily.activityDetails.highActivity ? `${Math.round(ouraReport.daily.activityDetails.highActivity / 60)}min` : '—', c: 'var(--accent)' },
                { l: 'Target Met', v: ouraReport.daily.activityDetails.meetDailyTargets != null ? (ouraReport.daily.activityDetails.meetDailyTargets >= 1 ? '✓ Yes' : 'Not yet') : '—', c: ouraReport.daily.activityDetails.meetDailyTargets >= 1 ? 'var(--green)' : 'var(--amber)' },
              ].map(m => <div key={m.l} className="metric"><div className="metric-value" style={{ fontSize: '16px', color: m.c }}>{m.v}</div><div className="metric-label">{m.l}</div></div>)}</div>
              {ouraTags.enhanced.length > 0 && <div className="mt-sm"><div className="text-xs text-muted mb-xs">Oura Tags oggi:</div><div className="flex gap-xs flex-wrap">{ouraTags.enhanced.map((t: any, i: number) => <span key={i} className="tag tag-green">{t.tagTypeCode?.replace(/_/g, ' ') || 'tag'}{t.comment ? `: ${t.comment}` : ''}</span>)}</div></div>}
            </div>
          )}
          {healthSource !== 'live' && (
            <div className="glass card mb-md" style={{ padding: '14px' }}>
              <div className="flex items-center gap-sm"><Icon name="alert" size="sm" color="var(--amber)" /><div className="text-sm text-muted">Connetti Oura Ring per vedere dati attività in tempo reale.</div></div>
            </div>
          )}
          <div className="tabs mb-md">{Object.keys(weeklyWorkouts).map(day => <div key={day} className={`tab ${workoutDay === day ? 'active' : ''}`} onClick={() => { setWorkoutDay(day as keyof typeof weeklyWorkouts); setCurrentExIdx(0); setExTimer(0); setWorkoutActive(false) }}>{day.slice(0, 3)}</div>)}</div>
          <div className="glass card mb-md glow-box"><div className="flex-between mb-md"><div><div className="text-lg font-bold">{weeklyWorkouts[workoutDay].name}</div><div className="text-sm text-muted">{weeklyWorkouts[workoutDay].exercises.length} exercises</div></div>{!workoutActive && <button className="btn btn-primary" onClick={() => setWorkoutActive(true)}><Icon name="play" size="sm" /> Start</button>}</div>{workoutActive && (() => { const ex = weeklyWorkouts[workoutDay].exercises[currentExIdx]; return <div className="text-center" style={{ padding: '30px' }}><div className="text-xl font-bold">{ex.name}</div>{ex.reps ? <div style={{ fontSize: '48px', fontWeight: 700 }} className="glow-text">{ex.reps} reps</div> : <div style={{ fontSize: '48px', fontWeight: 700,  }} className="glow-text">{formatTime((ex.duration || 0) - exTimer)}</div>}<div className="flex gap-sm justify-center mt-md"><button className="btn btn-ghost" onClick={() => { setWorkoutActive(false); setCurrentExIdx(0); setExTimer(0) }}><Icon name="stop" size="sm" /></button><button className="btn btn-primary" onClick={() => { if (currentExIdx < weeklyWorkouts[workoutDay].exercises.length - 1) { setCurrentExIdx(p => p + 1); setExTimer(0) } else { setWorkoutActive(false); toggleHabit(2); toast(' Done!', 'success') } }}>{currentExIdx < weeklyWorkouts[workoutDay].exercises.length - 1 ? 'Next ->' : 'OK'}</button></div></div> })()}</div>
          {!workoutActive && <div className="grid-2">{weeklyWorkouts[workoutDay].exercises.map((ex, i) => <div key={ex.id} className="glass card clickable" style={{ padding: '14px' }} onClick={() => { setCurrentExIdx(i); setExTimer(0); setWorkoutActive(true) }}><div className="flex gap-sm items-center"><Icon name={ex.type === 'yoga' ? 'yoga' : 'workout'} /><div><div className="font-semibold text-sm">{ex.name}</div><div className="text-xs text-muted">{ex.reps ? `${ex.reps} reps` : `${ex.duration}s`}</div></div></div></div>)}</div>}
        </div>}

        {section === 'resources' && <div>
          {/* Header with filter + new */}
          <div className="glass card mb-md" style={{ padding: '12px 16px' }}>
            <div className="flex-between mb-sm">
              <div className="flex items-center gap-sm" style={{ flexWrap: 'wrap' }}>
                <span className="text-xs text-muted">Category:</span>
                <button className={`btn ${resourceFilter === 'all' ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setResourceFilter('all')}>All</button>
                {resourceCategories.map(cat => (
                  <button key={cat} className={`btn ${resourceFilter === cat ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setResourceFilter(cat)}>{cat}</button>
                ))}
                <button className="btn btn-ghost btn-xs" onClick={() => setShowCategoryManager(true)} title="Manage categories"><Icon name="settings" size="sm" /></button>
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => { setEditingResource(null); setShowResourceModal(true) }}><Icon name="plus" size="sm" /> New Resource</button>
            </div>
            {/* Tag filters */}
            {(() => {
              const allTags = [...new Set(resources.flatMap(r => r.tags || []))].filter(Boolean)
              if (allTags.length === 0) return null
              return (
                <div className="flex items-center gap-sm" style={{ flexWrap: 'wrap' }}>
                  <span className="text-xs text-muted">Tags:</span>
                  <button className={`btn ${resourceTagFilter === 'all' ? 'btn-accent' : 'btn-ghost'} btn-xs`} onClick={() => setResourceTagFilter('all')}>All</button>
                  {allTags.slice(0, 10).map(tag => (
                    <button key={tag} className={`btn ${resourceTagFilter === tag ? 'btn-accent' : 'btn-ghost'} btn-xs`} onClick={() => setResourceTagFilter(tag)}>{tag}</button>
                  ))}
                </div>
              )
            })()}
          </div>

          {/* Resource Cards Grid */}
          {resources.filter(r => (resourceFilter === 'all' || r.category === resourceFilter) && (resourceTagFilter === 'all' || (r.tags || []).includes(resourceTagFilter))).length === 0 ? (
            <div className="glass card text-center" style={{ padding: '60px' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 16px', opacity: 0.3 }}><Icon name="folder" /></div>
              <div className="text-lg font-bold mb-sm">No resources{resourceFilter !== 'all' ? ` in "${resourceFilter}"` : ''}{resourceTagFilter !== 'all' ? ` with tag "${resourceTagFilter}"` : ''}</div>
              <div className="text-sm text-muted mb-md">Add your first resource — notes, links, files, anything.</div>
              <button className="btn btn-primary" onClick={() => { setEditingResource(null); setShowResourceModal(true) }}><Icon name="plus" size="sm" /> New Resource</button>
            </div>
          ) : (
            <div className="grid-3" style={{ gap: '12px' }}>
              {resources
                .filter(r => (resourceFilter === 'all' || r.category === resourceFilter) && (resourceTagFilter === 'all' || (r.tags || []).includes(resourceTagFilter)))
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(r => (
                <div key={r.id} className="glass card clickable glow-box" style={{ padding: '16px' }} 
                  onClick={() => { setEditingResource(r); setShowResourceModal(true) }}
                  onContextMenu={e => { e.preventDefault(); handleContextMenu(e, 'resource', r) }}>
                  <div className="flex-between mb-sm">
                    <span className="tag" style={{ fontSize: '10px' }}>{r.category}</span>
                    <span className="text-xs text-muted">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="font-semibold mb-xs">{r.name || 'Untitled'}</div>
                  {r.notes && <div className="text-sm text-muted mb-sm" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{r.notes}</div>}
                  <div className="flex items-center gap-sm mb-xs" style={{ marginTop: 'auto' }}>
                    {r.link && <span className="text-xs" style={{ color: 'var(--accent)' }}><Icon name="link" size="sm" /></span>}
                    {r.fileName && <span className="text-xs" style={{ color: 'var(--cyan)' }}><Icon name="doc" size="sm" /></span>}
                  </div>
                  {r.tags && r.tags.length > 0 && (
                    <div className="flex gap-xs flex-wrap">
                      {r.tags.slice(0, 3).map(tag => <span key={tag} className="tag tag-accent" style={{ fontSize: '9px', padding: '2px 6px' }}>{tag}</span>)}
                      {r.tags.length > 3 && <span className="text-xs text-muted">+{r.tags.length - 3}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Category Manager Modal */}
          {showCategoryManager && <div className="modal-overlay" onClick={() => setShowCategoryManager(false)}><div className="modal glass" onClick={e => e.stopPropagation()} style={{ width: '400px' }}>
            <div className="flex-between mb-md"><div className="text-lg font-bold">Manage Categories</div><button className="btn btn-ghost btn-xs" onClick={() => setShowCategoryManager(false)}><Icon name="close" /></button></div>
            <div className="flex gap-sm mb-md">
              <input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="New category..." style={{ flex: 1 }} onKeyDown={e => { if (e.key === 'Enter' && newCategoryName.trim()) { setResourceCategories(p => [...p, newCategoryName.trim()]); setNewCategoryName(''); toast('Category added', 'success') }}} />
              <button className="btn btn-primary btn-sm" onClick={() => { if (newCategoryName.trim()) { setResourceCategories(p => [...p, newCategoryName.trim()]); setNewCategoryName(''); toast('Category added', 'success') }}}><Icon name="plus" size="sm" /></button>
            </div>
            {resourceCategories.map((cat, i) => (
              <div key={i} className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span className="text-sm">{cat}</span>
                <div className="flex gap-xs">
                  <button className="btn btn-ghost btn-xs" onClick={() => {
                    const newName = prompt('Rename category:', cat)
                    if (newName && newName.trim()) {
                      setResourceCategories(p => p.map(c => c === cat ? newName.trim() : c))
                      setResources(p => p.map(r => r.category === cat ? { ...r, category: newName.trim() } : r))
                      toast('Renamed', 'success')
                    }
                  }}><Icon name="edit" size="sm" /></button>
                  <button className="btn btn-ghost btn-xs" style={{ color: 'var(--red)' }} onClick={() => {
                    if (confirm(`Delete category "${cat}"? Resources in this category will be moved to "General".`)) {
                      setResources(p => p.map(r => r.category === cat ? { ...r, category: 'General' } : r))
                      setResourceCategories(p => p.filter(c => c !== cat))
                      if (resourceFilter === cat) setResourceFilter('all')
                      toast('Deleted', 'success')
                    }
                  }}><Icon name="trash" size="sm" /></button>
                </div>
              </div>
            ))}
          </div></div>}
        </div>}

        {section === 'social' && <div>
          <div className="grid-2 mb-md" style={{ gap: '16px' }}>
            {/* Twitter Section */}
            <div className="glass card">
              <div className="flex-between mb-md">
                <div className="flex items-center gap-sm">
                  <div className="icon-box" style={{ background: '#000' }}><Icon name="x" /></div>
                  <div><div className="font-bold">X / Twitter</div><div className="text-xs text-muted">Post directly</div></div>
                </div>
              </div>
              
              <div style={{ background: 'var(--bg-hover)', padding: '12px', borderRadius: '10px' }}>
                <textarea 
                  value={newTweet} 
                  onChange={e => setNewTweet(e.target.value)} 
                  placeholder="What's happening?" 
                  style={{ minHeight: '70px', background: 'transparent', border: 'none', resize: 'none', fontSize: '14px' }}
                />
                <div className="flex-between mt-sm">
                  <span className="text-xs" style={{ color: newTweet.length > 280 ? 'var(--red)' : 'var(--text-muted)' }}>{newTweet.length}/280</span>
                  <button className="btn btn-primary btn-sm" onClick={postTweet} disabled={twitterPosting || !newTweet.trim() || newTweet.length > 280}>
                    {twitterPosting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
              
              <div className="flex gap-xs flex-wrap mt-sm">
                {[
                  { icon: 'trading', label: 'Win', text: 'Another green day! Discipline over emotion. #Trading #NQ' },
                  { icon: 'journal', label: 'Recap', text: 'Weekly Stats:\n- Win Rate: ___%\n- P&L: $___\n\n#TradingJournal' },
                  { icon: 'brain', label: 'Lesson', text: 'Trading Lesson:\n\n___\n\n#TradingWisdom' }
                ].map(t => (
                  <button key={t.label} className="btn btn-ghost btn-xs" onClick={() => setNewTweet(t.text)}><Icon name={t.icon} size="sm" /> {t.label}</button>
                ))}
              </div>
            </div>
            
            {/* Discord Section */}
            <div className="glass card">
              <div className="flex-between mb-md">
                <div className="flex items-center gap-sm">
                  <div className="icon-box" style={{ background: '#5865F2' }}><Icon name="discord" /></div>
                  <div><div className="font-bold">Discord</div><div className="text-xs text-muted">Share to channel</div></div>
                </div>
                <span className="tag tag-green">Connected</span>
              </div>
              
              <div style={{ background: 'var(--bg-hover)', padding: '12px', borderRadius: '10px' }}>
                <textarea 
                  id="discord-message"
                  placeholder="Message to send..." 
                  style={{ minHeight: '70px', background: 'transparent', border: 'none', resize: 'none', fontSize: '14px' }}
                />
                <div className="flex-between mt-sm">
                  <span className="text-xs text-muted">Via Webhook</span>
                  <button className="btn btn-primary btn-sm" onClick={async () => {
                    const msg = (document.getElementById('discord-message') as HTMLTextAreaElement).value
                    if (!msg.trim()) return
                    try {
                      const res = await fetch('/api/discord', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content: msg })
                      })
                      if (res.ok) {
                        toast('Sent to Discord!', 'success')
                        ;(document.getElementById('discord-message') as HTMLTextAreaElement).value = ''
                      } else {
                        toast('Failed to send', 'error')
                      }
                    } catch { toast('Failed to send', 'error') }
                  }}>Send</button>
                </div>
              </div>
              
              <div className="flex gap-xs flex-wrap mt-sm">
                <button className="btn btn-ghost btn-xs" onClick={() => {
                  const best = trades.reduce((a, b) => b.pnl > a.pnl ? b : a, trades[0])
                  if (best) (document.getElementById('discord-message') as HTMLTextAreaElement).value = `🏆 Best Trade Today: ${best.strategy || 'NQ'} ${best.dir} → $${best.pnl}`
                }}><Icon name="trading" size="sm" /> Best Trade</button>
                <button className="btn btn-ghost btn-xs" onClick={() => {
                  const total = trades.reduce((a, t) => a + t.pnl, 0)
                  const wr = Math.round(trades.filter(t => t.pnl > 0).length / Math.max(trades.length, 1) * 100)
                  ;(document.getElementById('discord-message') as HTMLTextAreaElement).value = `📊 Daily Stats\nTrades: ${trades.length}\nWin Rate: ${wr}%\nP&L: $${total}`
                }}><Icon name="journal" size="sm" /> Daily Stats</button>
              </div>
            </div>
          </div>
          
          {/* YouTube Channel Stats - Full Width */}
          <div className="glass card mb-md">
              <div className="flex-between mb-md">
                <div className="flex items-center gap-sm">
                  <div className="icon-box" style={{ background: '#FF0000' }}><Icon name="youtube" /></div>
                  <div><div className="font-bold">YouTube</div><div className="text-xs text-muted">{youtubeChannelData ? youtubeChannelData.title : 'Channel stats'}</div></div>
                </div>
                <span className={`tag ${youtubeChannelData ? 'tag-green' : 'tag-accent'}`}>{youtubeChannelData ? 'Connected' : 'API Ready'}</span>
              </div>
              
              {!youtubeChannelData ? (
                <div>
                  <div className="flex gap-sm mb-sm">
                    <input 
                      id="youtube-channel"
                      placeholder="@handle, channel name, or URL" 
                      style={{ flex: 1 }}
                      defaultValue={typeof window !== 'undefined' ? localStorage.getItem('theta_yt_channel') || '' : ''}
                    />
                    <button className="btn btn-primary btn-sm" onClick={async () => {
                      const channel = (document.getElementById('youtube-channel') as HTMLInputElement).value
                      if (!channel.trim()) return
                      toast('Searching...', 'info')
                      try {
                        const res = await fetch(`/api/youtube?action=channel&channelId=${encodeURIComponent(channel.trim())}`)
                        const data = await res.json()
                        if (data.channel) {
                          setYoutubeChannelData(data.channel)
                          localStorage.setItem('theta_yt_channel', channel.trim())
                          if (data.channel.uploadsPlaylistId) {
                            const vRes = await fetch(`/api/youtube?action=videos&playlistId=${data.channel.uploadsPlaylistId}&maxResults=6`)
                            const vData = await vRes.json()
                            if (vData.videos) setYoutubeVideos(vData.videos)
                          }
                          toast('Channel loaded!', 'success')
                        } else {
                          toast(data.error || 'Channel not found', 'error')
                        }
                      } catch { toast('Failed to fetch', 'error') }
                    }}>Search</button>
                  </div>
                  <div className="text-xs text-muted">Accepts: @handle, channel name, YouTube URL, or UC... ID</div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-sm mb-md">
                    {youtubeChannelData.thumbnail && <img src={youtubeChannelData.thumbnail} alt="" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />}
                    <div style={{ flex: 1 }}>
                      <div className="font-bold">{youtubeChannelData.title}</div>
                      <div className="text-xs text-muted">{youtubeChannelData.description?.slice(0, 80)}...</div>
                    </div>
                    <button className="btn btn-ghost btn-xs" onClick={() => { setYoutubeChannelData(null); setYoutubeVideos([]); localStorage.removeItem('theta_yt_channel') }}><Icon name="close" size="sm" /></button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                    <div className="text-center" style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)' }}>{youtubeChannelData.subscribers?.toLocaleString()}</div>
                      <div className="text-xs text-muted">Subscribers</div>
                    </div>
                    <div className="text-center" style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 700 }}>{youtubeChannelData.views?.toLocaleString()}</div>
                      <div className="text-xs text-muted">Total Views</div>
                    </div>
                    <div className="text-center" style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 700 }}>{youtubeChannelData.videos?.toLocaleString()}</div>
                      <div className="text-xs text-muted">Videos</div>
                    </div>
                  </div>
                  {youtubeVideos.length > 0 && <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {youtubeVideos.slice(0, 4).map((v: any) => (
                      <a key={v.id} href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="list-item mb-xs clickable" style={{ padding: '8px' }}>
                          {v.thumbnail && <img src={v.thumbnail} alt="" style={{ width: '80px', height: '45px', borderRadius: '4px', objectFit: 'cover' }} />}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="text-sm font-semibold" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</div>
                            <div className="text-xs text-muted">{v.views?.toLocaleString()} views</div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>}
                </div>
              )}
          </div>

          {/* Inspiration Feed — 2 Column Layout */}
          <div className="glass card mb-md">
            <div className="flex-between mb-md">
              <span className="card-title"><Icon name="globe" size="sm" /> Inspiration Feed</span>
            </div>
            
            <div className="flex gap-sm mb-md">
              <input 
                value={socialSearchQuery}
                onChange={e => setSocialSearchQuery(e.target.value)}
                placeholder="Search topic: trading, biohacking, productivity..." 
                style={{ flex: 1 }}
                onKeyDown={async e => {
                  if (e.key === 'Enter' && socialSearchQuery.trim()) {
                    setSocialSearching(true)
                    setAiInsight('')
                    try {
                      // Search YouTube
                      const ytRes = await fetch(`/api/youtube?action=search&q=${encodeURIComponent(socialSearchQuery.trim())}&maxResults=8`)
                      const ytData = await ytRes.json()
                      const ytResults = (ytData.videos || []).map((v: any, i: number) => ({
                        id: Date.now() + i,
                        author: v.channelTitle || 'YouTube',
                        content: v.title,
                        platform: 'youtube',
                        likes: 0,
                        time: v.publishedAt ? new Date(v.publishedAt).toLocaleDateString() : '',
                        url: `https://youtube.com/watch?v=${v.id}`,
                        thumbnail: v.thumbnail
                      }))
                      // X/Twitter placeholder — would need Twitter API
                      const xResults = (ytData.videos || []).slice(0, 4).map((v: any, i: number) => ({
                        id: Date.now() + 1000 + i,
                        author: v.channelTitle || 'User',
                        content: v.title,
                        platform: 'x',
                        likes: Math.floor(Math.random() * 500),
                        time: v.publishedAt ? new Date(v.publishedAt).toLocaleDateString() : '',
                        url: `https://x.com/search?q=${encodeURIComponent(socialSearchQuery.trim())}`,
                        thumbnail: ''
                      }))
                      setSocialFeed([...xResults, ...ytResults])
                      toast(`Found ${ytResults.length + xResults.length} results`, 'success')
                    } catch {}
                    setSocialSearching(false)
                  }
                }}
              />
              <button className={`btn btn-primary btn-sm ${socialSearching ? 'btn-ghost' : ''}`} disabled={socialSearching} onClick={async () => {
                if (!socialSearchQuery.trim()) return
                setSocialSearching(true)
                setAiInsight('')
                try {
                  const ytRes = await fetch(`/api/youtube?action=search&q=${encodeURIComponent(socialSearchQuery.trim())}&maxResults=8`)
                  const ytData = await ytRes.json()
                  const ytResults = (ytData.videos || []).map((v: any, i: number) => ({
                    id: Date.now() + i,
                    author: v.channelTitle || 'YouTube',
                    content: v.title,
                    platform: 'youtube',
                    likes: 0,
                    time: v.publishedAt ? new Date(v.publishedAt).toLocaleDateString() : '',
                    url: `https://youtube.com/watch?v=${v.id}`,
                    thumbnail: v.thumbnail
                  }))
                  const xResults = (ytData.videos || []).slice(0, 4).map((v: any, i: number) => ({
                    id: Date.now() + 1000 + i,
                    author: v.channelTitle || 'User',
                    content: v.title,
                    platform: 'x',
                    likes: Math.floor(Math.random() * 500),
                    time: v.publishedAt ? new Date(v.publishedAt).toLocaleDateString() : '',
                    url: `https://x.com/search?q=${encodeURIComponent(socialSearchQuery.trim())}`,
                    thumbnail: ''
                  }))
                  setSocialFeed([...xResults, ...ytResults])
                  toast(`Found ${ytResults.length + xResults.length} results`, 'success')
                } catch { toast('Search failed', 'error') }
                setSocialSearching(false)
              }}>{socialSearching ? '...' : <><Icon name="search" size="sm" /> Search</>}</button>
            </div>
            
            {socialFeed.length === 0 && <div className="text-center" style={{ padding: '30px' }}>
              <div style={{ marginBottom: '12px', opacity: 0.3 }}><Icon name="search" size="xl" /></div>
              <div className="text-sm text-muted">Search a topic to populate the feed.<br/>Try: "order flow trading", "biohacking", "productivity"</div>
            </div>}
            
            {socialFeed.length > 0 && <>
              {/* Two Column Grid: X on left, YouTube on right */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {/* X / Twitter Column */}
                <div>
                  <div className="flex items-center gap-xs mb-sm" style={{ padding: '8px 0', borderBottom: '2px solid #000' }}>
                    <Icon name="x" size="sm" /><span className="text-sm font-bold">X / Twitter</span>
                    <span className="text-xs text-muted ml-auto">{socialFeed.filter(f => f.platform === 'x').length} results</span>
                  </div>
                  <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                    {socialFeed.filter(f => f.platform === 'x').map(post => (
                      <a key={post.id} href={post.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="list-item mb-sm clickable" style={{ padding: '10px', borderRadius: '8px' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="flex items-center gap-xs mb-xs">
                              <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>@{post.author}</span>
                              <span className="text-xs text-muted">• {post.time}</span>
                            </div>
                            <div className="text-sm" style={{ lineHeight: 1.5 }}>{post.content}</div>
                            {post.likes > 0 && <div className="text-xs text-muted mt-xs">♥ {post.likes}</div>}
                          </div>
                        </div>
                      </a>
                    ))}
                    {socialFeed.filter(f => f.platform === 'x').length === 0 && (
                      <div className="text-center text-sm text-muted" style={{ padding: '20px' }}>
                        Add TWITTER_BEARER_TOKEN to Vercel for live X results.
                        <br/><span className="text-xs">Currently showing related content.</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* YouTube Column */}
                <div>
                  <div className="flex items-center gap-xs mb-sm" style={{ padding: '8px 0', borderBottom: '2px solid #FF0000' }}>
                    <Icon name="youtube" size="sm" /><span className="text-sm font-bold">YouTube</span>
                    <span className="text-xs text-muted ml-auto">{socialFeed.filter(f => f.platform === 'youtube').length} results</span>
                  </div>
                  <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                    {socialFeed.filter(f => f.platform === 'youtube').map(post => (
                      <a key={post.id} href={post.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="list-item mb-sm clickable" style={{ padding: '10px', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                            {post.thumbnail && <img src={post.thumbnail} alt="" style={{ width: '100px', height: '56px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }} />}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="text-xs font-bold mb-xs" style={{ color: 'var(--accent)' }}>{post.author}</div>
                              <div className="text-sm" style={{ lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{post.content}</div>
                              <div className="text-xs text-muted mt-xs">{post.time}</div>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* AI Analysis Button */}
              <div className="glass card glow-box" style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(139,92,246,0.08), transparent)' }}>
                <div className="flex-between mb-sm">
                  <div className="flex items-center gap-sm">
                    <Icon name="brain" size="sm" color="var(--accent)" />
                    <span className="text-sm font-bold">AI Analysis</span>
                  </div>
                  <button className={`btn btn-primary btn-sm ${aiInsightLoading ? 'btn-ghost' : ''}`} disabled={aiInsightLoading} onClick={async () => {
                    setAiInsightLoading(true)
                    try {
                      const titles = socialFeed.map(f => `[${f.platform.toUpperCase()}] ${f.author}: ${f.content}`).join('\n')
                      const res = await fetch('/api/claude', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          messages: [{ role: 'user', content: `The user searched for "${socialSearchQuery}" in their trading/biohacking dashboard. Here are the results found:\n\n${titles}\n\nAnalyze these results and provide:\n1. A brief summary of the key themes found\n2. Which content looks most valuable and why\n3. Key takeaways the user should focus on\n4. Any red flags or low-quality content to skip\n\nBe concise, use bullet points. Reply in the same language as the search query.` }],
                          system: 'You are an AI assistant helping a trader/biohacker curate and filter content from social media. Be direct, critical, and helpful. Focus on actionable insights.'
                        })
                      })
                      const data = await res.json()
                      setAiInsight(data.content || 'No analysis available.')
                    } catch { setAiInsight('Error generating analysis.') }
                    setAiInsightLoading(false)
                  }}>{aiInsightLoading ? 'Analyzing...' : <><Icon name="ai" size="sm" /> Analyze Content</>}</button>
                </div>
                {aiInsight && <div className="text-sm" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>{aiInsight}</div>}
                {!aiInsight && !aiInsightLoading && <div className="text-xs text-muted">Claude will analyze all search results, highlight the best content, and filter out noise.</div>}
              </div>
            </>}
          </div>
        </div>}

        {section === 'mail' && <div>
          {!googleUser ? (
            <div className="glass card text-center" style={{ padding: '60px' }}>
              <div className="icon-box icon-box-lg" style={{ margin: '0 auto' }}><Icon name="mail" /></div>
              <div className="mt-md text-lg font-bold">Connect Gmail</div>
              <div className="text-sm text-muted mt-sm mb-md">View your emails directly in THETA</div>
              <button className="btn btn-primary" onClick={() => window.location.href = '/api/auth/google?action=login'}>
                <Icon name="link" size="sm" /> Connect with Google
              </button>
            </div>
          ) : showMailSettings ? (
            <div>
              <div className="flex-between mb-md">
                <div className="text-lg font-semibold">Mail Settings</div>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowMailSettings(false)}><Icon name="close" size="sm" /></button>
              </div>
              <div className="glass card" style={{ padding: '20px' }}>
                <div className="mb-md">
                  <label className="text-sm font-medium mb-sm block">Email Signature</label>
                  <textarea value={mailSignature} onChange={e => setMailSignature(e.target.value)} placeholder="La tua firma email..." style={{ minHeight: '100px' }} />
                </div>
                <button className="btn btn-primary" onClick={() => { localStorage.setItem('theta_mail_signature', mailSignature); toast('Signature saved!', 'success'); setShowMailSettings(false) }}>Save</button>
              </div>
            </div>
          ) : selectedEmail ? (
            <div>
              <div className="flex gap-sm mb-md">
                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedEmail(null)}><Icon name="close" size="sm" /> Back</button>
                <button className="btn btn-primary btn-sm" onClick={() => { setReplyTo({ to: selectedEmail.from, subject: `Re: ${selectedEmail.subject}` }); setComposeData({ to: selectedEmail.from?.match(/<(.+)>/)?.[1] || selectedEmail.from, subject: `Re: ${selectedEmail.subject}`, body: `\n\n---\n${mailSignature}` }); setShowCompose(true); setSelectedEmail(null) }}><Icon name="send" size="sm" /> Reply</button>
                <button className="btn btn-ghost btn-sm" onClick={async () => { await fetch(`/api/gmail?action=star&id=${selectedEmail.id}`, { method: 'POST' }); toast(' Important!', 'success') }}><Icon name="star" size="sm" /></button>
                <button className="btn btn-ghost btn-sm" onClick={async () => { await fetch(`/api/gmail?action=archive&id=${selectedEmail.id}`, { method: 'POST' }); toast('Archived', 'success'); setSelectedEmail(null) }}><Icon name="folder" size="sm" /></button>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }} onClick={async () => { await fetch(`/api/gmail?action=trash&id=${selectedEmail.id}`, { method: 'POST' }); toast('Deleted', 'success'); setSelectedEmail(null) }}><Icon name="trash" size="sm" /></button>
              </div>
              
              {/* AI Suggestions */}
              <div className="ai-box mb-md">
                <div className="flex-between mb-sm">
                  <div className="flex items-center gap-sm"><Icon name="brain" size="sm" color="var(--accent)" /><span className="text-sm font-medium">AI Assistant</span></div>
                  <button className="btn btn-ghost btn-xs" onClick={() => toast('Calendar event created', 'success')}><Icon name="calendar" size="sm" /> Add to Calendar</button>
                </div>
                <div className="text-sm text-sec mb-sm">Quick replies:</div>
                <div className="flex gap-sm flex-wrap">
                  {['Thanks, confirmed!', 'I need more time', 'Perfect, let us proceed'].map(s => (
                    <button key={s} className="btn btn-ghost btn-sm" onClick={() => setComposeData(p => ({...p, body: s + `\n\n---\n${mailSignature}`}))}>{s}</button>
                  ))}
                </div>
              </div>
              
              <div className="glass card" style={{ padding: '20px' }}>
                <div className="mb-md">
                  <div className="text-lg font-semibold mb-xs">{selectedEmail.subject}</div>
                  <div className="text-sm text-muted">{selectedEmail.from}</div>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                  <div className="text-sm" style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{selectedEmail.body || selectedEmail.snippet}</div>
                </div>
              </div>
            </div>
          ) : showCompose ? (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className="flex-between mb-md">
                <div className="text-lg font-semibold">{replyTo ? 'Reply' : 'New Email'}</div>
                <button className="btn btn-ghost btn-sm" onClick={() => { setShowCompose(false); setReplyTo(null); setComposeData({ to: '', subject: '', body: '' }) }}><Icon name="close" size="sm" /></button>
              </div>
              <div className="glass card" style={{ padding: '20px' }}>
                {googleAccounts.length > 0 && (
                  <div className="mb-sm"><label className="text-xs text-muted">From:</label>
                    <select className="w-full" value={googleUser?.email || ''} onChange={(e) => { const acc = googleAccounts.find(a => a.email === e.target.value); if (acc) setGoogleUser(acc) }}>
                      {googleAccounts.map(acc => <option key={acc.email} value={acc.email}>{acc.email}</option>)}
                    </select>
                  </div>
                )}
                <div className="mb-sm"><label className="text-xs text-muted">To:</label><input value={composeData.to} onChange={e => setComposeData(p => ({...p, to: e.target.value}))} placeholder="recipient@example.com" /></div>
                <div className="mb-sm"><label className="text-xs text-muted">Subject:</label><input value={composeData.subject} onChange={e => setComposeData(p => ({...p, subject: e.target.value}))} placeholder="Subject" /></div>
                <div className="mb-sm"><label className="text-xs text-muted">Message:</label><textarea value={composeData.body || ''} onChange={e => setComposeData(p => ({...p, body: e.target.value}))} placeholder="Write your message..." style={{ minHeight: '200px' }} /></div>
                
                {/* Toolbar - AI, Attach, Snippet, Event */}
                <div className="flex gap-sm mb-md" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '10px 0' }}>
                  <button className="btn btn-ghost btn-sm" onClick={async () => {
                    if (!composeData.subject && !composeData.body) { toast('Write something first', 'error'); return }
                    toast('AI writing...', 'success')
                    try {
                      const res = await fetch('/api/claude', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ messages: [{ role: 'user', content: `Help me write a professional email. Subject: "${composeData.subject}". Current draft: "${composeData.body}". Please improve or complete this email in a professional tone. Reply ONLY with the improved email body, no explanations.` }] })
                      })
                      const data = await res.json()
                      if (data.response) { setComposeData(p => ({...p, body: data.response})); toast('AI improved!', 'success') }
                    } catch { toast('AI error', 'error') }
                  }}><Icon name="brain" size="sm" /> AI Write</button>
                  
                  <button className="btn btn-ghost btn-sm" onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.onchange = (e: any) => {
                      const file = e.target.files[0]
                      if (file) toast(`Attached: ${file.name} (upload pending)`, 'success')
                    }
                    input.click()
                  }}><Icon name="link" size="sm" /> Attach</button>
                  
                  <button className="btn btn-ghost btn-sm" onClick={() => {
                    const snippets = [
                      { name: 'Greeting', text: 'Hope this email finds you well.' },
                      { name: 'Follow-up', text: 'Just following up on our previous conversation.' },
                      { name: 'Thank you', text: 'Thank you for your time and consideration.' },
                      { name: 'Signature', text: mailSignature || 'Best regards,\n[Your Name]' },
                    ]
                    const snippet = snippets[Math.floor(Math.random() * snippets.length)]
                    setComposeData(p => ({...p, body: p.body + '\n\n' + snippet.text}))
                    toast(`Added: ${snippet.name}`, 'success')
                  }}><Icon name="folder" size="sm" /> Snippet</button>
                  
                  <button className="btn btn-ghost btn-sm" onClick={() => {
                    const meetingTime = new Date()
                    meetingTime.setDate(meetingTime.getDate() + 1)
                    meetingTime.setHours(10, 0, 0, 0)
                    const eventText = `\n\nProposed meeting: ${meetingTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at 10:00 AM`
                    setComposeData(p => ({...p, body: p.body + eventText}))
                    toast('Meeting suggestion added', 'success')
                  }}><Icon name="calendar" size="sm" /> Event</button>
                </div>
                
                <div className="flex-between">
                  <button className="btn btn-ghost" style={{ color: 'var(--red)' }} onClick={() => { 
                    if (confirm('Discard this draft?')) {
                      setShowCompose(false); setReplyTo(null); setComposeData({ to: '', subject: '', body: '' })
                      toast('Draft discarded', 'success')
                    }
                  }}><Icon name="trash" size="sm" /> Discard</button>
                  
                  <div className="flex gap-sm">
                    <button className="btn btn-ghost" onClick={() => { setShowCompose(false); setReplyTo(null); setComposeData({ to: '', subject: '', body: '' }) }}>Cancel</button>
                    <button className="btn btn-primary" onClick={async () => {
                      if (!composeData.to || !composeData.subject) { toast('Fill To and Subject', 'error'); return }
                      try {
                        const res = await fetch('/api/gmail', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ ...composeData, from: googleUser?.email }) })
                        const data = await res.json()
                        if (data.success) { toast('Email sent!', 'success'); setShowCompose(false); setReplyTo(null); setComposeData({ to: '', subject: '', body: '' }) }
                        else toast('Send error: ' + (data.error || ''), 'error')
                      } catch { toast('Send error', 'error') }
                    }}><Icon name="send" size="sm" /> Send</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex" style={{ height: 'calc(100vh - 140px)' }}>
              {/* Sidebar */}
              <div style={{ width: '200px', borderRight: '1px solid var(--border)', padding: '12px', flexShrink: 0 }}>
                <button className="btn btn-primary w-full mb-md" onClick={() => { setComposeData({ to: '', subject: '', body: mailSignature ? `\n\n---\n${mailSignature}` : '' }); setShowCompose(true) }}><Icon name="plus" size="sm" /> Compose</button>
                
                {[
                  { id: 'inbox', label: 'Inbox', icon: 'mail', count: gmailEmails.filter(e => e.unread).length },
                  { id: 'starred', label: 'Starred', icon: 'star', count: 0 },
                  { id: 'sent', label: 'Sent', icon: 'send', count: 0 },
                  { id: 'spam', label: 'Spam', icon: 'close', count: 0 },
                  { id: 'trash', label: 'Trash', icon: 'trash', count: 0 },
                ].map(f => (
                  <div key={f.id} className={`flex items-center gap-sm clickable`} style={{ padding: '8px 12px', borderRadius: '6px', background: mailFolder === f.id ? 'var(--bg-hover)' : 'transparent', marginBottom: '2px' }} onClick={() => { setMailFolder(f.id as any); fetch(`/api/gmail?folder=${f.id}`).then(r => r.json()).then(data => { if (data.emails) setGmailEmails(data.emails) }) }}>
                    <Icon name={f.icon as any} size="sm" />
                    <span className="text-sm" style={{ flex: 1 }}>{f.label}</span>
                    {f.count > 0 && <span className="text-xs" style={{ background: 'var(--accent)', color: 'white', borderRadius: '10px', padding: '1px 6px' }}>{f.count}</span>}
                  </div>
                ))}
                
                <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <div className="flex-between mb-sm">
                    <span className="text-xs text-muted">ACCOUNTS</span>
                    <button className="btn btn-ghost btn-xs" onClick={() => { 
                      const acc = googleUser?.email || googleAccounts[0]?.email
                      if (acc) {
                        fetch(`/api/gmail?account=${encodeURIComponent(acc)}&folder=${mailFolder}`)
                          .then(r => r.json())
                          .then(data => { 
                            if (data.emails) { setGmailEmails(data.emails); toast('Refreshed', 'success') }
                            else if (data.needsReauth) { toast('Re-authenticate this account', 'error') }
                          })
                      }
                    }}><Icon name="refresh" size="sm" /></button>
                  </div>
                  {googleAccounts.map(acc => (
                    <div key={acc.email} className={`flex items-center gap-sm clickable`} style={{ padding: '6px 8px', borderRadius: '6px', background: googleUser?.email === acc.email ? 'var(--accent)' : 'transparent', color: googleUser?.email === acc.email ? 'white' : undefined }} onClick={() => { 
                      setGoogleUser(acc)
                      setGmailEmails([])
                      toast(`Loading ${acc.email.split('@')[0]}...`, 'success')
                      fetch(`/api/gmail?account=${encodeURIComponent(acc.email)}&folder=${mailFolder}`)
                        .then(r => r.json())
                        .then(data => { 
                          if (data.emails) { 
                            setGmailEmails(data.emails)
                            toast(`${data.emails.length} emails loaded`, 'success')
                          } else if (data.needsReauth || data.needsAuth) {
                            toast('Token expired - Re-authenticate', 'error')
                            window.location.href = '/api/auth/google?action=login&prompt=select_account'
                          }
                        })
                        .catch(() => toast('Error loading emails', 'error'))
                    }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: googleUser?.email === acc.email ? 'white' : 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 600, color: googleUser?.email === acc.email ? 'var(--accent)' : 'white' }}>{acc.email[0].toUpperCase()}</div>
                      <span className="text-xs" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{acc.email.split('@')[0]}</span>
                      {googleUser?.email === acc.email && <Icon name="check" size="sm" />}
                    </div>
                  ))}
                  <button className="btn btn-ghost btn-sm w-full mt-sm" onClick={() => window.location.href = '/api/auth/google?action=login&prompt=select_account'}><Icon name="plus" size="sm" /> Add</button>
                </div>
                
                <button className="btn btn-ghost btn-sm w-full mt-md" onClick={() => { const sig = localStorage.getItem('theta_mail_signature') || ''; setMailSignature(sig); setShowMailSettings(true) }}><Icon name="settings" size="sm" /> Settings</button>
              </div>
              
              {/* Email List */}
              <div style={{ flex: 1, overflow: 'auto' }}>
                {/* Header */}
                <div className="flex-between" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div className="flex gap-sm items-center">
                    <input type="checkbox" checked={selectedEmails.length === gmailEmails.length && gmailEmails.length > 0} onChange={(e) => { if (e.target.checked) { setSelectedEmails(gmailEmails.map(em => em.id)) } else { setSelectedEmails([]) } }} />
                    <span className="font-medium">{mailFolder === 'inbox' ? 'Inbox' : mailFolder}</span>
                    {selectedEmails.length > 0 && <span className="text-xs text-muted">({selectedEmails.length} selected)</span>}
                  </div>
                  <div className="flex gap-sm items-center">
                    {selectedEmails.length > 0 ? (
                      <>
                        <button className="btn btn-ghost btn-xs" onClick={async () => { for (const id of selectedEmails) { await fetch(`/api/gmail?action=archive&id=${id}`, { method: 'POST' }) }; toast(`Archived ${selectedEmails.length}`, 'success'); setSelectedEmails([]); setGmailEmails(p => p.filter(e => !selectedEmails.includes(e.id))) }}><Icon name="folder" size="sm" /> Archive</button>
                        <button className="btn btn-ghost btn-xs" onClick={async () => { for (const id of selectedEmails) { await fetch(`/api/gmail?action=star&id=${id}`, { method: 'POST' }) }; toast(`Starred ${selectedEmails.length}`, 'success'); setSelectedEmails([]) }}><Icon name="star" size="sm" /> Star</button>
                        <button className="btn btn-ghost btn-xs" style={{ color: 'var(--red)' }} onClick={async () => { for (const id of selectedEmails) { await fetch(`/api/gmail?action=trash&id=${id}`, { method: 'POST' }) }; toast(`Deleted ${selectedEmails.length}`, 'success'); setSelectedEmails([]); setGmailEmails(p => p.filter(e => !selectedEmails.includes(e.id))) }}><Icon name="trash" size="sm" /> Delete</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-ghost btn-xs" onClick={() => toast('Auto-labeling...', 'success')}><Icon name="brain" size="sm" /> Auto label</button>
                        <input value={mailFilter.sender} onChange={e => setMailFilter(p => ({...p, sender: e.target.value}))} placeholder="Filter..." style={{ width: '150px', padding: '4px 8px', fontSize: '12px' }} />
                        <button className="btn btn-ghost btn-sm" onClick={() => { fetch(`/api/gmail?folder=${mailFolder}&account=${encodeURIComponent(googleUser?.email || '')}`).then(r => r.json()).then(data => { if (data.emails) { setGmailEmails(data.emails); toast('Refreshed', 'success') } }) }}><Icon name="refresh" size="sm" /></button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Email rows - Notion style */}
                {gmailEmails.filter(email => {
                  if (mailFilter.sender && !email.from?.toLowerCase().includes(mailFilter.sender.toLowerCase())) return false
                  return true
                }).length === 0 ? (
                  <div className="text-center text-muted" style={{ padding: '60px' }}>No emails</div>
                ) : (
                  gmailEmails.filter(email => {
                    if (mailFilter.sender && !email.from?.toLowerCase().includes(mailFilter.sender.toLowerCase())) return false
                    return true
                  }).map(email => (
                    <div key={email.id} className={`email-row ${email.unread ? 'unread' : ''} ${selectedEmails.includes(email.id) ? 'selected' : ''}`} style={{ background: selectedEmails.includes(email.id) ? 'var(--bg-hover)' : undefined }}>
                      <input type="checkbox" checked={selectedEmails.includes(email.id)} onChange={(e) => { e.stopPropagation(); if (e.target.checked) { setSelectedEmails(p => [...p, email.id]) } else { setSelectedEmails(p => p.filter(id => id !== email.id)) } }} onClick={(e) => e.stopPropagation()} style={{ marginRight: '8px' }} />
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={async () => {
                        try {
                          const res = await fetch(`/api/gmail?id=${email.id}&account=${encodeURIComponent(googleUser?.email || '')}`)
                          const data = await res.json()
                          setSelectedEmail({ ...email, body: data.body || email.snippet })
                          setGmailEmails(p => p.map(e => e.id === email.id ? {...e, unread: false} : e))
                        } catch { setSelectedEmail(email) }
                      }}>
                        {email.unread && <div className="email-dot" />}
                        {!email.unread && <div style={{ width: '6px' }} />}
                        <div className="email-sender">{email.from?.split('<')[0]?.trim() || email.from}</div>
                        <div className="email-subject">
                          {email.subject}
                          <span className="email-snippet">  {email.snippet}</span>
                        </div>
                        {email.hasAttachment && <Icon name="link" size="sm" />}
                        <div className="email-time">{email.date ? new Date(email.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : ''}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>}

        {section === 'insights' && <div>
          {todayTrades.filter(t => t.pnl < 0).length >= 1 && <div className="ai-box mb-md" style={{ borderColor: 'var(--red)' }}><div className="flex items-center gap-sm"><Icon name="insights" size="sm" /> <span style={{ color: 'var(--red)' }}>{todayTrades.filter(t => t.pnl < 0).length} loss(es) today</span></div></div>}

          {/* Supabase Status */}
          <div className="glass card mb-md">
            <div className="flex-between mb-md">
              <span className="card-title"><Icon name="settings" size="sm" /> Database Status</span>
              <button className="btn btn-ghost btn-sm" id="supabase-check-btn" onClick={async () => {
                const btn = document.getElementById('supabase-check-btn') as HTMLButtonElement
                btn.textContent = 'Checking...'
                try {
                  const res = await fetch('/api/data?table=_debug')
                  const data = await res.json()
                  const el = document.getElementById('supabase-status')
                  if (el) {
                    const tables = data.tables || {}
                    el.innerHTML = Object.entries(tables).map(([name, info]: [string, any]) => 
                      `<div style="display:flex;justify-content:space-between;padding:8px;background:var(--bg-hover);border-radius:6px;margin-bottom:6px"><span>${name}</span><span style="color:${info.exists ? 'var(--green)' : 'var(--red)'}">${info.exists ? `✓ (${info.count} rows)` : `✗ ${info.error}`}</span></div>`
                    ).join('')
                  }
                } catch (e) {
                  const el = document.getElementById('supabase-status')
                  if (el) el.innerHTML = '<div style="color:var(--red)">Failed to connect to Supabase</div>'
                }
                btn.textContent = 'Check Again'
              }}><Icon name="refresh" size="sm" /> Check Status</button>
            </div>
            <div id="supabase-status" className="text-sm">Click "Check Status" to verify Supabase connection and tables.</div>
          </div>
          
          <div className="glass card mb-md glow-box" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.15), transparent)' }}>
            <div className="flex-between mb-md">
              <div className="flex items-center gap-sm"><div className="icon-box icon-box-lg"><Icon name="brain" /></div><div><div className="text-lg font-bold">Future Self AI Coach</div><div className="text-xs text-muted">Talk to yourself from 2026</div></div></div>
              <button className="btn btn-primary" onClick={() => setFutureSelf(p => ({...p, isOpen: true}))}><Icon name="play" size="sm" /> Start Session</button>
            </div>
            <div className="ai-box"><div className="text-sm italic">"Hey, I am you from the future. I have seen all your data, I know how certain decisions turn out. Want to talk?"</div></div>
          </div>

          <div className="glass card mb-md glow-box"><div className="card-title mb-md"> Predictions</div><div className="grid-3"><div className="metric"><div className="metric-value glow-text" style={{ color: habits.find(h => h.name === 'Workout')?.done ? 'var(--green)' : 'var(--amber)' }}>{habits.find(h => h.name === 'Workout')?.done ? '0%' : health.readiness < 60 ? '85%' : habits.filter(h => h.done).length < 2 ? '65%' : '30%'}</div><div className="metric-label">Skip Workout</div></div><div className="metric"><div className="metric-value glow-text" style={{ color: (trades.filter(t => t.date === new Date().toISOString().slice(0, 10) && t.pnl < 0).length >= 2 || health.stress > 60) ? 'var(--red)' : 'var(--green)' }}>{trades.filter(t => t.date === new Date().toISOString().slice(0, 10) && t.pnl < 0).length >= 2 ? '87%' : health.stress > 50 ? '60%' : '15%'}</div><div className="metric-label">Revenge Risk</div></div><div className="metric"><div className="metric-value glow-text" style={{ color: 'var(--green)' }}>{health.readiness > 70 && health.stress < 40 ? '89%' : health.readiness > 50 ? '65%' : '42%'}</div><div className="metric-label">Win If Calm</div></div></div></div>
          <div className="ai-box"><div className="text-sm">{sentimentMirror.prediction || `Readiness ${health.readiness}% | Stress ${health.stress}% | Habits ${habits.filter(h => h.done).length}/${habits.length} | WR ${trades.length > 0 ? Math.round((trades.filter(t => t.pnl > 0).length / trades.length) * 100) : '—'}%`}</div></div>
        </div>}

        {section === 'settings' && <div>
          <div className="glass card mb-md">
            <div className="card-header"><span className="card-title"><Icon name="settings" size="sm" /> General Settings</span></div>
            
            <div className="mb-md">
              <label className="text-sm font-semibold mb-xs" style={{ display: 'block' }}>Timezone</label>
              <select className="w-full" value={timezone} onChange={(e) => { setTimezone(e.target.value); localStorage.setItem('theta_timezone', e.target.value); toast('Timezone updated', 'success') }}>
                <option value="America/New_York">EST - New York (Market Time)</option>
                <option value="America/Chicago">CST - Chicago</option>
                <option value="America/Los_Angeles">PST - Los Angeles</option>
                <option value="Europe/London">GMT - London</option>
                <option value="Europe/Rome">CET - Rome / Milan</option>
                <option value="Europe/Paris">CET - Paris</option>
                <option value="Europe/Berlin">CET - Berlin</option>
                <option value="Asia/Tokyo">JST - Tokyo</option>
                <option value="Asia/Hong_Kong">HKT - Hong Kong</option>
                <option value="Asia/Singapore">SGT - Singapore</option>
                <option value="Australia/Sydney">AEST - Sydney</option>
              </select>
              <div className="text-xs text-muted mt-xs">Economic calendar times will be converted to your local timezone</div>
            </div>

            <div className="mb-md">
              <label className="text-sm font-semibold mb-xs" style={{ display: 'block' }}>Theme</label>
              <div className="grid-2" style={{ gap: '8px' }}>
                {themes.map(t => (
                  <div key={t.id} className="flex items-center gap-sm clickable" style={{ padding: '10px', borderRadius: '8px', background: theme === t.id ? 'var(--bg-hover)' : 'transparent', border: theme === t.id ? '1px solid var(--accent)' : '1px solid var(--border)' }} onClick={() => setTheme(t.id)}>
                    <div className="flex gap-xs">{t.colors.map((c, i) => <div key={i} style={{ width: '12px', height: '12px', borderRadius: '3px', background: c }} />)}</div>
                    <span className="text-sm">{t.name}</span>
                    {theme === t.id && <Icon name="check" size="sm" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass card mb-md">
            <div className="card-header"><span className="card-title"><Icon name="mail" size="sm" /> Connected Accounts</span></div>
            
            <div className="mb-sm">
              <div className="text-sm font-semibold mb-xs">Google Accounts</div>
              {googleAccounts.length > 0 ? googleAccounts.map(acc => (
                <div key={acc.email} className="flex items-center gap-sm" style={{ padding: '10px', background: 'var(--bg-hover)', borderRadius: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white' }}>{acc.email[0].toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div className="text-sm font-semibold">{acc.name || acc.email.split('@')[0]}</div>
                    <div className="text-xs text-muted">{acc.email}</div>
                  </div>
                  <span className="tag tag-green">Connected</span>
                </div>
              )) : <div className="text-sm text-muted">No Google accounts connected</div>}
              <button className="btn btn-ghost btn-sm mt-sm" onClick={() => window.location.href = '/api/auth/google?action=login&prompt=select_account'}><Icon name="plus" size="sm" /> Add Google Account</button>
            </div>

            <div className="mb-sm">
              <div className="text-sm font-semibold mb-xs">Spotify</div>
              {spotifyUser ? (
                <div className="flex items-center gap-sm" style={{ padding: '10px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <Icon name="spotify" />
                  <div style={{ flex: 1 }}>
                    <div className="text-sm font-semibold">{spotifyUser.display_name}</div>
                    <div className="text-xs text-muted">{spotifyUser.email}</div>
                  </div>
                  <span className="tag tag-green">Connected</span>
                </div>
              ) : (
                <button className="btn btn-ghost btn-sm" onClick={() => window.location.href = '/api/auth/spotify?action=login'}><Icon name="spotify" size="sm" /> Connect Spotify</button>
              )}
            </div>
          </div>
        </div>}
      </main>

      {showThemes && <div className="modal-overlay" onClick={() => setShowThemes(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="flex-between mb-md"><div className="text-lg font-bold">Choose Theme</div><button className="btn btn-ghost btn-xs" onClick={() => setShowThemes(false)}><Icon name="close" /></button></div>{themes.map(t => <div key={t.id} className={`list-item`} style={{ borderColor: theme === t.id ? 'var(--accent)' : undefined }} onClick={() => { setTheme(t.id); setShowThemes(false) }}><div className="flex gap-xs">{t.colors.map((c, i) => <div key={i} style={{ width: '16px', height: '16px', borderRadius: '4px', background: c }} />)}</div><div style={{ flex: 1 }}><div className="font-semibold">{t.name}</div></div>{theme === t.id && <Icon name="check" color="var(--accent)" />}</div>)}</div></div>}
      
      {/* Behaviors Modal */}
      {showBehaviorsModal && <div className="modal-overlay" onClick={() => setShowBehaviorsModal(false)}><div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex-between mb-md"><div className="text-lg font-bold">Edit Behaviors</div><button className="btn btn-ghost btn-xs" onClick={() => setShowBehaviorsModal(false)}><Icon name="close" /></button></div>
        {behaviors.map((b, i) => (
          <div key={b.id} className="flex gap-sm items-center mb-sm">
            <input value={b.label} onChange={(e) => setBehaviors(prev => prev.map(x => x.id === b.id ? {...x, label: e.target.value} : x))} style={{ flex: 1 }} />
            <button className="btn btn-ghost btn-xs" onClick={() => { dbDelete('behaviors', b.id); setBehaviors(prev => prev.filter(x => x.id !== b.id)) }}><Icon name="trash" size="sm" /></button>
          </div>
        ))}
        <button className="btn btn-ghost btn-sm w-full mb-md" onClick={async () => { const tempId = Date.now(); setBehaviors(prev => [...prev, { id: tempId, label: 'New behavior' }]); const rec = await dbInsert('behaviors', { label: 'New behavior', sort_order: behaviors.length }); if (rec?.id) setBehaviors(prev => prev.map(x => x.id === tempId ? {...x, id: rec.id} : x)) }}><Icon name="plus" size="sm" /> Add Behavior</button>
        <div className="flex gap-sm"><button className="btn btn-ghost" onClick={() => setShowBehaviorsModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => { behaviors.forEach(b => dbUpdate('behaviors', b.id, behaviorToDb(b))); setShowBehaviorsModal(false); toast('Behaviors saved', 'success') }}><Icon name="check" size="sm" /> Save</button></div>
      </div></div>}
      
      {/* Checklist Modal */}
      {showChecklistModal && <div className="modal-overlay" onClick={() => setShowChecklistModal(false)}><div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex-between mb-md"><div className="text-lg font-bold">Edit Checklist</div><button className="btn btn-ghost btn-xs" onClick={() => setShowChecklistModal(false)}><Icon name="close" /></button></div>
        {checklist.map((c, i) => (
          <div key={c.id} className="flex gap-sm items-center mb-sm">
            <input value={c.label} onChange={(e) => setChecklist(prev => prev.map(x => x.id === c.id ? {...x, label: e.target.value} : x))} style={{ flex: 1 }} />
            <button className="btn btn-ghost btn-xs" onClick={() => { dbDelete('checklist', c.id); setChecklist(prev => prev.filter(x => x.id !== c.id)) }}><Icon name="trash" size="sm" /></button>
          </div>
        ))}
        <button className="btn btn-ghost btn-sm w-full mb-md" onClick={async () => { const tempId = Date.now(); setChecklist(prev => [...prev, { id: tempId, label: 'New item' }]); const rec = await dbInsert('checklist', { label: 'New item', sort_order: checklist.length }); if (rec?.id) setChecklist(prev => prev.map(x => x.id === tempId ? {...x, id: rec.id} : x)) }}><Icon name="plus" size="sm" /> Add Item</button>
        <div className="flex gap-sm"><button className="btn btn-ghost" onClick={() => setShowChecklistModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => { checklist.forEach(c => dbUpdate('checklist', c.id, { label: c.label, sort_order: c.sort_order })); setShowChecklistModal(false); toast('Checklist saved', 'success') }}><Icon name="check" size="sm" /> Save</button></div>
      </div></div>}
      
      {/* Transaction Modal */}
      {(showTransactionModal || selectedTransaction) && <div className="modal-overlay" onClick={() => { setShowTransactionModal(false); setSelectedTransaction(null); setNewTransaction({ type: 'expense', category: 'Food', description: '', amount: '', account: 'Main', image: '' }) }}><div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex-between mb-md"><div className="text-lg font-bold">{selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}</div><button className="btn btn-ghost btn-xs" onClick={() => { setShowTransactionModal(false); setSelectedTransaction(null) }}><Icon name="close" /></button></div>
        <div className="flex gap-sm mb-md">
          <button className={`btn btn-sm ${(selectedTransaction?.type || newTransaction.type) === 'income' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, background: (selectedTransaction?.type || newTransaction.type) === 'income' ? 'rgba(34,197,94,0.2)' : undefined, borderColor: (selectedTransaction?.type || newTransaction.type) === 'income' ? 'var(--green)' : undefined }} onClick={() => selectedTransaction ? setSelectedTransaction({...selectedTransaction, type: 'income'}) : setNewTransaction(prev => ({...prev, type: 'income'}))}><Icon name="zap" size="sm" /> Income</button>
          <button className={`btn btn-sm ${(selectedTransaction?.type || newTransaction.type) === 'expense' ? 'btn-primary' : 'btn-ghost'}`} style={{ flex: 1, background: (selectedTransaction?.type || newTransaction.type) === 'expense' ? 'rgba(239,68,68,0.2)' : undefined, borderColor: (selectedTransaction?.type || newTransaction.type) === 'expense' ? 'var(--red)' : undefined }} onClick={() => selectedTransaction ? setSelectedTransaction({...selectedTransaction, type: 'expense'}) : setNewTransaction(prev => ({...prev, type: 'expense'}))}><Icon name="wallet" size="sm" /> Expense</button>
        </div>
        <div className="mb-sm"><label className="text-xs text-muted">Amount (€)</label><input type="number" value={selectedTransaction?.amount?.toString() || newTransaction.amount} onChange={e => selectedTransaction ? setSelectedTransaction({...selectedTransaction, amount: parseFloat(e.target.value) || 0}) : setNewTransaction(prev => ({...prev, amount: e.target.value}))} placeholder="0.00" /></div>
        <div className="mb-sm"><label className="text-xs text-muted">Description</label><input value={selectedTransaction?.description || newTransaction.description} onChange={e => selectedTransaction ? setSelectedTransaction({...selectedTransaction, description: e.target.value}) : setNewTransaction(prev => ({...prev, description: e.target.value}))} placeholder="What was it for?" /></div>
        <div className="grid-2 mb-sm" style={{ gap: '10px' }}>
          <div><label className="text-xs text-muted">Category</label><select value={selectedTransaction?.category || newTransaction.category} onChange={e => selectedTransaction ? setSelectedTransaction({...selectedTransaction, category: e.target.value}) : setNewTransaction(prev => ({...prev, category: e.target.value}))}>{financeCategories[(selectedTransaction?.type || newTransaction.type) as 'income' | 'expense'].map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className="text-xs text-muted">Account</label><select value={selectedTransaction?.account || newTransaction.account} onChange={e => selectedTransaction ? setSelectedTransaction({...selectedTransaction, account: e.target.value}) : setNewTransaction(prev => ({...prev, account: e.target.value}))}>{accounts.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
        </div>
        <div className="mb-sm"><label className="text-xs text-muted">Date</label><input type="date" value={selectedTransaction?.date || todayStr} onChange={e => selectedTransaction ? setSelectedTransaction({...selectedTransaction, date: e.target.value}) : undefined} /></div>
        <div className="mb-md">
          <label className="text-xs text-muted">Receipt Image (optional)</label>
          <div className="flex gap-sm items-center mt-xs">
            <input type="file" accept="image/*" id="tx-image-input" style={{ display: 'none' }} onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) {
                const reader = new FileReader()
                reader.onload = (evt) => {
                  const imgData = evt.target?.result as string
                  selectedTransaction ? setSelectedTransaction({...selectedTransaction, image: imgData}) : setNewTransaction(prev => ({...prev, image: imgData}))
                }
                reader.readAsDataURL(f)
              }
            }} />
            <button className="btn btn-ghost btn-sm" onClick={() => document.getElementById('tx-image-input')?.click()}><Icon name="upload" size="sm" /> Upload</button>
            {(selectedTransaction?.image || newTransaction.image) && (
              <div className="flex items-center gap-sm">
                <img src={selectedTransaction?.image || newTransaction.image} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                <button className="btn btn-ghost btn-xs" onClick={() => selectedTransaction ? setSelectedTransaction({...selectedTransaction, image: ''}) : setNewTransaction(prev => ({...prev, image: ''}))}><Icon name="trash" size="sm" /></button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-sm">
          {selectedTransaction && <button className="btn btn-danger" onClick={() => { setTransactions(prev => prev.filter(t => t.id !== selectedTransaction.id)); dbDelete('transactions', selectedTransaction.id); setSelectedTransaction(null); toast('Deleted', 'success') }}><Icon name="trash" size="sm" /></button>}
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={() => { setShowTransactionModal(false); setSelectedTransaction(null) }}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { 
            if (selectedTransaction) {
              setTransactions(prev => prev.map(t => t.id === selectedTransaction.id ? selectedTransaction : t))
              dbUpdate('transactions', selectedTransaction.id, transactionToDb(selectedTransaction))
              setSelectedTransaction(null)
              toast('Updated', 'success')
            } else if (newTransaction.description && newTransaction.amount) { 
              const tempId = Date.now()
              const newTx = { id: tempId, date: todayStr, type: newTransaction.type, category: newTransaction.category, description: newTransaction.description, amount: parseFloat(newTransaction.amount), account: newTransaction.account, image: newTransaction.image }
              setTransactions(prev => [...prev, newTx])
              dbInsert('transactions', transactionToDb(newTx)).then(dbRec => { if (dbRec?.id) setTransactions(p => p.map(t => t.id === tempId ? { ...t, id: dbRec.id } : t)) })
              setNewTransaction({ type: 'expense', category: 'Food', description: '', amount: '', account: 'Main', image: '' })
              setShowTransactionModal(false)
              toast('Added', 'success') 
            } 
          }}><Icon name="check" size="sm" /> Save</button>
        </div>
      </div></div>}
      
      {showTradeModal && <div className="modal-overlay" onClick={() => setShowTradeModal(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="flex-between mb-md">
          <div className="text-lg font-bold">{editingTrade ? 'Edit Trade' : 'New Trade'}</div>
          <button className="btn btn-ghost btn-xs" onClick={() => setShowTradeModal(false)}><Icon name="close" /></button>
        </div>
        
        <div className="modal-split">
          <div>
            {/* Core Trade Data */}
            <div className="grid-3 mb-sm" style={{ gap: '10px' }}>
              <div><label className="text-xs text-muted">P&L ($)</label><input type="number" defaultValue={editingTrade?.pnl || ''} id="trade-pnl" /></div>
              <div><label className="text-xs text-muted">R:R</label><input defaultValue={editingTrade?.rr || ''} id="trade-rr" placeholder="1.5:1" /></div>
              <div><label className="text-xs text-muted">Outcome</label><select defaultValue={editingTrade?.outcome || 'TP'} id="trade-outcome"><option>TP</option><option>SL</option><option>BE</option></select></div>
            </div>
            
            {/* Date/Time/Session */}
            <div className="grid-4 mb-sm" style={{ gap: '10px' }}>
              <div><label className="text-xs text-muted">Date</label><input type="date" defaultValue={editingTrade?.date || todayStr} id="trade-date" /></div>
              <div><label className="text-xs text-muted">Time</label><input type="time" defaultValue={editingTrade?.time || formatClock(currentTime)} id="trade-time" /></div>
              <div><label className="text-xs text-muted">Session</label><select defaultValue={editingTrade?.session || 'NY'} id="trade-session"><option>Tokyo</option><option>London</option><option>NY</option></select></div>
              <div><label className="text-xs text-muted">Direction</label><select defaultValue={editingTrade?.dir || 'LONG'} id="trade-dir"><option>LONG</option><option>SHORT</option></select></div>
            </div>
            
            {/* Strategy & Symbol */}
            <div className="grid-2 mb-sm" style={{ gap: '10px' }}>
              <div><label className="text-xs text-muted">Strategy</label><input defaultValue={editingTrade?.strategy || ''} id="trade-strategy" placeholder="ORB, FVG, ICT..." /></div>
              <div><label className="text-xs text-muted">Symbol</label><input defaultValue={editingTrade?.symbol || 'NQ'} id="trade-symbol" /></div>
            </div>
            
            {/* Emotion (Journal only) */}
            <div className="mb-sm">
              <label className="text-xs text-muted">Emotion</label>
              <select defaultValue={editingTrade?.emotion || 'calm'} id="trade-emotion" className="w-full">
                <option value="calm">😌 Calm</option>
                <option value="confident">💪 Confident</option>
                <option value="anxious">😰 Anxious</option>
                <option value="frustrated">😤 Frustrated</option>
              </select>
            </div>
            
            {/* Tags */}
            <div className="mb-sm">
              <label className="text-xs text-muted">Tags</label>
              <div className="flex gap-xs flex-wrap mb-xs" id="trade-tags-container">
                {(editingTrade?.tags || []).map(tag => (
                  <span key={tag} className="tag tag-accent">{tag}</span>
                ))}
              </div>
              <div className="flex gap-xs flex-wrap">
                {['Breakout', 'Reversal', 'FVG', 'ORB', 'ICT', 'Scalp', 'Swing', 'News'].map(tag => (
                  <button key={tag} type="button" className="btn btn-ghost btn-xs" data-tag={tag}>{tag}</button>
                ))}
              </div>
            </div>
            
            {/* Notes */}
            <div className="mb-sm">
              <label className="text-xs text-muted">Notes (use #tags for AI)</label>
              <textarea defaultValue={editingTrade?.notes || ''} id="trade-notes" placeholder="#breakout #cleansetup&#10;Entry was at key level..." style={{ minHeight: '80px' }} />
            </div>
            
            {/* Voice Notes Section */}
            {editingTrade && (
              <div className="mb-sm" style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                <div className="flex-between mb-sm">
                  <div className="flex items-center gap-sm">
                    <Icon name="mic" size="sm" />
                    <span className="text-sm font-semibold">Voice & Text Notes</span>
                  </div>
                  <button 
                    className={`btn ${isRecordingAudio ? 'btn-danger' : 'btn-ghost'} btn-xs`}
                    onClick={async () => {
                      if (isRecordingAudio && audioRecorder) {
                        audioRecorder.stop()
                        setIsRecordingAudio(false)
                      } else {
                        try {
                          const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                          const recorder = new MediaRecorder(stream)
                          const chunks: Blob[] = []
                          recorder.ondataavailable = e => chunks.push(e.data)
                          recorder.onstop = () => {
                            const blob = new Blob(chunks, { type: 'audio/webm' })
                            setAudioChunks([blob])
                            stream.getTracks().forEach(t => t.stop())
                            toast('Audio recorded!', 'success')
                          }
                          recorder.start()
                          setAudioRecorder(recorder)
                          setIsRecordingAudio(true)
                        } catch (e) {
                          toast('Microphone access denied', 'error')
                        }
                      }
                    }}
                  >
                    {isRecordingAudio ? <><Icon name="stop" size="sm" /> Stop</> : <><Icon name="mic" size="sm" /> Record</>}
                  </button>
                </div>
                {isRecordingAudio && <div className="tag tag-red mb-sm" style={{ animation: 'pulse 1s infinite' }}>Recording...</div>}
                
                {/* Quick note input */}
                <div className="flex gap-xs mb-sm">
                  <input 
                    value={newTradeNote.content}
                    onChange={e => setNewTradeNote(p => ({...p, content: e.target.value, linkedTradeId: editingTrade?.id}))}
                    placeholder="Quick thought about this trade..."
                    style={{ flex: 1 }}
                    onKeyDown={async e => {
                      if (e.key === 'Enter' && newTradeNote.content.trim()) {
                        const note = {
                          id: Date.now(),
                          date: new Date().toISOString(),
                          tradeId: editingTrade?.id,
                          content: newTradeNote.content,
                          mood: (document.getElementById('trade-emotion') as HTMLSelectElement)?.value || 'neutral',
                          tags: ['trade-note']
                        }
                        setTradeNotes(p => [note, ...p])
                        await dbInsert('trade_notes', { trade_id: note.tradeId, content: note.content, mood: note.mood, tags: note.tags.join(','), created_at: note.date })
                        setNewTradeNote({ content: '', mood: 'neutral', linkedTradeId: undefined, tags: '' })
                        toast('Note added!', 'success')
                      }
                    }}
                  />
                  <button 
                    className="btn btn-primary btn-xs"
                    disabled={!newTradeNote.content.trim()}
                    onClick={async () => {
                      if (!newTradeNote.content.trim()) return
                      const note = {
                        id: Date.now(),
                        date: new Date().toISOString(),
                        tradeId: editingTrade?.id,
                        content: newTradeNote.content,
                        mood: (document.getElementById('trade-emotion') as HTMLSelectElement)?.value || 'neutral',
                        tags: ['trade-note']
                      }
                      setTradeNotes(p => [note, ...p])
                      await dbInsert('trade_notes', { trade_id: note.tradeId, content: note.content, mood: note.mood, tags: note.tags.join(','), created_at: note.date })
                      setNewTradeNote({ content: '', mood: 'neutral', linkedTradeId: undefined, tags: '' })
                      toast('Note added!', 'success')
                    }}
                  ><Icon name="plus" size="sm" /></button>
                </div>
                
                {/* Existing notes for this trade */}
                {tradeNotes.filter(n => n.tradeId === editingTrade?.id).length > 0 && (
                  <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                    {tradeNotes.filter(n => n.tradeId === editingTrade?.id).map(note => (
                      <div key={note.id} className="flex-between text-xs mb-xs" style={{ padding: '6px 8px', background: 'var(--bg)', borderRadius: '6px' }}>
                        <div style={{ flex: 1 }}>
                          <span>{note.content}</span>
                          <span className="text-muted ml-sm">{new Date(note.date).toLocaleTimeString()}</span>
                        </div>
                        <button className="btn btn-ghost btn-xs" onClick={() => {
                          setTradeNotes(p => p.filter(n => n.id !== note.id))
                          dbDelete('trade_notes', note.id)
                        }}><Icon name="close" size="sm" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div>
            {/* Price Action Image */}
            <div className="mb-md">
              <label className="text-xs text-muted">Price Action Chart</label>
              <input defaultValue={editingTrade?.priceActionImage || ''} id="trade-pa-image" placeholder="Paste image URL..." className="mb-sm" />
              <div className="img-preview" style={{ height: '120px', border: '2px dashed var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {editingTrade?.priceActionImage ? <img src={editingTrade.priceActionImage} alt="PA" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} /> : <div className="text-center text-muted"><Icon name="trading" size="lg" /><div className="text-xs mt-xs">Price Action</div></div>}
              </div>
            </div>
            
            {/* Orderflow Image */}
            <div>
              <label className="text-xs text-muted">Orderflow Chart</label>
              <input defaultValue={editingTrade?.orderflowImage || ''} id="trade-of-image" placeholder="Paste image URL..." className="mb-sm" />
              <div className="img-preview" style={{ height: '120px', border: '2px dashed var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {editingTrade?.orderflowImage ? <img src={editingTrade.orderflowImage} alt="OF" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} /> : <div className="text-center text-muted"><Icon name="wave" size="lg" /><div className="text-xs mt-xs">Orderflow</div></div>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-sm mt-md">
          {editingTrade && <button className="btn btn-danger" onClick={() => { pushUndo('delete-trade', editingTrade, 'Deleted'); deleteTrade(editingTrade); setShowTradeModal(false) }}><Icon name="trash" size="sm" /></button>}
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={() => setShowTradeModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { 
            const notes = (document.getElementById('trade-notes') as HTMLTextAreaElement).value
            const notesTags = notes.match(/#\w+/g)?.map(t => t.slice(1)) || []
            const existingTags = editingTrade?.tags || []
            const allTags = [...new Set([...existingTags, ...notesTags])]
            
            saveTrade({ 
              date: (document.getElementById('trade-date') as HTMLInputElement).value, 
              time: (document.getElementById('trade-time') as HTMLInputElement).value, 
              symbol: (document.getElementById('trade-symbol') as HTMLInputElement).value, 
              dir: (document.getElementById('trade-dir') as HTMLSelectElement).value, 
              session: (document.getElementById('trade-session') as HTMLSelectElement).value, 
              strategy: (document.getElementById('trade-strategy') as HTMLInputElement).value, 
              pnl: parseFloat((document.getElementById('trade-pnl') as HTMLInputElement).value) || 0, 
              rr: (document.getElementById('trade-rr') as HTMLInputElement).value || '1:1',
              outcome: (document.getElementById('trade-outcome') as HTMLSelectElement).value, 
              emotion: (document.getElementById('trade-emotion') as HTMLSelectElement).value, 
              notes: notes, 
              tags: allTags,
              priceActionImage: (document.getElementById('trade-pa-image') as HTMLInputElement).value, 
              orderflowImage: (document.getElementById('trade-of-image') as HTMLInputElement).value 
            }) 
          }}><Icon name="check" size="sm" /> Save</button>
        </div>
      </div></div>}
      
      {/* Backtest Trade Edit Modal */}
      {editingBacktestTrade && <div className="modal-overlay" onClick={() => setEditingBacktestTrade(null)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="flex-between mb-md">
          <div className="text-lg font-bold">Edit Backtest Trade</div>
          <button className="btn btn-ghost btn-xs" onClick={() => setEditingBacktestTrade(null)}><Icon name="close" /></button>
        </div>
        
        {editingBacktestTrade.image && <div className="mb-md"><img src={editingBacktestTrade.image} alt="" style={{ width: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '8px', background: 'var(--bg)' }} /></div>}
        
        {/* Core Trade Data */}
        <div className="grid-3 mb-sm" style={{ gap: '10px' }}>
          <div><label className="text-xs text-muted">P&L ($)</label><input type="number" value={editingBacktestTrade.pnl} onChange={e => setEditingBacktestTrade({...editingBacktestTrade, pnl: parseFloat(e.target.value) || 0})} style={{ color: editingBacktestTrade.pnl >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }} /></div>
          <div><label className="text-xs text-muted">R:R</label><input value={editingBacktestTrade.rr} onChange={e => setEditingBacktestTrade({...editingBacktestTrade, rr: e.target.value})} placeholder="1.5:1" /></div>
          <div><label className="text-xs text-muted">Outcome</label><select value={editingBacktestTrade.outcome} onChange={e => setEditingBacktestTrade({...editingBacktestTrade, outcome: e.target.value})}><option>TP</option><option>SL</option><option>BE</option></select></div>
        </div>
        
        {/* Date/Time/Session */}
        <div className="grid-4 mb-sm" style={{ gap: '10px' }}>
          <div><label className="text-xs text-muted">Date</label><input type="date" value={editingBacktestTrade.date} onChange={e => setEditingBacktestTrade({...editingBacktestTrade, date: e.target.value})} /></div>
          <div><label className="text-xs text-muted">Time</label><input type="time" value={editingBacktestTrade.time || ''} onChange={e => setEditingBacktestTrade({...editingBacktestTrade, time: e.target.value})} /></div>
          <div><label className="text-xs text-muted">Session</label><select value={editingBacktestTrade.session || 'NY'} onChange={e => setEditingBacktestTrade({...editingBacktestTrade, session: e.target.value})}><option>Tokyo</option><option>London</option><option>NY</option></select></div>
          <div><label className="text-xs text-muted">Direction</label><select value={editingBacktestTrade.dir} onChange={e => setEditingBacktestTrade({...editingBacktestTrade, dir: e.target.value})}><option>LONG</option><option>SHORT</option></select></div>
        </div>
        
        {/* Strategy */}
        <div className="mb-sm">
          <label className="text-xs text-muted">Strategy</label>
          <input value={editingBacktestTrade.strategy} onChange={e => setEditingBacktestTrade({...editingBacktestTrade, strategy: e.target.value})} placeholder="ORB, FVG, ICT, Reversal..." />
        </div>
        
        {/* Tags */}
        <div className="mb-sm">
          <label className="text-xs text-muted">Tags</label>
          <div className="flex gap-xs flex-wrap mb-xs">
            {editingBacktestTrade.tags?.map(tag => (
              <span key={tag} className="tag tag-accent clickable" onClick={() => setEditingBacktestTrade({...editingBacktestTrade, tags: editingBacktestTrade.tags.filter(t => t !== tag)})}>{tag} ×</span>
            ))}
          </div>
          <div className="flex gap-sm">
            <input value={newBacktestTag} onChange={e => setNewBacktestTag(e.target.value)} placeholder="Add tag..." onKeyDown={e => { if (e.key === 'Enter' && newBacktestTag.trim()) { setEditingBacktestTrade({...editingBacktestTrade, tags: [...(editingBacktestTrade.tags || []), newBacktestTag.trim()]}); setNewBacktestTag('') } }} />
            <button className="btn btn-ghost btn-sm" onClick={() => { if (newBacktestTag.trim()) { setEditingBacktestTrade({...editingBacktestTrade, tags: [...(editingBacktestTrade.tags || []), newBacktestTag.trim()]}); setNewBacktestTag('') } }}><Icon name="plus" size="sm" /></button>
          </div>
          <div className="flex gap-xs flex-wrap mt-xs">
            {['Breakout', 'Reversal', 'FVG', 'ORB', 'ICT', 'Scalp', 'Swing', 'News'].map(tag => (
              <button key={tag} className="btn btn-ghost btn-xs" style={{ opacity: editingBacktestTrade.tags?.includes(tag) ? 0.5 : 1 }} onClick={() => { if (!editingBacktestTrade.tags?.includes(tag)) setEditingBacktestTrade({...editingBacktestTrade, tags: [...(editingBacktestTrade.tags || []), tag]}) }}>{tag}</button>
            ))}
          </div>
        </div>
        
        {/* Notes */}
        <div className="mb-md">
          <label className="text-xs text-muted">Notes (use #tags for AI recognition)</label>
          <textarea value={editingBacktestTrade.notes || ''} onChange={e => setEditingBacktestTrade({...editingBacktestTrade, notes: e.target.value})} placeholder="#breakout #cleansetup&#10;Entry was at key level...&#10;Lesson learned: wait for confirmation" style={{ minHeight: '100px' }} />
        </div>
        
        <div className="flex gap-sm">
          <button className="btn btn-danger" onClick={() => { deleteBacktestTrade(editingBacktestTrade); setEditingBacktestTrade(null); toast('Deleted', 'success') }}><Icon name="trash" size="sm" /></button>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={() => setEditingBacktestTrade(null)}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { 
            // Extract tags from notes and merge
            const notesTags = (editingBacktestTrade.notes || '').match(/#\w+/g)?.map(t => t.slice(1)) || []
            const allTags = [...new Set([...(editingBacktestTrade.tags || []), ...notesTags])]
            updateBacktestTrade({...editingBacktestTrade, tags: allTags})
            setEditingBacktestTrade(null)
            toast('Updated', 'success') 
          }}><Icon name="check" size="sm" /> Save</button>
        </div>
      </div></div>}
      
      {showTaskModal && <div className="modal-overlay" onClick={() => setShowTaskModal(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="flex-between mb-md"><div className="text-lg font-bold">{editingTask ? 'Edit Task' : 'New Task'}</div><button className="btn btn-ghost btn-xs" onClick={() => setShowTaskModal(false)}><Icon name="close" /></button></div><div className="mb-sm"><label className="text-xs text-muted">Title</label><input defaultValue={editingTask?.title || ''} id="task-title" /></div><div className="flex gap-md mb-sm"><label className="flex items-center gap-sm"><input type="checkbox" defaultChecked={editingTask?.urgent} id="task-urgent" /><span className="text-sm">Urgent</span></label><label className="flex items-center gap-sm"><input type="checkbox" defaultChecked={editingTask?.important} id="task-important" /><span className="text-sm">Important</span></label></div><div className="grid-2 mb-sm" style={{ gap: '10px' }}><div><label className="text-xs text-muted">Deadline</label><input type="date" defaultValue={editingTask?.deadline || ''} id="task-deadline" /></div><div><label className="text-xs text-muted">Project</label><div className="flex gap-xs"><input list="project-list" defaultValue={editingTask?.projectId ? projects.find(p => p.id === editingTask.projectId)?.name : ''} id="task-project-input" placeholder="Select or create..." style={{ flex: 1 }} /><datalist id="project-list">{projects.map(p => <option key={p.id} value={p.name} />)}</datalist></div></div></div><div className="flex gap-sm">{editingTask && <button className="btn btn-danger" onClick={() => { pushUndo('delete-task', editingTask, 'Deleted'); deleteTask(editingTask); setShowTaskModal(false) }}><Icon name="trash" size="sm" /></button>}<div style={{ flex: 1 }} /><button className="btn btn-ghost" onClick={() => setShowTaskModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => { const projInput = (document.getElementById('task-project-input') as HTMLInputElement).value; let projId: number | null = null; if (projInput) { const existingProj = projects.find(p => p.name.toLowerCase() === projInput.toLowerCase()); if (existingProj) { projId = existingProj.id } else { const newProjId = Date.now(); setProjects(p => [...p, { id: newProjId, name: projInput, color: '#8b5cf6', deadline: '' }]); projId = newProjId; toast('Project created!', 'success') } } saveTask({ title: (document.getElementById('task-title') as HTMLInputElement).value, urgent: (document.getElementById('task-urgent') as HTMLInputElement).checked, important: (document.getElementById('task-important') as HTMLInputElement).checked, deadline: (document.getElementById('task-deadline') as HTMLInputElement).value, projectId: projId }) }}><Icon name="check" size="sm" /> Save</button></div></div></div>}
      {showProjectModal && <div className="modal-overlay" onClick={() => setShowProjectModal(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()}><div className="flex-between mb-md"><div className="text-lg font-bold">{editingProject ? 'Edit Project' : 'New Project'}</div><button className="btn btn-ghost btn-xs" onClick={() => setShowProjectModal(false)}><Icon name="close" /></button></div><div className="mb-sm"><label className="text-xs text-muted">Name</label><input defaultValue={editingProject?.name || ''} id="proj-name" /></div><div className="grid-2 mb-sm" style={{ gap: '10px' }}><div><label className="text-xs text-muted">Color</label><input type="color" defaultValue={editingProject?.color || '#8b5cf6'} id="proj-color" style={{ height: '42px' }} /></div><div><label className="text-xs text-muted">Deadline</label><input type="date" defaultValue={editingProject?.deadline || ''} id="proj-deadline" /></div></div>{!editingProject && <div className="mb-sm"><label className="text-xs text-muted mb-sm" style={{ display: 'block' }}>Tasks</label>{newProjectTasks.map((t, i) => <div key={i} className="glass card mb-sm" style={{ padding: '12px' }}><div className="mb-xs"><input value={t.title || ''} onChange={e => { const n = [...newProjectTasks]; n[i] = {...n[i], title: e.target.value}; setNewProjectTasks(n) }} placeholder="Task title" /></div><div className="flex gap-md mb-xs"><label className="flex items-center gap-sm"><input type="checkbox" checked={t.urgent || false} onChange={e => { const n = [...newProjectTasks]; n[i] = {...n[i], urgent: e.target.checked}; setNewProjectTasks(n) }} /><span className="text-xs">Urgent</span></label><label className="flex items-center gap-sm"><input type="checkbox" checked={t.important || false} onChange={e => { const n = [...newProjectTasks]; n[i] = {...n[i], important: e.target.checked}; setNewProjectTasks(n) }} /><span className="text-xs">Important</span></label></div><div><input type="date" value={t.deadline || ''} onChange={e => { const n = [...newProjectTasks]; n[i] = {...n[i], deadline: e.target.value}; setNewProjectTasks(n) }} style={{ width: '100%' }} /></div></div>)}<button className="btn btn-ghost btn-sm w-full" onClick={() => setNewProjectTasks([...newProjectTasks, { title: '', urgent: false, important: false, deadline: '' }])}><Icon name="plus" size="sm" /> Add Task</button></div>}{editingProject && <div className="mb-sm"><label className="text-xs text-muted">Tasks</label><div style={{ padding: '10px', background: 'var(--bg-hover)', borderRadius: '8px', maxHeight: '200px', overflow: 'auto' }}>{tasks.filter(t => t.projectId === editingProject.id).map(t => <div key={t.id} className="flex gap-sm items-center mb-xs"><input type="checkbox" checked={t.completed} onChange={() => completeTask(t.id)} /><span className={`text-sm ${t.completed ? 'line-through opacity-50' : ''}`} style={{ flex: 1 }}>{t.title}</span>{t.urgent && <span className="tag tag-red">!</span>}{t.important && <span className="tag tag-amber"></span>}</div>)}</div><div className="progress mt-sm"><div className="progress-fill" style={{ width: `${getProjectProgress(editingProject)}%` }} /></div></div>}<div className="flex gap-sm">{editingProject && <button className="btn btn-danger" onClick={() => { pushUndo('delete-project', editingProject, 'Deleted'); setProjects(p => p.filter(pr => pr.id !== editingProject.id)); setShowProjectModal(false) }}><Icon name="trash" size="sm" /></button>}<div style={{ flex: 1 }} /><button className="btn btn-ghost" onClick={() => setShowProjectModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => { saveProject({ name: (document.getElementById('proj-name') as HTMLInputElement).value, color: (document.getElementById('proj-color') as HTMLInputElement).value, deadline: (document.getElementById('proj-deadline') as HTMLInputElement).value }) }}><Icon name="check" size="sm" /> Save</button></div></div></div>}
      {showEventModal && <div className="modal-overlay" onClick={() => setShowEventModal(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="flex-between mb-md"><div className="text-lg font-bold">{editingEvent ? 'Edit' : 'New'} Event</div><button className="btn btn-ghost btn-xs" onClick={() => setShowEventModal(false)}><Icon name="close" /></button></div><div className="mb-sm"><input defaultValue={editingEvent?.title || ''} id="event-title" placeholder="Title" /></div><div className="grid-2 mb-sm" style={{ gap: '10px' }}><input type="date" defaultValue={editingEvent?.date || todayStr} id="event-date" /><input type="time" defaultValue={editingEvent?.time || '09:00'} id="event-time" /></div><div className="grid-2 mb-sm" style={{ gap: '10px' }}><select defaultValue={editingEvent?.category || 'personal'} id="event-category">{eventCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>{googleAccounts.length > 0 && <select id="event-gcal" defaultValue="local"><option value="local">Local Only</option>{googleAccounts.map(acc => <option key={acc.email} value={acc.email}>{acc.email.split('@')[0]}</option>)}</select>}</div><div className="flex gap-sm">{editingEvent && <button className="btn btn-danger" onClick={() => { pushUndo('delete-event', editingEvent, 'Deleted'); setCalendarEvents(p => p.filter(e => e.id !== editingEvent.id)); dbDelete('calendar_events', editingEvent.id); setShowEventModal(false) }}><Icon name="trash" size="sm" /></button>}<div style={{ flex: 1 }} /><button className="btn btn-ghost" onClick={() => setShowEventModal(false)}>Cancel</button><button className="btn btn-primary" onClick={() => { saveEvent({ title: (document.getElementById('event-title') as HTMLInputElement).value, date: (document.getElementById('event-date') as HTMLInputElement).value, time: (document.getElementById('event-time') as HTMLInputElement).value, category: (document.getElementById('event-category') as HTMLSelectElement).value }) }}><Icon name="check" size="sm" /> Save</button></div></div></div>}
      {showResourceModal && <div className="modal-overlay" onClick={() => { setShowResourceModal(false); setEditingResource(null) }}><div className="modal glass" onClick={e => e.stopPropagation()} style={{ width: '520px' }}>
        <div className="flex-between mb-md"><div className="text-lg font-bold">{editingResource ? 'Edit' : 'New'} Resource</div><button className="btn btn-ghost btn-xs" onClick={() => { setShowResourceModal(false); setEditingResource(null) }}><Icon name="close" /></button></div>
        
        <div className="mb-sm"><label className="text-xs text-muted">Name</label><input defaultValue={editingResource?.name || ''} id="res-name" placeholder="Resource name..." /></div>
        
        <div className="mb-sm"><label className="text-xs text-muted">Notes</label><textarea defaultValue={editingResource?.notes || ''} id="res-notes" placeholder="Write your notes here..." style={{ minHeight: '100px', resize: 'vertical' }} /></div>
        
        <div className="mb-sm"><label className="text-xs text-muted">Link (optional)</label><input defaultValue={editingResource?.link || ''} id="res-link" placeholder="https://..." /></div>
        
        <div className="mb-sm">
          <label className="text-xs text-muted">File (optional)</label>
          {editingResource?.fileName && <div className="flex items-center gap-sm mb-xs" style={{ padding: '8px', background: 'var(--bg-hover)', borderRadius: '6px' }}>
            <Icon name="doc" size="sm" />
            <span className="text-sm" style={{ flex: 1 }}>{editingResource.fileName}</span>
            <button className="btn btn-ghost btn-xs" style={{ color: 'var(--red)' }} onClick={() => setEditingResource({ ...editingResource, fileName: '', fileData: '' })}><Icon name="close" size="sm" /></button>
          </div>}
          <input type="file" id="res-file" style={{ fontSize: '13px' }} onChange={e => {
            const file = e.target.files?.[0]
            if (!file) return
            if (file.size > 5 * 1024 * 1024) { toast('File too large (max 5MB)', 'error'); return }
            const reader = new FileReader()
            reader.onload = () => {
              const el = document.getElementById('res-file-data') as HTMLInputElement
              const elName = document.getElementById('res-file-name') as HTMLInputElement
              if (el) el.value = reader.result as string
              if (elName) elName.value = file.name
            }
            reader.readAsDataURL(file)
          }} />
          <input type="hidden" id="res-file-data" defaultValue={editingResource?.fileData || ''} />
          <input type="hidden" id="res-file-name" defaultValue={editingResource?.fileName || ''} />
        </div>
        
        <div className="mb-md"><label className="text-xs text-muted">Category</label>
          <select defaultValue={editingResource?.category || resourceCategories[0] || 'General'} id="res-category">
            {resourceCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        
        <div className="mb-md">
          <label className="text-xs text-muted">Tags (comma separated)</label>
          <input defaultValue={editingResource?.tags?.join(', ') || ''} id="res-tags" placeholder="#trading, #strategy, #setup..." />
          <div className="flex gap-xs flex-wrap mt-xs">
            {['Trading', 'Strategy', 'Setup', 'Psychology', 'Analysis', 'Tutorial', 'Reference'].map(tag => (
              <button key={tag} type="button" className="btn btn-ghost btn-xs" onClick={() => {
                const el = document.getElementById('res-tags') as HTMLInputElement
                const current = el.value.trim()
                if (!current.toLowerCase().includes(tag.toLowerCase())) {
                  el.value = current ? `${current}, ${tag}` : tag
                }
              }}>{tag}</button>
            ))}
          </div>
        </div>
        
        {/* File preview/download for existing resources */}
        {editingResource?.fileData && <div className="mb-md">
          <button className="btn btn-ghost btn-sm w-full" onClick={() => {
            const a = document.createElement('a')
            a.href = editingResource.fileData
            a.download = editingResource.fileName || 'download'
            a.click()
          }}><Icon name="upload" size="sm" /> Download {editingResource.fileName}</button>
        </div>}
        
        {/* Link preview */}
        {editingResource?.link && <div className="mb-md">
          <a href={editingResource.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm w-full" style={{ color: 'var(--accent)' }}><Icon name="link" size="sm" /> Open link</a>
        </div>}
        
        <div className="flex gap-sm">
          {editingResource && <button className="btn btn-danger" onClick={() => { pushUndo('delete-resource', editingResource, 'Deleted'); setResources(p => p.filter(r => r.id !== editingResource.id)); setShowResourceModal(false); setEditingResource(null) }}><Icon name="trash" size="sm" /></button>}
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={() => { setShowResourceModal(false); setEditingResource(null) }}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { 
            const fileDataEl = document.getElementById('res-file-data') as HTMLInputElement
            const fileNameEl = document.getElementById('res-file-name') as HTMLInputElement
            const tagsEl = document.getElementById('res-tags') as HTMLInputElement
            saveResource({ 
              name: (document.getElementById('res-name') as HTMLInputElement).value, 
              notes: (document.getElementById('res-notes') as HTMLTextAreaElement).value,
              link: (document.getElementById('res-link') as HTMLInputElement).value,
              fileName: fileNameEl?.value || editingResource?.fileName || '',
              fileData: fileDataEl?.value || editingResource?.fileData || '',
              category: (document.getElementById('res-category') as HTMLSelectElement).value,
              tags: tagsEl?.value.split(',').map(t => t.trim()).filter(Boolean) || []
            }) 
          }}><Icon name="check" size="sm" /> Save</button>
        </div>
      </div></div>}
      
      {/* Trick Modal */}
      {showTrickModal && <div className="modal-overlay" onClick={() => { setShowTrickModal(false); setEditingTrick(null) }}><div className="modal glass" onClick={e => e.stopPropagation()} style={{ width: '520px' }}>
        <div className="flex-between mb-md">
          <div className="text-lg font-bold">{editingTrick ? 'Edit' : 'New'} Trick</div>
          <button className="btn btn-ghost btn-xs" onClick={() => { setShowTrickModal(false); setEditingTrick(null) }}><Icon name="close" /></button>
        </div>
        
        <div className="mb-sm">
          <label className="text-xs text-muted">Nome</label>
          <input defaultValue={editingTrick?.name || ''} id="trick-name" placeholder="Es: FVG su livello chiave..." />
        </div>
        
        <div className="mb-sm">
          <label className="text-xs text-muted">Descrizione</label>
          <textarea defaultValue={editingTrick?.description || ''} id="trick-desc" placeholder="Descrivi il pattern, quando funziona, cosa cercare..." style={{ minHeight: '100px', resize: 'vertical' }} />
        </div>
        
        <div className="mb-sm">
          <label className="text-xs text-muted">Immagine (URL o paste)</label>
          <input defaultValue={editingTrick?.image || ''} id="trick-image" placeholder="https://... o incolla un'immagine" 
            onPaste={async e => {
              const items = e.clipboardData?.items
              if (!items) return
              for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                  const blob = items[i].getAsFile()
                  if (blob) {
                    const reader = new FileReader()
                    reader.onload = () => {
                      const el = document.getElementById('trick-image') as HTMLInputElement
                      if (el) el.value = reader.result as string
                      toast('Immagine incollata!', 'success')
                    }
                    reader.readAsDataURL(blob)
                  }
                }
              }
            }}
          />
          {(editingTrick?.image || (document.getElementById('trick-image') as HTMLInputElement)?.value) && (
            <div className="mt-sm" style={{ height: '120px', background: 'var(--bg-hover)', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={editingTrick?.image || ''} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.target as HTMLImageElement).style.display = 'none'} />
            </div>
          )}
        </div>
        
        <div className="mb-md">
          <label className="text-xs text-muted">Tags (separati da virgola)</label>
          <input defaultValue={editingTrick?.tags?.join(', ') || ''} id="trick-tags" placeholder="FVG, reversal, NY session..." />
          <div className="flex gap-xs flex-wrap mt-xs">
            {['FVG', 'ORB', 'ICT', 'Reversal', 'Breakout', 'NY', 'London', 'Scalp', 'Swing'].map(tag => (
              <button key={tag} type="button" className="btn btn-ghost btn-xs" onClick={() => {
                const el = document.getElementById('trick-tags') as HTMLInputElement
                const current = el.value.trim()
                if (!current.toLowerCase().includes(tag.toLowerCase())) {
                  el.value = current ? `${current}, ${tag}` : tag
                }
              }}>{tag}</button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-sm">
          {editingTrick && <button className="btn btn-danger" onClick={async () => { 
            setTricks(p => p.filter(t => t.id !== editingTrick.id))
            await dbDelete('tricks', editingTrick.id)
            setShowTrickModal(false)
            setEditingTrick(null)
            toast('Trick eliminato', 'success')
          }}><Icon name="trash" size="sm" /></button>}
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost" onClick={() => { setShowTrickModal(false); setEditingTrick(null) }}>Cancel</button>
          <button className="btn btn-primary" onClick={async () => { 
            const name = (document.getElementById('trick-name') as HTMLInputElement).value
            const description = (document.getElementById('trick-desc') as HTMLTextAreaElement).value
            const image = (document.getElementById('trick-image') as HTMLInputElement).value
            const tagsStr = (document.getElementById('trick-tags') as HTMLInputElement).value
            const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean)
            
            if (editingTrick) {
              const updated = { ...editingTrick, name, description, image, tags }
              setTricks(p => p.map(t => t.id === editingTrick.id ? updated : t))
              await dbUpdate('tricks', editingTrick.id, { name, description, image, tags: tags.join(',') })
            } else {
              const tempId = Date.now()
              const newTrick: Trick = { id: tempId, name, description, image, tags, createdAt: new Date().toISOString() }
              setTricks(p => [...p, newTrick])
              const dbRecord = await dbInsert('tricks', { name, description, image, tags: tags.join(','), created_at: newTrick.createdAt })
              if (dbRecord?.id) setTricks(p => p.map(t => t.id === tempId ? { ...t, id: dbRecord.id } : t))
            }
            setShowTrickModal(false)
            setEditingTrick(null)
            toast(editingTrick ? 'Trick aggiornato' : 'Trick salvato', 'success')
          }}><Icon name="check" size="sm" /> Save</button>
        </div>
      </div></div>}
      
      {showExamModal && selectedExam && <div className="modal-overlay" onClick={() => setShowExamModal(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="flex-between mb-md"><div className="text-lg font-bold">{selectedExam.name}</div><div className="flex gap-xs"><button className="btn btn-ghost btn-xs" onClick={() => { dbDelete('health_exams', selectedExam.id); setHealthExams(p => p.filter(e => e.id !== selectedExam.id)); setShowExamModal(false); toast('Deleted', 'success') }}><Icon name="trash" size="sm" /></button><button className="btn btn-ghost btn-xs" onClick={() => setShowExamModal(false)}><Icon name="close" /></button></div></div><div className="flex gap-sm mb-md"><span className="tag tag-accent">{selectedExam.category}</span><span className="text-sm text-muted">{selectedExam.date}</span></div>{selectedExam.file ? <iframe src={selectedExam.file} style={{ width: '100%', height: '400px', border: 'none', borderRadius: '12px' }} /> : <div className="text-center text-muted" style={{ padding: '60px' }}>No file attached</div>}</div></div>}
      {showAddExamModal && <div className="modal-overlay" onClick={() => setShowAddExamModal(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="flex-between mb-md"><div className="text-lg font-bold">Add Exam</div><button className="btn btn-ghost btn-xs" onClick={() => setShowAddExamModal(false)}><Icon name="close" /></button></div><div className="mb-sm"><label className="text-xs text-muted">Name</label><input id="exam-name" placeholder="Exam name" /></div><div className="grid-2 mb-sm" style={{ gap: '10px' }}><div><label className="text-xs text-muted">Category</label><select id="exam-cat">{examCategories.map(c => <option key={c} value={c}>{c}</option>)}</select></div><div><label className="text-xs text-muted">Date</label><input type="date" id="exam-date" defaultValue={todayStr} /></div></div><div className="mb-sm"><label className="text-xs text-muted">File</label><input type="file" id="exam-file" ref={fileInputRef} /></div><div className="flex gap-sm"><button className="btn btn-ghost" onClick={() => setShowAddExamModal(false)}>Cancel</button><button className="btn btn-primary" onClick={async () => { const file = fileInputRef.current?.files?.[0]; const tempId = Date.now(); const exam: HealthExam = { id: tempId, name: (document.getElementById('exam-name') as HTMLInputElement).value, category: (document.getElementById('exam-cat') as HTMLSelectElement).value, date: (document.getElementById('exam-date') as HTMLInputElement).value, file: file ? URL.createObjectURL(file) : '' }; setHealthExams(p => [...p, exam]); const dbRecord = await dbInsert('health_exams', examToDb(exam)); if (dbRecord?.id) setHealthExams(p => p.map(e => e.id === tempId ? { ...e, id: dbRecord.id } : e)); setShowAddExamModal(false); toast('Added', 'success') }}><Icon name="check" size="sm" /> Save</button></div></div></div>}
      {showCategoryModal && <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="flex-between mb-md"><div className="text-lg font-bold">Exam Categories</div><button className="btn btn-ghost btn-xs" onClick={() => setShowCategoryModal(false)}><Icon name="close" /></button></div><div className="flex gap-sm mb-md"><input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New category" /><button className="btn btn-primary btn-sm" onClick={() => { if (newCategory.trim()) { setExamCategories(p => [...p, newCategory.trim()]); setNewCategory(''); toast('Added', 'success') } }}><Icon name="plus" size="sm" /></button></div>{examCategories.map(c => <div key={c} className="flex-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}><span>{c}</span><button className="btn btn-ghost btn-xs" onClick={() => { setExamCategories(p => p.filter(x => x !== c)); toast('Removed', 'success') }}><Icon name="trash" size="sm" /></button></div>)}</div></div>}
      {showDiaryModal && <div className="modal-overlay" onClick={() => setShowDiaryModal(false)}><div className="modal" onClick={e => e.stopPropagation()}><div className="flex-between mb-md"><div className="text-lg font-bold">New Entry</div><button className="btn btn-ghost btn-xs" onClick={() => setShowDiaryModal(false)}><Icon name="close" /></button></div><div className="grid-2 mb-sm" style={{ gap: '10px' }}><input type="date" defaultValue={todayStr} id="diary-date" /><select id="diary-mood"><option value="great"> Great</option><option value="good"> Good</option><option value="neutral"> Neutral</option><option value="bad"> Bad</option></select></div><div className="mb-sm"><textarea value={diaryText} onChange={e => setDiaryText(e.target.value)} placeholder="Write..." style={{ minHeight: '150px' }} /></div><div className="flex gap-sm"><button className="btn btn-ghost" onClick={() => setShowDiaryModal(false)}>Cancel</button><button className="btn btn-primary" onClick={async () => { const tempId = Date.now(); const entry: DiaryEntry = { id: tempId, date: (document.getElementById('diary-date') as HTMLInputElement).value, content: diaryText, mood: (document.getElementById('diary-mood') as HTMLSelectElement).value, aiAnalysis: '' }; setDiaryEntries(p => [...p, entry]); const dbRecord = await dbInsert('diary_entries', diaryToDb(entry)); if (dbRecord?.id) setDiaryEntries(p => p.map(d => d.id === tempId ? { ...d, id: dbRecord.id } : d)); setDiaryText(''); setShowDiaryModal(false); toast('Saved', 'success') }}><Icon name="check" size="sm" /> Save</button></div></div></div>}
      {futureSelf.isOpen && <div className="modal-overlay" onClick={() => setFutureSelf(p => ({...p, isOpen: false}))}><div className="modal" onClick={e => e.stopPropagation()} style={{ background: 'linear-gradient(145deg, rgba(139,92,246,0.1), rgba(5,5,10,0.98))' }}><div className="flex-between mb-md"><div className="flex items-center gap-sm"><div className="icon-box"><Icon name="brain" /></div><div className="text-lg font-bold">Future Self - 2026</div></div><button className="btn btn-ghost btn-xs" onClick={() => setFutureSelf(p => ({...p, isOpen: false}))}><Icon name="close" /></button></div><div style={{ maxHeight: '300px', overflow: 'auto', marginBottom: '16px' }}>{futureSelf.messages.map((m, i) => <div key={i} className={`mb-sm ${m.from === 'future' ? 'ai-box' : ''}`} style={{ padding: '12px', borderRadius: '12px', background: m.from === 'user' ? 'var(--bg-hover)' : undefined, marginLeft: m.from === 'user' ? '40px' : '0', marginRight: m.from === 'future' ? '40px' : '0' }}><div className="text-xs text-muted mb-xs">{m.from === 'future' ? 'Tu (2026)' : 'Tu (oggi)'}</div><div className="text-sm">{m.text}</div></div>)}{futureSelfLoading && <div className="ai-box mb-sm" style={{ padding: '12px', borderRadius: '12px' }}><div className="text-xs text-muted" style={{ animation: 'pulse 1.5s infinite' }}>Il tuo futuro sta pensando...</div></div>}</div><div className="flex gap-sm"><input value={futureSelf.input} onChange={e => setFutureSelf(p => ({...p, input: e.target.value}))} placeholder="Parla con il tuo future self..." disabled={futureSelfLoading} onKeyDown={e => { if (e.key === 'Enter') sendToFutureSelf(futureSelf.input) }} /><button className="btn btn-primary" disabled={futureSelfLoading} onClick={() => sendToFutureSelf(futureSelf.input)}><Icon name="check" size="sm" /></button></div></div></div>}
      
      {/* Habit Edit Modal */}
      {showHabitEditModal && editingHabit && <div className="modal-overlay" onClick={() => { setShowHabitEditModal(false); setEditingHabit(null) }}><div className="modal" onClick={e => e.stopPropagation()}>
        <div className="flex-between mb-md"><div className="text-lg font-bold">Modifica Habit</div><button className="btn btn-ghost btn-xs" onClick={() => { setShowHabitEditModal(false); setEditingHabit(null) }}><Icon name="close" /></button></div>
        <div className="mb-md"><label className="text-xs text-muted mb-xs" style={{ display: 'block' }}>Nome</label><input value={editingHabit.name} onChange={e => setEditingHabit({...editingHabit, name: e.target.value})} /></div>
        <div className="mb-md"><label className="text-xs text-muted mb-xs" style={{ display: 'block' }}>Icona</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>{habitIcons.map(ic => (
            <div key={ic} onClick={() => setEditingHabit({...editingHabit, icon: ic})} style={{ padding: '10px', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', background: editingHabit.icon === ic ? 'var(--accent)' : 'var(--bg-hover)', color: editingHabit.icon === ic ? 'white' : 'var(--text)', transition: 'all 0.2s' }}>
              <Icon name={ic} size="sm" />
              <div className="text-xs mt-xs" style={{ fontSize: '9px' }}>{ic}</div>
            </div>
          ))}</div>
        </div>
        <div className="mb-md"><label className="text-xs text-muted mb-xs" style={{ display: 'block' }}>Colore</label>
          <div className="flex gap-sm flex-wrap">{['#8b5cf6', '#22c55e', '#3b82f6', '#f97316', '#ef4444', '#06b6d4', '#ec4899', '#eab308', '#a855f7', '#14b8a6'].map(c => (
            <div key={c} onClick={() => setEditingHabit({...editingHabit, color: c})} style={{ width: '32px', height: '32px', borderRadius: '50%', background: c, cursor: 'pointer', border: editingHabit.color === c ? '3px solid white' : '3px solid transparent', transition: 'all 0.2s' }} />
          ))}</div>
        </div>
        <div className="mb-md" style={{ padding: '12px', background: 'var(--bg-hover)', borderRadius: '10px' }}>
          <div className="flex items-center gap-sm">
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: editingHabit.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={editingHabit.icon} size="sm" color={editingHabit.color} /></div>
            <div><div className="font-semibold">{editingHabit.name}</div><div className="text-xs text-muted">Streak: {editingHabit.streak} days</div></div>
          </div>
        </div>
        <div className="flex gap-sm">
          <button className="btn btn-danger btn-sm" onClick={() => deleteHabit(editingHabit.id)}><Icon name="trash" size="sm" /> Elimina</button>
          <div style={{ flex: 1 }} />
          <button className="btn btn-ghost btn-sm" onClick={() => { setShowHabitEditModal(false); setEditingHabit(null) }}>Annulla</button>
          <button className="btn btn-primary btn-sm" onClick={() => saveHabit(editingHabit)}><Icon name="check" size="sm" /> Salva</button>
        </div>
      </div></div>}

      {/* === DEEP WORK MODE MODAL === */}
      {showDeepWorkModal && <div className="modal-overlay" onClick={() => setShowDeepWorkModal(false)}><div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ background: 'linear-gradient(145deg, rgba(139,92,246,0.1), rgba(5,5,10,0.98))' }}>
        <div className="flex-between mb-md">
          <div className="flex items-center gap-sm">
            <div className="icon-box"><Icon name="bolt" /></div>
            <div className="text-lg font-bold">Deep Work Mode</div>
            <span className="tag tag-accent text-xs">Koe + Doris Protocol</span>
          </div>
          <button className="btn btn-ghost btn-xs" onClick={() => setShowDeepWorkModal(false)}><Icon name="close" /></button>
        </div>
        
        {/* Flow Score Overview */}
        <div className="ai-box mb-md" style={{ padding: '16px' }}>
          <div className="flex-between mb-sm">
            <div>
              <div className="text-xs text-muted mb-xs">FLOW READINESS</div>
              <div style={{ fontSize: '32px', fontWeight: 700, color: deepWork.flowScore >= 70 ? 'var(--green)' : deepWork.flowScore >= 40 ? 'var(--accent)' : 'var(--red)' }}>{deepWork.flowScore}<span className="text-sm text-muted">/100</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="text-xs text-muted mb-xs">OPTIMAL TIME</div>
              <div className="text-lg font-bold">{deepWork.optimalTime}</div>
              <div className="text-xs text-muted">{healthSource === 'live' ? 'Based on HRV' : 'Default'}</div>
            </div>
          </div>
          <div className="flex gap-md text-center text-xs">
            <div style={{ flex: 1, padding: '10px', background: 'var(--bg)', borderRadius: '8px' }}>
              <div className="text-muted">HRV</div>
              <div className="font-bold">{health.hrv}ms</div>
            </div>
            <div style={{ flex: 1, padding: '10px', background: 'var(--bg)', borderRadius: '8px' }}>
              <div className="text-muted">Sleep</div>
              <div className="font-bold">{health.sleep}%</div>
            </div>
            <div style={{ flex: 1, padding: '10px', background: 'var(--bg)', borderRadius: '8px' }}>
              <div className="text-muted">Stress</div>
              <div className="font-bold">{health.stress}%</div>
            </div>
            <div style={{ flex: 1, padding: '10px', background: 'var(--bg)', borderRadius: '8px' }}>
              <div className="text-muted">Readiness</div>
              <div className="font-bold">{health.readiness}%</div>
            </div>
          </div>
        </div>
        
        {/* Protocol Explanation */}
        <div className="mb-md" style={{ padding: '14px', background: 'var(--bg-hover)', borderRadius: '10px' }}>
          <div className="text-sm font-semibold mb-sm flex items-center gap-xs"><Icon name="brain" size="sm" /> The Flow Cycle (Doris)</div>
          <div className="flex gap-sm text-xs mb-sm">
            <div style={{ flex: 1, padding: '8px', background: 'rgba(139,92,246,0.15)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--accent)' }}>
              <div style={{ marginBottom: '4px' }}><Icon name="bolt" size="lg" color="var(--accent)" /></div>
              <div className="font-bold">BUILD</div>
              <div className="text-muted">Deep focus</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>→</div>
            <div style={{ flex: 1, padding: '8px', background: 'rgba(34,197,94,0.1)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--green)' }}>
              <div style={{ marginBottom: '4px' }}><Icon name="recover" size="lg" color="var(--green)" /></div>
              <div className="font-bold">RECOVERY</div>
              <div className="text-muted">Boring break</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>→</div>
            <div style={{ flex: 1, padding: '8px', background: 'rgba(59,130,246,0.1)', borderRadius: '6px', textAlign: 'center', border: '1px solid var(--blue)' }}>
              <div style={{ marginBottom: '4px' }}><Icon name="walk" size="lg" color="var(--blue)" /></div>
              <div className="font-bold">CREATIVE</div>
              <div className="text-muted">Walk/Think</div>
            </div>
          </div>
          <div className="text-xs text-muted">
            <strong>Key insight:</strong> Boring breaks (no screens, no stimuli) allow the Default Mode Network to process and integrate. Creative blocks use gentle movement to trigger insight.
          </div>
        </div>
        
        {/* Session Configuration */}
        <div className="mb-md">
          <div className="text-sm font-semibold mb-sm flex items-center gap-xs"><Icon name="settings" size="sm" /> Session Config</div>
          <div className="grid-3" style={{ gap: '12px' }}>
            <div>
              <label className="text-xs text-muted">Build Block</label>
              <select value={deepWorkConfig.buildDuration} onChange={e => setDeepWorkConfig(p => ({...p, buildDuration: Number(e.target.value)}))}>
                <option value={25}>25 min</option>
                <option value={50}>50 min</option>
                <option value={75}>75 min</option>
                <option value={90}>90 min</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted">Creative Block</label>
              <select value={deepWorkConfig.creativeDuration} onChange={e => setDeepWorkConfig(p => ({...p, creativeDuration: Number(e.target.value)}))}>
                <option value={10}>10 min</option>
                <option value={15}>15 min</option>
                <option value={20}>20 min</option>
                <option value={30}>30 min</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted">Recovery Break</label>
              <select value={deepWorkConfig.recoveryDuration} onChange={e => setDeepWorkConfig(p => ({...p, recoveryDuration: Number(e.target.value)}))}>
                <option value={5}>5 min</option>
                <option value={10}>10 min</option>
                <option value={15}>15 min</option>
              </select>
            </div>
          </div>
          <div className="flex-between mt-sm">
            <label className="flex items-center gap-sm text-sm">
              <input type="checkbox" checked={deepWorkConfig.autoAdvance} onChange={e => setDeepWorkConfig(p => ({...p, autoAdvance: e.target.checked}))} />
              Auto-advance blocks
            </label>
            <div className="text-xs text-muted">
              Blocks/session: <input type="number" min={1} max={6} value={deepWorkConfig.blocksPerSession} onChange={e => setDeepWorkConfig(p => ({...p, blocksPerSession: Number(e.target.value)}))} style={{ width: '50px', textAlign: 'center' }} />
            </div>
          </div>
        </div>
        
        {/* Today's Stats */}
        <div className="mb-md" style={{ padding: '14px', background: 'var(--bg-hover)', borderRadius: '10px' }}>
          <div className="text-sm font-semibold mb-sm flex items-center gap-xs"><Icon name="insights" size="sm" /> Today's Deep Work</div>
          <div className="flex gap-md text-center">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>{deepWork.totalDeepMinutes}</div>
              <div className="text-xs text-muted">minutes</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{deepWork.sessionsToday}</div>
              <div className="text-xs text-muted">sessions</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--green)' }}>{deepWork.weeklyMinutes}</div>
              <div className="text-xs text-muted">weekly mins</div>
            </div>
          </div>
        </div>
        
        {/* Correlation Insights */}
        <div className="mb-md" style={{ padding: '14px', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), transparent)', borderRadius: '10px', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div className="text-sm font-semibold mb-sm">🔮 Performance Correlations</div>
          <div className="text-xs space-y-1">
            <div className="flex-between"><span>Flow Score 70+ → Trading Win Rate</span><span className="font-bold text-green">+23%</span></div>
            <div className="flex-between"><span>50+ min deep work before trading</span><span className="font-bold text-green">+18% better entries</span></div>
            <div className="flex-between"><span>No boring breaks → cognitive fatigue</span><span className="font-bold text-red">-15% focus by 2pm</span></div>
          </div>
        </div>
        
        {/* Start Buttons */}
        <div className="flex gap-sm">
          <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { startDeepWorkSession('build'); setShowDeepWorkModal(false) }}>
            <Icon name="bolt" size="sm" /> Start Build Block
          </button>
          <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { startDeepWorkSession('creative'); setShowDeepWorkModal(false) }}>
            <Icon name="walking" size="sm" /> Start Creative Walk
          </button>
        </div>
      </div></div>}

            {showContentImporter && <div className="modal-overlay" onClick={() => { setShowContentImporter(false); setContentAnalysis(null); setContentUrl('') }}><div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ background: 'linear-gradient(145deg, rgba(139,92,246,0.1), rgba(5,5,10,0.98))' }}>
        <div className="flex-between mb-md"><div className="flex items-center gap-sm"><div className="icon-box"><Icon name="brain" /></div><div className="text-lg font-bold">AI Content Importer</div></div><button className="btn btn-ghost btn-xs" onClick={() => { setShowContentImporter(false); setContentAnalysis(null); setContentUrl('') }}><Icon name="close" /></button></div>
        <div className="ai-box mb-md" style={{ padding: '12px' }}><div className="text-sm">Paste a URL or content and Claude will analyze it to integrate into THETA (Resources, Neuro, Trading, etc.)</div></div>
        <div className="mb-md"><label className="text-xs text-muted">URL or Content</label><textarea value={contentUrl} onChange={e => setContentUrl(e.target.value)} placeholder="https://x.com/thedankoe/status/123... or paste text directly" style={{ minHeight: '100px' }} /></div>
        {!contentAnalysis && <button className={`btn btn-primary w-full ${contentAnalyzing ? 'opacity-50' : ''}`} disabled={contentAnalyzing || !contentUrl.trim()} onClick={async () => {
          setContentAnalyzing(true)
          try {
            const res = await fetch('/api/claude', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ messages: [{ role: 'user', content: `Analyze this content and suggest how to integrate it into my system THETA (a traders app with sections: Resources/documents, Neuro/meditation-focus, Trading/journal, Biohacking/habits, Tasks/projects). Reply ONLY with valid JSON in this format: {"summary": "brief summary", "actions": [{"section": "resources|neuro|trading|biohacking|tasks", "suggestion": "what to add/modify", "data": "specific content"}]}. Content to analyze: ${contentUrl}` }] })
            })
            const data = await res.json()
            try {
              const parsed = JSON.parse(data.content.replace(/```json|```/g, '').trim())
              setContentAnalysis(parsed)
            } catch { setContentAnalysis({ summary: data.content || 'Error.parsing', actions: [] }) }
          } catch (e) { toast('Error.analisi', 'error') }
          setContentAnalyzing(false)
        }}>{contentAnalyzing ? 'Analyzing...' : 'Analyze with Claude'}</button>}
        {contentAnalysis && <div>
          <div className="glass card mb-md" style={{ padding: '16px' }}><div className="text-xs text-muted mb-xs">Riepilogo</div><div className="text-sm">{contentAnalysis.summary}</div></div>
          {contentAnalysis.actions && contentAnalysis.actions.length > 0 && <div className="text-xs text-muted mb-sm">Integrazioni suggerite:</div>}
          {contentAnalysis.actions?.map((action, i) => (
            <div key={i} className="glass card mb-sm" style={{ padding: '12px' }}>
              <div className="flex-between mb-xs"><span className="tag tag-accent">{action.section}</span><button className="btn btn-primary btn-xs" onClick={async () => {
                if (action.section === 'resources') {
                  setResources(p => [...p, { 
                    id: Date.now(), 
                    name: `Imported: ${contentAnalysis.summary?.slice(0, 30)}...`,
                    notes: action.data || action.suggestion,
                    link: contentUrl || '',
                    fileName: '', fileData: '',
                    category: 'Notes',
                    createdAt: new Date().toISOString()
                  }])
                } else if (action.section === 'neuro') {
                  setNeuroSoundscape(p => ({...p, adaptiveReason: action.suggestion}))
                } else if (action.section === 'tasks') {
                  setTasks(p => [...p, { id: Date.now(), title: action.suggestion, urgent: false, important: true, deadline: '', projectId: null, completed: false, order: p.length }])
                } else if (action.section === 'biohacking') {
                  toast(`Biohacking: ${action.suggestion}`, 'success')
                }
                toast(`Aggiunto a ${action.section}!`, 'success')
              }}>Applica</button></div>
              <div className="text-sm">{action.suggestion}</div>
            </div>
          ))}
          <button className="btn btn-ghost w-full mt-md" onClick={() => { setContentAnalysis(null); setContentUrl('') }}>Analyze another</button>
        </div>}
      </div></div>}

      {/* === FLOATING CLAUDE AI WIDGET === */}
      {mounted && <div ref={claudeWidgetRef} style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
        {/* Expanded Chat Panel */}
        {claudeWidgetOpen && <div style={{ 
          position: 'absolute', bottom: '70px', right: '0', width: '380px', maxHeight: '520px',
          background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, rgba(139,92,246,0.1), transparent)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="ai" size="sm" /></div>
              <div><div style={{ fontWeight: 700, fontSize: '14px' }}>Claude AI</div><div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Monitoring: {navLabels[section]?.label || section}</div></div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button className="btn btn-ghost btn-xs" onClick={() => { setClaudeMessages([]); toast('Chat cleared', 'info') }}><Icon name="trash" size="sm" /></button>
              <button className="btn btn-ghost btn-xs" onClick={() => setClaudeWidgetOpen(false)}><Icon name="close" size="sm" /></button>
            </div>
          </div>
          
          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: '14px', minHeight: '280px', maxHeight: '350px' }}>
            {claudeMessages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>I'm always here, watching your data across all tabs. Ask me anything.</div>
                <div style={{ display: 'grid', gap: '6px' }}>
                  {[
                    section === 'trading' ? 'Analyze my recent trades' : section === 'biohacking' ? 'How is my health today?' : section === 'finance' ? 'Summarize my finances' : 'What should I focus on?',
                    'Give me a performance overview',
                    'Suggest improvements'
                  ].map(s => (
                    <button key={s} className="btn btn-ghost btn-xs" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => setClaudeInput(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {claudeMessages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
                <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: '14px', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-wrap', background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-hover)', color: m.role === 'user' ? '#000' : 'var(--text)' }}>
                  {m.content}
                </div>
              </div>
            ))}
            {claudeLoading && <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', fontSize: '12px', color: 'var(--text-muted)' }}><Icon name="ai" size="sm" /> Thinking...</div>}
          </div>
          
          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={claudeInput} onChange={e => setClaudeInput(e.target.value)} placeholder="Ask Claude..." style={{ flex: 1, fontSize: '13px', padding: '8px 12px' }} onKeyDown={async e => { 
                if (e.key === 'Enter' && claudeInput.trim() && !claudeLoading) { 
                  const msg = claudeInput; 
                  setClaudeMessages(p => [...p, { role: 'user', content: msg }]); 
                  setClaudeInput(''); 
                  setClaudeLoading(true); 
                  try { 
                    const context = `THETA Context (current tab: ${section}):\n- Health: HRV ${health.hrv || '?'}ms, Sleep ${health.sleep}%, Readiness ${health.readiness}%, Stress ${health.stress}%\n- Trading: ${trades.length} trades, Today P&L: $${todayPnl}, Win Rate: ${winRate}%\n- Backtest: ${backtestTrades.length} trades\n- Habits done: ${habits.filter(h => h.done).length}/${habits.length}\n- Tasks: ${tasks.filter(t => !t.completed).length} pending\n- Transactions: ${transactions.length} recorded\n- OURA data loaded: ${ouraReport ? 'yes' : 'no'}`;
                    const res = await fetch('/api/claude', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ messages: [...claudeMessages, { role: 'user', content: msg }], system: `You are Claude, the omnipresent AI assistant in THETA dashboard. You monitor all user data in real-time. You are concise, direct, and action-oriented. Context:\n${context}\n\nReply helpfully. Keep answers short unless asked for detail. Use the user's language.` }) }); 
                    const data = await res.json(); 
                    setClaudeMessages(p => [...p, { role: 'assistant', content: data.content || 'Error.' }]) 
                  } catch { setClaudeMessages(p => [...p, { role: 'assistant', content: 'Connection error.' }]) } 
                  setClaudeLoading(false) 
                }
              }} />
              <button className="btn btn-primary" style={{ padding: '8px 12px', minWidth: 'auto' }} disabled={claudeLoading || !claudeInput.trim()} onClick={async () => { 
                if (claudeInput.trim() && !claudeLoading) { 
                  const msg = claudeInput; setClaudeMessages(p => [...p, { role: 'user', content: msg }]); setClaudeInput(''); setClaudeLoading(true); 
                  try { 
                    const context = `THETA (tab: ${section}): HRV ${health.hrv || '?'}ms, Sleep ${health.sleep}%, Trades ${trades.length}, P&L $${todayPnl}, WR ${winRate}%`;
                    const res = await fetch('/api/claude', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ messages: [...claudeMessages, { role: 'user', content: msg }], system: `You are Claude in THETA. Context:\n${context}\n\nReply concisely.` }) }); 
                    const data = await res.json(); 
                    setClaudeMessages(p => [...p, { role: 'assistant', content: data.content || 'Error.' }]) 
                  } catch { setClaudeMessages(p => [...p, { role: 'assistant', content: 'Error.' }]) } 
                  setClaudeLoading(false) 
                }
              }}><Icon name="send" size="sm" /></button>
            </div>
          </div>
        </div>}
        
        {/* Floating Button */}
        <button onClick={() => setClaudeWidgetOpen(p => !p)} style={{
          width: '56px', height: '56px', borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: claudeWidgetOpen ? 'var(--text-muted)' : 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(139,92,246,0.4)', transition: 'all 0.3s ease',
          transform: claudeWidgetOpen ? 'rotate(45deg)' : 'none'
        }}>
          {claudeWidgetOpen ? <Icon name="plus" /> : <Icon name="ai" />}
        </button>
      </div>}
      </div>
    </div>
  )
}
