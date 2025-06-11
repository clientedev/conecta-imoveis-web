
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterBarProps {
  filters: {
    type: string;
    location: string;
    priceRange: string;
  };
  onFilterChange: (filters: any) => void;
}

export const FilterBar = ({ filters, onFilterChange }: FilterBarProps) => {
  const updateFilter = (key: string, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: string) => {
    onFilterChange({ ...filters, [key]: "" });
  };

  const clearAllFilters = () => {
    onFilterChange({ type: "", location: "", priceRange: "" });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={filters.type} onValueChange={(value) => updateFilter("type", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de imóvel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apartamento">Apartamento</SelectItem>
            <SelectItem value="casa">Casa</SelectItem>
            <SelectItem value="cobertura">Cobertura</SelectItem>
            <SelectItem value="terreno">Terreno</SelectItem>
            <SelectItem value="comercial">Comercial</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Localização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="centro">Centro</SelectItem>
            <SelectItem value="vila-madalena">Vila Madalena</SelectItem>
            <SelectItem value="moema">Moema</SelectItem>
            <SelectItem value="pinheiros">Pinheiros</SelectItem>
            <SelectItem value="brooklin">Brooklin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.priceRange} onValueChange={(value) => updateFilter("priceRange", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Faixa de preço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ate-500k">Até R$ 500.000</SelectItem>
            <SelectItem value="500k-1m">R$ 500.000 - R$ 1.000.000</SelectItem>
            <SelectItem value="1m-2m">R$ 1.000.000 - R$ 2.000.000</SelectItem>
            <SelectItem value="acima-2m">Acima de R$ 2.000.000</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Filtros ativos:</span>
          
          {filters.type && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.type}
              <Button
                size="icon"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => clearFilter("type")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.location}
              <Button
                size="icon"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => clearFilter("location")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.priceRange && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.priceRange}
              <Button
                size="icon"
                variant="ghost"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => clearFilter("priceRange")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs"
          >
            Limpar todos
          </Button>
        </div>
      )}
    </div>
  );
};
