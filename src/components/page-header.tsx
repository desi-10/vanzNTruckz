import { Button } from "./ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => {
  return (
    <div className="flex items-center justify-between w-full border-b pb-4 mb-6">
      <div>
        <h1 className="text-4xl font-bold ">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      {action && (
        <Button
          asChild
          className="bg-orange-500 text-white hover:bg-orange-500/90"
        >
          {action}
        </Button>
      )}
    </div>
  );
};

export default PageHeader;
