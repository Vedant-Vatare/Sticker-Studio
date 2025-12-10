import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const ProductOptions = ({
  name,
  values,
  selectedVariant,
  setSelectedVariant,
}) => {
  if (name === 'Color') {
    return (
      <div className="my-2 ml-2">
        <label className="text-foreground mb-2 block text-lg font-medium">
          Colors
        </label>
        <div className="flex flex-wrap gap-3">
          {values.map((color) => (
            <button
              key={color.id}
              onClick={() =>
                setSelectedVariant((variant) => ({
                  ...variant,
                  Color: color.id,
                }))
              }
              className={`relative h-9 w-9 rounded-full border transition ${
                selectedVariant.Color === color.id
                  ? 'border-primary scale-110'
                  : 'border-border hover:border-primary/50'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.value}
            >
              {selectedVariant.Color === color.id && (
                <Check
                  className={cn(
                    'text-foreground absolute inset-0 m-auto h-5 w-5',
                    color.value?.toLowerCase() === 'black' && 'text-muted',
                  )}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-2 ml-2">
      <label className="text-foreground mb-3 block text-lg font-medium capitalize">
        {name}
      </label>
      <div className="flex flex-wrap gap-3">
        {values.map((option) => (
          <Button
            size={'icon'}
            variant={'outline'}
            className={`size-10 text-sm ${
              selectedVariant[name] === option.id
                ? 'border-primary scale-110'
                : 'border-border hover:border-primary/50'
            }`}
            key={option.id}
            onClick={() =>
              setSelectedVariant((variant) => ({
                ...variant,
                [name]: option.id,
              }))
            }
            title={option.value}
          >
            {option.value}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProductOptions;
