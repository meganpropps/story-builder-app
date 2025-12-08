import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Calculate node position for auto-layout
 */
export function calculateNodePosition(
  existingNodes: Array<{ position: { x: number; y: number } }>,
  index: number
): { x: number; y: number } {
  const gridSize = 300;
  const nodesPerRow = 3;
  
  if (existingNodes.length === 0) {
    return { x: 250, y: 100 };
  }
  
  const row = Math.floor(index / nodesPerRow);
  const col = index % nodesPerRow;
  
  return {
    x: 100 + col * gridSize,
    y: 100 + row * (gridSize + 50),
  };
}

/**
 * Validate choice text
 */
export function validateChoiceText(text: string): boolean {
  return text.trim().length > 0 && text.length <= 100;
}

/**
 * Export story as JSON file
 */
export function downloadStoryJSON(story: any, filename: string): void {
  const dataStr = JSON.stringify(story, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileDefaultName = `${filename}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

/**
 * Generate random pastel color for nodes
 */
export function generatePastelColor(): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 85%)`;
}

/**
 * Check if point is inside rectangle
 */
export function isPointInRect(
  point: { x: number; y: number },
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * Evaluate condition for branching logic
 */
export function evaluateCondition(
  condition: { variable: string; operator: string; value: any },
  variables: Record<string, any>
): boolean {
  const varValue = variables[condition.variable];
  const condValue = condition.value;
  
  switch (condition.operator) {
    case '==':
      return varValue == condValue;
    case '!=':
      return varValue != condValue;
    case '>':
      return varValue > condValue;
    case '<':
      return varValue < condValue;
    case '>=':
      return varValue >= condValue;
    case '<=':
      return varValue <= condValue;
    default:
      return true;
  }
}