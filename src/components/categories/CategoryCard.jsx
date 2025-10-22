import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { deleteCategory } from '@/lib/storage';

const CategoryCard = ({ category, onEdit, onUpdate }) => {
  const { toast } = useToast();

  const handleDelete = () => {
    deleteCategory(category.id);
    toast({
      title: "Catégorie supprimée",
      description: "La catégorie a été supprimée avec succès"
    });
    onUpdate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${category.color}20` }}
            >
              {category.icon}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
          <span className="font-semibold text-gray-900">{category.name}</span>
          <div 
            className="mt-2 h-1 rounded-full"
            style={{ backgroundColor: category.color }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryCard;