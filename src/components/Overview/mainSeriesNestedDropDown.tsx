import React, { useState } from "react";
import "./Overview.css"; // CSS'i aşağıda ekleyeceğiz

type VariableConfig = {
  name: string;
  index: number;
};

type DropdownData = Record<string, Record<string, Record<string, VariableConfig[]>>>;

function NestedDropdown({ 
  dropdownData, 
  onSelect 
}: { 
  dropdownData: DropdownData;
  onSelect: (il: string, ges: string, arac: string, variable: string) => void;
}) {
  const [hoveredIl, setHoveredIl] = useState<string | null>(null);
  const [hoveredGes, setHoveredGes] = useState<string | null>(null);
  const [hoveredArac, setHoveredArac] = useState<string | null>(null);

  return (
    <div className="nested-dropdown">
      <button className="dropdown-trigger">Veri Seçimi</button>
      <div className="dropdown-menu">
        <ul>
          {Object.keys(dropdownData).map((il) => (
            <li
              key={il}
              onMouseEnter={() => setHoveredIl(il)}
              onMouseLeave={() => setHoveredIl(null)}
            >
              {il}
              {hoveredIl === il && (
                <ul className="submenu">
                  {Object.keys(dropdownData[il]).map((ges) => (
                    <li
                      key={ges}
                      onMouseEnter={() => setHoveredGes(ges)}
                      onMouseLeave={() => setHoveredGes(null)}
                    >
                      {ges}
                      {hoveredGes === ges && (
                        <ul className="submenu">
                          {Object.keys(dropdownData[il][ges]).map((arac) => (
                            <li
                              key={arac}
                              onMouseEnter={() => setHoveredArac(arac)}
                              onMouseLeave={() => setHoveredArac(null)}
                            >
                              {arac}
                              {hoveredArac === arac && (
                                <ul className="submenu">
                                  {dropdownData[il][ges][arac].map((variable) => (
                                    <li
                                      key={variable.name}
                                      onClick={() => onSelect(il, ges, arac, variable.name)}
                                    >
                                      {variable.name}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default NestedDropdown;