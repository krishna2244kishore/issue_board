import React, { useState, useEffect } from 'react';
import { Issue, Priority, Status } from '../types';
import {
  getAllIssues,
  updateIssueStatus,
} from '../services/issueService';

interface IssueListProps {
  refreshTrigger: number;
}

export const IssueList: React.FC<IssueListProps> = ({ refreshTrigger }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdateError, setStatusUpdateError] = useState('');

  useEffect(() => {
    loadIssues();
  }, [refreshTrigger]);

  useEffect(() => {
    applyFilters();
  }, [issues, statusFilter, priorityFilter]);

  const loadIssues = async () => {
    setLoading(true);
    setError('');
    try {
      const allIssues = await getAllIssues();
      setIssues(allIssues);
    } catch (err: any) {
      setError(err.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      let filtered: Issue[];

      if (statusFilter === 'All' && priorityFilter === 'All') {
        filtered = issues;
      } else if (statusFilter !== 'All' && priorityFilter === 'All') {
        filtered = issues.filter((issue) => issue.status === statusFilter);
      } else if (statusFilter === 'All' && priorityFilter !== 'All') {
        filtered = issues.filter((issue) => issue.priority === priorityFilter);
      } else {
        filtered = issues.filter(
          (issue) => issue.status === statusFilter && issue.priority === priorityFilter
        );
      }

      // Sort by newest first (already sorted from getAllIssues, but ensure it)
      filtered.sort((a, b) => b.createdTime.getTime() - a.createdTime.getTime());
      setFilteredIssues(filtered);
    } catch (err: any) {
      setError(err.message || 'Failed to filter issues');
    }
  };

  const handleStatusChange = async (issueId: string, currentStatus: Status, newStatus: Status) => {
    setStatusUpdateError('');

    // Check if trying to move from Open to Done
    if (currentStatus === 'Open' && newStatus === 'Done') {
      setStatusUpdateError(
        'Cannot move issue directly from Open to Done. Please move it to "In Progress" first.'
      );
      setTimeout(() => setStatusUpdateError(''), 5000);
      return;
    }

    try {
      await updateIssueStatus(issueId, newStatus);
      await loadIssues();
    } catch (err: any) {
      setStatusUpdateError(err.message || 'Failed to update status');
      setTimeout(() => setStatusUpdateError(''), 5000);
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-purple-100 text-purple-800';
      case 'Done':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading issues...</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Issues</h2>
        <div className="flex space-x-4">
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mr-2">
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="All">All</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="priorityFilter"
              className="block text-sm font-medium text-gray-700 mr-2"
            >
              Filter by Priority:
            </label>
            <select
              id="priorityFilter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="All">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
      </div>

      {statusUpdateError && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
          {statusUpdateError}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {filteredIssues.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No issues found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue) => (
                <tr key={issue.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {issue.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(
                        issue.priority
                      )}`}
                    >
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {issue.assignedTo || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {issue.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {issue.createdTime.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={issue.status}
                      onChange={(e) =>
                        handleStatusChange(issue.id, issue.status, e.target.value as Status)
                      }
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-2 py-1 border"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

