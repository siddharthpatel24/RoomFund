import React, { useState } from 'react';
import { Card } from './Card';
import { formatDate, generateId } from '../utils/helpers';
import { Plus, Trophy, CheckCircle, Clock, User } from 'lucide-react';
import type { Chore, Roommate } from '../types';

interface ChoreTrackerProps {
  chores: Chore[];
  roommates: Roommate[];
  onAddChore: (chore: Omit<Chore, 'id'>) => void;
  onCompleteChore: (id: string) => void;
  onDeleteChore: (id: string) => void;
}

const choreEmojis = ['🥛', '🧹', '🗑️', '🧽', '🍽️', '🛒', '💡', '🚿'];
const choreTemplates = [
  { title: 'Buy Milk', emoji: '🥛', points: 5 },
  { title: 'Clean Living Room', emoji: '🧹', points: 10 },
  { title: 'Take Out Trash', emoji: '🗑️', points: 5 },
  { title: 'Clean Kitchen', emoji: '🧽', points: 15 },
  { title: 'Wash Dishes', emoji: '🍽️', points: 8 },
  { title: 'Grocery Shopping', emoji: '🛒', points: 12 },
  { title: 'Pay Utility Bills', emoji: '💡', points: 10 },
  { title: 'Clean Bathroom', emoji: '🚿', points: 15 },
];

export const ChoreTracker: React.FC<ChoreTrackerProps> = ({
  chores,
  roommates,
  onAddChore,
  onCompleteChore,
  onDeleteChore,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChore, setNewChore] = useState({
    title: '',
    assignedTo: '',
    dueDate: '',
    emoji: '🧹',
    points: 5,
  });

  const activeChores = chores.filter(chore => !chore.completed);
  const completedChores = chores.filter(chore => chore.completed);

  const leaderboard = roommates
    .map(roommate => ({
      ...roommate,
      chorePoints: chores
        .filter(chore => chore.assignedTo === roommate.name && chore.completed)
        .reduce((sum, chore) => sum + chore.points, 0)
    }))
    .sort((a, b) => b.chorePoints - a.chorePoints);

  const handleAddChore = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChore.title && newChore.assignedTo && newChore.dueDate) {
      onAddChore({
        ...newChore,
        completed: false,
      });
      setNewChore({
        title: '',
        assignedTo: '',
        dueDate: '',
        emoji: '🧹',
        points: 5,
      });
      setShowAddForm(false);
    }
  };

  const useTemplate = (template: typeof choreTemplates[0]) => {
    setNewChore(prev => ({
      ...prev,
      title: template.title,
      emoji: template.emoji,
      points: template.points,
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Chore Tracker</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {activeChores.length} active chores • {completedChores.length} completed this month
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 
                   text-white rounded-xl font-medium hover:from-primary-600 hover:to-emerald-600 
                   transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Add Chore</span>
        </button>
      </div>

      {/* Leaderboard */}
      <Card glass className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="w-6 h-6 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Leaderboard</h3>
        </div>
        <div className="space-y-3">
          {leaderboard.map((roommate, index) => (
            <div key={roommate.id} className="flex items-center justify-between p-3 
                                            bg-gray-50 dark:bg-dark-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                               ${index === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                 index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                                 index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                  {index + 1}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{roommate.name}</span>
                {roommate.isAdmin && (
                  <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 
                                 dark:text-primary-300 rounded text-xs">Admin</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900 dark:text-white">{roommate.chorePoints}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">pts</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Chores */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Active Chores</h3>
        {activeChores.length === 0 ? (
          <Card glass className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">All caught up!</h3>
            <p className="text-gray-600 dark:text-gray-400">No active chores at the moment.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeChores.map((chore) => (
              <Card key={chore.id} glass hover className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl">{chore.emoji}</div>
                  <div className="flex items-center space-x-1 text-sm text-amber-600 dark:text-amber-400">
                    <Trophy className="w-4 h-4" />
                    <span>{chore.points} pts</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{chore.title}</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{chore.assignedTo}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Due {formatDate(chore.dueDate)}</span>
                  </div>
                </div>
                <button
                  onClick={() => onCompleteChore(chore.id)}
                  className="w-full bg-primary-500 text-white py-2 rounded-lg font-medium
                           hover:bg-primary-600 transition-colors duration-200"
                >
                  Mark Complete
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Completions */}
      {completedChores.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recently Completed</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedChores.slice(-6).map((chore) => (
              <Card key={chore.id} glass className="p-6 opacity-75">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl">{chore.emoji}</div>
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">{chore.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed by {chore.assignedTo}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Chore Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Chore</h3>
            
            {/* Quick Templates */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Add:</p>
              <div className="grid grid-cols-2 gap-2">
                {choreTemplates.map((template) => (
                  <button
                    key={template.title}
                    onClick={() => useTemplate(template)}
                    className="flex items-center space-x-2 p-2 text-left bg-gray-50 dark:bg-dark-700 
                             rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors duration-200"
                  >
                    <span className="text-lg">{template.emoji}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{template.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{template.points} pts</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddChore} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chore Title
                </label>
                <input
                  type="text"
                  value={newChore.title}
                  onChange={(e) => setNewChore(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 
                           rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                  placeholder="Enter chore description"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Emoji
                  </label>
                  <select
                    value={newChore.emoji}
                    onChange={(e) => setNewChore(prev => ({ ...prev, emoji: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 
                             rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                  >
                    {choreEmojis.map((emoji) => (
                      <option key={emoji} value={emoji}>{emoji}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newChore.points}
                    onChange={(e) => setNewChore(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 
                             rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assign to
                </label>
                <select
                  value={newChore.assignedTo}
                  onChange={(e) => setNewChore(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 
                           rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select roommate</option>
                  {roommates.map((roommate) => (
                    <option key={roommate.id} value={roommate.name}>
                      {roommate.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={newChore.dueDate}
                  onChange={(e) => setNewChore(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-dark-600 
                           rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-3 rounded-xl font-medium
                           hover:bg-primary-600 transition-colors duration-200"
                >
                  Add Chore
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 dark:bg-dark-600 text-gray-700 dark:text-gray-300 
                           py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-dark-500
                           transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};