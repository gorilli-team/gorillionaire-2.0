export default function Main({ selectedPage }) {
    const renderContent = () => {
      switch (selectedPage) {
        case "My Account":
          return <div className="p-4 text-gray-800">Welcome to My Account</div>;
        case "Vaults":
          return <div className="p-4 text-gray-800">Here are your Vaults</div>;
        default:
          return <div className="p-4 text-gray-800">Select a page</div>;
      }
    };
  
    return <main className="flex-1 overflow-y-auto bg-gray-200">{renderContent()}</main>;
  }
  