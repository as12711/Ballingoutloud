import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

function H1({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'>) {
  return <Text variant="h1" className={cn(className)} {...props} />;
}

function H2({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'>) {
  return <Text variant="h2" className={cn(className)} {...props} />;
}

function H3({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'>) {
  return <Text variant="h3" className={cn(className)} {...props} />;
}

function H4({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'>) {
  return <Text variant="h4" className={cn(className)} {...props} />;
}

function P({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'>) {
  return <Text variant="p" className={cn(className)} {...props} />;
}

function BlockQuote({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'>) {
  return <Text variant="blockquote" className={cn(className)} {...props} />;
}

function Code({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'>) {
  return <Text variant="code" className={cn(className)} {...props} />;
}

function Lead({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'>) {
  return <Text variant="lead" className={cn(className)} {...props} />;
}

function Large({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'>) {
  return <Text variant="large" className={cn(className)} {...props} />;
}

function Small({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'>) {
  return <Text variant="small" className={cn(className)} {...props} />;
}

function Muted({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'>) {
  return <Text variant="muted" className={cn(className)} {...props} />;
}

export { BlockQuote, Code, H1, H2, H3, H4, Large, Lead, Muted, P, Small };
