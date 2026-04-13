import { useEffect, useState, useRef } from "react";
import { getAllProvinces, getWardsByProvince } from "../../../../api/provinces";

// Searchable Select Component
const SearchableSelect = ({ 
    label, 
    options, 
    value, 
    onChange, 
    placeholder, 
    disabled,
    loading,
    error,
    displayKey = "name",
    valueKey = "code"
}) => {
    const [searchInput, setSearchInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const wrapperRef = useRef(null);
    const selectedOption = options.find(opt => opt[valueKey] === value);

    // Filter options based on search input
    useEffect(() => {
        if (searchInput.trim() === "") {
            setFilteredOptions(options);
        } else {
            const filtered = options.filter(option =>
                option[displayKey].toLowerCase().includes(searchInput.toLowerCase())
            );
            setFilteredOptions(filtered);
        }
    }, [searchInput, options, displayKey]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option[valueKey]);
        setSearchInput("");
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col gap-2 md:col-span-1" ref={wrapperRef}>
            <label className="text-sm font-medium text-textMuted px-1">
                {label}
            </label>
            <div className="relative">
                {/* Input field */}
                <div
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-orange-500/50 bg-secondary transition text-sm cursor-pointer"
                >
                    <div className="flex-grow">
                        {loading ? (
                            <span className="text-textMuted">Đang tải...</span>
                        ) : selectedOption ? (
                            <span className="text-primary font-medium">
                                {selectedOption[displayKey]}
                            </span>
                        ) : (
                            <span className="text-textMuted">{placeholder}</span>
                        )}
                    </div>
                </div>

                {/* Dropdown menu */}
                {isOpen && !disabled && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
                        {/* Search input */}
                        <div className="p-3 border-b border-gray-100">
                            <input
                                type="text"
                                placeholder="Tìm kiếm..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm"
                                autoFocus
                            />
                        </div>

                        {/* Options list */}
                        <div className="max-h-48 overflow-y-auto">
                            {filteredOptions.length === 0 ? (
                                <div className="px-5 py-3 text-center text-textMuted text-sm">
                                    Không tìm thấy kết quả
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option[valueKey]}
                                        onClick={() => handleSelect(option)}
                                        className="w-full px-5 py-3 text-left text-sm hover:bg-orange-50 transition flex items-center justify-between group"
                                    >
                                        <span className="text-primary group-hover:font-medium">
                                            {option[displayKey]}
                                        </span>
                                        {value === option[valueKey] && (
                                            <svg
                                                className="w-5 h-5 text-orange-500"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {error && <small className="text-red-500 text-sm">{error}</small>}
        </div>
    );
};

const AddressSelector = ({ register, watch, errors, setValue }) => {
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingProvinces, setLoadingProvinces] = useState(false);

    const selectedProvince = watch("province_code");

    // Load all provinces on mount
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                setLoadingProvinces(true);
                const data = await getAllProvinces();
                setProvinces(data || []);
            } catch (error) {
                console.error("Lỗi tải danh sách tỉnh:", error);
            } finally {
                setLoadingProvinces(false);
            }
        };
        loadProvinces();
    }, []);

    // Load wards when province changes (API v2 không có districts, lấy wards trực tiếp từ province)
    useEffect(() => {
        if (!selectedProvince) {
            setWards([]);
            return;
        }

        const loadWards = async () => {
            try {
                const provinceData = await getWardsByProvince(selectedProvince);
                setWards(provinceData?.wards || []);
                setValue("ward_code", "");
            } catch (error) {
                console.error("Lỗi tải danh sách phường/xã:", error);
                setWards([]);
            }
        };

        loadWards();
    }, [selectedProvince, setValue]);

    return (
        <>
            {/* Province / City */}
            <SearchableSelect
                label="Tỉnh / Thành phố"
                options={provinces}
                value={selectedProvince}
                onChange={(value) => setValue("province_code", value)}
                placeholder="Chọn Tỉnh / Thành phố"
                disabled={loadingProvinces}
                loading={loadingProvinces}
                error={errors.province_code?.message}
                displayKey="name"
                valueKey="code"
            />

            {/* Ward / Commune */}
            <SearchableSelect
                label="Phường / Xã"
                options={wards}
                value={watch("ward_code")}
                onChange={(value) => setValue("ward_code", value)}
                placeholder={!selectedProvince ? "Chọn tỉnh trước" : "Chọn Phường / Xã"}
                disabled={!selectedProvince}
                loading={false}
                error={errors.ward_code?.message}
                displayKey="name"
                valueKey="code"
            />
        </>
    );
};

export default AddressSelector;
