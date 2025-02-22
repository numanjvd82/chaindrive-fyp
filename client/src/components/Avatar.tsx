type Props = {
  avatar: string;
  name: string;
  showOnlineStatus: boolean;
  isOnline: boolean;
};

export const Avatar: React.FC<Props> = ({
  avatar,
  showOnlineStatus = false,
  isOnline = false,
  name,
}) => {
  return (
    <div className="relative">
      <img src={avatar} alt={name} className="w-10 h-10 rounded-full " />
      {showOnlineStatus && (
        <span
          className={`w-3 h-3 rounded-full border ${
            isOnline ? "bg-green-400" : "bg-red-400"
          } inline-block absolute bottom-0 right-0 `}
        />
      )}
    </div>
  );
};
