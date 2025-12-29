import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createIssue, findSimilarIssues } from '../services/issueService';
import { IssueFormData, Issue } from '../types';

interface CreateIssueProps {
  onIssueCreated: () => void;
}

export const CreateIssue: React.FC<CreateIssueProps> = ({ onIssueCreated }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<IssueFormData>({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    assignedTo: '',
  });
  const [similarIssues, setSimilarIssues] = useState<Issue[]>([]);
  const [showSimilarIssues, setShowSimilarIssues] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const checkSimilarIssues = async () => {
    if (formData.title.trim().length < 3) return;

    try {
      const similar = await findSimilarIssues(formData.title, formData.description);
      setSimilarIssues(similar);
      setShowSimilarIssues(similar.length > 0);
    } catch (err) {
      console.error('Error checking similar issues:', err);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    // Debounce similar issue check
    setTimeout(() => {
      checkSimilarIssues();
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      await createIssue(formData, currentUser.email || '');
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Open',
        assignedTo: '',
      });
      setSimilarIssues([]);
      setShowSimilarIssues(false);
      onIssueCreated();
    } catch (err: any) {
      setError(err.message || 'Failed to create issue');
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAnyway = () => {
    setShowSimilarIssues(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Create New Issue</h2>

      {showSimilarIssues && similarIssues.length > 0 && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Similar issues found ({similarIssues.length})
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p className="mb-2">
                  We found {similarIssues.length} similar issue(s). Please review them before
                  creating a new one:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {similarIssues.slice(0, 3).map((issue) => (
                    <li key={issue.id}>
                      <span className="font-medium">{issue.title}</span> -{' '}
                      <span className="text-xs">
                        {issue.status} | {issue.priority}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={handleContinueAnyway}
                  className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={handleTitleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority *
            </label>
            <select
              id="priority"
              name="priority"
              required
              value={formData.priority}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              id="status"
              name="status"
              required
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700">
            Assigned To
          </label>
          <input
            type="text"
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleInputChange}
            placeholder="Email or name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Issue'}
        </button>
      </form>
    </div>
  );
};

