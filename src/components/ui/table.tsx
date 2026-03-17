import { TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { ScrollView, View, type ViewProps } from 'react-native';

function Table({ className, ...props }: React.ComponentProps<typeof ScrollView>) {
  return (
    <ScrollView horizontal className={cn('w-full', className)} {...props}>
      <View className="w-full">{props.children}</View>
    </ScrollView>
  );
}

function TableHeader({ className, ...props }: ViewProps & React.RefAttributes<View>) {
  return (
    <TextClassContext.Provider value="text-muted-foreground text-sm font-medium">
      <View className={cn('border-border border-b', className)} {...props} />
    </TextClassContext.Provider>
  );
}

function TableBody({ className, ...props }: ViewProps & React.RefAttributes<View>) {
  return <View className={cn('[&>*:last-child]:border-0', className)} {...props} />;
}

function TableRow({ className, ...props }: ViewProps & React.RefAttributes<View>) {
  return (
    <View
      className={cn('border-border flex flex-row border-b', className)}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: ViewProps & React.RefAttributes<View>) {
  return (
    <View
      className={cn(
        'flex h-10 flex-1 items-center justify-start px-2',
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: ViewProps & React.RefAttributes<View>) {
  return (
    <View
      className={cn('flex flex-1 items-center justify-start p-2', className)}
      {...props}
    />
  );
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
