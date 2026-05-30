'use client';

interface DeleteProductBtnProps {
  productId: number;
  deleteAction: (id: number) => Promise<void>;
}

export default function DeleteProductBtn({ productId, deleteAction }: DeleteProductBtnProps) {
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm('คุณแน่ใจว่าต้องการลบสินค้านี้?')) {
      await deleteAction(productId);
    }
  };

  return (
    <form onSubmit={handleDelete}>
      <button 
        type="submit" 
        style={{ 
          padding: '6px 12px', 
          background: '#ef4444', 
          border: 'none', 
          color: 'white', 
          borderRadius: '4px', 
          fontSize: '13px', 
          cursor: 'pointer' 
        }}
      >
        ลบ
      </button>
    </form>
  );
}
