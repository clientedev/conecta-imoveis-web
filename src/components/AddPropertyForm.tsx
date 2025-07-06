
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MultiImageUpload } from '@/components/MultiImageUpload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddPropertyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddPropertyForm = ({ onSuccess, onCancel }: AddPropertyFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    property_type: '',
    featured: false
  });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Inserir propriedade
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          price: Number(formData.price),
          bedrooms: formData.bedrooms ? Number(formData.bedrooms) : null,
          bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
          area: formData.area || null,
          property_type: formData.property_type || null,
          featured: formData.featured,
          image_url: images[0] || null,
          is_available: true
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Inserir imagens adicionais
      if (images.length > 0 && property) {
        const imageInserts = images.map((imageUrl, index) => ({
          property_id: property.id,
          image_url: imageUrl,
          image_order: index
        }));

        const { error: imagesError } = await supabase
          .from('property_images')
          .insert(imageInserts);

        if (imagesError) {
          console.error('Erro ao inserir imagens:', imagesError);
        }
      }

      toast({
        title: "Sucesso",
        description: "Imóvel adicionado com sucesso!",
      });

      onSuccess();
    } catch (error) {
      console.error('Erro ao adicionar imóvel:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar imóvel. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Adicionar Novo Imóvel</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="property_type">Tipo de Imóvel</Label>
              <Select value={formData.property_type} onValueChange={(value) => handleInputChange('property_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Localização *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bedrooms">Quartos</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bathrooms">Banheiros</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="area">Área (m²)</Label>
              <Input
                id="area"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
            />
            <Label htmlFor="featured">Imóvel em destaque</Label>
          </div>

          <MultiImageUpload
            onImagesChange={setImages}
            maxImages={10}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adicionando...' : 'Adicionar Imóvel'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
