import React, { useState, useEffect, useRef } from 'react';

const App: React.FC = () => {
    // === Sorting ===
    const [sortInput, setSortInput] = useState('5,3,8,4,2');
    const [sortProcess, setSortProcess] = useState<string[]>([]);
    const [sortResult, setSortResult] = useState<string>('');

    // === Searching ===
    const [searchInput, setSearchInput] = useState('2,3,4,5,8');
    const [searchValue, setSearchValue] = useState(5);
    const [searchSteps, setSearchSteps] = useState<string[]>([]);
    const [searchResult, setSearchResult] = useState<string>('');

    // === Stack (Undo) ===
    const [textInput, setTextInput] = useState('');
    const [, setCurrentText] = useState('');
    const [undoStack, setUndoStack] = useState<string[]>([]);
    const undoStackRef = useRef<string[]>([]); // to keep stack reference

    // Helpers to handle Undo stack
    const pushUndoStack = (text: string) => {
        undoStackRef.current = [...undoStackRef.current, text];
        setUndoStack(undoStackRef.current);
    };

    const popUndoStack = () => {
        if (undoStackRef.current.length === 0) return null;
        const popped = undoStackRef.current[undoStackRef.current.length - 1];
        undoStackRef.current = undoStackRef.current.slice(0, undoStackRef.current.length - 1);
        setUndoStack(undoStackRef.current);
        return popped;
    };

    const clearUndoStack = () => {
        undoStackRef.current = [];
        setUndoStack([]);
    };

    // === Sorting functions with visualization ===
    const performSort = () => {
        const numbers = sortInput
            .split(',')
            .map((n) => parseInt(n.trim()))
            .filter((n) => !isNaN(n));
        if (numbers.length === 0) {
            setSortResult('Please enter valid numbers');
            return;
        }
        setSortProcess([]);
        setSortResult('');

        // Visualize bubble sort with steps
        bubbleSortVisual(numbers);
    };

    const bubbleSortVisual = (arr: number[]) => {
        const n = arr.length;
        const array = [...arr];
        const steps: string[] = [];
        for (let i = 0; i < n - 1; i++) {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                const beforeHighlight = array.map((num, idx) =>
                    idx === j || idx === j + 1 ? `[${num}]` : `${num}`
                ).join(' ');

                steps.push(`Comparing ${array[j]} and ${array[j + 1]}: ${beforeHighlight}`);

                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    swapped = true;
                    const afterHighlight = array.map((num, idx) =>
                        idx === j || idx === j + 1 ? `[${num}]` : `${num}`
                    ).join(' ');
                    steps.push(`Swapped: ${afterHighlight}`);
                }
            }
            steps.push(`After pass ${i + 1}: ${array.join(' ')}`);
            if (!swapped) break;
        }
        setSortProcess(steps);
        setSortResult(array.join(', '));
    };

    // === Searching ===
    const performSearch = () => {
        const numbers = searchInput
            .split(',')
            .map((n) => parseInt(n.trim()))
            .filter((n) => !isNaN(n));
        if (numbers.length === 0 || isNaN(searchValue)) {
            setSearchResult('Please enter valid numbers and target');
            return;
        }
        setSearchSteps([]);
        setSearchResult('');

        const steps: string[] = [];
        let left = 0;
        let right = numbers.length - 1;
        let foundIndex = -1;
        let stepCount = 0;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            stepCount++;
            const range = numbers.slice(left, right + 1);
            const midVal = numbers[mid];
            steps.push(
                `Step ${stepCount}: Searching in [${range.join(' ')}], middle element: ${midVal}`
            );
            if (midVal === searchValue) {
                foundIndex = mid;
                break;
            } else if (midVal < searchValue) {
                left = mid + 1;
                steps.push('Target is greater than middle element, searching right half');
            } else {
                right = mid - 1;
                steps.push('Target is less than middle element, searching left half');
            }
        }
        setSearchSteps(steps);
        if (foundIndex === -1) {
            setSearchResult(`${searchValue} not found in the array`);
        } else {
            setSearchResult(`${searchValue} found at index ${foundIndex}`);
        }
    };

    // === Undo functionality ===
    useEffect(() => {
        setCurrentText(textInput);
    }, [textInput]);

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        if (textInput !== newText) {
            if (textInput !== '') {
                pushUndoStack(textInput);
            }
            setTextInput(newText);
        }
    };

    const handleUndo = () => {
        const previous = popUndoStack();
        if (previous !== null) {
            setTextInput(previous);
        }
    };

    const handleClearHistory = () => {
        clearUndoStack();
    };

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-indigo-700 mb-2">Algorithm Visualizer</h1>
                <p className="text-gray-600">
                    Interactive demonstration of fundamental algorithms and data structures
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sorting Section */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-indigo-600 mb-4 flex items-center">
                        <i className="fas fa-sort-amount-down-alt mr-2"></i> Bubble Sort
                    </h2>

                    <label htmlFor="sortInput" className="block text-gray-700 mb-2">
                        Enter numbers (comma separated):
                    </label>
                    <input
                        id="sortInput"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
                        value={sortInput}
                        onChange={(e) => setSortInput(e.target.value)}
                    />
                    <button
                        onClick={performSort}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg mb-4 transition"
                    >
                        Sort Array
                    </button>

                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Sorting Process:</h3>
                        <div className="flex flex-wrap gap-2 mb-4 min-h-12 flex-col">
                            {sortProcess.map((step, i) => (
                                <div key={i} className="mb-1 text-sm">
                                    {step}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Sorted Result:</h3>
                        <div className="text-xl font-semibold text-green-600">{sortResult}</div>
                    </div>
                </section>

                {/* Searching Section */}
                <section className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-indigo-600 mb-4 flex items-center">
                        <i className="fas fa-search mr-2"></i> Binary Search
                    </h2>

                    <label htmlFor="searchInput" className="block text-gray-700 mb-2">
                        Enter sorted numbers (comma separated):
                    </label>
                    <input
                        id="searchInput"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                    />

                    <label htmlFor="searchValue" className="block text-gray-700 mb-2">
                        Number to search:
                    </label>
                    <input
                        id="searchValue"
                        type="number"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
                        value={searchValue}
                        onChange={(e) => setSearchValue(parseInt(e.target.value))}
                    />

                    <button
                        onClick={performSearch}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg mb-4 transition"
                    >
                        Search Number
                    </button>

                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Search Steps:</h3>
                        <div className="mb-4 max-h-48 overflow-auto">
                            {searchSteps.map((step, i) => (
                                <div key={i} className="mb-2 p-2 bg-gray-50 rounded-lg text-sm">
                                    {step}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Search Result:</h3>
                        <div className="text-xl font-semibold">{searchResult}</div>
                    </div>
                </section>

                {/* Stack Section */}
                <section className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-indigo-600 mb-4 flex items-center">
                        <i className="fas fa-undo mr-2"></i> Undo Text Input (Stack)
                    </h2>

                    <label htmlFor="textInput" className="block text-gray-700 mb-2">
                        Enter text:
                    </label>
                    <input
                        id="textInput"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 mb-4"
                        value={textInput}
                        onChange={handleTextInputChange}
                        placeholder="Type something..."
                    />

                    <div className="mb-4">
                        <button
                            onClick={handleUndo}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg mr-4 transition disabled:opacity-50"
                            disabled={undoStack.length === 0}
                        >
                            Undo
                        </button>
                        <button
                            onClick={handleClearHistory}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                        >
                            Clear Undo History
                        </button>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Current Text:</h3>
                        <div className="p-2 bg-gray-100 rounded-md">{textInput}</div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Undo History (Stack):</h3>
                        <div className="max-h-40 overflow-auto bg-white border rounded-md p-2 text-sm">
                            {undoStack.length === 0 ? (
                                <p className="text-gray-500 italic">No undo history</p>
                            ) : (
                                undoStack.map((item, idx) => <div key={idx}>- {item}</div>)
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default App;
