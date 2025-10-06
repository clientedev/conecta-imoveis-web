import { useEffect, useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { GripVertical, UserCheck, UserX } from 'lucide-react';

interface Broker {
  id: number;
  brokerId: string;
  orderPosition: number;
  isActive: boolean;
  lastAssigned: string | null;
  totalLeadsAssigned: number;
  broker: {
    id: string;
    email: string;
    fullName: string | null;
    role: string;
  };
}

interface SortableItemProps {
  broker: Broker;
  onToggleActive: (brokerId: string, isActive: boolean) => void;
}

function SortableItem({ broker, onToggleActive }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: broker.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 bg-white border rounded-lg mb-2 ${
        !broker.isActive ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{broker.broker.fullName || broker.broker.email}</p>
          <p className="text-sm text-gray-500">
            Posição: {broker.orderPosition} | Leads: {broker.totalLeadsAssigned}
          </p>
        </div>
      </div>
      <Button
        variant={broker.isActive ? "outline" : "default"}
        size="sm"
        onClick={() => onToggleActive(broker.brokerId, !broker.isActive)}
      >
        {broker.isActive ? (
          <>
            <UserX className="h-4 w-4 mr-2" />
            Desativar
          </>
        ) : (
          <>
            <UserCheck className="h-4 w-4 mr-2" />
            Ativar
          </>
        )}
      </Button>
    </div>
  );
}

export function BrokerOrderManager() {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadBrokerOrder();
  }, []);

  const loadBrokerOrder = async () => {
    try {
      const response = await fetch('/api/broker-order');
      const data = await response.json();
      setBrokers(data);
    } catch (error) {
      console.error('Error loading broker order:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a ordem dos corretores',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBrokers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        const updates = newItems.map((item, index) => ({
          id: item.id,
          orderPosition: index + 1
        }));

        updateBrokerOrder(updates);

        return newItems.map((item, index) => ({
          ...item,
          orderPosition: index + 1
        }));
      });
    }
  };

  const updateBrokerOrder = async (updates: { id: number; orderPosition: number }[]) => {
    try {
      const response = await fetch('/api/broker-order', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orders: updates }),
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Ordem dos corretores atualizada'
        });
      }
    } catch (error) {
      console.error('Error updating broker order:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a ordem',
        variant: 'destructive'
      });
    }
  };

  const handleToggleActive = async (brokerId: string, isActive: boolean) => {
    try {
      const endpoint = isActive 
        ? `/api/broker-order/${brokerId}`
        : `/api/broker-order/${brokerId}`;
      
      const method = isActive ? 'POST' : 'DELETE';

      const response = await fetch(endpoint, { method });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: `Corretor ${isActive ? 'ativado' : 'desativado'} com sucesso`
        });
        loadBrokerOrder();
      }
    } catch (error) {
      console.error('Error toggling broker:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do corretor',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ordem de Distribuição de Leads</CardTitle>
        <CardDescription>
          Arraste os corretores para definir a ordem de recebimento dos leads
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={brokers.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {brokers.map((broker) => (
              <SortableItem
                key={broker.id}
                broker={broker}
                onToggleActive={handleToggleActive}
              />
            ))}
          </SortableContext>
        </DndContext>

        {brokers.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            Nenhum corretor cadastrado na ordem de distribuição
          </p>
        )}
      </CardContent>
    </Card>
  );
}
