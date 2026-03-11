'use client';

import { useState, useEffect } from 'react';
import { MapPin, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useProjectContext } from '@/context/ProjectContext';
import { getAllProjects } from '@/data/projects';

// Parse price string to a numeric value in Lakhs
function parsePriceToLakhs(priceStr) {
    if (!priceStr) return null;
    const s = priceStr.toLowerCase().replace(/[₹\s,]/g, '');
    // Find all numbers in the string
    const nums = s.match(/[\d.]+/g);
    if (!nums) return null;
    // Take the first number found (minimum of a range)
    let val = parseFloat(nums[0]);

    if (s.includes('cr')) {
        // e.g. "1.48Cr" → 148L
        val = val * 100;
    }
    // Already in lakhs if just a number like "75 L"
    return Math.round(val);
}

export default function FilterBar() {
    const { applyFilters, clearFilters, filtersApplied, filterCity, filterPriceRange } = useProjectContext();


    // Local state (uncommitted until "Search")
    const localCity = 'All';
    const [localMin, setLocalMin] = useState(0);
    const [localMax, setLocalMax] = useState(500);

    const budgetRanges = [
        { label: 'All Projects', min: 0, max: 1000000000 },
        { label: '₹1 - ₹1.5 Cr', min: 100, max: 150 },
        { label: '₹1.5 - ₹2.5 Cr', min: 150, max: 250 },
        // { label: 'Above 2.5 Cr', min: 250, max: 500 },
    ];

    // Sync with context on mount (if filters were already applied)
    useEffect(() => {
        setLocalMin(filterPriceRange[0]);
        setLocalMax(filterPriceRange[1]);
    }, []);

    const handleApply = () => {
        applyFilters({ city: localCity, priceRange: [localMin, localMax] });
    };

    const handleClear = () => {
        setLocalMin(0);
        setLocalMax(500);
        clearFilters();
    };

    const priceLabel = (val) => {
        if (val >= 100) return `${(val / 100).toFixed(2).replace(/\.00$/, '')} Cr`;
        return `${val} L`;
    };

    return (
        <div className="relative z-40 -mt-6 mx-auto max-w-5xl px-4">
            <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100 px-5 py-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">




                    {/* Budget Range Filter */}
                    <div className="flex-[3]">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Select Budget</p>
                            <p className="text-[11px] font-bold text-[#f5a631]">{priceLabel(localMin)} – {priceLabel(localMax)}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {budgetRanges.map((range, index) => {
                                const isActive = localMin === range.min && localMax === range.max;
                                return (
                                    <div key={range.label} className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setLocalMin(range.min);
                                                setLocalMax(range.max);
                                                // Apply filters immediately and scroll
                                                applyFilters({ city: localCity, priceRange: [range.min, range.max] });
                                            }}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${isActive
                                                ? 'bg-[#2D3E50] border-[#2D3E50] text-white shadow-md'
                                                : 'bg-white border-gray-200 text-[#2D3E50] hover:border-[#FCB63A] hover:text-[#FCB63A]'
                                                }`}
                                        >
                                            {range.label}
                                        </button>
                                        {index === 0 && (
                                            <div className="w-[1px] h-8 bg-gray-200 mx-1" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
