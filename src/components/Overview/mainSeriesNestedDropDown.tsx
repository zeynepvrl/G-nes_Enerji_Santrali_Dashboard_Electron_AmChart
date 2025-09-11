import React, { useState, useEffect, useRef } from "react";
import "./Overview.css"; // CSS'i aşağıda ekleyeceğiz

type VariableConfig = {
  name: string;
  index: number;
};

type DropdownData = Record<string, Record<string, Record<string, VariableConfig[]>>>;

function NestedDropdown({ 
  dropdownData, 
  onSelect,
  selectedIl,
  selectedGes,
  selectedArac,
  selectedVariable
}: { 
  dropdownData: DropdownData;
  onSelect: (il: string, ges: string, arac: string, variable: string) => void;
  selectedIl: string;
  selectedGes: string;
  selectedArac: string;
  selectedVariable: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null); // For closing
  const menuRef = useRef<HTMLDivElement | null>(null); // For positioning
  const [mainDropdownSelectedIl, setMainDropdownSelectedIl] = useState<string | null>(null);
  const [mainDropdownSelectedGes, setMainDropdownSelectedGes] = useState<string | null>(null);
  const [mainDropdownSelectedArac, setMainDropdownSelectedArac] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ilList = Object.keys(dropdownData || {});
  const gesList = mainDropdownSelectedIl && dropdownData?.[mainDropdownSelectedIl] ? Object.keys(dropdownData[mainDropdownSelectedIl] || {}) : [];
  const aracList = (mainDropdownSelectedIl && mainDropdownSelectedGes && dropdownData?.[mainDropdownSelectedIl]?.[mainDropdownSelectedGes]) ? Object.keys(dropdownData[mainDropdownSelectedIl][mainDropdownSelectedGes] || {}) : [];
  const variableList = (mainDropdownSelectedIl && mainDropdownSelectedGes && mainDropdownSelectedArac && dropdownData?.[mainDropdownSelectedIl]?.[mainDropdownSelectedGes]?.[mainDropdownSelectedArac]) ? dropdownData[mainDropdownSelectedIl][mainDropdownSelectedGes][mainDropdownSelectedArac] : [];
  
  const getSubmenuPosition = (triggerRef: HTMLLIElement | null) => {
    if (!menuRef.current || !triggerRef) return {};
    const menuRect = menuRef.current.getBoundingClientRect();
    const triggerRect = triggerRef.getBoundingClientRect();
    return {
      top: triggerRect.top - menuRect.top, // Use the correct reference
    };
  };
  
  const ilRefs = useRef<(HTMLLIElement | null)[]>([]);
  const gesRefs = useRef<(HTMLLIElement | null)[]>([]);
  const aracRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Mouse uzaklaştığında dropdown'ı kapatma fonksiyonu
  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setMainDropdownSelectedIl(null);
      setMainDropdownSelectedGes(null);
      setMainDropdownSelectedArac(null);
    }, 400); // 300ms gecikme
  };

  // Mouse dropdown'a geri döndüğünde timeout'u iptal et
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setMainDropdownSelectedIl(null);
        setMainDropdownSelectedGes(null);
        setMainDropdownSelectedArac(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const getDropdownLabel = () => {
    if (selectedVariable && selectedIl && selectedGes && selectedArac) return `${selectedIl} / ${selectedGes} / ${selectedArac} / ${selectedVariable}`;
    if (selectedArac && selectedIl && selectedGes) return `${selectedIl} / ${selectedGes} / ${selectedArac}`;
    if (selectedGes && selectedIl) return `${selectedIl} / ${selectedGes}`;
    if (selectedIl) return selectedIl;
    return "Ana değer seçin";
  };

  return (
    <div className="nested-dropdown" ref={containerRef}>
      <button className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        {getDropdownLabel()}
      </button>
      {isOpen && (
        <div 
          className="dropdown-menu" 
          ref={menuRef}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          {/* Level 1: İl */}
          <ul className="submenu-list">
            {ilList.map((il, i) => (
              <li
                key={il}
                ref={el => (ilRefs.current[i] = el)}
                className={mainDropdownSelectedIl === il ? 'selected' : ''}
                onMouseEnter={() => setMainDropdownSelectedIl(il)}
              >
                <span className="submenu-label">{il}</span>
                <span className="submenu-arrow">▶</span>
              </li>
            ))}
          </ul>

          {/* Level 2: GES */}
          {mainDropdownSelectedIl && gesList.length > 0 && (
            <ul className="submenu-list" style={{ ...getSubmenuPosition(ilRefs.current[ilList.indexOf(mainDropdownSelectedIl)]), left: '100%' }}>
              {gesList.map((ges, i) => (
                <li
                  key={`${mainDropdownSelectedIl}-${ges}`}
                  ref={el => (gesRefs.current[i] = el)}
                  className={mainDropdownSelectedGes === ges ? 'selected' : ''}
                  onMouseEnter={() => setMainDropdownSelectedGes(ges)}
                >
                  <span className="submenu-label">{ges}</span>
                  <span className="submenu-arrow">▶</span>
                </li>
              ))}
            </ul>
          )}

          {/* Level 3: Araç */}
          {mainDropdownSelectedGes && aracList.length > 0 && (
             <ul className="submenu-list" style={{ ...getSubmenuPosition(gesRefs.current[gesList.indexOf(mainDropdownSelectedGes)]), left: '200%' }}>
              {aracList.map((arac, i) => (
                <li
                  key={`${mainDropdownSelectedIl}-${mainDropdownSelectedGes}-${arac}`}
                  ref={el => (aracRefs.current[i] = el)}
                  className={ mainDropdownSelectedArac === arac ? 'selected' : ''}
                  onMouseEnter={() => setMainDropdownSelectedArac(arac)}
                >
                  <span className="submenu-label">{arac}</span>
                  <span className="submenu-arrow">▶</span>
                </li>
              ))}
            </ul>
          )}
          
          {/* Level 4: Değişken */}
          {mainDropdownSelectedArac && variableList.length > 0 && (
            <ul className="submenu-list" style={{ ...getSubmenuPosition(aracRefs.current[aracList.indexOf(mainDropdownSelectedArac)]), left: '293%' }}>
              {variableList.map(variable => (
                <li
                  key={`${mainDropdownSelectedIl}-${mainDropdownSelectedGes}-${mainDropdownSelectedArac}-${variable.name}`}
                  className={ selectedVariable === variable.name ? 'selected' : ''}
                  onClick={() => {
                    onSelect(mainDropdownSelectedIl!, mainDropdownSelectedGes!, mainDropdownSelectedArac!, variable.name);       //ana değer dropdown unda yalnızca variable seçildiğinde overview deki handleMainSeriesSelect tetiklenecek ve 4 değer de set edilip güncellenecek, aksi drumda her il ges arac haeketinde variable "" atanacaktı ve bu da kullanıcı deneyimini kötü etkileyecekti, variable boş atandığı için 
                    setIsOpen(false);
                  }}
                >
                  <span className="submenu-label">{variable.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default NestedDropdown;