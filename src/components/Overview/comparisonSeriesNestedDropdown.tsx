import React, { useState, useEffect, useCallback } from "react";
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

  const handleIlSelect = (il: string) => {
    // Sadece UI güncellemesi için
    onSelect(il, "", "", []);
  };

  const handleGesSelect = (ges: string) => {
    // Sadece UI güncellemesi için
    onSelect(selectedIl, ges, "", []);
  };

  const handleAracSelect = (arac: string) => {
    // Mevcut değişken seçimlerini koru
    const existingVars = selectedVariables[`${selectedIl}/${selectedGes}/${arac}`] || [];
    
    // Değişken seçimlerini koruyarak onSelect'i çağır
    onSelect(selectedIl, selectedGes, arac, existingVars);
  };

  const handleVariableToggle = (variableName: string) => {
    const key = `${selectedIl}/${selectedGes}/${selectedArac}`;
    const currentVars = selectedVariables[key] || [];
    const newVariables = currentVars.includes(variableName)
      ? currentVars.filter(v => v !== variableName)
      : [...currentVars, variableName];
    // Değişken seçimi değiştiğinde onSelect çağır
    onSelect(selectedIl, selectedGes, selectedArac, newVariables);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    console.log("selectedVariables", selectedVariables);
  }, [selectedVariables]);
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const ilList = Object.keys(dropdownData || {});
  const selectedIlIndex = ilList.indexOf(selectedIl);
  const gesList = selectedIl && dropdownData?.[selectedIl] ? Object.keys(dropdownData[selectedIl]) : [];
  const selectedGesIndex = gesList.indexOf(selectedGes);
  const aracList = selectedIl && selectedGes && dropdownData?.[selectedIl]?.[selectedGes] 
    ? Object.keys(dropdownData[selectedIl][selectedGes]) 
    : [];
  const selectedAracIndex = aracList.indexOf(selectedArac);

  const renderList = useCallback((items: string[], selectedItem: string, level: number, onClickHandler: (item: string) => void) => (
    <ul>
      {items.map((item) => (
        <li
          key={item}
          className={`has-submenu${selectedItem === item ? " selected" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onClickHandler(item);
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  ), []);

  const getSelectedVarsForCurrentSelection = useCallback(() => {
    if (!selectedIl || !selectedGes || !selectedArac) return [];
    const key = `${selectedIl}/${selectedGes}/${selectedArac}`;
    return selectedVariables?.[key] || [];
  }, [selectedIl, selectedGes, selectedArac, selectedVariables]);

  const getDropdownLabel = useCallback(() => {
    if (!selectedGes) return "+ Ekle";
    
    const selectedVars = getSelectedVarsForCurrentSelection();
    const varLabel = selectedVars.length ? ` / ${selectedVars.join(", ")}` : "";
    
    return `${selectedGes}${selectedArac ? ` / ${selectedArac}${varLabel}` : ""}`;
  }, [selectedGes, selectedArac, getSelectedVarsForCurrentSelection]);

  return (
    <div className="nested-dropdown" style={{ position: "relative" }}>
      <button className="dropdown-trigger" onClick={toggleDropdown}>
        {getDropdownLabel()}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {renderList(ilList, selectedIl, 0, handleIlSelect)}

          {selectedIl && gesList.length > 0 && (
            <div className="submenu" style={{ left: 220, top: selectedIlIndex * 48 }}>
              {renderList(gesList, selectedGes, 1, handleGesSelect)}
            </div>
          )}

          {selectedIl && selectedGes && aracList.length > 0 && (
            <div className="submenu" style={{ left: 440, top: selectedIlIndex * 48 + selectedGesIndex * 48 }}>
              <ul>
                {aracList.map((arac) => (
                  <li
                    key={arac}
                    className={`has-submenu${selectedArac === arac ? " selected" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAracSelect(arac);
                    }}
                  >
                    {arac}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedIl && selectedGes && selectedArac && dropdownData?.[selectedIl]?.[selectedGes]?.[selectedArac] && (
            <div className="submenu" style={{ left: 660, top: selectedIlIndex * 48 + selectedGesIndex * 48 + selectedAracIndex * 48 }}>
              <ul>
                {dropdownData[selectedIl][selectedGes][selectedArac].map((variable) => (
                  <li key={variable.name} onClick={(e) => e.stopPropagation()}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={getSelectedVarsForCurrentSelection().includes(variable.name)}
                        onChange={() => handleVariableToggle(variable.name)}
                      />
                      {variable.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComparisonSeriesNestedDropdown;
