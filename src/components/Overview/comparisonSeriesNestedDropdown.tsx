import React, { useState, useEffect } from "react";
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
  selectedVariables: string[];
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

  const handleVariableToggle = (variableName: string) => {
    const newVariables = selectedVariables.includes(variableName)
      ? selectedVariables.filter(v => v !== variableName)
      : [...selectedVariables, variableName];
    onSelect(selectedIl, selectedGes, selectedArac, newVariables);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const ilList = Object.keys(dropdownData);
  const selectedIlIndex = ilList.indexOf(selectedIl);
  const gesList = selectedIl ? Object.keys(dropdownData[selectedIl]) : [];
  const selectedGesIndex = gesList.indexOf(selectedGes);
  const aracList = selectedIl && selectedGes ? Object.keys(dropdownData[selectedIl][selectedGes]) : [];
  const selectedAracIndex = aracList.indexOf(selectedArac);

  const renderList = (items: string[], selectedItem: string, level: number, onClickHandler: (item: string) => void) => (
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
  );

  return (
    <div className="nested-dropdown" style={{ position: "relative" }}>
      <button className="dropdown-trigger" onClick={toggleDropdown}>
        {selectedGes
          ? `${selectedGes}${selectedArac ? ` / ${selectedArac}${selectedVariables ? ` / ${selectedVariables.join(", ")}` : ""}` : ""}`
          : "+ Ekle"}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {renderList(ilList, selectedIl, 0, (il) => onSelect(il, "", "", []))}

          {selectedIl && gesList.length > 0 && (
            <div className="submenu" style={{ left: 220, top: selectedIlIndex * 48 }}>
              {renderList(gesList, selectedGes, 1, (ges) => onSelect(selectedIl, ges, "", []))}
            </div>
          )}

          {selectedIl && selectedGes && aracList.length > 0 && (
            <div className="submenu" style={{ left: 440, top: selectedIlIndex * 48 + selectedGesIndex * 48 }}>
              <ul>
                {aracList.map((arac, i) => (
                  <li
                    key={arac}
                    className={`has-submenu${selectedArac === arac ? " selected" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(selectedIl, selectedGes, arac, []);
                    }}
                  >
                    {arac}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedIl && selectedGes && selectedArac && dropdownData[selectedIl][selectedGes][selectedArac] && (
            <div className="submenu" style={{ left: 660, top: selectedIlIndex * 48 + selectedGesIndex * 48 + selectedAracIndex * 48 }}>
              <ul>
                {dropdownData[selectedIl][selectedGes][selectedArac].map((variable) => (
                  <li key={variable.name} onClick={(e) => e.stopPropagation()}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={selectedVariables.includes(variable.name)}
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
