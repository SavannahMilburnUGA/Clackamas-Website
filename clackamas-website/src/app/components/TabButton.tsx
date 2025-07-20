// TabButton.tsx: exports Tab Button component that controls temperature type displayed on map
import { useTransition } from 'react';

// Define TypeScript interface for Tab Button props
interface TabButtonProps {
    action: () => void;
    children: React.ReactNode;
    isActive: boolean;
} // TabButtonProps

// Return Tab Button component by destructuring Tab Button props
export default function TabButton({ action, children, isActive } : TabButtonProps) {
  const [isPending, startTransition] = useTransition();
  if (isActive)  {
    return <b className="flex-1 px-3 py-2 text-xs font-medium rounded transition-all duration-200 text-center bg-indigo-50 text-indigo-700 shadow-sm border border-gray-200">{children}</b>;
  }
  if (isPending) {
    return <b className="flex-1 px-3 py-2 text-xs font-medium rounded transition-all duration-200 text-center bg-white text-indigo-600 shadow-sm border border-gray-200">{children}</b>;
  }
  return (
    <button className="flex-1 px-3 py-2 text-xs font-medium rounded transition-all duration-200 text-center bg-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50" onClick={() => {
      startTransition(async () => {
        await action();
      });
    }}>
      {children}
    </button>
  );
} // TabButton