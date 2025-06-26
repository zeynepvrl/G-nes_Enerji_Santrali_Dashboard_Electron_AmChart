import React, { useState, useEffect, useRef } from "react";
import "./Overview.css";

export type VariableConfig = {
  name: string;
  index: number;
};

export type DropdownData = Record<string, Record<string, Record<string, VariableConfig[]>>>;

interface ComparisonSeriesNestedDropdownProps {
  dropdownData: DropdownData;
  onSelect: (il: string, ges: string, arac: string, variable: string[]) => void;
  selectedIl: string;
  selectedGes: string;
  selectedArac: string;
  selectedVariables: Record<string, string[]>;
}

const ComparisonSeriesNestedDropdown: React.FC<ComparisonSeriesNestedDropdownProps> = ({
  dropdownData,
  onSelect,
  selectedIl,
  selectedGes,
  selectedArac,
  selectedVariables,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleVariableToggle = (il: string, ges: string, arac: string, variableName: string) => {
    const key = `${il}/${ges}/${arac}`;
    const currentVars = selectedVariables[key] || [];
    const newVariables = currentVars.includes(variableName)
      ? currentVars.filter(v => v !== variableName)
      : [...currentVars, variableName];
    onSelect(il, ges, arac, newVariables);
  };

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
    const totalSelectedCount = Object.values(selectedVariables).reduce((acc, vars) => acc + vars.length, 0);
    return totalSelectedCount > 0 ? `${totalSelectedCount} Değer Karşılaştırılıyor` : "+ Karşılaştır";
  };

  const ilList = Object.keys(dropdownData || {});
  const gesList = selectedIl ? Object.keys(dropdownData[selectedIl] || {}) : [];
  const aracList = (selectedIl && selectedGes) ? Object.keys(dropdownData[selectedIl]?.[selectedGes] || {}) : [];
  const variableList = (selectedIl && selectedGes && selectedArac) ? dropdownData[selectedIl][selectedGes][selectedArac] : [];
  
  const getSubmenuPosition = (triggerRef: HTMLLIElement | null) => {
    if (!menuRef.current || !triggerRef) return {};
    const menuRect = menuRef.current.getBoundingClientRect();
    const triggerRect = triggerRef.getBoundingClientRect();
    return { 
      top: triggerRect.top - menuRect.top
    };
  };
  
  const ilRefs = useRef<(HTMLLIElement | null)[]>([]);
  const gesRefs = useRef<(HTMLLIElement | null)[]>([]);
  const aracRefs = useRef<(HTMLLIElement | null)[]>([]);

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
                onMouseEnter={() => onSelect(il, "", "", selectedVariables[`${il}//`] || [])}
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
                  onMouseEnter={() => onSelect(selectedIl, ges, "", selectedVariables[`${selectedIl}/${ges}/`] || [])}
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
                  onMouseEnter={() => onSelect(selectedIl, selectedGes, arac, selectedVariables[`${selectedIl}/${selectedGes}/${arac}`] || [])}
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
              {variableList.map(variable => {
                const key = `${selectedIl}/${selectedGes}/${selectedArac}`;
                const isChecked = (selectedVariables[key] || []).includes(variable.name);
                return (
                  <li
                    key={`${selectedIl}-${selectedGes}-${selectedArac}-${variable.name}`}
                    onClick={() => handleVariableToggle(selectedIl, selectedGes, selectedArac, variable.name)}
                  >
                    <input type="checkbox" readOnly checked={isChecked} style={{ marginRight: '8px' }}/>
                    <span className="submenu-label">{variable.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ComparisonSeriesNestedDropdown;
