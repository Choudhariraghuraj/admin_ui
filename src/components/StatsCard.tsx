interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    bgColor: string;
  }
  
 const StatsCard = ({ title, value, icon, bgColor }: StatsCardProps) => {
    return (
      <div className={`flex-1 p-4 rounded-lg shadow-lg ${bgColor} text-white`}>
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold">{title}</div>
          <div className="text-3xl">{icon}</div>
        </div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
    );
  };

  export default StatsCard;
  