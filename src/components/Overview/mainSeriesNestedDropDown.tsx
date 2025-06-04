import React, { useState } from "react";
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Dropdown dışına tıklandığında kapanması için
  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Seçili index'leri bul (hizalama için)
  const ilList = Object.keys(dropdownData);
  const selectedIlIndex = ilList.findIndex(il => il === selectedIl);
  const gesList = selectedIl ? Object.keys(dropdownData[selectedIl]) : [];
  const selectedGesIndex = gesList.findIndex(ges => ges === selectedGes);
  const aracList = (selectedIl && selectedGes) ? Object.keys(dropdownData[selectedIl][selectedGes]) : [];
  const selectedAracIndex = aracList.findIndex(arac => arac === selectedArac);

  return (
    <div className="nested-dropdown" style={{ position: 'relative' }}>
      <button className="dropdown-trigger" onClick={handleClick}>
        {selectedGes
          ? selectedGes +
            (selectedArac
              ? " / " +
                selectedArac +
                (selectedVariable ? " / " + selectedVariable : "")
              : "")
          : "Ana değer seçin"}
      </button>
      {isOpen && (
        <div className="dropdown-menu" style={{ position: 'absolute', zIndex: 999 }}>
          <ul>
            {ilList.map((il, i) => (
              <li
                key={il}
                className={`has-submenu${selectedIl === il ? ' selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(il, '', '', '');
                }}
              >
                {il}
              </li>
            ))}
          </ul>
          {/* GES alt menüsü */}
          {selectedIl && gesList.length > 0 && (
            <div
              className="submenu"
              style={{ left: 220, top: selectedIlIndex * 48, position: 'absolute' }}
            >
              <ul>
                {gesList.map((ges, i) => (
                  <li
                    key={ges}
                    className={`has-submenu${selectedGes === ges ? ' selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(selectedIl, ges, '', '');
                    }}
                  >
                    {ges}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* ARAC alt menüsü */}
          {selectedIl && selectedGes && aracList.length > 0 && (
            <div
              className="submenu"
              style={{ left: 440, top: selectedIlIndex * 48 + selectedGesIndex * 48, position: 'absolute' }}
            >
              <ul>
                {aracList.map((arac, i) => (
                  <li
                    key={arac}
                    className={`has-submenu${selectedArac === arac ? ' selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(selectedIl, selectedGes, arac, '');
                    }}
                  >
                    {arac}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* VARIABLE alt menüsü */}
          {selectedIl && selectedGes && selectedArac && dropdownData[selectedIl][selectedGes][selectedArac] && (
            <div
              className="submenu"
              style={{ left: 660, top: selectedIlIndex * 48 + selectedGesIndex * 48 + selectedAracIndex * 48, position: 'absolute' }}
            >
              <ul>
                {dropdownData[selectedIl][selectedGes][selectedArac].map((variable) => (
                  <li
                    key={variable.name}
                    className={selectedVariable === variable.name ? 'selected' : ''}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(selectedIl, selectedGes, selectedArac, variable.name);
                      setIsOpen(false);
                    }}
                  >
                    {variable.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NestedDropdown;