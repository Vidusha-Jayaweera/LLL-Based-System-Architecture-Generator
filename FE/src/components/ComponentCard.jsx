// Color map for component types
const TYPE_COLORS = {
  service:     'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  database:    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  frontend:    'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  backend:     'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  gateway:     'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  cache:       'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  queue:       'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  storage:     'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  auth:        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  default:     'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

// Icon map for component types
const TYPE_ICONS = {
  service:  '⚙️',
  database: '🗄️',
  frontend: '🖥️',
  backend:  '🔧',
  gateway:  '🚪',
  cache:    '⚡',
  queue:    '📨',
  storage:  '📦',
  auth:     '🔐',
  default:  '🔷',
};

const getTypeKey = (type = '') => {
  const t = type.toLowerCase();
  return Object.keys(TYPE_COLORS).find(k => t.includes(k)) || 'default';
};

const ComponentCard = ({ component, index }) => {
  const typeKey = getTypeKey(component.type);
  const colorClass = TYPE_COLORS[typeKey];
  const icon = TYPE_ICONS[typeKey];

  return (
    <div
      className="card card-hover animate-slide-up group"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
            {component.name || 'Unnamed Component'}
          </h3>
        </div>
        <span className={`badge ${colorClass} ml-2 shrink-0`}>
          {component.type || 'Component'}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {component.description || 'No description provided.'}
      </p>

      {/* Bottom accent line */}
      <div className={`mt-4 h-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  );
};

export default ComponentCard;
