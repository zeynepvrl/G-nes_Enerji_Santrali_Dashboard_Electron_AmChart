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

  const ilList = Object.keys(dropdownData);
  const gesList = selectedIl ? Object.keys(dropdownData[selectedIl] || {}) : [];
  const aracList = (selectedIl && selectedGes) ? Object.keys(dropdownData[selectedIl]?.[selectedGes] || {}) : [];
  const variableList = (selectedIl && selectedGes && selectedArac) ? dropdownData[selectedIl][selectedGes][selectedArac] : [];
  
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDropdownLabel = () => {
    if (selectedVariable) return `${selectedIl} / ${selectedGes} / ${selectedArac} / ${selectedVariable}`;
    if (selectedArac) return `${selectedIl} / ${selectedGes} / ${selectedArac}`;
    if (selectedGes) return `${selectedIl} / ${selectedGes}`;
    if (selectedIl) return selectedIl;
    return "Ana değer seçin";
  };

  return (
    <div className="nested-dropdown" ref={containerRef}>
      <button className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        {getDropdownLabel()}
      </button>
      {isOpen && (
        <div className="dropdown-menu" ref={menuRef}>
          {/* Level 1: İl */}
          <ul className="submenu-list">
            {ilList.map((il, i) => (
              <li
                key={il}
                ref={el => (ilRefs.current[i] = el)}
                className={selectedIl === il ? 'selected' : ''}
                onMouseEnter={() => onSelect(il, "", "", "")}
              >
                <span className="submenu-label">{il}</span>
                <span className="submenu-arrow">▶</span>
              </li>
            ))}
          </ul>

          {/* Level 2: GES */}
          {selectedIl && gesList.length > 0 && (
            <ul className="submenu-list" style={{ ...getSubmenuPosition(ilRefs.current[ilList.indexOf(selectedIl)]), left: '100%' }}>
              {gesList.map((ges, i) => (
                <li
                  key={`${selectedIl}-${ges}`}
                  ref={el => (gesRefs.current[i] = el)}
                  className={selectedGes === ges ? 'selected' : ''}
                  onMouseEnter={() => onSelect(selectedIl, ges, "", "")}
                >
                  <span className="submenu-label">{ges}</span>
                  <span className="submenu-arrow">▶</span>
                </li>
              ))}
            </ul>
          )}

          {/* Level 3: Araç */}
          {selectedGes && aracList.length > 0 && (
             <ul className="submenu-list" style={{ ...getSubmenuPosition(gesRefs.current[gesList.indexOf(selectedGes)]), left: '200%' }}>
              {aracList.map((arac, i) => (
                <li
                  key={`${selectedIl}-${selectedGes}-${arac}`}
                  ref={el => (aracRefs.current[i] = el)}
                  className={selectedArac === arac ? 'selected' : ''}
                  onMouseEnter={() => onSelect(selectedIl, selectedGes, arac, "")}
                >
                  <span className="submenu-label">{arac}</span>
                  <span className="submenu-arrow">▶</span>
                </li>
              ))}
            </ul>
          )}
          
          {/* Level 4: Değişken */}
          {selectedArac && variableList.length > 0 && (
            <ul className="submenu-list" style={{ ...getSubmenuPosition(aracRefs.current[aracList.indexOf(selectedArac)]), left: '300%' }}>
              {variableList.map(variable => (
                <li
                  key={`${selectedIl}-${selectedGes}-${selectedArac}-${variable.name}`}
                  className={selectedVariable === variable.name ? 'selected' : ''}
                  onClick={() => {
                    onSelect(selectedIl, selectedGes, selectedArac, variable.name);
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