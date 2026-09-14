import Select from "react-select";

interface LanguageSelectorProps {
  options: string[];
  selected: string[];
  onChange: (languages: string[]) => void;
}

export default function LanguageSelector({
  options,
  selected,
  onChange,
}: LanguageSelectorProps) {
  const selectOptions = options.map((language) => ({
    value: language,
    label: language,
  }));

  const value = selectOptions.filter((option) =>
    selected.includes(option.value)
  );

  return (
    <Select
      isMulti
      isSearchable
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      placeholder="Select languages..."

      options={selectOptions}

      value={value}

      onChange={(selectedOptions) =>
        onChange(
          selectedOptions
            ? selectedOptions.map((item) => item.value)
            : []
        )
      }

      menuPortalTarget={document.body}

      menuPosition="fixed"

      maxMenuHeight={300}

      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: 56,
          borderRadius: 16,
          background: "#0A0F1F",
          borderColor: state.isFocused
            ? "#3C82F6"
            : "#374151",
          boxShadow: "none",
          "&:hover": {
            borderColor: "#3C82F6",
          },
        }),

        valueContainer: (base) => ({
          ...base,
          padding: "8px 14px",
        }),

        input: (base) => ({
          ...base,
          color: "#fff",
        }),

        placeholder: (base) => ({
          ...base,
          color: "#9CA3AF",
        }),

        singleValue: (base) => ({
          ...base,
          color: "#fff",
        }),

        multiValue: (base) => ({
          ...base,
          background: "#3C82F6",
          borderRadius: 999,
        }),

        multiValueLabel: (base) => ({
          ...base,
          color: "#fff",
        }),

        multiValueRemove: (base) => ({
          ...base,
          color: "#fff",
          ":hover": {
            background: "#2563EB",
            color: "#fff",
          },
        }),

        menuPortal: (base) => ({
          ...base,
          zIndex: 99999,
        }),

        menu: (base) => ({
          ...base,
          borderRadius: 16,
          overflow: "hidden",
          background: "#111827",
        }),

        menuList: (base) => ({
          ...base,
          maxHeight: 300,
          padding: 8,
        }),

        option: (base, state) => ({
          ...base,
          background: state.isFocused
            ? "#1F2937"
            : state.isSelected
            ? "#3C82F6"
            : "#111827",
          color: "#fff",
          cursor: "pointer",
        }),
      }}
    />
  );
}