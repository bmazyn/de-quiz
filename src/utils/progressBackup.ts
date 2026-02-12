/**
 * Progress Backup Utility
 * Exports and imports QuickCard progress data from localStorage
 */

interface BackupData {
  schemaVersion: number;
  exportedAt: string;
  data: Record<string, string>;
}

/**
 * Checks if a key is QuickCard progress data
 */
function isQuickCardProgressKey(key: string): boolean {
  // Include all qc_* keys
  if (key.startsWith('qc_')) {
    return true;
  }
  
  // Include specific quickcard_* progress keys
  if (key === 'quickcard_mastered_sections') {
    return true;
  }
  
  // Include other quickcard_* keys that are clearly progress-related
  // (but exclude things like timekeeper, time-slots, etc.)
  if (key.startsWith('quickcard_') && !key.includes('timekeeper') && !key.includes('time-slots')) {
    return true;
  }
  
  return false;
}

/**
 * Exports all QuickCard progress data to a JSON file
 */
export function exportProgress(): void {
  const data: Record<string, string> = {};
  
  // Collect all QuickCard progress keys
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && isQuickCardProgressKey(key)) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        data[key] = value;
      }
    }
  }

  const backup: BackupData = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    data
  };

  // Create blob and download
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `quickcard-progress-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Imports QuickCard progress data from a JSON file
 * @param file - The JSON file to import
 */
export async function importProgress(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const backup: BackupData = JSON.parse(text);
        
        // Validate JSON structure
        if (!backup.schemaVersion || typeof backup.schemaVersion !== 'number') {
          alert('Invalid backup file: missing or invalid schemaVersion');
          reject(new Error('Invalid schemaVersion'));
          return;
        }
        
        if (!backup.data || typeof backup.data !== 'object' || Array.isArray(backup.data)) {
          alert('Invalid backup file: data must be an object');
          reject(new Error('Invalid data structure'));
          return;
        }

        // Count keys to import - include all QuickCard progress keys
        const keysToImport = Object.keys(backup.data).filter(key => isQuickCardProgressKey(key));
        if (keysToImport.length === 0) {
          alert('No QuickCard progress data found in backup file');
          reject(new Error('No data to import'));
          return;
        }

        // Show confirmation dialog
        const confirmed = window.confirm(
          `This will restore ${keysToImport.length} progress item(s) from ${backup.exportedAt}.\n\n` +
          'Your current progress will be overwritten.\n\n' +
          'Continue?'
        );

        if (!confirmed) {
          reject(new Error('Import cancelled by user'));
          return;
        }

        // Write each key/value to localStorage
        keysToImport.forEach(key => {
          localStorage.setItem(key, backup.data[key]);
        });

        // Show success message
        alert(`Progress imported successfully! (${keysToImport.length} items)\n\nReloading page...`);
        
        // Reload the page to refresh UI
        setTimeout(() => {
          window.location.reload();
        }, 100);
        
        resolve();
      } catch (error) {
        alert('Failed to import progress: Invalid JSON file');
        reject(error);
      }
    };

    reader.onerror = () => {
      alert('Failed to read file');
      reject(reader.error);
    };

    reader.readAsText(file);
  });
}
