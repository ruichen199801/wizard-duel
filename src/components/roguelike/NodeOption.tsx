interface NodeOptionProps {
  readonly title: string;
  readonly description: string;
  readonly imageUrl: string;
  readonly onClick: () => void;
}

export const NodeOption = ({
  title,
  description,
  imageUrl,
  onClick,
}: NodeOptionProps) => {
  return (
    <div
      className='card node-option border-0'
      style={{ width: '18rem', backgroundColor: 'rgba(217, 217, 217, 0.6)' }}
      onClick={onClick}
    >
      <div className='text-center py-3'>
        <h5 className='fw-bold'>{title}</h5>
      </div>
      <img
        src={imageUrl}
        className='card-img-top px-3'
        alt={title}
        style={{ objectFit: 'cover', height: '150px' }}
      />
      <div className='card-body' style={{ minHeight: '150px' }}>
        <p className='card-text'>{description}</p>
      </div>
    </div>
  );
};
