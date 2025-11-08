import { useDrag, useDrop } from 'react-dnd';
import Button from 'react-bootstrap/Button';

function DraggableSection({ 
  id, 
  index, 
  type, 
  moveItem, 
  children, 
  onRemove 
}) {
  const [{ isDragging }, drag] = useDrag({
    type: type,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`p-4 rounded mb-3 cursor-move transition-all border-2 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
      style={{ 
        borderLeft: '4px solid var(--color-primary)',
        borderColor: 'var(--color-border)',
        backgroundColor: isDragging 
          ? 'rgba(var(--color-primary-rgb, 102, 126, 234), 0.05)' 
          : 'var(--color-background)',
        color: 'var(--color-text)'
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div 
          className="flex items-center gap-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <i className="fa-solid fa-grip-vertical"></i>
          <span className="text-sm">Drag to reorder</span>
        </div>
        {onRemove && (
          <Button
            variant="danger"
            size="sm"
            onClick={onRemove}
            style={{
              background: 'linear-gradient(135deg, var(--color-error) 0%, #dc2626 100%)',
              border: 'none'
            }}
          >
            <i className="fa-solid fa-trash"></i> Remove
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

export default DraggableSection;

