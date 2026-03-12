/* Design Philosophy: Data-Driven Cartography with Agricultural Heritage
   Header: Institutional branding with MEWA logo and Seed Center title
   Typography: Playfair Display for title, clean layout with topographic accent
*/

export default function Header() {
  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <img 
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663143815567/ovNcpxEDLjzMzHqc.jpg" 
              alt="MEWA Logo" 
              className="h-16 w-auto"
            />
            <div className="border-l border-border pl-4">
              <h1 className="text-2xl font-display font-semibold text-[#4A5D3F]">
                Seed Center Data Hub
              </h1>
              <p className="text-sm text-muted-foreground">
                Ministry of Environment, Water & Agriculture
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-[#4A5D3F] animate-pulse"></div>
            <span className="font-mono">Public Access</span>
          </div>
        </div>
      </div>
    </header>
  );
}
