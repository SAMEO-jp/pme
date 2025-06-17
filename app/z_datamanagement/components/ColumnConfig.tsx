'use client';

import { useEffect, useState } from 'react';
import type { ColumnConfig } from '../lib/column_config';

export default function ColumnConfig() {
  const [columnConfigs, setColumnConfigs] = useState<ColumnConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColumnConfigs = async () => {
      try {
        const response = await fetch('/api/z_datamanagement/column_config');
        if (!response.ok) {
          throw new Error('Failed to fetch column configs');
        }
        const data = await response.json();
        setColumnConfigs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchColumnConfigs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Column Configurations</h1>
      {columnConfigs.map((config) => (
        <div key={config.tableName}>
          <h2>{config.tableName}</h2>
          <table>
            <thead>
              <tr>
                <th>Column Name</th>
                <th>Key</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {config.columns.map((column) => (
                <tr key={column.name}>
                  <td>{column.name}</td>
                  <td>{column.key}</td>
                  <td>{column.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
} 